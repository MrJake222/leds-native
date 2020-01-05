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
import RootState from '../../redux/RootState';
import Module from '../../types/Module';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { net } from '../../network/Network';
import { validateModuleName, validateModuleAddress } from '../../helpers';

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
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type AddModuleScreenProps = ConnectedProps<typeof connector> & AddModuleScreenOwnProps

class AddModuleScreen extends React.Component<AddModuleScreenProps, AddModuleScreenState> {
    constructor(props: AddModuleScreenProps) {
        super(props)

        this.state = {
            modName: "test",
            modAddress: "1",
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

    async create() {
        const address = parseInt(this.state.modAddress)
        var addressList = Object.values(this.props.modules).map((mod) => mod.modAddress)

        if (validateModuleName(this.state.modName) && validateModuleAddress(address, addressList)) {
            if (await net.addModule(address, this.state.modName)) {
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

            <View style={{width: "70%", alignSelf: "center", marginTop: 16}}>
                <Button title="Create" color="#4CAF50" onPress={this.create}/>   
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