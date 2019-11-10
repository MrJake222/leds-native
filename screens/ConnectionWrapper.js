import React from 'react'

import {
    ActivityIndicator,
    StatusBar,
    View,

    AsyncStorage
} from 'react-native'
import store from '../redux/store';

export default class ConnectionWrapper extends React.Component {
    static mapStateToProps = (state) => {
        return {
            isAppInitialized: state.appStatus.isAppInitialized,
            isAppLoaded: state.appStatus.isAppLoaded
        }
    }

    async componentDidMount() {
        const ignoreMount = this.props.navigation.getParam("ignoreMount", false)        
        const isAppInitialized = await AsyncStorage.getItem("isAppInitialized") == "true"

        if (!isAppInitialized && !ignoreMount) {
            this.props.navigation.navigate("AppConfig")
        }
    }

    componentDidUpdate() {
        // console.log("ConnectionWrapper didUpdate, "+this.props.isAppLoaded); 

        if (this.props.isAppLoaded) {
            this.props.navigation.navigate("DrawerNavigator")
        }
    }

    render() {
        return <View style={{flex: 1, justifyContent: "center"}}>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
        </View>
    }
}