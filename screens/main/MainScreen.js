import React from 'react'

import {
    StyleSheet,
    AsyncStorage,

    View,
    FlatList,
    Image,
    Button,
    RefreshControl
} from 'react-native'

import ServerStatus from '../../elements/ServerStatus';
import Module from '../../elements/Module';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { socketGlobal } from '../../network/socket';
import { appLoad } from '../../redux/actions';

export default class MainScreen extends React.PureComponent {
    constructor(props) {
        super(props)
    
        this.refresh = this.refresh.bind(this)
    }

    static mapStateToProps = (state) => {
        return {
            isAppLoaded: state.appStatus.isAppLoaded,
            modules: state.modules,
        }
    }

    static mapDispatchToProps = (dispatch) => {
        return {
            deloadApp: () => dispatch(appLoad(false)),
        }
    }

    static addIcon = (navigation) => (
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("AddModule")}>
            <Image source={require("../../assets/add.png")} resizeMode="center" tintColor="#FFF" style={{height: "100%", width: 30, marginRight: 8}}/>
        </TouchableOpacity>
    )

    refresh() {
        this.props.deloadApp()
        socketGlobal.emit("forceReload")
    }

    // componentDidMount() {
    //     this.props.navigation.navigate("Module", {mod: {modId: "5dc72897654fd7639d4a2d90", modAddress: 1, modName: "Biurko", modType: "LED-RGB"}})
    // }

    render() {
        console.log("MainScreen rerender")

        return <ScrollView refreshControl={<RefreshControl colors={["#4CAF50"]} refreshing={!this.props.isAppLoaded} onRefresh={this.refresh}/>}>
            <View style={styles.container}>
                {/* Contains module definitions */}
                <View style={styles.modules}>
                    {/* <Button title="Clear AsyncStorage" onPress={() => AsyncStorage.clear()} /> */}

                    <FlatList
                        data={Object.values(this.props.modules)}
                        
                        keyExtractor={(item) => item.modId.toString()}
                        renderItem={({ item }) => <Module
                            mod={item}
                            openModule={() => this.props.navigation.navigate("Module", {mod: item})}
                        />}
                    />
                </View>

                {/* Status information, maybe presets */}
                <View style={styles.status}>
                    <ServerStatus />
                </View>
            </View>
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    // Main container of this screen
    container: {
        // marginTop: Constants.statusBarHeight,

        flex: 1,
        flexDirection: "row",
    },

    // Contains module definitions
    modules: {
        flex: 7,
    },

    // Status pane
    status: {
        flex: 3,

        padding: 4,
    },

    imageContainer: {
        height: "100%",
        width: 60,
        // alignSelf: "center",
        // flex: 1,
        // width: "100%",

        backgroundColor: "red",
        // overflow: "hidden"
    }
})