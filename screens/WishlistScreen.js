import React from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Dimensions, View, FlatList } from "react-native";

import { ListItem, List, Header } from "native-base";

import { NavigationActions, StackNavigator } from "react-navigation";
import navback from "../assets/images/navback.png";
import Home from "../screens/HomeScreen";

import { MonoText } from "../components/StyledText";
import WishTile from "../components/WishTile";

export default class WishlistScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wproducts: [],
            isLoading: true,
            isEmpty: false
        };
    }
    static navigationOptions = {
        title: "Wishlist"
    };

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    _handleTileNavigation = (pageName, propsObject) => {
        this.navigate(pageName, propsObject);
    };

    //VIM:ATTENTION: How to listen to the data live when deletion occurs.
    componentWillMount() {
        this.fetchWishlistData();
    }

    fetchWishlistData = () => {
        var update = [];
        var user = firebase.auth().currentUser;
        var uid;
        if (user != null) {
            uid = user.uid;
        }
        firebase
            .database()
            //user1 is actually a dynamic key that need to be fetched from actual user.
            .ref("/wishlists")
            .child(uid)
            .on("value", (data) => {
                //Logic for iterate data from 1st level before 2nd level process.
                if (data.val() != undefined) {
                    data.forEach(function(Snapshot) {
                        var c = Snapshot.key;
                        firebase
                            .database()
                            .ref("/products/" + c)
                            .on("value", (dat) => {
                                var x = dat.val();
                                update.push(x);
                            });
                    });

                    this.setState({ wproducts: update, isLoading: false });
                } else {
                    this.setState({ wproducts: [], isEmpty: true, isLoading: false });
                }
            });
    };

    render() {
        this.navigate = this.props.navigation.navigate;
        //console.log("empty check", Object.values(this.state.wproducts[0]));
        const width = Dimensions.get("window").width;
        const height = Dimensions.get("window").height;
        const dataview = (
            <FlatList
                data={this.state.wproducts}
                initialNumToRender={2}
                renderItem={({ item }) => (
                    <ListItem>
                        <WishTile
                            item={item}
                            _handleTileNavigation={this._handleTileNavigation.bind(this)}
                            fetchWishlistData={this.fetchWishlistData.bind(this)}
                        />
                    </ListItem>
                )}
                keyExtractor={(item) => item.pid}
            />
        );
        const loader = <ActivityIndicator size="large" color="#0097A7" />;
        const empty = <Text style={{ marginHorizontal: width / 4, marginVertical: height / 3.5, fontSize: 16, color: "grey" }}>Your wishlist is empty</Text>;
        const networkerror = <Text>Check your internet connection</Text>;
        return (
            <View style={styles.container}>
                <Header style={styles.headeri}>
                    <TouchableOpacity onPress={this.navigateToScreen("Gallery")}>
                        <Image source={navback} style={{ height: 35, width: 35 }} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 60, color: "#FFF", fontSize: 16, fontWeight: "bold" }}>My Wishlist</Text>
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
    developmentModeText: {
        marginBottom: 20,
        color: "rgba(0,0,0,0.4)",
        fontSize: 14,
        lineHeight: 19,
        textAlign: "center"
    },
    contentContainer: {
        paddingTop: 20
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
