import React from 'react'
import {
    StyleSheet,

    View,
    Text
} from 'react-native'

import ModFieldManager from "./field/ModFieldManager"

export default class AdminScreen extends React.Component {
    render() {
        return <View style={styles.container}>
            <ModFieldManager />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    
})