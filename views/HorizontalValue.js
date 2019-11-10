import React from 'react'

import {
    View,
    Text,
} from 'react-native'

const HorizontalValue = (props) => (
    <View style={{flex: 1, flexDirection: "row"}}>
        <View style={{flex: 1}}>
            <Text>{props.name}</Text>
        </View>
        
        <View style={{flex: 1}}>
            <Text>{props.value}</Text>
        </View>
    </View>
)

export default HorizontalValue