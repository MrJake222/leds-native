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
import { TouchableOpacity } from 'react-native-gesture-handler';
import { appLoadAllStates, appClearData, deselectAllModules, appSelectPreset } from '../../redux/actions';
import { rootNavigatorNavigate } from '../../RootNavigatorRef';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { ConnectedProps, connect } from 'react-redux';
import RootState from '../../redux/RootState';
import Preset from '../../types/Preset';
import PresetComponent from '../../elements/PresetComponent';
import { socket } from '../../network/Socket';
import { NavigationStackScreenProps, NavigationStackProp } from 'react-navigation-stack';

const mapStateToProps = (state: RootState) => {
    return {
        isAppLoaded: state.appStatus.isAppLoaded,
        selectedPreset: state.appStatus.selectedPreset,
        selectedModules: state.appStatus.selectedModules,

        modules: state.modules,
        modValues: state.modValues,
        presets: state.presets,
    }
}

const mapDispatchToProps = {
    deloadApp: () => appLoadAllStates(false),
    clearData: () => appClearData(),
    selectPreset: (preset: Preset | null) => appSelectPreset(preset),
    deselectAllModules: () => deselectAllModules(),
}

export interface MainScreenNavigationParams {
    applyPreset: (force: boolean) => void
    headerTitle: string | null
    presetMode: boolean
}

type NavigationProps = NavigationScreenProp<NavigationRoute<MainScreenNavigationParams>, MainScreenNavigationParams>

interface MainScreenOwnProps {
    navigation: NavigationProps
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

    static addIcon = (navigation: NavigationStackProp<NavigationRoute<MainScreenNavigationParams>, MainScreenNavigationParams>) => {
        let onPress: (() => boolean) | ((force: boolean) => void) = () => navigation.navigate("AddModule")
        let onLongPress = () => {}
        let source = require("../../assets/add.png")

        if (navigation.getParam("presetMode")) {
            onPress = navigation.getParam("applyPreset")
            onLongPress = () => navigation.getParam("applyPreset")(true)
            source = require("~/assets/apply.png")
        }

        return <TouchableOpacity activeOpacity={0.5} onPress={onPress} onLongPress={onLongPress}>
            <Image source={source} resizeMode="center" style={{ height: "100%", width: 30, marginRight: 8, tintColor: "#FFF" }} />
        </TouchableOpacity>
    }

    refresh() {
        this.props.deloadApp()
        rootNavigatorNavigate("ConnectionWrapperScreen")

        this.props.clearData()
        socket.forceReload()
    }

    applyPreset(force: boolean) {
        const { _id, presetName } = this.props.selectedPreset!
        let modules = this.props.selectedModules 

        // Get modules and filter out modules with preset already applied
        if (!force)
            modules = modules.filter(_id => this.props.modValues[_id].preset != presetName)
        
        if (modules.length > 0) {
            if (socket.applyPreset(_id, modules)) {
                ToastAndroid.show("Applying preset " + presetName + " to " + modules.length + " modules", ToastAndroid.SHORT)
            }
        }

        else if (this.props.selectedModules.length > 0) {
            const plural = this.props.selectedModules.length > 1 ? "s" : ""

            ToastAndroid.show("Module"+plural+" already have this preset applied. Hold the apply icon to force.", ToastAndroid.SHORT)
        }

        else {
            ToastAndroid.show("No modules selected", ToastAndroid.SHORT)
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