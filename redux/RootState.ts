import Preset from "../types/Preset";
import Module from "../types/Module";
import ModField from "../types/ModField";
import ModType from "../types/ModType";

export default interface RootState {
    appStatus: {
        isAppInitialized: boolean
        isAppLoaded: boolean
        statusString: string

        loadStates: {[key: string]: boolean}
        selectedPreset: Preset | null
        selectedModules: string[]
    }

    serverData: {
        serverAddress: string,
        serverPort: number,

        connected: boolean,
        connectionStatus: string
    }

    modules: {[_id: string]: Module}
    modFields: {[_id: string]: ModField}
    modTypes: {[_id: string]: ModType}
    modValues: {[modId: string]: {[valueName: string]: any}}
    presets: {[_id: string]: Preset}
}

export function getDefaultState(): RootState {
    return {
        appStatus: {
            isAppInitialized: false,
            isAppLoaded: false,
    
            statusString: "",
    
            /**
             * Indicates if app loaded given prop
             */
            loadStates: {
                modules: false,
                modTypes: false,
                modFields: false,
                modValues: false,
                presets: false
            },
    
            /**
             * If user is applying preset, this holds the reference to it.
             * If not, must be null.
             */
            selectedPreset: null,
    
            /**
             * Array of selected modules for preset apply
             */
            selectedModules: []
        },
    
        serverData: {
            serverAddress: "",
            serverPort: -1,
    
            connected: false,
            connectionStatus: ""
        },
    
        modules: {},
        modFields: {},
        modTypes: {},
        modValues: {},
        presets: {},
    }
}