import React from 'react'
import { connect, ConnectedProps } from 'react-redux';


import {
    StyleSheet,

    View,
    Text,
    FlatList,
    Button,
    TouchableOpacity,
    Image,
    Alert,
    ToastAndroid,
    Switch,
} from 'react-native'

import CardView from '../../elements/CardView';
import { modFieldUpdate, modDeleteModule, modNameUpdate } from '../../redux/actions';
import { validateModuleName, validateModuleAddress, leadingZero } from '../../helpers';
import { removeFromStorarge } from '../../network/updateDatabase';
import FieldHelper from '../../field/FieldHelper';
import RootState from '../../redux/RootState';
import store from '../../redux/store';
import Module from '../../types/Module';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import IndicatorHelper from '../../indicator/IndicatorHelper';
import NamedInput from '../../elements/NamedInput';
import { socket } from '../../network/Socket';

const mapStateToProps = (state: RootState) => ({
    modFields: state.modFields,
    modTypes: state.modTypes,
    modValues: state.modValues
})

const mapDispatchToProps = {
    updateModField: (modId: string, item: string, value: any) => modFieldUpdate(modId, item, value),
    updateName: (modId: string, modName: string) => modNameUpdate(modId, modName),
}

export interface ModuleScreenNavigationParams {
    mod: Module
}

type NavigationProps = NavigationScreenProp<NavigationRoute<ModuleScreenNavigationParams>, ModuleScreenNavigationParams>

interface ModuleScreenOwnProps {
    navigation: NavigationProps
}

interface ModuleScreenState {
    modName: string
    modAddress: string,
    presetName: string,
    modValues: { [codename: string]: any },
    addressChangePacket: boolean
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type ModuleScreenProps = ConnectedProps<typeof connector> & ModuleScreenOwnProps

class ModuleScreen extends React.Component<ModuleScreenProps, ModuleScreenState> {
    static removeIcon = (navigation: NavigationProps) => (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
                var proceed = () => {
                    const { _id } = navigation.getParam("mod")

                    if (socket.deleteModule(_id)) {
                        navigation.goBack()
                        store.dispatch(modDeleteModule(_id))
                        removeFromStorarge("modules", _id)
                    }
                }

                Alert.alert(
                    "Are you sure?",
                    "You're deleting module " + navigation.getParam("mod").modName, [
                        { text: "Cancel" },
                        { text: "Delete", onPress: proceed }
                    ]
                )
            }}>

