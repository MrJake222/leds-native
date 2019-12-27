import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import {
    StyleSheet,

    Text,
    ToastAndroid,
} from 'react-native'
import CardView from './CardView';
import { leadingZero } from '../helpers';
import { selectModule, deselectModule } from '../redux/actions';
import IndicatorHelper from '../indicator/IndicatorHelper';
import Module from '../types/Module';
import RootState from '../redux/RootState';
import store from '../redux/store';

const mapStateToProps = (state: RootState) => ({
    selectedPreset: state.appStatus.selectedPreset,
    selectedModules: state.appStatus.selectedModules,

    modTypes: state.modTypes,
    modValues: state.modValues
})

const mapDispatchToProps = {
    selectModule: (modId: string) => selectModule(modId),
    deselectModule: (modId: string) => deselectModule(modId),
}

interface ModuleOwnProps {
    mod: Module
    openModule: () => void
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type ModuleProps = ConnectedProps<typeof connector> & ModuleOwnProps

class ModuleComponent extends React.Component<ModuleProps> {
    shouldComponentUpdate(nextProps: ModuleProps) {
        const {_id} = this.props.mod

        return this.props.modValues[_id] !== nextProps.modValues[_id] ||
            this.props.mod !== nextProps.mod ||
            this.props.selectedPreset !== nextProps.selectedPreset ||
            this.props.selectedModules !== nextProps.selectedModules
    }

    render() {
        let {_id, modAddress, modName, modType} = this.props.mod
        const modTypeObject = this.props.modTypes[modType]
        const modValuesObject = this.props.modValues[_id]

        // console.log("this.props.modValues", this.props.modValues)

        const { selectedPreset }= this.props
        let bgColor: string | null = null

        const presetMode = selectedPreset !== null
        const greyedOut = presetMode && selectedPreset!.modType != modTypeObject.codename
        const selected = presetMode && this.props.selectedModules.includes(_id)

        // console.log(modId, greyedOut, this.props.selectedModules, selected)        

        if (presetMode) {
            if (greyedOut)
                bgColor = "rgba(52, 52, 52, 0.1)"

            else if (selected) {
                // bgColor = getSelectionColor(modType, selectedPreset)
                bgColor = IndicatorHelper.indicatorMod(modTypeObject).selectionColor(selectedPreset!)
            }
        }

        return <CardView
            style={styles.container}
            indicator={IndicatorHelper.indicatorMod(modTypeObject).create(modValuesObject)}
            contentStyle={[styles.contents, {backgroundColor: bgColor!}]}
            
            onPress={() => {
                if (presetMode) {
                    if (greyedOut)                  
                        ToastAndroid.show("Cannot select this module. Types dont't match.", ToastAndroid.SHORT)

                    else if (selected)
                        this.props.deselectModule(_id)

                    else
                        this.props.selectModule(_id)
                }

                else {
                    this.props.openModule()
                }
            }}>

                {/* <Text style={styles.address}>{leadingZero(modAddress)}</Text> */}
                <Text style={styles.preset}>{modValuesObject.preset}</Text>
                <Text style={styles.name}>{modName}</Text>
        </CardView>
    }
}

export default connector(ModuleComponent)

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
        marginVertical: 4
    },

    contents: {
        paddingHorizontal: 9,
        paddingVertical: 8,
    },

    // address: {
    //     position: "absolute",
    //     top: 0,
    //     right: 3,

    //     fontSize: 14,
    //     color: "#757575"
    // },

    preset: {
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
