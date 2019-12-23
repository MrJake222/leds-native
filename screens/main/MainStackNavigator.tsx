import React from "react"
import { connect } from 'react-redux'
import { createAppContainer } from "react-navigation"
import { createStackNavigator, NavigationStackScreenProps } from "react-navigation-stack";

import MainScreen, { MainScreenNavigationParams } from "./MainScreen"
import ModuleScreen, { ModuleScreenNavigationParams } from "./ModuleScreen";
import AddModule from "./AddModuleScreen";

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
                    screen: MainScreen,
                    navigationOptions: ({navigation}: NavigationStackScreenProps<MainScreenNavigationParams>) => {
                        var title = "Modules"

                        if (navigation.getParam("headerTitle"))
                            title = navigation.getParam("headerTitle")!

                        return {
                            title: title,
                            headerRight: MainScreen.addIcon(navigation),
                            ...headerStyles
                        }
                    }
                },

                Module: {
                    screen: ModuleScreen,
                    navigationOptions: ({navigation}: NavigationStackScreenProps<ModuleScreenNavigationParams>) => ({
                        title: navigation.getParam("mod").modName,
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