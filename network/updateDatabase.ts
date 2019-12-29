import { AsyncStorage } from 'react-native'
import { modAddValues, modAddType, modAddModule, modAddField, presetAdd, appLoadState } from '../redux/actions';
import LastModified from '../types/LastModified';
import store from '../redux/store';

/**
 * Reads up last modification date from AsyncStorage and loads
 * modules, presets etc. from AsyncStorage or from the server.
 */
export async function loadDatabase(lastModified: LastModified[], socket: SocketIOClient.Socket, force = false) {
    lastModified.forEach(async ({fieldName, lastModified}) => {
        var lastModifiedClient: string | Date | null = await AsyncStorage.getItem(fieldName + "LastModified")

        // console.log("force = " + force)

        if (lastModifiedClient != null)
            lastModifiedClient = new Date(lastModifiedClient)
        else
            force = true
        // if (fieldName=="presets") {
        //     console.log("lastModifiedClient", lastModifiedClient)
        //     console.log("lastModified", lastModified)
        // }

        if (force || new Date(lastModified) > lastModifiedClient!) {
            // if (fieldName == "modules")
            console.log(fieldName + " from server, force = " + force)

            socket.emit("getAll", {
                fieldName: fieldName
            })
        }

        else {
            var docs = await AsyncStorage.getItem(fieldName)
            docs = JSON.parse(docs!)

            // if (fieldName == "modules") {
                // console.log(fieldName + " from client")
                // console.log("docs", docs)
            // }

            Object.values(docs!).forEach((doc) => addToStore(fieldName, doc))

            store.dispatch(appLoadState(fieldName, true))
        }
    })
}

export async function removeFromStorarge(fieldName: string, _id: string) {
    const storageDocsRaw = await AsyncStorage.getItem(fieldName)
    const storageDocs = JSON.parse(storageDocsRaw!) || {}

    const {[_id]: value, ...removed} = storageDocs

    AsyncStorage.setItem(fieldName, JSON.stringify(removed))
    AsyncStorage.setItem(fieldName + "LastModified", new Date().toJSON())
}

/**
 * Stores actionCreators for @see addToStore
 */
const actionCreators: {[name: string]: (doc: any) => any} = {
    modules: modAddModule,
    modTypes: modAddType,
    modFields: modAddField,
    modValues: modAddValues,

    presets: presetAdd
}

/**
 * Handles adding ONE element to store only.
 * Document should be properly formatted for ex. {_id: data}
 * Does not handle AsyncStorage insertion
 * 
 * @param fieldName Name of field
 * @param  doc Elements data in {_id: data} format
 */
export function addToStore(fieldName: string, doc: any) {
    var actionCreator = actionCreators[fieldName]

    if (actionCreator) {
        store.dispatch(actionCreator(doc))
    }

    else {
        throw "No such creator"
    }
}