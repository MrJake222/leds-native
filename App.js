import React from "react"
import { Provider, connect } from 'react-redux'
import { createAppContainer, createSwitchNavigator } from "react-navigation"

import store from "./redux/store"
import ConnectionWrapper from "./screens/ConnectionWrapper"
import AppConfig from "./screens/AppConfig"
// import MainScreen from "./screens/MainScreen"
import DrawerNavigator from "./screens/DrawerNavigator";
import { setRootNavigatorRef } from "./RootNavigatorRef";

export default class App extends React.Component {
    render() {
        const AppContainer = createAppContainer(
            createSwitchNavigator({
                ConnectionWrapper: {
                    screen: ConnectionWrapper
                },

                AppConfig: {
                    screen: connect(AppConfig.mapStateToProps, AppConfig.mapDispatchToProps)(AppConfig)
                },

                DrawerNavigator: {
                    screen: DrawerNavigator
                }
            },
            
            {
                initialRouteName: "ConnectionWrapper"
            })
        )

        return <Provider store={store}>
            <AppContainer ref={setRootNavigatorRef}/>
        </Provider>
    }
}
