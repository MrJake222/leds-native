import React from 'react'
import { connect } from 'react-redux'

import {
    ActivityIndicator,
    Text,
    View,
    StyleSheet,
    FlatList,
    Button,

    AsyncStorage
} from 'react-native'
import { title } from '../helpers';
// import store from '../redux/store';

// Sorted array
const loadStateArray = ["modules", "modTypes", "modFields", "modValues", "presets"]

const mapStateToProps = (state) => ({
    isAppInitialized: state.appStatus.isAppInitialized,
    isAppLoaded: state.appStatus.isAppLoaded,
    loadStates: state.appStatus.loadStates,
})

class ConnectionWrapper extends React.Component {
    async componentDidMount() {
        const ignoreMount = this.props.navigation.getParam("ignoreMount", false)
        const isAppInitialized = await AsyncStorage.getItem("isAppInitialized") == "true"

        if (!isAppInitialized && !ignoreMount) {
            this.props.navigation.navigate("AppConfig")
        }
    }

    componentDidUpdate() {
        if (this.props.isAppLoaded) {
            setTimeout(() => this.props.navigation.navigate("DrawerNavigator"), 0) // Allows render to finish
        }
    }

    render() {
        var genStatus = (key) => {
            var loaded = this.props.loadStates[key]
            var color = loaded ? "#388E3C" : "#FF5252"
            // console.log("loaded", key, loaded)

            return <Text style={[styles.text, { color: color }]}>{title(key)}</Text>
        }

        return <View style={styles.container}>
            <ActivityIndicator />
            {/* <Button title="Clear modules" onPress={() => {
                AsyncStorage.removeItem("modules")
                AsyncStorage.removeItem("modulesLastModified")
            }} />

            <Button title="Clear asyncstorage" onPress={() => {
                AsyncStorage.clear()
            }} /> */}

            {this.props.isAppInitialized ? <View style={styles.status}>
                <FlatList
                    data={loadStateArray}
                    extraData={this.props.loadStates}

                    keyExtractor={item => item}
                    renderItem={({ item }) => genStatus(item)}
                />
            </View> : null}
        </View>
    }
}

export default connect(mapStateToProps)(ConnectionWrapper)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },

    status: {
        marginTop: 28,
    },

    text: {
        alignSelf: "center",

        letterSpacing: 2,
        marginBottom: 8
    },
})