import React from 'react'

import {
    StyleSheet,
    AsyncStorage,

    View,
    FlatList,
    Image,
    Button,
    RefreshControl,
    Text
} from 'react-native'

import ServerStatus from '../../elements/ServerStatus';
import Module from '../../elements/Module';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { socketGlobal } from '../../network/socket';
import { appLoadAllStates, presetAdd, presetDelete, appClearData } from '../../redux/actions';
import Preset from '../../elements/Preset';
import { rootNavigatorNavigate } from '../../RootNavigatorRef';
import { removeFromStorarge } from '../../network/updateDatabase';

export default class MainScreen extends React.PureComponent {
    constructor(props) {
        super(props)

        this.refresh = this.refresh.bind(this)
        this.savePreset = this.savePreset.bind(this)
    }

    static mapStateToProps = (state) => {
        return {
            isAppLoaded: state.appStatus.isAppLoaded,
            modules: state.modules,
            presets: state.presets
        }
    }

    static mapDispatchToProps = (dispatch) => {
        return {
            deloadApp: () => dispatch(appLoadAllStates(false)),
            clearData: () => dispatch(appClearData()),
            addPreset: (modTypeCodename, values) => dispatch(presetAdd(modTypeCodename, values)),
            deletePreset: (id) => dispatch(presetDelete(id)),
        }
    }

    static addIcon = (navigation) => (
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("AddModule")}>
            <Image source={require("../../assets/add.png")} resizeMode="center" tintColor="#FFF" style={{ height: "100%", width: 30, marginRight: 8 }} />
        </TouchableOpacity>
    )

    refresh() {
        this.props.deloadApp()
        rootNavigatorNavigate("ConnectionWrapper")

        this.props.clearData()
        socketGlobal.emit("forceReload")
    }

    savePreset(modType, modValues) {
        var values = {}
        modType.fields.forEach((codename) => values[codename] = modValues[codename])

        // console.log("Saving preset values", values)

        socketGlobal.emit("addPreset", {
            modType: modType.codename,
            values: values
        })
    }

    render() {
        // console.log("MainScreen rerender", this.props.presets)

        return <ScrollView contentContainerStyle={{ flex: 1 }} refreshControl={<RefreshControl colors={["#4CAF50"]} refreshing={!this.props.isAppLoaded} onRefresh={this.refresh} />}>
            <View style={styles.container}>
                {/* Contains module definitions */}
                <View style={styles.modules}>
                    <Button title="Clear AsyncStorage" onPress={() => AsyncStorage.clear()} />

                    <FlatList
                        contentContainerStyle={{ flex: 1 }}
                        data={Object.values(this.props.modules)}
                        keyExtractor={(item) => item.modId.toString()}

                        renderItem={({ item }) => <Module
                            mod={item}
                            openModule={() => this.props.navigation.navigate("Module", { mod: item })}
                            savePreset={(modType, modValues) => this.savePreset(modType, modValues)}
                        />}
                    />
                </View>

                {/* Status information, maybe presets */}
                <View style={styles.status}>
                    <ServerStatus />
                    {/* <Preset preset={this.props.presets[0]}/> */}

                    <View style={styles.presets}>
                        <Text style={styles.presetsHeader}>Presets</Text>

                        <FlatList
                            contentContainerStyle={{ flex: 1 }}
                            data={Object.values(this.props.presets)}
                            keyExtractor={(item) => item._id.toString()}

                            renderItem={({ item }) => <Preset
                                preset={item}
                                deletePreset={() => {
                                    if (socketGlobal.connected) {
                                        socketGlobal.emit("deletePreset", { _id: item._id })
                                        this.props.deletePreset(item._id)
                                        removeFromStorarge("presets", item._id)
                                    }

                                    else {
                                        ToastAndroid.show("Socket disconnected", ToastAndroid.SHORT)
                                    }
                                }}
                            />}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    // Main container of this screen
    container: {
        flex: 1,
        flexDirection: "row",
    },

    // Contains module definitions
    modules: {
        flex: 2,
    },

    // Status pane
    status: {
        flex: 1,

        // padding: 4,
    },

    imageContainer: {
        height: "100%",
        width: 60,

        backgroundColor: "red",
    },

    presets: {
        flex: 1,
        marginTop: 12
    },

    presetsHeader: {
        fontWeight: "bold",
        textAlign: "right",

        paddingRight: 6
    }
})