import React from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";

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
            wproducts: []
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
        console.log("recieve");
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
                data.forEach(function(Snapshot) {
                    var c = Snapshot.key;
                    firebase
                        .database()
                        .ref("/products/" + c)
                        .on("value", (dat) => {
                            var x = dat.val();
                            update.push(x);
                            //console.log("productsvalue", update);
                            //this.state.wproducts.push(dat.val());
                            /*if (update != undefined) {
                                    this.setState({ wproducts: update });
                                } else {
                                    this.setState({ wproducts: [] });
                                }*/
                        });
                });
                this.setState({ wproducts: update });
            });
    };

    //TODO:Need attention for updation of data in state from child.
    /*updateWishlistState(ProductPid) {
        console.log("childItemPid", ProductPid);
        var products = this.state.wproducts;
        var updatedProducts = products.filter(function(el) {
            return el.pid !== ProductPid;
        });

        console.log("updateWishlist:", updatedProducts);
        /*this.setState({
            wproducts: updatedProducts
        });}*/

    render() {
        this.navigate = this.props.navigation.navigate;
        //console.log("state", this.state.wproducts);
        return (
            <View style={styles.container}>
                <Header style={styles.headeri}>
                    <TouchableOpacity onPress={this.navigateToScreen("Gallery")}>
                        <Image source={navback} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 60, color: "#FFF", fontSize: 16, fontWeight: "bold" }}>My Wishlist</Text>
                </Header>

                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
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
