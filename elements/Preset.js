import React from 'react'
import { connect } from 'react-redux'

import {
    StyleSheet,

    Text,
    ToastAndroid,
    Alert
} from 'react-native'
import CardView from './CardView';
import getIndicator from '../indicator/getIndicator';
import getSelectionColor from '../indicator/getSelectionColor';
import { socketGlobal } from '../network/socket';
import { removeFromStorarge } from '../network/updateDatabase';
import { presetDelete, appSelectPreset } from '../redux/actions';

const mapStateToProps = (state) => ({
    selectedPreset: state.appStatus.selectedPreset,

    modTypes: state.modTypes,
})

const mapDispatchToProps = (dispatch) => ({
    selectPreset: (preset) => dispatch(appSelectPreset(preset)),
    deletePreset: (id) => dispatch(presetDelete(id)),
})

class Preset extends React.Component {
    render() {
        let { _id, presetName, modType, values } = this.props.preset
        modType = this.props.modTypes[modType]

        const { selectedPreset } = this.props
        let bgColor = null

        const presetMode = selectedPreset !== null
        const selected = presetMode && this.props.selectedPreset._id == _id

        if (selected)
            bgColor = getSelectionColor(modType, this.props.preset)

        return <CardView
            style={styles.container}
            contentStyles={[styles.contents, { backgroundColor: bgColor }]}
            indicator={getIndicator(modType)}
            indicatorHeight={8}
            indicatorData={values}

            onPress={() => {
                this.props.selectPreset(this.props.preset)
                this.props.setPresetMode()
            }}

            onLongPress={() =>
                Alert.alert(
                    "Are you sure?",
                    "You're deleting preset " + presetName, [
                        { text: "Cancel" },
                        { text: "Delete", onPress: () => {
                            if (socketGlobal.connected) {
                                socketGlobal.emit("deletePreset", { _id: _id })
                                this.props.deletePreset(_id)
                                removeFromStorarge("presets", _id)
                            }

                            else {
                                ToastAndroid.show("Socket disconnected", ToastAndroid.SHORT)
                            }
                        }}
                    ]
                )
            }>

            {/* <Text style={styles.type}>{modType.codename}</Text> */}
            <Text style={styles.name}>{presetName}</Text>
        </CardView>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preset)

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