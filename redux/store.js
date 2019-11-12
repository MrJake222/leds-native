import { AsyncStorage } from 'react-native'

import { createStore } from "redux"
import { reducer } from "./reducers";
import { appInitialize, serverUpdateConfig } from './actions';
import devToolsEnhancer from 'remote-redux-devtools';
import { initSocketIO } from '../network/socket';

export default store = createStore(reducer, {
    appStatus: {
        isAppInitialized: false,
        isAppLoaded: false,

        statusString: "",

        /**
         * Indicates if app loaded given prop
         */
        loadStates: {
            modules: false,
            modTypes: false,
            modFields: false,
            modValues: false,
            presets: false
        },

        /**
         * If user is applying preset, this holds the reference to it.
         * If not, must be null.
         */
        selectedPreset: null,

        /**
         * Array of selected modules for preset apply
         */
        selectedModules: []
    },

    serverData: {
        serverAddress: "",
        serverPort: -1,

        connected: false,
        connectionStatus: ""
    },

    modules: {},
    modFields: {},
    modTypes: {},
    modValues: {},
    presets: {},
},

devToolsEnhancer({
    name: "Leds",
    realtime: true,
    // hostname: "192.168.43.217",
    hostname: "192.168.1.2",
    port: 8000,
    maxAge: 30,
    // actionsBlacklist: ["SERVER_UPDATE_CONNECTION_STATUS"]
}))

AsyncStorage.multiGet(["isAppInitialized", "serverAddress", "serverPort"], (err, array) => {
    var res = {}
    array.forEach((e) => res[e[0]] = e[1])

    res.isAppInitialized = res.isAppInitialized == "true"

    if (err)
        throw err

    if (res.isAppInitialized) {
        store.dispatch(serverUpdateConfig(res.serverAddress, res.serverPort))
        store.dispatch(appInitialize(res.isAppInitialized))

        initSocketIO(res.serverAddress, res.serverPort, store)
    }
})

var unsubStorage = store.subscribe(async () => {
    var state = store.getState()

    var currentAddress = await AsyncStorage.getItem("serverAddress")
    var newAddress = state.serverData.serverAddress

    var currentPort = await AsyncStorage.getItem("serverPort")
    var newPort = state.serverData.serverPort

    if (newAddress != currentAddress || newPort != currentPort) {
        AsyncStorage.setItem("isAppInitialized", "true")
        AsyncStorage.setItem("serverAddress", newAddress)
        AsyncStorage.setItem("serverPort", newPort)

        initSocketIO(newAddress, newPort, store)
        unsubStorage()
    }
})