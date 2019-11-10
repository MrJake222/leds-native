import { actionTypes } from "./actions";

// -----------------------
// Reducers

function appInitialize(appStatus = {}, action) {
    switch (action.type) {

        case actionTypes.APP_INITIALIZE:
            return {
                ...appStatus,
                isAppInitialized: action.isAppInitialized
            }

        case actionTypes.APP_LOAD:
            return {
                ...appStatus,
                isAppLoaded: action.isAppLoaded
            }
    }

    return appStatus
}

function serverData(serverData = {}, action) {
    switch (action.type) {

        case actionTypes.SERVER_UPDATE_CONFIG:
            return {
                ...serverData,
                serverAddress: action.serverAddress,
                serverPort: action.serverPort
            }

        case actionTypes.SERVER_UPDATE_CONNECTION_STATUS:
            return {
                ...serverData,
                connected: action.connected,
                connectionStatus: action.connectionStatus
            }
    }

    return serverData
}

function modules(modules = {}, action) {
    switch (action.type) {

        case actionTypes.MOD_ADD_MODULE:
            return {
                ...modules,
                [action.module.modId]: action.module
            }

        case actionTypes.MOD_DELETE_MODULE:
            const { [action.modId]: value, ...removed } = modules
            
            return removed

        case actionTypes.MOD_CLEAR_MODULES:
            return {}

        case actionTypes.MOD_NAME_ADDRESS_UPDATE:
            return {
                ...modules,

                [action.modId]: {
                    ...modules[action.modId],

                    modName: action.modName,
                    modAddress: action.modAddress
                }
            }

    }

    return modules
}

function modFields(modFields = {}, action) {
    switch (action.type) {

        case actionTypes.MOD_ADD_FIELD:
            return {
                ...modFields,
                [action.field.codename]: action.field
            }
    }

    return modFields
}

function modTypes(modTypes = {}, action) {
    switch (action.type) {

        case actionTypes.MOD_ADD_TYPE:
            return {
                ...modTypes,
                [action.modType.codename]: action.modType
            }

    }

    return modTypes
}

function modValues(modValues = {}, action) {
    switch (action.type) {

        case actionTypes.MOD_ADD_VALUES:
            return {
                ...modValues,
                [action.modValues.modId]: action.modValues
            }

        case actionTypes.MOD_FIELD_UPDATE:
            return {
                ...modValues,

                [action.modId]: {
                    ...modValues[action.modId],
                    [action.fieldCodename]: action.fieldValue
                }
            }

    }

    return modValues
}

export function reducer(state = {}, action) {
    return {
        ...state,
        appStatus: appInitialize(state.appStatus, action),

        serverData: serverData(state.serverData, action),

        modules: modules(state.modules, action),
        modFields: modFields(state.modFields, action),
        modTypes: modTypes(state.modTypes, action),
        modValues: modValues(state.modValues, action),
    }
}