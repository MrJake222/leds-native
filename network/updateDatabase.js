import { AsyncStorage } from 'react-native'
import { modAddValues, modAddType, modAddModule, modAddField, appLoad } from '../redux/actions';

/**
 * Reads up last modification date from AsyncStorage and loads
 * modules, presets etc. from AsyncStorage or from the server.
 * 
 */
export default async function loadDatabase(lastModified, socket, force = false) {
    loadState = 0

    lastModified.forEach(async ({fieldName, lastModified}) => {
        var lastModifiedClient = new Date(await AsyncStorage.getItem(fieldName + "LastModified"))

        if (fieldName=="modules") {
            console.log("lastModifiedClient", lastModifiedClient)
            console.log("lastModified", lastModified)
        }

        if (new Date(lastModified) > lastModifiedClient || force) {
            console.log(fieldName + " from server")

            AsyncStorage.setItem(fieldName + "LastModified", lastModified)

            socket.emit("getAll", {
                fieldName: fieldName
            })
        }

        else {
            // console.log(fieldName + " from client")

            var docs = await AsyncStorage.getItem(fieldName)
            docs = JSON.parse(docs)

            addToStore(fieldName, docs)
        }
    })
}

export var loadState = 0

export function addToStore(fieldName, docs) {
    var actionCreator = null

    switch (fieldName) {
        case "modules":     actionCreator = modAddModule;   loadState++; break
        case "modTypes":    actionCreator = modAddType;     loadState++; break
        case "modFields":   actionCreator = modAddField;    loadState++; break
        case "modValues":   actionCreator = modAddValues;   loadState++; break
    }

    if (actionCreator) {
        docs.forEach((doc) => {
            store.dispatch(actionCreator(doc))

            AsyncStorage.setItem(fieldName, JSON.stringify(docs))
        })

        if (loadState == 4)
            store.dispatch(appLoad(true))
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