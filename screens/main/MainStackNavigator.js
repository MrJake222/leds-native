import React from "react"
import { connect } from 'react-redux'
import { createAppContainer } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack";

import MainScreen from "./MainScreen"
import ModuleScreen from "./ModuleScreen";
import AddModule from "./AddModule";

export default class MainStackNavigator extends React.Component {
    render() {
        const headerStyles = {
            headerTintColor: "#FFFFFF",
                        
            headerStyle: {
                backgroundColor: "#4CAF50"
            }
        }

        const AppContainer = createAppContainer(
            createStackNavigator({
                MainScreen: {
                    screen: connect(MainScreen.mapStateToProps, MainScreen.mapDispatchToProps)(MainScreen),
                    navigationOptions: ({navigation}) => {
                        var title = "Modules"

                        if (navigation.state.params && navigation.state.params.headerTitle)
                            title = navigation.state.params.headerTitle

                        return {
                            title: title,
                            headerRight: MainScreen.addIcon(navigation),
                            ...headerStyles
                        }
                    }
                },

                Module: {
                    screen: ModuleScreen,
                    navigationOptions: ({navigation}) => ({
                        title: navigation.state.params.mod.modName,
                        headerRight: ModuleScreen.removeIcon(navigation),
                        ...headerStyles
                    })
                },

                AddModule: {
                    screen: AddModule,
                    navigationOptions: ({
                        title: "Add Module",
                        ...headerStyles
                    })
                }
            },
            
            {
                initialRouteName: "MainScreen",
            })
        )

        return <AppContainer />
    }
}