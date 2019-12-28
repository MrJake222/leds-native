import { AppAction, APP_INITIALIZE, APP_LOAD_STATE, APP_LOAD_ALL_STATES, APP_CONNECTION_FAILED, APP_SELECT_PRESET, APP_SELECT_MODULE, APP_DESELECT_MODULE, APP_DESELECT_ALL_MODULES, SERVER_UPDATE_CONFIG, SERVER_UPDATE_CONNECTION_STATUS, ServerAction, ModuleAction, MOD_ADD_MODULE, MOD_DELETE_MODULE, APP_CLEAR_DATA, MOD_NAME_UPDATE, FieldAction, MOD_ADD_FIELD, TypeAction, MOD_ADD_TYPE, ValuesAction, MOD_ADD_VALUES, MOD_FIELD_UPDATE, PRESET_ADD, PRESET_DELETE, PresetAction, MOD_ADDRESS_UPDATE } from "./actionTypes";
import RootState, { getDefaultState } from "./RootState";
import { Reducer } from "react";

// -----------------------
// Reducers

function appStatus(appStatus: RootState["appStatus"], action: AppAction) {
    switch (action.type) {

        case APP_INITIALIZE:
            return {
                ...appStatus,
                isAppInitialized: action.isAppInitialized
            }

        case APP_LOAD_STATE:
            var loadStates: {[key: string]: boolean} = {
                ...appStatus.loadStates,
                [action.loadState]: action.state
            }

            const loaded = Object.values(loadStates).reduce((loaded, loadState) => loaded && loadState, true)

            return {
                ...appStatus,

                isAppLoaded: loaded,
                loadStates: loadStates
            }

        case APP_LOAD_ALL_STATES:
            const keys = Object.keys(appStatus.loadStates)
            const loadStates2 = keys.reduce((prev, current) => ({...prev, [current]: action.state}), {})

            return {
                ...appStatus,

                isAppLoaded: action.state,
                loadStates: loadStates2
            }

        
        case APP_CONNECTION_FAILED:
            return {
                ...appStatus,
                connectionFailed: action.connectionFailed,
                connectionRetryTimeout: action.connectionRetryTimeout
            }

        case APP_SELECT_PRESET:
            return {
                ...appStatus,

                selectedPreset: action.preset
            }
        
        case APP_SELECT_MODULE:
            return {
                ...appStatus,

                selectedModules: [
                    ...appStatus.selectedModules,
                    action.modId
                ]
            }

        case APP_DESELECT_MODULE:            
            return {
                ...appStatus,

                selectedModules: appStatus.selectedModules.filter((modId) => modId != action.modId),
            }

        case APP_DESELECT_ALL_MODULES:
            return {
                ...appStatus,

                selectedModules: []
            }
    }

    return appStatus
}

function serverData(serverData: RootState["serverData"], action: ServerAction) {
    switch (action.type) {

        case SERVER_UPDATE_CONFIG:
            return {
                ...serverData,
                serverAddress: action.serverAddress,
                serverPort: action.serverPort
            }

        case SERVER_UPDATE_CONNECTION_STATUS:
            return {
                ...serverData,
                connected: action.connected,
                connectionStatus: action.connectionStatus
            }
    }

    return serverData
}

function modules(modules: RootState["modules"], action: ModuleAction) {
    switch (action.type) {

        case MOD_ADD_MODULE:
            return {
                ...modules,
                [action.moduleObj._id]: action.moduleObj
            }

        case MOD_DELETE_MODULE:
            const { [action.modId]: value, ...removed } = modules
            
            return removed

        case APP_CLEAR_DATA:
            return {}

        case MOD_NAME_UPDATE:
            return {
                ...modules,

                [action.modId]: {
                    ...modules[action.modId],

                    modName: action.modName,
                }
            }

        case MOD_ADDRESS_UPDATE:
            return {
                ...modules,

                [action.modId]: {
                    ...modules[action.modId],

                    modAddress: action.modAddress,
                }
            }

    }

    return modules
}

function modFields(modFields: RootState["modFields"], action: FieldAction) {
    switch (action.type) {

        case MOD_ADD_FIELD:
            return {
                ...modFields,
                [action.field.codename]: action.field
            }

        case APP_CLEAR_DATA:
            return {}
    }

    return modFields
}

function modTypes(modTypes: RootState["modTypes"], action: TypeAction) {
    switch (action.type) {

        case MOD_ADD_TYPE:
            return {
                ...modTypes,
                [action.modType.codename]: action.modType
            }

        case APP_CLEAR_DATA:
            return {}

    }

    return modTypes
}

function modValues(modValues: RootState["modValues"], action: ValuesAction) {
    switch (action.type) {

        case MOD_ADD_VALUES:
            return {
                ...modValues,
                [action.modValues.modId]: action.modValues
            }

        case MOD_FIELD_UPDATE:
            return {
                ...modValues,

                [action.modId]: {
                    ...modValues[action.modId],
                    [action.fieldCodename]: action.fieldValue
                }
            }

        case APP_CLEAR_DATA:
            return {}

    }

    return modValues
}


// ------------------------------------------------------------
// Presets

function presets(presets: RootState["presets"], action: PresetAction): RootState["presets"] {
    switch (action.type) {

        case PRESET_ADD:
            return {
                ...presets,
                [action.preset._id]: action.preset
            }

        case PRESET_DELETE:
            const { [action.presetId]: value, ...removed } = presets
            
            return removed

        case APP_CLEAR_DATA:
            return {}
    }

    return presets
}

// export const reducer = combineReducers({
//     appStatus: appStatus,

//     serverData: serverData,

//     modules: modules,
//     modFields: modFields,
//     modTypes: modTypes,
//     modValues: modValues,

//     presets: presets,
// })

export function reducer(state: RootState = getDefaultState(), action: any): RootState {
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