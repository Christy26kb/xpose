import React, { Component } from "react";
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, View, Text, FlatList } from "react-native";

import { Container, Header, Content, Body, ListItem, List, Icon } from "native-base";
import { NavigationActions, StackNavigator } from "react-navigation";
import navback from "../assets/images/navback.png";
import DetailOrderTile from "../components/DetailOrderTile";

export default class S_Oscreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentorderdata: [],
            isLoading: true
        };
    }

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    _handleTileNavigation = (pageName, propsObject) => {
        this.navigate(pageName, propsObject);
    };

    componentDidMount() {
        var ord = this.props.navigation.state.params;
        //TODO:'User1' will be a dynamic key obtained from user.
        var user = firebase.auth().currentUser;
        var uid;
        if (user != null) {
            uid = user.uid;
        }
        return firebase
            .database()
            .ref("/orders/user_order_products")
            .child(uid)
            .child(ord.oid)
            .on("child_added", (data) => {
                firebase
                    .database()
                    .ref("/products/" + data.key)
                    .on("value", (dat) => {
                        this.state.currentorderdata.push(dat.val());
                        this.setState({ currentorderdata: this.state.currentorderdata, isLoading: false });
                    });
            });
    }

    render() {
        //->Recieving data sent from OrdersScreen.
        const r_data = this.props.navigation.state.params;
        this.navigate = this.props.navigation.navigate;
        const dataview = (
            <FlatList
                data={this.state.currentorderdata}
                initialNumToRender={2}
                renderItem={({ item }) => (
                    <ListItem>
                        <DetailOrderTile item={item} _handleTileNavigation={this._handleTileNavigation.bind(this)} />
                    </ListItem>
                )}
                keyExtractor={(item) => item.pid}
            />
        );
        const loader = <ActivityIndicator size="large" color="#0097A7" />;
        return (
            <View style={styles.container}>
                <Header style={styles.headeri}>
                    <TouchableOpacity onPress={this.navigateToScreen("Orders")}>
                        <Image source={navback} style={{ height: 35, width: 35 }} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 60, color: "#FFF", fontSize: 16, fontWeight: "bold" }}>Orderid/{r_data.oid}</Text>
                </Header>

                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {this.state.isLoading ? loader : dataview}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headeri: {
        backgroundColor: "#0097A7",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    developmentModeText: {
        marginBottom: 20,
        color: "rgba(0,0,0,0.4)",
        fontSize: 14,
        lineHeight: 19,
        textAlign: "center"
    },
    contentContainer: {
        paddingTop: 20,
        alignItems: "center"
    },
    welcomeContainer: {
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: "contain",
        marginTop: 3,
        marginLeft: -10
    }
});
