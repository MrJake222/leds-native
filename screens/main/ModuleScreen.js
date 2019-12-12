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
    ToastAndroid,
} from 'react-native'

import Field from '../../elements/Field';
import CardView from '../../elements/CardView';
import getIndicator from '../../indicator/getIndicator';
import { modFieldUpdate, modDeleteModule, modNameAddressUpdate } from '../../redux/actions';
import store from "~/redux/store"
import { socketGlobal } from '../../network/socket';
import NamedInput from "~/elements/NamedInput"
import { validateModuleData, leadingZero } from '../../helpers';
import { removeFromStorarge } from '../../network/updateDatabase';

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
                    removeFromStorarge("modules", modId)
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

        const { _id, modAddress, modName } = this.props.navigation.state.params.mod

        this.state = {
            modName: modName,
            modAddress: modAddress.toString(),
            presetName: "",
            modValues: props.modValues[_id]
        }

        this.apply = this.apply.bind(this)
        this.updateField = this.updateField.bind(this)
        this.addPreset = this.addPreset.bind(this)
    }

    apply() {
        const { modId, modAddress, modName } = this.props.navigation.state.params.mod

        const address = parseInt(this.state.modAddress)
        const addressList = Object.values(store.getState().modules).map((mod) => mod.modAddress)

        if (socketGlobal.connected) {

            if (this.state.modName != modName || this.state.modAddress != modAddress) {

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
        const { modId, modAddress, modType } = this.props.navigation.state.params.mod

        if (socketGlobal.connected) {
            this.props.updateModField(modId, codename, value)

            // this.setState({
            //     modValues: {
            //         ...this.state.modValues,
            //         [codename]: value
            //     }
            // })

            socketGlobal.emit("updateModField", {
                modId: modId,
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

    addPreset(values) {
        if (socketGlobal.connected) {

            if (this.state.presetName != "") {
                var { modType } = this.props.navigation.state.params.mod

                values = {...values}
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
        var { modId, modType, modAddress } = this.props.navigation.state.params.mod
        modType = this.props.modTypes[modType]

        const modValues = this.props.modValues[modId]
        // console.log("ModuleScreen rerender", modId, "hue: " + modFields.hue)        

        return <View style={styles.container}>
            <CardView
                style={styles.cardview}
                contentStyle={styles.contents}
                indicator={getIndicator(modType)}
                indicatorHeight="8"
                indicatorData={modValues}>

                    <Text style={styles.topRight}>{modType.codename + " at " + leadingZero(modAddress)}</Text>

                    <FlatList
                        data={modType.fields}
                        // extraData={modFields}

                        keyExtractor={(item) => item}
                        renderItem={({ item }) => <Field
                            field={this.props.modFields[item]}
                            value={this.state.modValues[item]}
                            onValueChange={(value) => this.updateField(item, value)}
                        />}
                    />
            </CardView>

            <View style={styles.containerInner}>
                <CardView
                    style={[styles.cardviewInner, { marginRight: 6 }]}
                    contentStyle={styles.contents}>

                        <Text style={styles.topRight}>Properties</Text>

                        <NamedInput name="Module's name" value={this.state.modName} onChangeText={(value) => this.setState({ ...this.state, modName: value })} />
                        <NamedInput name="Module's address" value={this.state.modAddress} keyboardType="numeric" onChangeText={(value) => this.setState({ ...this.state, modAddress: value })} />

                        <Button style={{ marginTop: 6 }} title="Save" color="#4CAF50" onPress={this.apply} />
                </CardView>

                <CardView
                    style={[styles.cardviewInner, { marginLeft: 6 }]}
                    contentStyle={styles.contents}>

                        <Text style={styles.topRight}>Add preset</Text>

                        <NamedInput name="Preset's name" value={this.state.presetName} onChangeText={(value) => this.setState({ ...this.state, presetName: value })} />

                        <Button style={{ marginTop: 6 }} title="Create preset" color="#4CAF50" onPress={() => this.addPreset(modValues)} />
                </CardView>
            </View>
        </View>
    }
}

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