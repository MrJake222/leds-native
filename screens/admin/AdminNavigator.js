import React from 'react'
import {
    StyleSheet,

    View,
    Text
} from 'react-native'
import AdminScreen from './AdminScreen';

import { createAppContainer } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack";

export default class AdminNavigator extends React.Component {
    render() {
        const headerStyles = {
            headerTintColor: "#FFFFFF",
                        
            headerStyle: {
                backgroundColor: "#4CAF50"
            }
        }

        const AppContainer = createAppContainer(
            createStackNavigator({
                AdminScreen: {
                    screen: AdminScreen,
                    navigationOptions: {
                        title: "Admin",
                        ...headerStyles
                    }
                }
            })
        )

        return <AppContainer />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    
})