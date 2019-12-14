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
} from 'react-native'

import CardView from '../../elements/CardView';
import getIndicator from '../../indicator/IndicatorHelper';
import { modFieldUpdate, modDeleteModule, modNameAddressUpdate } from '../../redux/actions';
import { socketGlobal } from '../../network/socket';
import { validateModuleData, leadingZero } from '../../helpers';
import { removeFromStorarge } from '../../network/updateDatabase';
import FieldHelper from '../../field/FieldHelper';
import RootState from '../../redux/RootState';
import { NavigationStackProp } from 'react-navigation-stack';
import store from '../../redux/store';
import Module from '../../types/Module';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import IndicatorHelper from '../../indicator/IndicatorHelper';
import NamedInput from '../../elements/NamedInput';
import { Color } from 'csstype';

const mapStateToProps = (state: RootState) => ({
    modFields: state.modFields,
    modTypes: state.modTypes,
    modValues: state.modValues
})

const mapDispatchToProps = {
    updateModField: (modId: string, item: string, value: any) => modFieldUpdate(modId, item, value),
    updateNameAddress: (modId: string, modAddress: number, modName: string) => modNameAddressUpdate(modId, modAddress, modName),
}

interface NavigationParams {
    mod: Module
}

type NavigationProps = NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>

interface ModuleScreenOwnProps {
    navigation: NavigationProps
}

interface ModuleScreenState {
    modName: string
    modAddress: number,
    presetName: string,
    modValues: { [codename: string]: any }
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

                    navigation.goBack()
                    store.dispatch(modDeleteModule(_id))
                    socketGlobal.emit("deleteModule", { modId: _id })
                    removeFromStorarge("modules", _id)
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

            <Image source={require("../../assets/remove.png")} resizeMode="center" style={{ height: "100%", width: 30, marginRight: 8, tintColor: "#FFFFFF" }} />
        </TouchableOpacity>
    )

    constructor(props: ModuleScreenProps) {
        super(props)

        const { _id, modAddress, modName } = this.props.navigation.getParam("mod")

        console.log("props", props)

        this.state = {
            modName: modName,
            modAddress: modAddress,
            presetName: "",
            modValues: props.modValues[_id]
        }

        this.apply = this.apply.bind(this)
        this.updateField = this.updateField.bind(this)
        this.addPreset = this.addPreset.bind(this)
    }

    apply() {
        const { _id, modAddress, modName } = this.props.navigation.getParam("mod")

        const address = this.state.modAddress
        const addressList = Object.values(store.getState().modules).map((mod) => mod.modAddress)

        if (socketGlobal.connected) {

            if (this.state.modName != modName || this.state.modAddress != modAddress) {

                if (validateModuleData(this.state.modName, address, addressList, true)) {
                    this.props.updateNameAddress(_id, address, this.state.modName)
                    socketGlobal.emit("updateModule", {
                        modId: _id,
                        modName: this.state.modName,
                        modAddress: address
                    })

                    this.props.navigation.setParams({
                        mod: {
                            ...this.props.navigation.getParam("mod"),
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

    updateField(codename: string, value: any) {
        const { _id, modAddress, modType } = this.props.navigation.getParam("mod")

        if (socketGlobal.connected) {
            this.props.updateModField(_id, codename, value)

            // this.setState({
            //     modValues: {
            //         ...this.state.modValues,
            //         [codename]: value
            //     }
            // })

            socketGlobal.emit("updateModField", {
                modId: _id,
                modAddress: modAddress,
                modType: modType,
                codename: codename,
                value: value
            })
        }

        else {
            ToastAndroid.show("Socket disconnected", ToastAndroid.SHORT)
        }
    }

    addPreset(values: { [codename: string]: any }) {
        if (socketGlobal.connected) {

            if (this.state.presetName != "") {
                var { modType } = this.props.navigation.getParam("mod")

                values = { ...values }
                delete values._id
                delete values.modId

                socketGlobal.emit("addPreset", {
                    presetName: this.state.presetName,
                    modType: modType,
                    values: values
                })

                this.props.navigation.navigate("MainScreen")
            }

            else {
                ToastAndroid.show("Preset name cannot be empty", ToastAndroid.SHORT);
            }
        }

        else {
            ToastAndroid.show("Socket disconnected", ToastAndroid.SHORT)
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

                    <Text style={styles.topRight}>Properties</Text>

                    <NamedInput name="Module's name" value={this.state.modName} onChangeText={(value: string) => this.setState({ modName: value })} />
                    <NamedInput name="Module's address" value={this.state.modAddress.toString()} keyboardType="numeric" onChangeText={(value: string) => this.setState({ modAddress: parseInt(value) })} />
                    <NamedInput name="Module's address" value={this.state.modAddress.toString()} keyboardType="numeric" onChangeText={(value: string) => this.setState({ modAddress: parseInt(value) })} />

                    {/* style={{ marginTop: 6 }} */}
                    <Button title="Save" color="#4CAF50" onPress={this.apply} />
                </CardView>

                <CardView
                    style={[styles.cardviewInner, { marginLeft: 6 }]}
                    contentStyle={styles.contents}>

                    <Text style={styles.topRight}>Add preset</Text>

                    <NamedInput name="Preset's name" value={this.state.presetName} onChangeText={(value: string) => this.setState({ presetName: value })} />

                    <Button title="Create preset" color="#4CAF50" onPress={() => this.addPreset(modValuesObject)} />
                </CardView>
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
        flex: 1,
        flexDirection: "row"
    },

    cardviewInner: {
        flex: 1,
        alignSelf: "flex-start"
    },

    contents: {
        paddingHorizontal: 4,
        paddingVertical: 2,
    },

    topRight: {
        position: "absolute",
        top: 2,
        right: 3,

        fontSize: 14,
        color: "#757575"
    },
})