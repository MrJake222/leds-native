import React from 'react'
import { connect } from 'react-redux'

import {
    StyleSheet,
    ActivityIndicator,

    View,
    Text,
} from 'react-native'
import CardView from '../elements/CardView';
import IndicatorHelper from '../indicator/IndicatorHelper';

const mapStateToProps = (state) => ({
    serverAddress: state.serverData.serverAddress,

    connected: state.serverData.connected,
    connectionStatus: state.serverData.connectionStatus,
})

/**
 * Keeps the CardView displaying the current server status
 */
class ServerStatus extends React.PureComponent {
    render() {
        // console.log("ServerStatus")

        return <CardView
            style={styles.container}
            contentStyles={styles.contents} 
            indicator={IndicatorHelper.indicator("color").create({...serverStatusColor, hue: this.props.connected ? 120 : 0})}>
            
                <View style={styles.titleBar}>
                    {this.props.connected ? <View /> : <ActivityIndicator />}

                    <Text style={styles.address}>{this.props.serverAddress}</Text>
                </View>

                <Text style={styles.title}>Server status</Text>
                <Text style={styles.status}>{this.props.connectionStatus}</Text>
        </CardView>
    }
}

export default connect(mapStateToProps)(ServerStatus)

const serverStatusColor = {hue: 0, saturation: 50, lightness: 50}

const styles = StyleSheet.create({
    container: {
        margin: 4
    },

    // CardView contents styling
    contents: {
        paddingHorizontal: 4,
        paddingVertical: 2,
    },

    // Title bar of a Server status CardView
    // Contains ActivityIndicator and text.title
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    title: {
        fontSize: 14,
        fontWeight: "bold",

        textAlign: "right",
        color: "#212121"
    },

    address: {
        color: "#757575",

        textAlign: "right",
        fontSize: 12,
    },

    status: {
        fontSize: 14,
        textAlign: "right",

        color: "#212121"
        // fontWeight: "bold"
    }
})