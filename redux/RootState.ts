import Preset from "../types/Preset";
import Module from "../types/Module";
import ModField from "../types/ModField";
import ModType from "../types/ModType";
import { number } from "prop-types";

export default interface RootState {
    appStatus: {
        isAppInitialized: boolean
        isAppLoaded: boolean

        connectionFailed: boolean
        connectionRetryTimeout: number

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
            // Was the app given address and port information?
            isAppInitialized: false,

            // Had the modules data been loaded?
            isAppLoaded: false,

            // If app doesn't get to connect to the socket in the given amount of time
            // this is set to true
            connectionFailed: false,

            // Seconds left to another socket connection check
            connectionRetryTimeout: 5,
        
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

// export const getOffPreset: (() => Preset) = () => ({
//     _id: "off",
//     presetName: "Off",
//     modType: "LED-RGB",
//     values: {
//         hue: 0,
//         saturation: 0,
//         lightness: 0
//     }
// })