import SocketIOClient from 'socket.io-client'
import { serverUpdateConnectionStatus, modDeleteModule, modNameUpdate, modFieldUpdate, appLoadState, presetDelete, appConnectionFailed, modAddressUpdate } from '../redux/actions';

import { loadDatabase, addToStore, removeFromStorarge } from './updateDatabase';
import { AsyncStorage, ToastAndroid } from 'react-native'
import { Store } from 'redux';
import LastModified from '../types/LastModified';

/**
 * Wraps all SocketIO interactions to use across entire project
 */
class Socket {
    initialized: boolean = false
    socket: SocketIOClient.Socket

    constructor() {

    }

    /**
     * Initializes the SocketIO
     * Called from store.js on address:port read either from user or from AsyncStorage
     * 
     * @param serverAddress Server's IP address
     * @param serverPort Server's port
     * @returns True if init was successful
     */
    init(serverAddress: string, serverPort: number): boolean {
        if (this.initialized) {
            console.warn("Socket already initialized. Init should be called once")

            return false
        }

        else {
            this.initialized = true

            const addr = "http://" + serverAddress + ":" + serverPort
            console.log("Socket address: " + addr)

            this.socket = SocketIOClient(addr, {
                transports: ['websocket']
            })

            return true
        }
    }

    reset() {
        this.socket.disconnect()

        this.initialized = false
    }

    /**
     * Adds events to socket
     * 
     * @param store Redux store for dispatching actions
     */
    addEvents(store: Store) {
        this.socket.on("connect", () => {
            store.dispatch(serverUpdateConnectionStatus(true, "Connected"))

            if (!store.getState().appStatus.isAppLoaded) {
                store.dispatch(appConnectionFailed(false, 0))

                this.socket.emit("forceReload")
            }
        })

        this.socket.on("disconnect", () => {
            store.dispatch(serverUpdateConnectionStatus(false, "Disonnected"))
        })

        this.socket.on("init", ({ lastModified, force }: { lastModified: LastModified[], force: boolean }) => {
            if (!store.getState().appStatus.isAppLoaded) {
                loadDatabase(lastModified, this.socket, force)
            }
        })


        /**
         * Received when another user adds a module or a preset or anything else,
         * but also on our own addition to receive proper _id
         */
        this.socket.on("added", async ({ fieldName, docs, getAll }: { fieldName: string, docs: any[], getAll: boolean }) => {

            let storageDocs: {[key: string]: any} = {}

            // If not getAll, read current AsyncStorage content
            if (!getAll) {
                const storageDocsRaw = await AsyncStorage.getItem(fieldName)
                storageDocs = JSON.parse(storageDocsRaw!)

                // If adding module, show a Toast
                if (fieldName == "modules") {
                    ToastAndroid.show("Discovered " + docs[0].modType + " at " + docs[0].modAddress, ToastAndroid.SHORT)
                }
            }

            docs.forEach((doc) => {
                addToStore(fieldName, doc)
                storageDocs[doc._id] = doc
            })

            // Set AsyncStorage contents and update LastModified
            AsyncStorage.setItem(fieldName, JSON.stringify(storageDocs))
            AsyncStorage.setItem(fieldName + "LastModified", new Date().toJSON())

            // If getting all the records,
            // Change the load state
            if (getAll)
                store.dispatch(appLoadState(fieldName, true))
        })

        /**
         * Removes item from Redux Store and from AsyncStorage
         */
        this.socket.on("removed", ({ fieldName, _id }: { fieldName: string, _id: string }) => {
            switch (fieldName) {
                case "modules":
                    store.dispatch(modDeleteModule(_id))
                    break

                case "presets":
                    store.dispatch(presetDelete(_id))
                    break

                default:
                    console.error("No remove action defined for field " + fieldName)
                    break
            }

            removeFromStorarge(fieldName, _id)
        })

        this.socket.on("addModuleFailed", ({ reason }: { reason: string }) => {
            switch (reason) {
                case "timeout":
                    ToastAndroid.show("Reading module's type failed. Double check the address and powering of the device and try again.", ToastAndroid.LONG)
                    break
            }
        })

        this.socket.on("updateModuleName", ({ modId, modName }: { modId: string, modName: string }) => {
            store.dispatch(modNameUpdate(modId, modName))
        })

        this.socket.on("updateModuleAddress", ({ modId, newModAddress }: { modId: string, newModAddress: number }) => {
            ToastAndroid.show("Address successfully updated to " + newModAddress, ToastAndroid.SHORT)
            store.dispatch(modAddressUpdate(modId, newModAddress))
        })

        this.socket.on("updateModuleAddressFailed", ({ reason }: { reason: string }) => {
            switch (reason) {
                case "timeout":
                    ToastAndroid.show("Timeout sending the update packet. Check address and connections.", ToastAndroid.LONG)
                    break

                default:
                    ToastAndroid.show("Unknown error. See server console for details.", ToastAndroid.LONG)
            }
        })

        this.socket.on("updateModField", ({ modId, codename, value }: { modId: string, codename: string, value: any }) => {
            store.dispatch(modFieldUpdate(modId, codename, value))
        })

        this.socket.on("updateMultipleModFields", ({ modId, values }: { modId: string, values: { [codename: string]: any } }) => {
            Object.keys(values).forEach((codename) => store.dispatch(modFieldUpdate(modId, codename, values[codename])))
        })
    }

