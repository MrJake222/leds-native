import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import {
    StyleSheet,

    View,
    Button,
    ToastAndroid
} from 'react-native'

import NamedInput from '../../elements/NamedInput';
import NamedPicker from '../../elements/NamedPicker';
import { modAddModule } from '../../redux/actions';
import { validateModuleData } from '../../helpers';
import RootState from '../../redux/RootState';
import Module from '../../types/Module';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { socket } from '../../network/Socket';

const mapStateToProps = (state: RootState) => ({
    modTypes: state.modTypes,
    modules: state.modules
})

const mapDispatchToProps = {
    addModule: (moduleObj: Module) => modAddModule(moduleObj)
}

interface AddModuleScreenOwnProps {
    navigation: NavigationScreenProp<any>
}

interface AddModuleScreenState {
    modName: string
    modAddress: string
    modType: string
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type AddModuleScreenProps = ConnectedProps<typeof connector> & AddModuleScreenOwnProps

class AddModuleScreen extends React.Component<AddModuleScreenProps, AddModuleScreenState> {
    constructor(props: AddModuleScreenProps) {
        super(props)

        this.state = {
            modName: "",
            modAddress: "0",
            modType: Object.values(this.props.modTypes)[0].codename
        }

        this.updateValues = this.updateValues.bind(this)
        this.create = this.create.bind(this)
    }

    updateValues(key: string, value: string) {
        this.setState({
            ...this.state,
            [key]: value
        })
    }

    create() {
        const address = parseInt(this.state.modAddress)
        var addressList = Object.values(this.props.modules).map((mod) => mod.modAddress)

        if (validateModuleData(this.state.modName, address, addressList)) {
            if (socket.addModule(address, this.state.modName, this.state.modType)) {
                this.props.navigation.navigate("MainScreen")
            }
        }
    }

    render() {
        var modTypesList = Object.values(this.props.modTypes).map((modType) => ({
            name: modType.codename,
            value: modType.codename
        }))

        return <View style={styles.container}>
            <NamedInput name="Module's name" value={this.state.modName} onChangeText={(value) => this.updateValues("modName", value)} />
            <NamedInput name="Module's address" value={this.state.modAddress} keyboardType="numeric" onChangeText={(value) => this.updateValues("modAddress", value)} />
            <NamedPicker name="Module's type" value={this.state.modType} items={modTypesList} onValueChange={(value) => this.updateValues("modType", value)} />

            <View style={{width: "70%", alignSelf: "center", marginTop: 16}}>
                <Button title="Create" color="#4CAF50" onPress={() => this.create()}/>   
            </View>
        </View>
    }
}

export default connector(AddModuleScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,

    }
})