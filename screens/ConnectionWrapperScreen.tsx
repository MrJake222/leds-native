import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

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
import RootState from '../redux/RootState';
import { NavigationScreenProp } from 'react-navigation';
// import store from '../redux/store';

// Sorted array
const loadStateArray = ["modules", "modTypes", "modFields", "modValues", "presets"]

const mapStateToProps = (state: RootState) => ({
    isAppInitialized: state.appStatus.isAppInitialized,
    isAppLoaded: state.appStatus.isAppLoaded,
    loadStates: state.appStatus.loadStates,
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
        var genStatus = (key: string) => {
            var loaded = this.props.loadStates[key]
            var color = loaded ? "#388E3C" : "#FF5252"

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

            <Button title="Go" onPress={() => {
                this.props.navigation.navigate("DrawerNavigator")
            }} />

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
})