import React from 'react'
import {
    StyleSheet,

    View,
    Text,
    Button
} from 'react-native'

export default class ModFieldEntry extends React.Component {
    render() {
        ({modId, modAddress, modName, modType} = this.props.field)

        return <View style={styles.container}>
            <Text style={styles.name}>{modName}</Text>
            <Text style={styles.codename}>{modId}</Text>
            <Text style={styles.type}>{modAddress}</Text>
            {/* <Button style={styles.button} title="Edit" color="#4CAF50"/> */}
            {/* <Button style={styles.button} title="Delete" color="#4CAF50"/> */}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexShrink: 1,
        // flexDirection: "row",

        // borderWidth: 1,
        // borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 12
    },

    name: {
        // flex: 1,
        // flexShrink: 1,

        fontWeight: "bold",
        // textAlign: "right",
        textAlignVertical: "center"
    },

    codename: {
        // flex: 1,
        paddingLeft: 12,

        fontStyle: "italic",
        textAlignVertical: "center"
    },

    type: {
        // flex: 1,
        paddingLeft: 12,

        textAlignVertical: "center"   
    },

    button: {
        flex: 1,
        // marginHorizontal: 12
    }
})