import React from 'react'
import {
    StyleSheet,

    View,
    Text
} from 'react-native'
import {hslToRgb, toHex} from '../helpers'

var toHexColor = (hsl) => {
    var rgb = hslToRgb(hsl.hue/360, hsl.saturation/100, hsl.lightness/100)

    var str = "#"
    rgb.forEach((e) => { str += toHex(e) })
    
    return str
}

export default class IndicatorColor extends React.Component {
    render() {
        var height = parseInt(this.props.height)
        var color = toHexColor(this.props.data)
        
        // flex: 1, 
        return <View style={{height: height, backgroundColor: toHexColor(this.props.data)}} />
    }
}

// const styles = StyleSheet.create({
//     indicator: {
//         borderTopLeftRadius: 8,
//         borderTopRightRadius: 8
//     },    
// })