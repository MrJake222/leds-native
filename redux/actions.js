// -----------------------
// Action types

export const actionTypes = {
    APP_INITIALIZE: "APP_INITIALIZE",
    // APP_LOAD: "APP_LOAD",
    APP_LOAD_STATE: "APP_LOAD_STATE",
    APP_LOAD_ALL_STATES: "APP_LOAD_ALL_STATES",
    APP_CLEAR_DATA: "APP_CLEAR_DATA",
    APP_SELECT_PRESET: "APP_SELECT_PRESET",
    APP_SELECT_MODULE: "APP_SELECT_MODULE",
    APP_DESELECT_MODULE: "APP_DESELECT_MODULE",
    APP_DESELECT_ALL_MODULES: "APP_DESELECT_ALL_MODULES",

    APP_SET_STATUS: "APP_SET_STATUS",

    SERVER_UPDATE_CONFIG: "SERVER_UPDATE_CONFIG",
    SERVER_UPDATE_CONNECTION_STATUS: "SERVER_UPDATE_CONNECTION_STATUS",

    MOD_ADD_MODULE: "MOD_ADD_MODULE",
    MOD_DELETE_MODULE: "MOD_DELETE_MODULE",
    MOD_CLEAR_MODULES: "MOD_CLEAR_MODULES",
    MOD_ADD_FIELD: "MOD_ADD_FIELD",
    MOD_ADD_TYPE: "MOD_ADD_TYPE",
    MOD_ADD_VALUES: "MOD_ADD_VALUES",

    MOD_FIELD_UPDATE: "MOD_FIELD_UPDATE",
    MOD_NAME_ADDRESS_UPDATE: "MOD_NAME_ADDRESS_UPDATE",

    PRESET_ADD: "PRESET_ADD",
    PRESET_DELETE: "PRESET_DELETE",
}

// -----------------------
// Action creators

/**
 * Generates action to change the inititalization state
 * 
 * @param {*} isAppInitialized 
 */
export const appInitialize = (isAppInitialized) => ({

    type: actionTypes.APP_INITIALIZE,

    isAppInitialized: isAppInitialized

})

/**
 * Changes the load state
 * 
 * @param {*} loadState 
 * @param {*} state 
 */
export const appLoadState = (loadState, state) => ({
    type: actionTypes.APP_LOAD_STATE,

    loadState: loadState,
    state: state
})

/**
 * Changes all load states
 */
export const appLoadAllStates = (state) => ({
    type: actionTypes.APP_LOAD_ALL_STATES,

    state: state
})

/**
 * Clears all fields
 */
export const appClearData = () => ({
    type: actionTypes.APP_CLEAR_DATA,
})

export const appSelectPreset = (preset) => ({
    type: actionTypes.APP_SELECT_PRESET,

    preset: preset
})

export const selectModule = (modId) => ({
    type: actionTypes.APP_SELECT_MODULE,
    
    modId: modId
})

export const deselectModule = (modId) => ({
    type: actionTypes.APP_DESELECT_MODULE,

    modId: modId
})

export const deselectAllModules = () => ({
    type: actionTypes.APP_DESELECT_ALL_MODULES
})

export const appSetStatus = (statusString) => ({
    type: actionTypes.APP_SET_STATUS,

    statusString: statusString
})

/**
 * Generates action to configure an app. 
 * Sets server's address and port.
 * 
 * @param {*} serverAddress Server's address
 * @param {*} serverPort Server's port
 */
export const serverUpdateConfig = (serverAddress, serverPort) => ({
    type: actionTypes.SERVER_UPDATE_CONFIG,

    serverAddress: serverAddress,
    serverPort: serverPort
})

/**
 * Update connection status shown on the right
 * 
 * @param {*} connected True if connected to the server
 * @param {*} connectionStatus Status string
 */
export const serverUpdateConnectionStatus = (connected, connectionStatus) => ({
    type: actionTypes.SERVER_UPDATE_CONNECTION_STATUS,

    connected: connected,
    connectionStatus: connectionStatus

})

/**
 * Adds a module. Should be called last to avoid errors.
 * 
 * @param {*} moduleObj Module data in an object
 */
export const modAddModule = (moduleObj) => ({
    type: actionTypes.MOD_ADD_MODULE,

    module: moduleObj
})

/**
 * Delete module
 * 
 * @param {*} modId 
 */
export const modDeleteModule = (modId) => ({
    type: actionTypes.MOD_DELETE_MODULE,

    modId: modId
})

/**
 * Clear all modules
 * 
 * @param {*} modId 
 */
export const modClearModules = () => ({
    type: actionTypes.MOD_CLEAR_MODULES,
})

/**
 * Add a module's field = (a single prop, like Hue for ex.)
 * 
 * @param {*} field Field's data
 */
export const modAddField = (field) => ({
    type: actionTypes.MOD_ADD_FIELD,

    field: field
})

/**
 * Add module type. Like LED-RGB for ex.
 * 
 * @param {*} modType 
 */
export const modAddType = (modType) => ({
    type: actionTypes.MOD_ADD_TYPE,

    modType: modType
})

/**
 * Adds values based on modId.
 * 
 * @param {*} modValues 
 */
export const modAddValues = (modValues) => ({
    type: actionTypes.MOD_ADD_VALUES,

    modValues: modValues
})

/**
 * Updates module data
 * 
 * @param {*} modName Module's new name 
 * @param {*} modAddress Module's new address
 */
export const modNameAddressUpdate = (modId, modAddress, modName) => ({
    type: actionTypes.MOD_NAME_ADDRESS_UPDATE,

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
export const modFieldUpdate = (modId, fieldCodename, fieldValue) => ({
    type: actionTypes.MOD_FIELD_UPDATE,

    modId: modId,
    fieldCodename: fieldCodename,
    fieldValue: fieldValue
})


// ------------------------------------------------------------
// Presets

export const presetAdd = (preset) => ({
    type: actionTypes.PRESET_ADD,

    preset: preset
})

export const presetDelete = (id) => ({
    type: actionTypes.PRESET_DELETE,

    id: id
})