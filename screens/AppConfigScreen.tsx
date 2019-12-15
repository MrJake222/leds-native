import React from 'react'
import {
    StyleSheet,

    View,
    Text,
    TextInput,
    Button,
    ToastAndroid
} from 'react-native'
import { serverUpdateConfig, appInitialize } from '../redux/actions';
import NamedInput from '../elements/NamedInput';
import RootState from '../redux/RootState';
import { connect, ConnectedProps } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import { checkIPAddress, checkPort } from '../helpers';

const mapDispatchToProps = {
    serverUpdateConfig: (address: string, port: number) => serverUpdateConfig(address, port),
    appInitialize: () => appInitialize(true)
}

interface AppConfigScreenOwnProps {
    navigation: NavigationScreenProp<any>
}

interface AppConfigScreenState {
    address: string
    port: string
}

const connector = connect(null, mapDispatchToProps)
type AppConfigScreenProps = ConnectedProps<typeof connector> & AppConfigScreenOwnProps

class AppConfigScreen extends React.Component<AppConfigScreenProps, AppConfigScreenState> {
    constructor(props: AppConfigScreenProps) {
        super(props)

        this.state = {
            address: "",
            port: ""
        }

        this.updateValues = this.updateValues.bind(this)
    }    

    updateValues(idx: string, value: string) {
        this.setState({
            ...this.state,
            [idx]: value
        })
    }

    render() {
        return <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Configure the Leds</Text>
            </View>

            <View style={styles.contents}>
                <NamedInput name="Address" keyboardType="numeric" value={this.state.address} onChangeText={(value) => this.updateValues("address", value)}/>
                <NamedInput name="Port" keyboardType="numeric" value={this.state.port} onChangeText={(value) => this.updateValues("port", value)}/>
                                
                <View style={{alignItems: "flex-end", marginRight: 8, marginTop: 4}}>
                    <View style={{width: "50%"}}>
                        <Button title="Accept" color="#4CAF50" onPress={() => {
                            if (!checkIPAddress(this.state.address)) {
                                ToastAndroid.show("Invaild IP address", ToastAndroid.SHORT)
                                return
                            }

                            if (!checkPort(this.state.port)) {
                                ToastAndroid.show("Invaild port", ToastAndroid.SHORT)
                                return
                            }

                            this.props.serverUpdateConfig(this.state.address, parseInt(this.state.port))
                            this.props.appInitialize()
                            this.props.navigation.navigate("ConnectionWrapper", {ignoreMount: true})
                        }}/>   
                    </View>
                </View>
            </View>
        </View>
    }
}

export default connector(AppConfigScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flex: 1,
        backgroundColor: "#4CAF50",
        justifyContent: "center"
    },

    headerText: {
        textAlign: "center",
        fontSize: 48,
        color: "#FFFFFF"
    },

    contents: {
        flex: 2
    },
})