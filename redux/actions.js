// -----------------------
// Action types

export const actionTypes = {
    APP_INITIALIZE: "APP_INITIALIZE",
    // APP_LOAD: "APP_LOAD",
    APP_LOAD_STATE: "APP_LOAD_STATE",
    APP_LOAD_ALL_STATES: "APP_LOAD_ALL_STATES",
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
    // PRESET_DELETE: "PRESET_DELETE",
}

// -----------------------
// Action creators

/**
 * Generates action to change the inititalization state
 * 
 * @param {*} isAppInitialized 
 */
export function appInitialize(isAppInitialized) {
    return {
        type: actionTypes.APP_INITIALIZE,

        isAppInitialized: isAppInitialized
    }
}

/**
 * Called when all 4 module related fields are loaded
 * 
 * @param {*} isAppLoaded 
 */
// export function appLoad(isAppLoaded) {
//     return {
//         type: actionTypes.APP_LOAD,

//         isAppLoaded: isAppLoaded
//     }
// }

/**
 * Changes the load state
 * 
 * @param {*} loadState 
 * @param {*} state 
 */
export function appLoadState(loadState, state) {
    return {
        type: actionTypes.APP_LOAD_STATE,

        loadState: loadState,
        state: state
    }
}

/**
 * Changes all load states
 */
export function appLoadAllStates(state) {
    return {
        type: actionTypes.APP_LOAD_ALL_STATES,

        state: state
    }
}

export function appSetStatus(statusString) {
    return {
        type: actionTypes.APP_SET_STATUS,

        statusString: statusString
    }
}

/**
 * Generates action to configure an app. 
 * Sets server's address and port.
 * 
 * @param {*} serverAddress Server's address
 * @param {*} serverPort Server's port
 */
export function serverUpdateConfig(serverAddress, serverPort) {
    return {
        type: actionTypes.SERVER_UPDATE_CONFIG,

        serverAddress: serverAddress,
        serverPort: serverPort
    }
}

/**
 * Update connection status shown on the right
 * 
 * @param {*} connected True if connected to the server
 * @param {*} connectionStatus Status string
 */
export function serverUpdateConnectionStatus(connected, connectionStatus) {
    return {
        type: actionTypes.SERVER_UPDATE_CONNECTION_STATUS,

        connected: connected,
        connectionStatus: connectionStatus
    }
}

/**
 * Adds a module. Should be called last to avoid errors.
 * 
 * @param {*} moduleObj Module data in an object
 */
export function modAddModule(moduleObj) {
    return {
        type: actionTypes.MOD_ADD_MODULE,

        module: moduleObj
    }
}

/**
 * Delete module
 * 
 * @param {*} modId 
 */
export function modDeleteModule(modId) {
    return {
        type: actionTypes.MOD_DELETE_MODULE,

        modId: modId
    }
}

/**
 * Clear all modules
 * 
 * @param {*} modId 
 */
export function modClearModules() {
    return {
        type: actionTypes.MOD_CLEAR_MODULES,
    }
}

/**
 * Add a module's field(a single prop, like Hue for ex.)
 * 
 * @param {*} field Field's data
 */
export function modAddField(field) {
    return {
        type: actionTypes.MOD_ADD_FIELD,

        field: field
    }
}

/**
 * Add module type. Like LED-RGB for ex.
 * 
 * @param {*} modType 
 */
export function modAddType(modType) {
    return {
        type: actionTypes.MOD_ADD_TYPE,

        modType: modType
    }
}

/**
 * Adds values based on modId.
 * 
 * @param {*} modValues 
 */
export function modAddValues(modValues) {
    return {
        type: actionTypes.MOD_ADD_VALUES,

        modValues: modValues
    }
}

/**
 * Updates module data
 * 
 * @param {*} modName Module's new name 
 * @param {*} modAddress Module's new address
 */
export function modNameAddressUpdate(modId, modAddress, modName) {
    return {
        type: actionTypes.MOD_NAME_ADDRESS_UPDATE,

        modId: modId,
        modAddress: modAddress,
        modName: modName
    }
}

/**
 * Generates action to update single field of a Module.
 * 
 * @param {*} modId Module's ID
 * @param {*} fieldCodename Field's codename
 * @param {*} fieldValue Field's value to be applied
 */
export function modFieldUpdate(modId, fieldCodename, fieldValue) {
    return {
        type: actionTypes.MOD_FIELD_UPDATE,
        
        modId: modId,
        fieldCodename: fieldCodename,
        fieldValue: fieldValue
    }
}


// ------------------------------------------------------------
// Presets

export function presetAdd(preset) {
    return {
        type: actionTypes.PRESET_ADD,

        preset: preset
    }
}