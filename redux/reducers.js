import { actionTypes } from "./actions";

// -----------------------
// Reducers

function appStatus(appStatus = {}, action) {
    switch (action.type) {

        case actionTypes.APP_INITIALIZE:
            return {
                ...appStatus,
                isAppInitialized: action.isAppInitialized
            }

        case actionTypes.APP_LOAD_STATE:
            var loadStates = {
                ...appStatus.loadStates,
                [action.loadState]: action.state
            }

            const loaded = Object.values(loadStates).reduce((loaded, loadState) => loaded && loadState, true)

            return {
                ...appStatus,

                isAppLoaded: loaded,
                loadStates: loadStates
            }

        case actionTypes.APP_LOAD_ALL_STATES:
            const keys = Object.keys(appStatus.loadStates)
            loadStates = keys.reduce((prev, current) => ({...prev, [current]: action.state}), {})

            return {
                ...appStatus,

                isAppLoaded: action.state,
                loadStates: loadStates
            }

        case actionTypes.APP_SELECT_PRESET:
            return {
                ...appStatus,

                selectedPreset: action.preset
            }
        
        case actionTypes.APP_SELECT_MODULE:
            return {
                ...appStatus,

                selectedModules: [
                    ...appStatus.selectedModules,
                    action.modId
                ]
            }

        case actionTypes.APP_DESELECT_MODULE:            
            return {
                ...appStatus,

                selectedModules: appStatus.selectedModules.filter((modId) => modId != action.modId),
            }

        case actionTypes.APP_DESELECT_ALL_MODULES:
            return {
                ...appStatus,

                selectedModules: []
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

        case actionTypes.APP_CLEAR_DATA:
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

        case actionTypes.APP_CLEAR_DATA:
            return {}
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

        case actionTypes.APP_CLEAR_DATA:
            return {}

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

        case actionTypes.APP_CLEAR_DATA:
            return {}

    }

    return modValues
}


// ------------------------------------------------------------
// Presets

function presets(presets = {}, action) {
    switch (action.type) {

        case actionTypes.PRESET_ADD:
            return {
                ...presets,
                [action.preset._id]: action.preset
            }

        case actionTypes.PRESET_DELETE:
            const { [action.id]: value, ...removed } = presets
            
            return removed

        case actionTypes.APP_CLEAR_DATA:
            return {}
    }

    return presets
}


export function reducer(state = {}, action) {
    return {
        ...state,
        appStatus: appStatus(state.appStatus, action),

        serverData: serverData(state.serverData, action),

        modules: modules(state.modules, action),
        modFields: modFields(state.modFields, action),
        modTypes: modTypes(state.modTypes, action),
        modValues: modValues(state.modValues, action),

        presets: presets(state.presets, action),
    }
}