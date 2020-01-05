import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import {
    ActivityIndicator,
    Text,
    View,
    StyleSheet,
    FlatList,
    Button,

    AsyncStorage,
    TouchableOpacity
} from 'react-native'
import { title } from '../helpers';
import RootState from '../redux/RootState';
import { NavigationScreenProp } from 'react-navigation';
import Icon from 'react-native-ionicons'
import { net } from '../network/Network';
// import store from '../redux/store';

// Sorted array
const loadStateArray = ["modules", "modTypes", "modFields", "modValues", "presets"]

const mapStateToProps = (state: RootState) => ({
    isAppInitialized: state.appStatus.isAppInitialized,
    isAppLoaded: state.appStatus.isAppLoaded,
    loadStates: state.appStatus.loadStates,

    connectionFailed: state.appStatus.connectionFailed
})

interface ConnectionWrapperScreenOwnProps {
    navigation: NavigationScreenProp<any>
}

const connector = connect(mapStateToProps)
type ConnectionWrapperScreenProps = ConnectedProps<typeof connector> & ConnectionWrapperScreenOwnProps

class ConnectionWrapperScreen extends React.Component<ConnectionWrapperScreenProps> {
    async componentDidMount() {
        const ignoreMount = this.props.navigation.getParam("ignoreMount", false)
        const isAppInitialized = await AsyncStorage.getItem("isAppInitialized") == "true"

        console.log("isAppInitialized", isAppInitialized)
        console.log("ignoreMount", ignoreMount)

        if (!ignoreMount) {
            if (this.props.isAppLoaded)
                this.props.navigation.navigate("DrawerNavigator")

            else if (!isAppInitialized)
                this.props.navigation.navigate("AppConfigScreen")
        }
    }

    componentDidUpdate() {
        if (this.props.isAppLoaded) {
            setTimeout(() => this.props.navigation.navigate("DrawerNavigator"), 0) // Allows render to finish
        }
    }

    render() {
        const genStatus = (key: string) => {
            var loaded = this.props.loadStates[key]
            var color = loaded ? "#388E3C" : "#FF5252"

            return <Text style={[styles.text, { color: color }]}>{title(key)}</Text>
        }

        const errorBackground = this.props.connectionFailed ? "#FF5252" : "rgba(0,0,0,0)"
        const errorText = this.props.connectionFailed ? "white" : "rgba(0,0,0,0)"
        const iconColor = this.props.connectionFailed ? "#404040" : "rgba(0,0,0,0)"

        return <View style={styles.container}>
            <ActivityIndicator />
            {/* <Button title="Clear modules" onPress={() => {
                AsyncStorage.removeItem("modules")
                AsyncStorage.removeItem("modulesLastModified")
            }} /> */}

            {/* <Button title="Clear asyncstorage" onPress={() => {
                AsyncStorage.clear()
            }} /> */}

            {/* <Button title="Go" onPress={() => {
                this.props.navigation.navigate("DrawerNavigator")
            }} /> */}

            {this.props.isAppInitialized ? <View style={styles.status}>
                <FlatList
                    data={loadStateArray}
                    extraData={this.props.loadStates}

                    keyExtractor={item => item}
                    renderItem={({ item }) => genStatus(item)}
                />

                <Text style={[styles.failed, { backgroundColor: errorBackground, color: errorText }]}>Connection failed</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                    net.reset()
                    this.props.navigation.navigate("AppConfigScreen")
                }}>

                    <Icon name="settings" size={42} style={[styles.icon, { color: iconColor }]} />
                </TouchableOpacity>
            </View> : null}
        </View>
    }
}

export default connector(ConnectionWrapperScreen)

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

    failed: {
        marginTop: 8,

        color: "white",
        fontSize: 18,
        letterSpacing: 2,

        alignSelf: "center",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },

    icon: {
        marginTop: 16,
        textAlign: "center"
    }
})