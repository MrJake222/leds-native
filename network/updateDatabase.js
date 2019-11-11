import { AsyncStorage } from 'react-native'
import { modAddValues, modAddType, modAddModule, modAddField, appLoad, presetAdd, appLoadState } from '../redux/actions';

/**
 * Reads up last modification date from AsyncStorage and loads
 * modules, presets etc. from AsyncStorage or from the server.
 */
export async function loadDatabase(lastModified, socket, force = false) {
    loadState = 0

    lastModified.forEach(async ({fieldName, lastModified}) => {
        var lastModifiedClient = new Date(await AsyncStorage.getItem(fieldName + "LastModified"))

        // if (fieldName=="presets") {
        //     console.log("lastModifiedClient", lastModifiedClient)
        //     console.log("lastModified", lastModified)
        // }

        if (new Date(lastModified) > lastModifiedClient || force) {
            // if (fieldName == "modules")
            console.log(fieldName + " from server")

            socket.emit("getAll", {
                fieldName: fieldName
            })
        }

        else {
            var docs = await AsyncStorage.getItem(fieldName)
            docs = JSON.parse(docs)

            // if (fieldName == "modules") {
                // console.log(fieldName + " from client")
                // console.log("docs", docs)
            // }

            Object.values(docs).forEach((doc) => addToStore(fieldName, doc))

            store.dispatch(appLoadState(fieldName, true))
        }
    })
}

export async function removeFromStorarge(fieldName, _id) {
    var storageDocs = await AsyncStorage.getItem(fieldName)
    storageDocs = JSON.parse(storageDocs) || {}

    const {[_id]: value, ...removed} = storageDocs

    AsyncStorage.setItem(fieldName, JSON.stringify(removed))
    AsyncStorage.setItem(fieldName + "LastModified", new Date().toJSON())
}

/**
 * Stores actionCreators for @see addToStore
 */
const actionCreators = {
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
 * @param {*} fieldName Name of field
 * @param {*} doc Elements data in {_id: data} format
 */
export function addToStore(fieldName, doc) {
    var actionCreator = actionCreators[fieldName]

    if (actionCreator) {
        store.dispatch(actionCreator(doc))
    }

    else {
        throw "No such creator"
    }
}

function objToArray(obj) {

    return Object.keys(obj).map((key) => {
        return {
            [key]: obj[key]
        }
    })
}