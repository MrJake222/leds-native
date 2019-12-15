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
import Module from '../../elements/ModuleComponent';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { socketGlobal } from '../../network/socket';
import { appLoadAllStates, presetAdd, appClearData, deselectAllModules, appSelectPreset } from '../../redux/actions';
import { rootNavigatorNavigate } from '../../RootNavigatorRef';
import { NavigationScreenProp } from 'react-navigation';
import { ConnectedProps, connect } from 'react-redux';
import RootState from '../../redux/RootState';
import Preset from '../../types/Preset';
import PresetComponent from '../../elements/PresetComponent';

const mapStateToProps = (state: RootState) => {
    return {
        isAppLoaded: state.appStatus.isAppLoaded,
        selectedPreset: state.appStatus.selectedPreset,
        selectedModules: state.appStatus.selectedModules,

        modules: state.modules,
        presets: state.presets,
    }
}

const mapDispatchToProps = {
    deloadApp: () => appLoadAllStates(false),
    clearData: () => appClearData(),
    selectPreset: (preset: Preset | null) => appSelectPreset(preset),
    deselectAllModules: () => deselectAllModules(),
}

interface MainScreenOwnProps {
    navigation: NavigationScreenProp<any>
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type MainScreenProps = ConnectedProps<typeof connector> & MainScreenOwnProps

class MainScreen extends React.PureComponent<MainScreenProps> {
    constructor(props: MainScreenProps) {
        super(props)

        this.refresh = this.refresh.bind(this)
        this.applyPreset = this.applyPreset.bind(this)
        this.deselectPreset = this.deselectPreset.bind(this)
    }

    static addIcon = (navigation: NavigationScreenProp<any>) => {
        let onPress = () => navigation.navigate("AddModule")
        let source = require("../../assets/add.png")

        if (navigation.state.params && navigation.state.params.presetMode) {
            onPress = navigation.state.params.applyPreset
            source = require("~/assets/apply.png")
        }

        return <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
            <Image source={source} resizeMode="center" style={{ height: "100%", width: 30, marginRight: 8, tintColor: "#FFF" }} />
        </TouchableOpacity>
    }

    refresh() {
        this.props.deloadApp()
        rootNavigatorNavigate("ConnectionWrapper")

        this.props.clearData()
        socketGlobal.emit("forceReload")
    }

    applyPreset() {
        const { _id, presetName } = this.props.selectedPreset!
        const modules = this.props.selectedModules

        if (socketGlobal.connected){
            ToastAndroid.show("Applying preset " + presetName + " to " + modules.length + " modules", ToastAndroid.SHORT)

            socketGlobal.emit("applyPreset", {
                presetId: _id,
                modules: modules
            })
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

        // return <ScrollView contentContainerStyle={{ flex: 1 }} refreshControl={<RefreshControl colors={["#4CAF50"]} refreshing={!this.props.isAppLoaded} onRefresh={this.refresh} />}>
        return <View style={styles.container}>
            {/* Contains module definitions */}
            <View style={styles.modules}>
                {/* <Button style={{zIndex: 0}} title="Clear AsyncStorage" onPress={() => AsyncStorage.clear()} /> */}

                <FlatList
                    // contentContainerStyle={{ flex: 1 }}
                    refreshControl={<RefreshControl colors={["#4CAF50"]} refreshing={!this.props.isAppLoaded} onRefresh={this.refresh} />}
                    data={Object.values(this.props.modules)}
                    keyExtractor={(item) => item._id.toString()}

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

                        renderItem={({ item }) => <PresetComponent
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
        // </ScrollView>
    }
}

export default connector(MainScreen)

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