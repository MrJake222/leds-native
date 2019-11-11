import React from 'react'
import { connect } from 'react-redux'

import {
    StyleSheet,

    View,
    Text,
    TouchableOpacity
} from 'react-native'
import CardView from './CardView';
import getIndicator from '../indicator/getIndicator';

const mapStateToProps = (state) => ({
    modTypes: state.modTypes,
})

class Preset extends React.Component {
    render() {
        var { presetName, modType, values } = this.props.preset
        modType = this.props.modTypes[modType]

        // console.log("this.props.preset", this.props.preset, this.props.modTypes, modType)

        return <CardView
            style={styles.container}
            contentStyles={styles.contents} 
            indicator={getIndicator(modType)} 
            indicatorHeight={8} 
            indicatorData={values}
            onLongPress={this.props.deletePreset}>
            
                {/* <Text style={styles.type}>{modType.codename}</Text> */}
                <Text style={styles.name}>{presetName}</Text>
        </CardView>
    }
}

export default connect(mapStateToProps)(Preset)

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