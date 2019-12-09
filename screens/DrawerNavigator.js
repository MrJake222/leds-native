import React from 'react'
import {
    StyleSheet,

    View,
    ScrollView,
    Text
} from 'react-native'

import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';

import MainStackNavigator from './main/MainStackNavigator';
import AdminNavigator from './admin/AdminNavigator';

export default class DrawerNavigator extends React.Component {
    render() {
        const AppContainer = createAppContainer(
            createDrawerNavigator({
                Main: MainStackNavigator,
                // Admin: AdminNavigator
            },
            
            {
                // drawerBackgroundColor: "#C8E6C9"
                contentComponent: (props) => (
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.text}>Leds</Text>
                        </View>

                        <View style={styles.scrollview}>
                            <ScrollView>
                                <DrawerItems {...props} />
                            </ScrollView>
                        </View>
                    </View>
                )
            })
        )

        return <AppContainer />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    header: {
        flex: 1,
        // paddingTop: Constants.statusBarHeight,

        backgroundColor: "#4CAF50",
        // justifyContent: "center"
    },

    text: {
        flex: 1,

        paddingLeft: 12,
        fontSize: 24,
        textAlignVertical: "center"
    },

    scrollview: {
        flex: 3
    }
})
