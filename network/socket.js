import SocketIOClient from 'socket.io-client'
import { serverUpdateConnectionStatus, modDeleteModule, modClearModules, modNameAddressUpdate, modFieldUpdate, appLoadState } from '../redux/actions';

import { loadDatabase, loadDoc, addToStore } from './updateDatabase';
import { AsyncStorage } from 'react-native'

export var socketGlobal
var initialized = false

/**
 * Connects to server via the SocketIO
 * Called from store.js on address:port read
 * 
 * @param {*} serverAddress Server's IP address
 * @param {*} serverPort Server's port
 * @param {*} store Redux store for dispatching actions
 */
export function initSocketIO(serverAddress, serverPort, store) {
    if (initialized)
        return

    initialized = true

    const addr = "http://" + serverAddress + ":" + serverPort
    console.log(addr)    
    
    var socket = SocketIOClient(addr, {
        transports: ['websocket']
    })


    // ---------------------------------------------------------------------------------------
    socket.on("connect", () => {
        // console.log("Socket connected")

        store.dispatch(serverUpdateConnectionStatus(true, "Connected"))
        socketGlobal = socket
        // socket.emit("addModule", {a: 1, b: 3})
    })

    socket.on("disconnect", () => {
        // console.log("Socket disconnected")

        store.dispatch(serverUpdateConnectionStatus(false, "Disonnected"))
    })

    socket.on("init", ({lastModified, force}) => {
        // console.log("init")

        if (!store.getState().appStatus.isAppLoaded) {
            loadDatabase(lastModified, socket, force)
        }
    })

    socket.on("added", async ({fieldName, docs, getAll}) => {
        var storageDocs = await AsyncStorage.getItem(fieldName)
        storageDocs = JSON.parse(storageDocs) || {}

        docs.forEach((doc) => {
            if (fieldName == "modules")
                doc.modId = doc._id

            addToStore(fieldName, doc)
            storageDocs[doc._id] = doc
        })

        // if (fieldName == "modules")
        //     console.log("storageDocs", storageDocs)

        AsyncStorage.setItem(fieldName, JSON.stringify(storageDocs))
        AsyncStorage.setItem(fieldName + "LastModified", new Date().toJSON())

        if (getAll)
            store.dispatch(appLoadState(fieldName, true))
    })

    socket.on("removed", ({fieldName, modId}) => {
        if (fieldName == "modules") {
            store.dispatch(modDeleteModule(modId))
        }
    })

    socket.on("updateModule", ({modId, modAddress, modName}) => {
        store.dispatch(modNameAddressUpdate(modId, modAddress, modName))
    })

    socket.on("updateModField", ({modId, codename, value}) => {
        store.dispatch(modFieldUpdate(modId, codename, value))
    })
    
    socket.connect()
}