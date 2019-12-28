import {
    ToastAndroid
} from 'react-native'

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
export function hslToRgb(h: number, s: number, l: number) {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p: number, q: number, t: number){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function toHex(dec: number, zero: boolean=false) {
    var hexString = dec.toString(16).toUpperCase()

    if (hexString.length % 2 != 0) 
        hexString = "0" + dec

    if (zero)
        hexString = "0x" + dec

    return hexString
}

export function leadingZero(number: number, length: number=2) {
    var numberString = number.toString()

    while (numberString.length < length)
        numberString = "0" + number

    return numberString
}

/**
 * Makes first letter capital
 * 
 * @param {*} str 
 */
export function title(str: string) {
    if (str.length > 0)
        return str[0].toUpperCase() + str.slice(1)
        
    else
        return ""
}

/**
 * Checks if modName isn't empty
 * 
 * @param modName Module's name
 */
export function validateModuleName(modName: string): boolean {
    if (modName == "") {
        ToastAndroid.show("Module's name cannot be empty", ToastAndroid.SHORT);
        return false
    }

    return true
}

/** Check for duplicate address
 * @param modAddress Module's address
 * @param addressList Address list, for ex. from store
 * @param update Skip duplicate address check
 */
export function validateModuleAddress(modAddress: number, addressList: number[], update: boolean=false): boolean {
    if (Number.isNaN(modAddress) || modAddress < 1 || modAddress > 247) {
        ToastAndroid.show("Invalid address. Should be 1-247", ToastAndroid.SHORT);
        return false
    }

    if (addressList.includes(modAddress) && !update) {
        ToastAndroid.show("Duplicate address", ToastAndroid.SHORT);
        return false
    }

    return true
}

export function checkIPAddress(address: string): boolean {
    const regex = new RegExp("^([012]?[0-9]?[0-9]\.){3}[012]?[0-9]?[0-9]$")

    if (!regex.test(address)) {
        return false
    }

    else {
        var octets = address.split(".").map(oct => parseInt(oct))

        if (Math.max(...octets) > 255)
            return false
    }

    return true
}

export function checkPort(port: string): boolean {
    const portNum = parseInt(port)

    if (Number.isNaN(portNum) || portNum > 65535) {
        return false
    }
    
    return true
}