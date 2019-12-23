import { AsyncStorage } from 'react-native'

import { createStore } from "redux"
import { reducer } from "./reducers";
import { appInitialize, serverUpdateConfig } from './actions';
// import devToolsEnhancer from 'remote-redux-devtools';
import RootState, { getDefaultState } from './RootState';
import devToolsEnhancer, { composeWithDevTools } from 'remote-redux-devtools';
import { socket } from '../network/Socket';

const store = createStore<RootState, any, {}, {}>(reducer, getDefaultState(),

composeWithDevTools({
    name: "Leds",
    realtime: true,
    // hostname: "192.168.43.217",
    hostname: "192.168.1.2",
    port: 8000,
    maxAge: 30,
    // actionsBlacklist: ["SERVER_UPDATE_CONNECTION_STATUS"]
})())

export default store

AsyncStorage.multiGet(["isAppInitialized", "serverAddress", "serverPort"], (err, array) => {
    var res: {[key: string]: string} = {}
    array!.forEach((e) => res[e[0]] = e[1])

    if (err)
        throw err

    if (res.isAppInitialized) {
        store.dispatch(serverUpdateConfig(res.serverAddress, parseInt(res.serverPort)))
        store.dispatch(appInitialize(res.isAppInitialized == "true"))

        console.log("init multiget")

        if (socket.init(res.serverAddress, parseInt(res.serverPort))) {
            socket.addEvents(store)
            socket.connect(store)

            // unsubStorage()
        }
    }
})

const unsubStorage = store.subscribe(async () => {
    var state = store.getState()

    var currentAddress = await AsyncStorage.getItem("serverAddress")
    var newAddress = state.serverData.serverAddress

    var currentPort = await AsyncStorage.getItem("serverPort")
    var newPort = state.serverData.serverPort

    // console.log("newAddress", newAddress)
    // console.log("currentAddress", currentAddress)
    // console.log("newPort", newPort)
    // console.log("currentPort", currentPort)

    if (newAddress != currentAddress || newPort != parseInt(currentPort!)) {
        AsyncStorage.setItem("isAppInitialized", "true")
        AsyncStorage.setItem("serverAddress", newAddress)
        AsyncStorage.setItem("serverPort", newPort.toString())

        if (!socket.initialized && socket.init(newAddress, newPort)) {
            socket.addEvents(store)
            socket.connect(store)
        }

        // unsubStorage()
    }
})