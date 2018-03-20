import React from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, Dimensions, ActivityIndicator, View, FlatList } from "react-native";
import { Container, Header, Content, Right, Left, Body, ListItem, List } from "native-base";

import { NavigationActions } from "react-navigation";
import navback from "../assets/images/navback.png";
import { MonoText } from "../components/StyledText";
import OrdTile from "../components/OrdTile";

export default class OrdersScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersdat: [],
            isLoading: true,
            isEmpty: false
        };
    }
    static navigationOptions = {
        title: "Orders"
    };

    _handleTileNavigation = (pageName, propsObject) => {
        this.navigate(pageName, propsObject);
    };

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };
    componentWillMount() {
        //TODO:'User1' will be a dynamic key obtained from user.
        var user = firebase.auth().currentUser;
        var uid;
        if (user != null) {
            uid = user.uid;
        }
        return firebase
            .database()
            .ref("/orders")
            .child("users")
            .child(uid)
            .child("order")
            .on("value", (data) => {
                if (data.val() != undefined) {
                    this.setState({
                        ordersdat: Object.values(data.val()),
                        isLoading: false
                    });
                } else {
                    this.setState({ ordersdat: [], isEmpty: true, isLoading: false });
                }
            });
    }

    render() {
        this.navigate = this.props.navigation.navigate;
        const width = Dimensions.get("window").width;
        const height = Dimensions.get("window").height;
        const dataview = (
            <FlatList
                data={this.state.ordersdat}
                initialNumToRender={2}
                renderItem={({ item }) => (
                    <ListItem>
                        <OrdTile item={item} _handleTileNavigation={this._handleTileNavigation.bind(this)} />
                    </ListItem>
                )}
                keyExtractor={(item) => item.oid}
            />
        );
        const loader = <ActivityIndicator size="large" color="#0097A7" />;
        const empty = <Text style={{ marginHorizontal: width / 4, marginVertical: height / 4, fontSize: 16, color: "grey" }}>Currently no orders!</Text>;
        const networkerror = <Text>Check your internet connection</Text>;
        return (
            <View style={styles.container}>
                <Header style={styles.headeri}>
                    <TouchableOpacity onPress={this.navigateToScreen("Gallery")}>
                        <Image source={navback} style={{ height: 35, width: 35 }} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 60, color: "#FFF", fontSize: 16, fontWeight: "bold" }}>My Orders</Text>
                </Header>

                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {this.state.isLoading ? loader : dataview}
                    {this.state.isEmpty ? empty : null}
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
    contentContainer: {
        paddingTop: 20,
        alignItems: "center"
    },
    welcomeContainer: {
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20
    },

    tabBarInfoContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: "black",
                shadowOffset: { height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3
            },
            android: {
                elevation: 20
            }
        }),
        alignItems: "center",
        backgroundColor: "#fbfbfb",
        paddingVertical: 20
    }
});