            <Image source={require("../../assets/remove.png")} resizeMode="center" style={{ height: "100%", width: 30, marginRight: 8, tintColor: "#FFFFFF" }} />
        </TouchableOpacity>
    )

    constructor(props: ModuleScreenProps) {
        super(props)

        const { _id, modAddress, modName } = this.props.navigation.getParam("mod")

        this.state = {
            modName: modName,
            modAddress: modAddress.toString(),
            presetName: "",
            modValues: props.modValues[_id],
            addressChangePacket: false
        }

        this.updateName = this.updateName.bind(this)
        this.updateAddress = this.updateAddress.bind(this)
        this.updateField = this.updateField.bind(this)
        this.addPreset = this.addPreset.bind(this)
    }

    updateName() {
        const { _id, modName } = this.props.navigation.getParam("mod")

        const addressList = Object.values(store.getState().modules).map((mod) => mod.modAddress)

        if (this.state.modName != modName) {

            if (validateModuleName(this.state.modName)) {
                if (socket.updateModuleName(_id, this.state.modName)) {
                    this.props.updateName(_id, this.state.modName)

                    this.props.navigation.setParams({
                        mod: {
                            ...this.props.navigation.getParam("mod"),
                            modName: this.state.modName,
                        }
                    })
                }
            }
        }

        else {
            ToastAndroid.show("Change something", ToastAndroid.SHORT);
        }
    }

    updateAddress() {
        const { _id, modAddress } = this.props.navigation.getParam("mod")
        const newAddress = parseInt(this.state.modAddress)
        const addressList = Object.values(store.getState().modules).map((mod) => mod.modAddress)

        if (newAddress != modAddress) {
            if (validateModuleAddress(modAddress, addressList, true)) {
                if (socket.updateModuleAddress(_id, newAddress)) {
                    this.props.navigation.setParams({
                        mod: {
                            ...this.props.navigation.getParam("mod"),
                            modAddress: newAddress,
                        }
                    })
                }
            }
        }

        else {
            ToastAndroid.show("Change something", ToastAndroid.SHORT);
        }
    }

    updateField(codename: string, value: any) {
        const { _id, modAddress, modType } = this.props.navigation.getParam("mod")

        if (socket.updateModField(_id, modAddress, modType, codename, value)) {
            this.props.updateModField(_id, codename, value)
            this.props.updateModField(_id, "preset", null)
        }
    }

    addPreset(values: { [codename: string]: any }) {
        var { _id, modType } = this.props.navigation.getParam("mod")

        if (this.state.presetName != "") {
            values = { ...values }
            delete values._id
            delete values.modId
            delete values.preset

            if (socket.addPreset(this.state.presetName, _id, modType, values)) {
                this.props.updateModField(_id, "preset", this.state.presetName)

                this.props.navigation.navigate("MainScreen")
            }
        }

        else {
            ToastAndroid.show("Preset name cannot be empty", ToastAndroid.SHORT);
        }
    }

    render() {
        var { _id, modType, modAddress } = this.props.navigation.getParam("mod")
        const modTypeObject = this.props.modTypes[modType]
        const modValuesObject = this.props.modValues[_id]
        // console.log("ModuleScreen rerender", modId, "hue: " + modFields.hue)        

        return <View style={styles.container}>
            <CardView
                style={styles.cardview}
                contentStyle={styles.contents}
                indicator={IndicatorHelper.indicatorMod(modTypeObject).create(modValuesObject)}>

                <Text style={styles.topRight}>{modTypeObject.codename + " at " + leadingZero(modAddress)}</Text>

                <FlatList
                    data={modTypeObject.fields}

                    keyExtractor={(item) => item}
                    renderItem={({ item }) => FieldHelper
                        .field(this.props.modFields[item])
                        .create(this.props.modFields[item], this.state.modValues[item], (value) => this.updateField(item, value))
                        // field={this.props.modFields[item]}
                        // value={this.state.modValues[item]}
                        // onValueChange={(value) => this.updateField(item, value)}
                    }
                />
            </CardView>

            <View style={styles.containerInner}>
                <CardView
                    style={[styles.cardviewInner, { marginRight: 6 }]}
                    contentStyle={styles.contents}>

                    <NamedInput name="Module's name" value={this.state.modName} onChangeText={(value: string) => this.setState({ modName: value })} />

                    <Button title="Save" color="#4CAF50" onPress={this.updateName} />
                </CardView>

                <CardView
                    style={[styles.cardviewInner, { marginLeft: 6 }]}
                    contentStyle={styles.contents}>

                    <NamedInput name="Preset's name" value={this.state.presetName} onChangeText={(value: string) => this.setState({ presetName: value })} />

                    <Button title="Create preset" color="#4CAF50" onPress={() => this.addPreset(modValuesObject)} />
                </CardView>
            </View>

            <View style={styles.containerInner}>
                <View style={[{ width: "50%", paddingRight: 6, paddingTop: 12 }]}>

                    <CardView contentStyle={styles.contents}>
                        <NamedInput name="Module's address" value={this.state.modAddress} keyboardType="numeric" onChangeText={(value: string) => this.setState({ modAddress: value })} />
                        <Text style={styles.warn}>Warning: This will also change the Modbus address of the device</Text>

                        <Button title="Change" color="#4CAF50" onPress={this.updateAddress} />
                    </CardView>
                </View>
            </View>
        </View>
    }
}

export default connector(ModuleScreen)


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
        marginVertical: 4,

        flex: 1,     
    },

    cardview: {
        marginBottom: 12
    },

    containerInner: {
        flexDirection: "row",
    },

    cardviewInner: {
        flex: 1,
        alignSelf: "flex-start"
    },

    contents: {
        // paddingHorizontal: 4,
        // paddingVertical: 2,
    },

    topRight: {
        position: "absolute",
        top: 2,
        right: 3,

        fontSize: 14,
        color: "#757575"
    },

    warn: {
        color: "#757575",
        textAlign: "center",
        marginBottom: 8,
        paddingHorizontal: 8,
    }
})