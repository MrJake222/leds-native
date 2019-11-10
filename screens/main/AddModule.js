import React from 'react'
import { connect } from 'react-redux'

import {
    StyleSheet,

    View,
    Button,
    ToastAndroid
} from 'react-native'

import NamedInput from '~/elements/NamedInput';
import NamedPicker from '../../elements/NamedPicker';
import { modAddModule } from '../../redux/actions';
import { socketGlobal } from '../../network/socket';
import { validateModuleData } from '../../helpers';

const mapStateToProps = (state) => ({
    modTypes: state.modTypes,
    modules: state.modules
})

const mapDispatchToProps = (dispatch) => ({
    addModule: (moduleObj) => dispatch(modAddModule(moduleObj))
})

class AddModule extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            modName: "",
            modAddress: "0",
            modType: Object.values(this.props.modTypes)[0].codename
        }

        this.updateValues = this.updateValues.bind(this)
        this.create = this.create.bind(this)
    }

    updateValues(key, value) {
        this.setState({
            ...this.state,
            [key]: value
        })
    }

    create() {
        const address = parseInt(this.state.modAddress)
        
        var addressList = Object.values(this.props.modules).map((mod) => mod.modAddress)

        if (socketGlobal.connected) {

            if (validateModuleData(this.state.modName, address, addressList)) {
                
                socketGlobal.emit("addModule", {
                    modAddress: address,
                    modName: this.state.modName,
                    modType: this.state.modType
                })

                this.props.navigation.navigate("MainScreen")
            }
        }

        else {
            ToastAndroid.show("Socket disconnected", ToastAndroid.SHORT)
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

export default connect(mapStateToProps, mapDispatchToProps)(AddModule)

const styles = StyleSheet.create({
    container: {
        flex: 1,

    }
})