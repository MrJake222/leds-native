import SocketIOClient from 'socket.io-client'
import { serverUpdateConnectionStatus, modDeleteModule, modNameAddressUpdate, modFieldUpdate, appLoadState, presetDelete } from '../redux/actions';

import { loadDatabase, addToStore, removeFromStorarge } from './updateDatabase';
import { AsyncStorage } from 'react-native'
import { Store } from 'redux';
import LastModified from '../types/LastModified';

export var socketGlobal: SocketIOClient.Socket
var initialized = false

/**
 * Connects to server via the SocketIO
 * Called from store.js on address:port read
 * 
 * @param serverAddress Server's IP address
 * @param serverPort Server's port
 * @param store Redux store for dispatching actions
 */
export function initSocketIO(serverAddress: string, serverPort: number, store: Store) {
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

    socket.on("init", ({lastModified, force}: {lastModified: LastModified[], force: boolean}) => {
        // console.log("init")

        if (!store.getState().appStatus.isAppLoaded) {
            loadDatabase(lastModified, socket, force)
        }
    })

    socket.on("added", async ({fieldName, docs, getAll}: {fieldName: string, docs: any[], getAll: boolean}) => {
        const storageDocsRaw = await AsyncStorage.getItem(fieldName)
        const storageDocs = JSON.parse(storageDocsRaw!) || {}

        if (fieldName == "modules")
            console.log(docs)

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

    socket.on("removed", ({fieldName, _id}: {fieldName: string, _id: string}) => {
        switch (fieldName) {
            case "modules":
                store.dispatch(modDeleteModule(_id))
                break

            case "presets":
                store.dispatch(presetDelete(_id))
                break

            default:
                removeFromStorarge(fieldName, _id)
                break
        }
    })

    socket.on("updateModule", ({modId, modAddress, modName}: {modId: string, modAddress: number, modName: string}) => {
        store.dispatch(modNameAddressUpdate(modId, modAddress, modName))
    })

    socket.on("updateModField", ({modId, codename, value}: {modId: string, codename: string, value: any}) => {
        store.dispatch(modFieldUpdate(modId, codename, value))
    })

    socket.on("updateMultipleModFields", ({modId, values}: {modId: string, values: {[codename: string]: any}}) => {
        Object.keys(values).forEach((codename) => store.dispatch(modFieldUpdate(modId, codename, values[codename])))
    })
    
    socket.connect()
}