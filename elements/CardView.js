import React from 'react'
import {
    StyleSheet,

    View,
    TouchableOpacity
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
        const activeOpacity = (this.props.onPress || this.props.onLongPress) ? 0.8 : 1

        return <TouchableOpacity activeOpacity={activeOpacity} style={[styles.container, this.props.style]} onPress={this.props.onPress} onLongPress={this.props.onLongPress}>
            {this.props.indicator ? <this.props.indicator height={this.props.indicatorHeight} data={this.props.indicatorData} /> : []}

            <View style={this.props.contentStyles}>
                {this.props.children}
            </View>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        elevation: 6,
        backgroundColor: "white",

        overflow: "hidden"
    }
})