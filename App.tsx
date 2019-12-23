import React from "react"
import { Provider, connect } from 'react-redux'
import { createAppContainer, createSwitchNavigator } from "react-navigation"

import store from "./redux/store"
import ConnectionWrapperScreen from "./screens/ConnectionWrapperScreen"
import AppConfigScreen from "./screens/AppConfigScreen"
// import MainScreen from "./screens/MainScreen"
import DrawerNavigator from "./screens/DrawerNavigator";
import { setRootNavigatorRef } from "./RootNavigatorRef";

export default class App extends React.Component {
    render() {
        const AppContainer = createAppContainer(
            createSwitchNavigator({
                ConnectionWrapperScreen: ConnectionWrapperScreen,
                AppConfigScreen: AppConfigScreen,
                DrawerNavigator: DrawerNavigator,
            },
            
            {
                initialRouteName: "ConnectionWrapperScreen"
            })
        )

        return <Provider store={store}>
            <AppContainer ref={setRootNavigatorRef}/>
        </Provider>
    }
}