    /**
     * Tries to connect to the socket
     */
    connect(store: Store) {
        this.socket.connect()

        setTimeout(() => {
            if (!this.socket.connected) {
                store.dispatch(appConnectionFailed(true, 0))
            }
        }, 2000)
    }

    /**
     * Checks connection.
     * If failed, it shows AndroidToast
     * 
     * @returns True if socket is connected
     */
    checkConnetionWithToast(): boolean {
        if (this.socket.connected) {
            return true
        }

        else {
            ToastAndroid.show("Cannot perform this action. Socket is not connected.", ToastAndroid.SHORT)

            return false
        }
    }

    addModule(modAddress: number, modName: string): boolean {
        if (this.checkConnetionWithToast()) {
            this.socket.emit("addModule", {
                modAddress: modAddress,
                modName: modName,
            })

            return true
        }

        return false
    }

    updateModuleName(_id: string, modName: string): boolean {
        if (this.checkConnetionWithToast()) {
            this.socket.emit("updateModuleName", {
                modId: _id,
                modName: modName
            })

            return true
        }

        return false
    }

    updateModuleAddress(_id: string, newModAddress: number): boolean {
        if (this.checkConnetionWithToast()) {
            this.socket.emit("updateModuleAddress", {
                modId: _id,
                newModAddress: newModAddress
            })

            return true
        }

        return false
    }

    updateModField(_id: string, modAddress: number, modType: string, codename: string, value: any) {
        if (this.checkConnetionWithToast()) {
            this.socket.emit("updateModField", {
                modId: _id,
                modAddress: modAddress,
                modType: modType,
                codename: codename,
                value: value
            })

            return true
        }

        return false
    }

    deleteModule(_id: string): boolean {
        if (this.checkConnetionWithToast()) {
            this.socket.emit("deleteModule", { modId: _id })

            return true
        }

        return false
    }

    addPreset(presetName: string, modId: string, modType: string, values: {[key: string]: number}): boolean {        
        if (this.checkConnetionWithToast()) {
            this.socket.emit("addPreset", {
                presetName: presetName,
                modId: modId,
                modType: modType,
                values: values
            })

            return true
        }

        return false
    }

    applyPreset(_id: string, modules: string[]): boolean {
        if (this.checkConnetionWithToast()) {
            this.socket.emit("applyPreset", {
                presetId: _id,
                modules: modules
            })

            return true
        }

        return false
    }

    deletePreset(_id: string): boolean {
        if (this.checkConnetionWithToast()) {
            this.socket.emit("deletePreset", { _id: _id })

            return true
        }

        return false
    }

    forceReload(): boolean {
        if (this.checkConnetionWithToast()) {
            this.socket.emit("forceReload")

            return true
        }

        return false
    }
}

export const socket = new Socket()
