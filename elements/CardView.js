import React from 'react'
import {
    StyleSheet,

    View,
    Text
} from 'react-native'

/**
 * Simlates the original CardView from Android Studio
 * 
 * props:
 *  style - root View styles
 *  indicator - top indicator
 *  indicatorHeight - height of the indicator
 *  indicatorData - data for the indicator
 *  contentStyles - styles for the children View
 */
export default class CardView extends React.Component {
    render() {
        return <View style={[styles.container, this.props.style]}>
            {this.props.indicator ? <this.props.indicator height={this.props.indicatorHeight} data={this.props.indicatorData} /> : []}

            <View style={this.props.contentStyles}>
                {this.props.children}
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // margin: 4,

        borderRadius: 8,
        elevation: 6,
        backgroundColor: "white",

        position: "relative",
        overflow: "hidden"
    }
})