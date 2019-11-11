import React from 'react'
import {
    StyleSheet,

    View,
    Text,
    Slider
} from 'react-native'

export default class Field extends React.Component {
    render() {
        ({name, codename, type, maxValue} = this.props.field)

        // console.log("Field rerender", name)

        switch (type) {
            case "smooth":
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

        // return <View style={styles.container}>
        // </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        // display: "flex",
        // flexDirection: "row",

        marginVertical: 8
    },

    text: {
        // flex: 1,
        color: "#212121",

        paddingLeft: 6,
        fontSize: 14,
        // textAlign: "left"
    },

    slider: {
        // flex: 5
    }
})