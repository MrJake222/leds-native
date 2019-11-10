import SocketIOClient from 'socket.io-client'
import { serverUpdateConnectionStatus, modDeleteModule, modClearModules, modNameAddressUpdate, modFieldUpdate } from '../redux/actions';

import loadDatabase, { addToStore, loadState } from './updateDatabase';

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

    const addr = "http://" + serverAddress + ":" + serverPort
    console.log(addr)    
    
    var socket = SocketIOClient(addr, {
        transports: ['websocket']
    })


    // ---------------------------------------------------------------------------------------
    socket.on("connect", () => {
        console.log("Socket connected")

        store.dispatch(serverUpdateConnectionStatus(true, "Connected"))
        socketGlobal = socket
        // socket.emit("addModule", {a: 1, b: 3})
    })

    socket.on("disconnect", () => {
        console.log("Socket disconnected")

        store.dispatch(serverUpdateConnectionStatus(false, "Disonnected"))
    })

    socket.on("init", (lastModified) => {
        if (loadState == 0)
            loadDatabase(lastModified, socket)
    })

    socket.on("forceReload", (lastModified) => {
        // loadState = 0
        store.dispatch(modClearModules())

        loadDatabase(lastModified, socket, true)
    })

    socket.on("added", ({fieldName, docs}) => addToStore(fieldName, docs))
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