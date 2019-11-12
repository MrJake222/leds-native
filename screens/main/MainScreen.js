import React from 'react'

import {
    StyleSheet,

    View,
    FlatList,
    Image,
    RefreshControl,
    Text,
    BackHandler,
    ToastAndroid
} from 'react-native'

import ServerStatus from '../../elements/ServerStatus';
import Module from '../../elements/Module';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { socketGlobal } from '../../network/socket';
import { appLoadAllStates, presetAdd, appClearData, deselectAllModules, appSelectPreset } from '../../redux/actions';
import Preset from '../../elements/Preset';
import { rootNavigatorNavigate } from '../../RootNavigatorRef';

export default class MainScreen extends React.PureComponent {
    constructor(props) {
        super(props)

        this.refresh = this.refresh.bind(this)
        this.applyPreset = this.applyPreset.bind(this)
        this.deselectPreset = this.deselectPreset.bind(this)
    }

    static mapStateToProps = (state) => {
        return {
            isAppLoaded: state.appStatus.isAppLoaded,
            selectedPreset: state.appStatus.selectedPreset,
            selectedModules: state.appStatus.selectedModules,

            modules: state.modules,
            presets: state.presets,
        }
    }

    static mapDispatchToProps = (dispatch) => {
        return {
            deloadApp: () => dispatch(appLoadAllStates(false)),
            clearData: () => dispatch(appClearData()),
            addPreset: (modTypeCodename, values) => dispatch(presetAdd(modTypeCodename, values)),
            selectPreset: (preset) => dispatch(appSelectPreset(preset)),
            deselectAllModules: () => dispatch(deselectAllModules()),
        }
    }

    static addIcon = (navigation) => {
        let onPress = () => navigation.navigate("AddModule")
        let source = require("../../assets/add.png")

        if (navigation.state.params && navigation.state.params.presetMode) {
            onPress = navigation.state.params.applyPreset
            source = require("~/assets/apply.png")
        }

        return <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
            <Image source={source} resizeMode="center" tintColor="#FFF" style={{ height: "100%", width: 30, marginRight: 8 }} />
        </TouchableOpacity>
    }

    refresh() {
        this.props.deloadApp()
        rootNavigatorNavigate("ConnectionWrapper")

        this.props.clearData()
        socketGlobal.emit("forceReload")
    }

    applyPreset() {
        const { presetName } = this.props.selectedPreset
        const modules = this.props.selectedModules

        if (socketGlobal.connected){
            ToastAndroid.show("Applying preset " + presetName + " to " + modules.length + " modules", ToastAndroid.SHORT)
        }

        else {
            ToastAndroid.show("Socket disconnected", ToastAndroid.SHORT)
        }
        
        this.deselectPreset()
    }

    deselectPreset() {
        this.props.selectPreset(null)
        this.props.deselectAllModules()

        this.props.navigation.setParams({
            headerTitle: null,
            presetMode: false
        })
    }

    componentDidMount() {
        this.props.navigation.setParams({
            applyPreset: this.applyPreset
        })

        BackHandler.addEventListener("hardwareBackPress", () => {
            if (this.props.selectedPreset) {
                this.deselectPreset()
                return true
            }

            return false
        })
    }

    render() {
        // console.log("MainScreen rerender", this.props.presets)

        return <ScrollView contentContainerStyle={{ flex: 1 }} refreshControl={<RefreshControl colors={["#4CAF50"]} refreshing={!this.props.isAppLoaded} onRefresh={this.refresh} />}>
            <View style={styles.container}>
                {/* Contains module definitions */}
                <View style={styles.modules}>
                    {/* <Button style={{zIndex: 0}} title="Clear AsyncStorage" onPress={() => AsyncStorage.clear()} /> */}

                    <FlatList
                        contentContainerStyle={{ flex: 1 }}
                        data={Object.values(this.props.modules)}
                        keyExtractor={(item) => item.modId.toString()}

                        renderItem={({ item }) => <Module
                            mod={item}
                            openModule={() => this.props.navigation.navigate("Module", { mod: item })}
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
                                
                                setPresetMode={() => {
                                    this.props.navigation.setParams({
                                        headerTitle: "Apply preset " + item.presetName,
                                        presetMode: true
                                    })
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
        flex: 2
    },

    // Status pane
    status: {
        flex: 1
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