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

export function hslToRgb(h, s, l) {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
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

export function toHex(dec, zero=false) {
    dec = dec.toString(16).toUpperCase()

    if (dec.length % 2 != 0) 
        dec = "0" + dec

    if (zero)
        dec = "0x" + dec

    return dec
}

export function leadingZero(number, length=2) {
    number = number.toString()

    while (number.length < length)
        number = "0" + number

    return number
}

/**
 * Makes first letter capital
 * 
 * @param {*} str 
 */
export function title(str) {
    if (str.length > 0)
        return str[0].toUpperCase() + str.slice(1)
        
    else
        return ""
}

/**
 * Checks if modName isn't empty and for invalid or
 * Duplicate addresses
 * 
 * @param {*} modName Module's name
 * @param {*} modAddress Module's address
 * @param {*} addressList Address list, for ex. from store
 * @param {boolean} update Skip duplicate address check
 */
export function validateModuleData(modName, modAddress, addressList, update = false) {
    if (modName == "") {
        ToastAndroid.show("Module's name cannot be empty", ToastAndroid.SHORT);
        return false
    }
    
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