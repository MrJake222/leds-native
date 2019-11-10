import React from 'react'
import {
    StyleSheet,

    View,
    Text
} from 'react-native'

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