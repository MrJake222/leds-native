import React from 'react'
import {
    StyleSheet,

    View,
    Text,
    TextInput,
    KeyboardTypeOptions
} from 'react-native'

interface Props {
    name: string
    value: string
    keyboardType?: KeyboardTypeOptions

    onChangeText?: (text: string) => void
    onFocus?: () => void
    onBlur?: () => void
}

/**
 * Props:
 *  name - Text to be displayed
 *  value - Initial value
 *  keyboardType - keyboard type (numeric)
 *  onChangeText(value) - event when value has been changed
 */
export default class NamedInput extends React.Component<Props> {
    render() {
        return <View style={styles.inputContainer}>
            <Text style={styles.text}>{this.props.name}</Text>
            <TextInput
                style={styles.input}
                keyboardType={this.props.keyboardType}
                value={this.props.value}
                onChangeText={this.props.onChangeText}
                onFocus={this.props.onFocus}
                onBlur={this.props.onBlur} />
        </View>
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        margin: 8
    },

    text: {
        color: "#212121"
    },

    input: {
        marginTop: 2,
        padding: 4,
        
        borderColor: '#212121',
        borderWidth: 1,
        borderRadius: 4
    }
})