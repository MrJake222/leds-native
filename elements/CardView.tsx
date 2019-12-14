import React from 'react'
import {
    StyleSheet,

    View,
    TouchableOpacity,
    ViewStyle
} from 'react-native'
import IndicatorColor, { IndicatorColorComponent } from '../indicator/IndicatorColor';
import IndicatorHelper from '../indicator/IndicatorHelper';

interface Props {
    style?: ViewStyle[] | ViewStyle
    contentStyle?: ViewStyle[] | ViewStyle
    indicator?: Element

    onPress?: () => void
    onLongPress?: () => void
}

/**
 * Simlates the original CardView from Android Studio
 * 
 * props:
 *  style - root View styles
 *  indicator - top indicator
 *  contentStyle - styles for the children View
 */
export default class CardView extends React.Component<Props> {
    render() {
        const activeOpacity = (this.props.onPress || this.props.onLongPress) ? 0.8 : 1

        return <TouchableOpacity activeOpacity={activeOpacity} style={[styles.container, this.props.style]} onPress={this.props.onPress} onLongPress={this.props.onLongPress}>
            {this.props.indicator}

            <View style={this.props.contentStyle}>
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