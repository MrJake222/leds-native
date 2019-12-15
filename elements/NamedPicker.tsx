import React from 'react'
import {
    StyleSheet,

    View,
    Text,
    Picker,
    FlatList
} from 'react-native'

interface Props {
    name: string
    value: string
    items: {name: string, value: string}[]

    onValueChange: (value: string) => void
}

/**
 * Props:
 *  name - Text to be displayed
 *  value - Initial value
 *  items - array of objects {name, value}
 *  onValueChange(value) - event when value has been changed
 */
export default class NamedPicker extends React.Component<Props> {
    render() {
        var items = this.props.items.map((item) => (
            <Picker.Item key={item.name} label={item.name} value={item.value} />
        ))

        return <View style={styles.inputContainer}>
            <Text style={styles.text}>{this.props.name}</Text>

            <View style={styles.input}>
                <Picker style={{height: 37}} selectedValue={this.props.value} onValueChange={(value) => this.props.onValueChange(value)}>
                    {/* <FlatList 
                        data={this.props.items}
                        keyExtractor={(item) => item.label}
                        renderItem={({item}) => <Picker.Item label={item.name} value={item.value} />}
                    /> */}

                    {items}
                </Picker>
            </View>
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
        // padding: 4,
        
        borderColor: '#212121',
        borderWidth: 1,
        borderRadius: 4
    }
})