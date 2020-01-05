import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import {
    StyleSheet,

    Text,
    ToastAndroid,
    Alert,
    ViewStyle
} from 'react-native'
import CardView from './CardView';
import { removeFromStorarge } from '../network/updateDatabase';
import { presetDelete, appSelectPreset } from '../redux/actions';
import IndicatorHelper from '../indicator/IndicatorHelper';
import RootState from '../redux/RootState';
import Preset from '../types/Preset';
import ModType from '../types/ModType';
import { net } from '../network/Network';

interface PresetOwnProps {
    preset: Preset

    setPresetMode: () => void
}

const mapStateToProps = (state: RootState) => ({
    selectedPreset: state.appStatus.selectedPreset,

    modTypes: state.modTypes,
})

const mapDispatchToProps = {
    selectPreset: (preset: Preset) => appSelectPreset(preset),
    deletePreset: (presetId: string) => presetDelete(presetId),
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PresetProps = ConnectedProps<typeof connector> & PresetOwnProps

class PresetComponent extends React.Component<PresetProps> {
    render() {
        const { _id, presetName, modType, values, builtin } = this.props.preset
        const modTypeObject: ModType = this.props.modTypes[modType]

        const { selectedPreset } = this.props
        let bgColor: string | null = null

        const presetMode = selectedPreset !== null
        const selected = presetMode && this.props.selectedPreset!._id == _id

        // console.log("selectedPreset", selectedPreset)

        if (selected)
            bgColor = IndicatorHelper.indicatorMod(modTypeObject).selectionColor(this.props.preset)
            // bgColor = getSelectionColor(modType, this.props.preset)

        return <CardView
            style={styles.container}
            contentStyle={[styles.contents, { backgroundColor: bgColor } as ViewStyle]}
            indicator={IndicatorHelper.indicatorMod(modTypeObject).create(values)}

            onPress={() => {
                this.props.selectPreset(this.props.preset)
                this.props.setPresetMode()
            }}

            onLongPress={() => {
                if (builtin) {
                    ToastAndroid.show("You cannot delete built-in preset " + presetName, ToastAndroid.SHORT)
                }

                else {
                    Alert.alert(
                        "Are you sure?",
                        "You're deleting preset " + presetName, [
                            { text: "Cancel" },
                            { text: "Delete", onPress: () => {
                                if (net.deletePreset(_id)) {
                                    this.props.deletePreset(_id)
                                    removeFromStorarge("presets", _id)
                                }
                            }}
                        ]
                    )
                }
            }}>

            {/* <Text style={styles.type}>{modType.codename}</Text> */}
            <Text style={styles.name}>{presetName}</Text>
        </CardView>
    }
}

export default connector(PresetComponent)

const styles = StyleSheet.create({
    container: {
        margin: 4,
        marginLeft: 12
    },

    contents: {
        padding: 8,
        paddingTop: 6
    },

    name: {
        fontSize: 16,
        color: "#212121",
    },

    type: {
        position: "absolute",
        top: 0,
        right: 3,

        fontSize: 11,
        color: "#9A9C9D"
    },
})