import React from 'react'
import {
    StyleSheet,

    View,
    Text
} from 'react-native'
import {hslToRgb, toHex} from '../helpers'
import { IndicatorInterface } from './IndicatorHelper';
import HslColors from '../types/HslColors';

function toHexColor({hue, saturation, lightness}: HslColors): string {
    var rgb = hslToRgb(hue/360, saturation/100, lightness/100)

    var str = "#"
    rgb.forEach((e) => { str += toHex(e) })
    
    return str
}

interface IndicatorColorProps {
    height: number
    data: HslColors
}

export class IndicatorColorComponent extends React.Component<IndicatorColorProps> {
    render(): Element {
        var height = this.props.height

        return <View style={{height: height, backgroundColor: toHexColor(this.props.data)}} />
    }
}

export default class IndicatorColor implements IndicatorInterface {
    create(data: any, height: number=8): React.ReactElement {
        return <IndicatorColorComponent height={height} data={data} />
    }
}