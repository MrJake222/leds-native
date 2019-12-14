import { APP_INITIALIZE, APP_LOAD_STATE, APP_LOAD_ALL_STATES, APP_CLEAR_DATA, APP_SELECT_PRESET, APP_SELECT_MODULE, APP_DESELECT_MODULE, APP_DESELECT_ALL_MODULES, APP_SET_STATUS, SERVER_UPDATE_CONFIG, SERVER_UPDATE_CONNECTION_STATUS, MOD_ADD_MODULE, MOD_DELETE_MODULE, MOD_CLEAR_MODULES, MOD_ADD_FIELD, MOD_ADD_TYPE, MOD_ADD_VALUES, MOD_NAME_ADDRESS_UPDATE, MOD_FIELD_UPDATE, PRESET_DELETE, PRESET_ADD } from "./actionTypes";
import Preset from "../types/Preset";
import Module from "../types/Module";
import ModField from "../types/ModField";
import ModType from "../types/ModType";

// -----------------------
// Action types



// -----------------------
// Action creators

/**
 * Generates action to change the inititalization state
 * 
 * @param {*} isAppInitialized 
 */
export const appInitialize = (isAppInitialized: boolean) => ({
    type: APP_INITIALIZE,

    isAppInitialized: isAppInitialized
})

/**
 * Changes the load state
 * 
 * @param {*} loadState 
 * @param {*} state 
 */
export const appLoadState = (loadState: string, state: boolean) => ({
    type: APP_LOAD_STATE,

    loadState: loadState,
    state: state
})

/**
 * Changes all load states
 */
export const appLoadAllStates = (state: boolean) => ({
    type: APP_LOAD_ALL_STATES,

    state: state
})

/**
 * Clears all fields
 */
export const appClearData = () => ({
    type: APP_CLEAR_DATA,
})

export const appSelectPreset = (preset: Preset | null) => ({
    type: APP_SELECT_PRESET,

    preset: preset
})

export const selectModule = (modId: string) => ({
    type: APP_SELECT_MODULE,
    
    modId: modId
})

export const deselectModule = (modId: string) => ({
    type: APP_DESELECT_MODULE,

    modId: modId
})

export const deselectAllModules = () => ({
    type: APP_DESELECT_ALL_MODULES
})

export const appSetStatus = (statusString: string) => ({
    type: APP_SET_STATUS,

    statusString: statusString
})

/**
 * Generates action to configure an app. 
 * Sets server's address and port.
 * 
 * @param {*} serverAddress Server's address
 * @param {*} serverPort Server's port
 */
export const serverUpdateConfig = (serverAddress: string, serverPort: number) => ({
    type: SERVER_UPDATE_CONFIG,

    serverAddress: serverAddress,
    serverPort: serverPort
})

/**
 * Update connection status shown on the right
 * 
 * @param {*} connected True if connected to the server
 * @param {*} connectionStatus Status string
 */
export const serverUpdateConnectionStatus = (connected: boolean, connectionStatus: string) => ({
    type: SERVER_UPDATE_CONNECTION_STATUS,

    connected: connected,
    connectionStatus: connectionStatus
})

/**
 * Adds a module. Should be called last to avoid errors.
 * 
 * @param {*} moduleObj Module data in an object
 */
export const modAddModule = (moduleObj: Module) => ({
    type: MOD_ADD_MODULE,

    moduleObj: moduleObj
})

/**
 * Delete module
 * 
 * @param {*} modId 
 */
export const modDeleteModule = (modId: string) => ({
    type: MOD_DELETE_MODULE,

    modId: modId
})

/**
 * Clear all modules
 * 
 * @param {*} modId 
 */
export const modClearModules = () => ({
    type: MOD_CLEAR_MODULES,
})

/**
 * Add a module's field = (a single prop, like Hue for ex.)
 * 
 * @param {*} field Field's data
 */
export const modAddField = (field: ModField) => ({
    type: MOD_ADD_FIELD,

    field: field
})

/**
 * Add module type. Like LED-RGB for ex.
 * 
 * @param {*} modType 
 */
export const modAddType = (modType: ModType) => ({
    type: MOD_ADD_TYPE,

    modType: modType
})

/**
 * Adds values based on modId.
 * 
 * @param {*} modValues 
 */
export const modAddValues = (modValues: {[key: string]: any}) => ({
    type: MOD_ADD_VALUES,

    modValues: modValues
})

/**
 * Updates module data
 * 
 * @param {*} modName Module's new name 
 * @param {*} modAddress Module's new address
 */
export const modNameAddressUpdate = (modId: string, modAddress: number, modName: string) => ({
    type: MOD_NAME_ADDRESS_UPDATE,

    modId: modId,
    modAddress: modAddress,
    modName: modName
})

/**
 * Generates action to update single field of a Module.
 * 
 * @param {*} modId Module's ID
 * @param {*} fieldCodename Field's codename
 * @param {*} fieldValue Field's value to be applied
 */
export const modFieldUpdate = (modId: string, fieldCodename: string, fieldValue: any) => ({
    type: MOD_FIELD_UPDATE,

    modId: modId,
    fieldCodename: fieldCodename,
    fieldValue: fieldValue
})


// ------------------------------------------------------------
// Presets

export const presetAdd = (preset: Preset) => ({
    type: PRESET_ADD,

    preset: preset
})

export const presetDelete = (presetId: string) => ({
    type: PRESET_DELETE,

    presetId: presetId
})