import React from 'react'
import { connect } from 'react-redux'

import {
    StyleSheet,

    View,
    Text,
    TouchableWithoutFeedback
} from 'react-native'
import getIndicator from '../indicator/getIndicator';
import CardView from './CardView';
import { leadingZero } from '../helpers';

var mapStateToProps = (state) => ({
    modTypes: state.modTypes,
    modValues: state.modValues
})

class Module extends React.Component {
    shouldComponentUpdate(nextProps) {
        const {modId} = this.props.mod

        return this.props.modValues[modId] !== nextProps.modValues[modId] ||
            this.props.mod !== nextProps.mod
    }

    render() {
        ({modId, modAddress, modName, modType} = this.props.mod)
        modType = this.props.modTypes[modType]
        modValues = this.props.modValues[modId]

        // console.log("modValues", this.props.modValues);
        
        return <TouchableWithoutFeedback onPress={this.props.openModule}>
                <View>
                    <CardView
                        style={styles.container}
                        indicator={getIndicator(modType)}
                        indicatorHeight="8"
                        indicatorData={modValues}
                        contentStyles={styles.contents}>
                        
                            <Text style={styles.address}>{leadingZero(modAddress)}</Text>
                            <Text style={styles.name}>{modName}</Text>
                </CardView>
            </View>
        </TouchableWithoutFeedback>
    }
}

export default connect(mapStateToProps)(Module)

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
        marginVertical: 4
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
