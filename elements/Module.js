import React from 'react'
import { connect } from 'react-redux'

import {
    StyleSheet,

    Text,
} from 'react-native'
import getIndicator from '../indicator/getIndicator';
import CardView from './CardView';
import { leadingZero } from '../helpers';
import { selectModule, deselectModule } from '../redux/actions';
import getSelectionColor from '../indicator/getSelectionColor';

const mapStateToProps = (state) => ({
    selectedPreset: state.appStatus.selectedPreset,
    selectedModules: state.appStatus.selectedModules,

    modTypes: state.modTypes,
    modValues: state.modValues
})

const mapDispatchToProps = (dispatch) => ({
    selectModule: (modId) => dispatch(selectModule(modId)),
    deselectModule: (modId) => dispatch(deselectModule(modId)),
})

class Module extends React.Component {
    shouldComponentUpdate(nextProps) {
        const {modId} = this.props.mod

        return this.props.modValues[modId] !== nextProps.modValues[modId] ||
            this.props.mod !== nextProps.mod ||
            this.props.selectedPreset !== nextProps.selectedPreset ||
            this.props.selectedModules !== nextProps.selectedModules
    }

    render() {
        let {modId, modAddress, modName, modType} = this.props.mod
        modType = this.props.modTypes[modType]
        modValues = this.props.modValues[modId]

        const { selectedPreset }= this.props
        let bgColor = null

        const presetMode = selectedPreset !== null
        const greyedOut = presetMode && selectedPreset.modType != modType.codename
        const selected = presetMode && this.props.selectedModules.includes(modId)

        // console.log(modId, greyedOut, this.props.selectedModules, selected)        

        if (presetMode) {
            if (greyedOut)
                bgColor = "rgba(52, 52, 52, 0.1)"

            else if (selected) {
                bgColor = getSelectionColor(modType, selectedPreset)
            }
        }

        return <CardView
            style={styles.container}
            indicator={getIndicator(modType)}
            indicatorHeight="8"
            indicatorData={modValues}
            contentStyles={[styles.contents, {backgroundColor: bgColor}]}
            
            onPress={() => {
                if (presetMode) {
                    if (greyedOut)                  
                        ToastAndroid.show("Cannot select this module. Types dont't match.", ToastAndroid.SHORT)

                    else if (selected)
                        this.props.deselectModule(modId)

                    else {
                        // console.log("selecting", modId)                        

                        this.props.selectModule(modId)
                    }
                }

                else {
                    this.props.openModule()
                }
            }}>

                <Text style={styles.address}>{leadingZero(modAddress)}</Text>
                <Text style={styles.name}>{modName}</Text>
        </CardView>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Module)

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
        marginVertical: 4,

        // backgroundColor: "rgba(52, 52, 52, 0.2)"
    },

    contents: {
        paddingHorizontal: 9,
        paddingVertical: 8,
    },

    address: {
        position: "absolute",
        top: 0,
        right: 3,

        fontSize: 14,
        color: "#757575"
    },

    name: {
        fontSize: 20,

        marginBottom: 6,
        color: "#212121"
    },

    list: {
        marginVertical: 12
    },
})
