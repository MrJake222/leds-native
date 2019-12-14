import Preset from "../types/Preset";
import Module from "../types/Module";
import ModField from "../types/ModField";
import ModType from "../types/ModType";

export const APP_INITIALIZE = "APP_INITIALIZE"
export const APP_LOAD_STATE = "APP_LOAD_STATE"
export const APP_LOAD_ALL_STATES = "APP_LOAD_ALL_STATES"
export const APP_CLEAR_DATA = "APP_CLEAR_DATA"
export const APP_SELECT_PRESET = "APP_SELECT_PRESET"
export const APP_SELECT_MODULE = "APP_SELECT_MODULE"
export const APP_DESELECT_MODULE = "APP_DESELECT_MODULE"
export const APP_DESELECT_ALL_MODULES = "APP_DESELECT_ALL_MODULES"
export const APP_SET_STATUS = "APP_SET_STATUS"

export const SERVER_UPDATE_CONFIG = "SERVER_UPDATE_CONFIG"
export const SERVER_UPDATE_CONNECTION_STATUS = "SERVER_UPDATE_CONNECTION_STATUS"

export const MOD_ADD_MODULE = "MOD_ADD_MODULE"
export const MOD_DELETE_MODULE = "MOD_DELETE_MODULE"
export const MOD_CLEAR_MODULES = "MOD_CLEAR_MODULES"
export const MOD_ADD_FIELD = "MOD_ADD_FIELD"
export const MOD_ADD_TYPE = "MOD_ADD_TYPE"
export const MOD_ADD_VALUES = "MOD_ADD_VALUES"

export const MOD_FIELD_UPDATE = "MOD_FIELD_UPDATE"
export const MOD_NAME_ADDRESS_UPDATE = "MOD_NAME_ADDRESS_UPDATE"

export const PRESET_ADD = "PRESET_ADD"
export const PRESET_DELETE = "PRESET_DELETE"


interface AppClearData {
    type: "APP_CLEAR_DATA"
}

// -------------------------------------------------------------------------------------------    
// -------------------------------------------------------------------------------------------    
interface AppInitialize {
    type: "APP_INITIALIZE"

    isAppInitialized: boolean
}

interface AppLoadState {
    type: "APP_LOAD_STATE"

    loadState: string
    state: boolean
}

interface AppLoadAllStates {
    type: "APP_LOAD_ALL_STATES"

    state: boolean
}

interface AppSelectPreset {
    type: "APP_SELECT_PRESET"

    preset: Preset
}

interface AppSelectModule {
    type: "APP_SELECT_MODULE"

    modId: string
}

interface AppDeselectModule {
    type: "APP_DESELECT_MODULE"

    modId: string
}

interface AppDeselectAllModules {
    type: "APP_DESELECT_ALL_MODULES"
}

interface AppSetStatus {
    type: "APP_SET_STATUS"

    statusString: string
}

export type AppAction =
    AppInitialize | AppLoadState | AppLoadAllStates |
    AppSelectPreset | AppSelectModule | AppDeselectModule |
    AppDeselectAllModules | AppSetStatus


// -------------------------------------------------------------------------------------------    
// -------------------------------------------------------------------------------------------    
interface ServerUpdateConfig {
    type: "SERVER_UPDATE_CONFIG"

    serverAddress: string
    serverPort: number
}

interface ServerUpdateConnectionStatus {
    type: "SERVER_UPDATE_CONNECTION_STATUS"

    connected: boolean
    connectionStatus: string
}

export type ServerAction = ServerUpdateConfig | ServerUpdateConnectionStatus


// -------------------------------------------------------------------------------------------    
// -------------------------------------------------------------------------------------------  
interface ModAddModule {
    type: "MOD_ADD_MODULE"

    moduleObj: Module
}

interface ModDeleteModule {
    type: "MOD_DELETE_MODULE"

    modId: string
}

interface ModClearModules {
    type: "MOD_CLEAR_MODULES"
}

interface ModNameAddressUpdate {
    type: "MOD_NAME_ADDRESS_UPDATE"

    modId: string
    modAddress: number
    modName: string
}

export type ModuleAction = 
    ModAddModule | ModDeleteModule | ModClearModules |
    ModNameAddressUpdate | AppClearData


// -------------------------------------------------------------------------------------------    
// -------------------------------------------------------------------------------------------  
interface ModAddField {
    type: "MOD_ADD_FIELD"

    field: ModField
}

export type FieldAction = ModAddField | AppClearData


// -------------------------------------------------------------------------------------------    
// -------------------------------------------------------------------------------------------  
interface ModAddType {
    type: "MOD_ADD_TYPE"

    modType: ModType
}

export type TypeAction = ModAddType | AppClearData


// -------------------------------------------------------------------------------------------    
// -------------------------------------------------------------------------------------------  
interface ModAddValues {
    type: "MOD_ADD_VALUES"

    modValues: {[key: string]: any}
}

interface ModFieldUpdate {
    type: "MOD_FIELD_UPDATE"

    modId: string
    fieldCodename: string
    fieldValue: any
}

export type ValuesAction = ModAddValues | ModFieldUpdate | AppClearData


// -------------------------------------------------------------------------------------------    
// -------------------------------------------------------------------------------------------  

interface PresetAdd {
    type: "PRESET_ADD"

    preset: Preset
}

interface PresetDelete {
    type: "PRESET_DELETE"

    presetId: string
}

export type PresetAction = PresetAdd | PresetDelete | AppClearData


// -------------------------------------------------------------------------------------------    
// -------------------------------------------------------------------------------------------  

// export type Action = AppAction | ServerAction | ModuleAction | FieldAction | TypeAction | ValuesAction | PresetAction