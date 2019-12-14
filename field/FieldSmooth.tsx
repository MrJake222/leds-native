import React from 'react'
import {
    StyleSheet,

    View,
    Text
} from 'react-native'

import ModField from '../types/ModField';
import { FieldInterface } from './FieldHelper';
import Slider from "@react-native-community/slider"

interface FieldSmoothProps {
    field: ModField,
    value: number,

    onValueChange: (value: any) => void
}

class FieldSmoothComponent extends React.Component<FieldSmoothProps> {
    render() {
        const {name, codename, maxValue} = this.props.field

        // console.log("Field rerender", name)

        return <View style={styles.container}>
            <Text style={styles.text}>{name}</Text>
            <Slider
                style={styles.slider}
                thumbTintColor="#8BC34A"
                minimumTrackTintColor="#4CAF50"

                step={1}
                value={this.props.value}
                minimumValue={0}
                maximumValue={maxValue}
                onValueChange={this.props.onValueChange} />
        </View>
    }
}

export default class FieldSmooth implements FieldInterface {
    create(field: ModField, value: any, onValueChange: (value: any) => void): React.ReactElement {
        return <FieldSmoothComponent
            field={field}
            value={value}

            onValueChange={onValueChange}
        />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        marginVertical: 8
    },

    text: {
        color: "#212121",

        paddingLeft: 6,
        fontSize: 14,
    },

    slider: {
        // flex: 5
    }
})