import React from 'react'
import {
    StyleSheet,

    View,
    Text,
    FlatList,
    Button,
    TouchableOpacity,
    Image,
    Alert,
    ToastAndroid
} from 'react-native'
import Field from '../../elements/Field';
import CardView from '../../elements/CardView';
import getIndicator from '../../indicator/getIndicator';
import { modFieldUpdate, modDeleteModule, modNameAddressUpdate } from '../../redux/actions';
import store from "~/redux/store"
import { socketGlobal } from '../../network/socket';
import NamedInput from "~/elements/NamedInput"
import { validateModuleData, leadingZero } from '../../helpers';

export default class ModuleScreen extends React.Component {
    static mapStateToProps = (state) => ({
        modFields: state.modFields,
        modTypes: state.modTypes,
        modValues: state.modValues
    })

    static mapDispatchToProps = (dispatch) => ({
        updateModField: (modId, item, value) => dispatch(modFieldUpdate(modId, item, value)),
        updateNameAddress: (modId, modAddress, modName) => dispatch(modNameAddressUpdate(modId, modAddress, modName)),
    })

    static removeIcon = (navigation) => (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
                var proceed = () => {
                    const modId = navigation.getParam("mod").modId

                    navigation.goBack()
                    store.dispatch(modDeleteModule(modId))
                    socketGlobal.emit("deleteModule", { modId: modId })
                }

                if (socketGlobal.connected) {
                    Alert.alert(
                        "Are you sure?",
                        "You're deleting module " + navigation.getParam("mod").modName, [
                            { text: "Cancel" },
                            { text: "Delete", onPress: proceed }
                        ]
                    )
                }

                else {
                    ToastAndroid.show("Socket disconnected", ToastAndroid.SHORT)
                }
            }}>

            <Image source={require("../../assets/remove.png")} resizeMode="center" tintColor="#FFF" style={{ height: "100%", width: 30, marginRight: 8 }} />
        </TouchableOpacity>
    )

    constructor(props) {
        super(props)
        
        const { modAddress, modName } = this.props.navigation.state.params.mod

        this.state = {
            modName: modName,
            modAddress: modAddress.toString()
        }

        this.apply = this.apply.bind(this)
        this.updateField = this.updateField.bind(this)
    }

    apply() {
        const { modId, modAddress, modName } = this.props.navigation.state.params.mod

        const address = parseInt(this.state.modAddress)
        const addressList = Object.values(store.getState().modules).map((mod) => mod.modAddress)

        if (socketGlobal.connected) {

            if (this.state.modName != modName || this.state.modAddress != modAddress ) {

                if (validateModuleData(this.state.modName, address, addressList, true)) {
                    this.props.updateNameAddress(modId, address, this.state.modName)
                    socketGlobal.emit("updateModule", {
                        modId: modId,
                        modName: this.state.modName,
                        modAddress: address
                    })

                    this.props.navigation.setParams({
                        mod: {
                            ...this.props.navigation.state.params.mod,
                            modName: this.state.modName,
                            modAddress: address
                        }
                    })                
                } 
            }

            else {
                ToastAndroid.show("Change something", ToastAndroid.SHORT);
            }
        }

        else {
            ToastAndroid.show("Socket disconnected", ToastAndroid.SHORT)
        }
    }

    updateField(codename, value) {
        const { modId } = this.props.navigation.state.params.mod

        if (socketGlobal.connected) {
            this.props.updateModField(modId, codename, value)

            socketGlobal.emit("updateModField", {
                modId: modId, 
                codename: codename, 
                value: value
            })
        }

        else {
            ToastAndroid.show("Socket disconnected", ToastAndroid.SHORT)
        }
    }

    render() {
        var { modId, modType, modAddress } = this.props.navigation.state.params.mod
        modType = this.props.modTypes[modType]

        const modFields = this.props.modValues[modId]
        console.log("ModuleScreen rerender", modId, "hue: " + modFields.hue)        

        return <View style={styles.container}>
            <CardView
                style={styles.cardview}
                contentStyle={styles.contents}
                indicator={getIndicator(modType)}
                indicatorHeight="8"
                indicatorData={modFields}>

                    <Text style={styles.modType}>{modType.codename + " at " + leadingZero(modAddress)}</Text>

                    <FlatList
                        data={modType.fields}
                        // extraData={modFields}

                        keyExtractor={(item) => item}
                        renderItem={({ item }) => <Field
                            field={this.props.modFields[item]}
                            value={modFields[item]}
                            onValueChange={(value) => this.updateField(item, value)}
                        />}
                    />
            </CardView>

            <CardView
                style={styles.cardview}
                contentStyle={styles.contents}>

                    <Text style={styles.modType}>Properties</Text>

                    <NamedInput name="Module's name" value={this.state.modName} onChangeText={(value) => this.setState({...this.state, modName: value})}/>
                    <NamedInput name="Module's address" value={this.state.modAddress} keyboardType="numeric" onChangeText={(value) => this.setState({...this.state, modAddress: value})}/>
                    
                    <View style={{width: "50%", alignSelf: "flex-end", marginTop: 6}}>
                        <Button title="Save" color="#4CAF50" onPress={this.apply}/>
                    </View>
            </CardView>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
        marginVertical: 4,

        // flex: 1,
        // justifyContent: "center"
    },

    cardview: {
        marginBottom: 12
    },

    contents: {
        paddingHorizontal: 4,
        paddingVertical: 2,
    },

    modType: {
        position: "absolute",
        top: 2,
        right: 3,

        fontSize: 14,
        color: "#757575"
    },
})