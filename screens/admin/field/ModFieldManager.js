import React from 'react'
import { connect } from 'react-redux'

import {
    StyleSheet,

    View,
    Text,
    FlatList
} from 'react-native'

import CardView from "~/elements/CardView"
import ModFieldEntry from "./ModFieldEntry"

const mapStateToProps = (state) => ({
    modules: state.modules
})

class ModFieldManager extends React.Component {
    render() {
        // var fields = [
        //     {name: "Name", codename: "Codename", type: "Type"},
        //     ...
        // ]

        return <CardView style={styles.container}>
            
            <FlatList
                data={Object.values(this.props.modules)}
                keyExtractor={(item) => item.codename}
                renderItem={({item}) => <ModFieldEntry field={item} />}
            />
        </CardView>
    }
}

export default connect(mapStateToProps)(ModFieldManager)

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignSelf: "flex-start"
        // width: "70%"

    },

    
})