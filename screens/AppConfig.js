import React from 'react'
import {
    StyleSheet,

    View,
    Text,
    TextInput,
    Button
} from 'react-native'
import { serverUpdateConfig, appInitialize } from '../redux/actions';
import NamedInput from '../elements/NamedInput';

export default class AppConfig extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
        this.updateValues = this.updateValues.bind(this)
    }

    static mapStateToProps = (state) => {
        return {
            isAppInitialized: state.isAppInitialized
        }
    }

    static mapDispatchToProps = (dispatch) => {
        return {
            initalize: ({address, port}) => {
                dispatch(serverUpdateConfig(address, port))
                dispatch(appInitialize(true))
            }
        }
    }

    updateValues(idx, value) {
        this.setState({
            ...this.state,
            [idx]: value
        })
    }

    render() {
        // var genInput = (idx, name) => {
        //     return <View style={styles.inputContainer}>
        //         <Text style={styles.text}>{name}</Text>
        //         <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => this.updateValues(idx, value)}/>
        //     </View>
        // }

        return <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Configure the Leds</Text>
            </View>

            <View style={styles.contents}>
                {/* <Text>{"Is initalized: " + this.props.isAppInitialized}</Text> */}
                {/* {genInput("address", "Address")}
                {genInput("port", "Port")} */}

                <NamedInput name="Address" keyboardType="numeric" onChangeText={(value) => this.updateValues("address", value)}/>
                <NamedInput name="Port" keyboardType="numeric" onChangeText={(value) => this.updateValues("port", value)}/>
                                
                <View style={{alignItems: "flex-end", marginRight: 8, marginTop: 4}}>
                    <View style={{width: "50%"}}>
                        <Button title="Accept" color="#4CAF50" onPress={() => {
                            this.props.initalize(this.state)
                            this.props.navigation.navigate("ConnectionWrapper", {ignoreMount: true})
                        }}/>   
                    </View>
                </View>
            </View>
        </View>
    }
}

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

    // text: {
    //     color: "#212121"
    // },

    contents: {
        flex: 2
    },

    // inputContainer: {
    //     margin: 8
    // },

    // input: {
    //     // height: 40,
    //     padding: 4,
        
    //     borderColor: '#212121',
    //     borderWidth: 1,
    //     borderRadius: 4
    // }
})