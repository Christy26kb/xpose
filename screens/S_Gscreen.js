import React, { Component } from "react";
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, Text, FlatList, Picker } from "react-native";

import { Container, Header, Footer, FooterTab, Content, Body, ListItem, List, Icon, H3, H1, H2 } from "native-base";

import { NavigationActions, StackNavigator } from "react-navigation";
import navback from "../assets/images/navback.png";
import movcart from "../assets/images/movcart.png";
import movbag from "../assets/images/movbag.png";

export default class S_Gscreen extends Component {
    constructor(props) {
        super(props);
        this.state = { quantity: "1" };
    }

    addToWishlist = () => () => {
        //console.log("check", this.props.navigation.state.params);
        var productid = this.props.navigation.state.params.pid;
        var wishlistentry = {
            pid: productid
        };
        //Adding new entry to wishlist of 'user1'(it will be dynamic) with finded custom key.
        var user = firebase.auth().currentUser;
        var uid;
        if (user != null) {
            uid = user.uid;
        }
        firebase
            .database()
            .ref("/wishlists")
            .child(uid)
            .child(wishlistentry.pid)
            .set(wishlistentry, function(error) {
                if (error) {
                    alert(error);
                } else {
                    alert("Added to wishlist successfully");
                }
            });
    };

    addToCart = () => () => {
        //console.log("check", this.props.navigation.state.params);
        var productid = this.props.navigation.state.params.pid;
        var qua = this.state.quantity;
        var cartentry = {
            pid: productid,
            quantity: qua
        };
        //Adding new entry to carts of 'user1'(it will be dynamic) with finded custom key.
        var user = firebase.auth().currentUser;
        var uid;
        if (user != null) {
            uid = user.uid;
        }
        firebase
            .database()
            .ref("/carts")
            .child(uid)
            .child(cartentry.pid)
            .set(cartentry, function(error) {
                if (error) {
                    alert(error);
                } else {
                    alert("Added to Cart successfully");
                }
            });
    };

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    _handleTileNavigation = (pageName, propsObject) => {
        //Adding corresponding quantity selected by user to sending data to (S_Cscreen) or Buynow.
        propsObject.quantity = this.state.quantity;
        //Structuring the data to the corresponding design over S_Cscreen.
        const preparedparam = {
            propsObject
        };
        this.navigate(pageName, preparedparam);
    };

    //TODO:Replace image in view with image slider component.

    render() {
        this.navigate = this.props.navigation.navigate;
        //Recieving selected product data from GalleryScreen.
        const productdata = this.props.navigation.state.params;

        return (
            <Container>
                <Header style={styles.headeri}>
                    <TouchableOpacity onPress={this.navigateToScreen("Gallery")}>
                        <Image source={navback} style={{ height: 35, width: 35 }} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 60, color: "#FFF", fontSize: 16, fontWeight: "bold" }}>Product Details</Text>
                </Header>

                <ScrollView contentContainerStyle={styles.baseContainer}>
                    <View style={{ flex: 2 }}>
                        <Image source={{ uri: productdata.imguri }} style={{ width: 300, height: 223, resizeMode: "contain" }} />
                    </View>

                    <View style={{ flexWrap: "nowrap", padding: 20, borderBottomWidth: 0.8, borderBottomColor: "grey" }}>
                        <H3 style={{ marginTop: 15, color: "grey" }}>{productdata.name}</H3>
                        <H3 style={{ marginTop: 15, color: "grey" }}>Rs. {productdata.price.toString()}</H3>
                        <H3 style={{ marginTop: 15, color: "grey" }}>{productdata.instock ? "Available" : "Out of stock"}</H3>
                        <View style={{ flexDirection: "row", marginTop: 15 }}>
                            <H3 style={{ color: "grey" }}>Qty:</H3>
                            <Picker
                                style={{ width: 40, height: 25, backgroundColor: "#EFF1F2", marginLeft: 20 }}
                                mode="dropdown"
                                itemStyle={{ backgroundColor: "grey", height: 10, width: 20 }}
                                selectedValue={this.state.quantity}
                                onValueChange={(itemValue, itemIndex) => this.setState({ quantity: itemValue })}
                            >
                                <Picker.Item label="1" value="1" />
                                <Picker.Item label="2" value="2" />
                                <Picker.Item label="3" value="3" />
                                <Picker.Item label="4" value="4" />
                                <Picker.Item label="5" value="5" />
                            </Picker>
                        </View>
                    </View>

                    <View style={{ padding: 2, marginLeft: 15 }}>
                        <H3 style={{ marginTop: 10, color: "grey" }}>Description</H3>
                        <Text style={{ marginTop: 10, color: "grey", fontSize: 14 }}>{productdata.description}</Text>
                    </View>
                </ScrollView>

                <Footer style={{ height: 50, borderTopWidth: 0.5, borderTopColor: "#0097A7" }}>
                    <FooterTab style={{ backgroundColor: "#FFF", borderRightWidth: 0.5, borderRightColor: "#0097A7" }}>
                        <TouchableOpacity onPress={this._handleTileNavigation.bind(null, "S_Cscreen", productdata)}>
                            <Text
                                style={{
                                    textAlign: "center",
                                    marginVertical: 10,
                                    marginHorizontal: 30,
                                    color: "#17B7C7",
                                    fontSize: 20,
                                    fontWeight: "bold"
                                }}
                            >
                                BUY NOW
                            </Text>
                        </TouchableOpacity>
                    </FooterTab>
                    <FooterTab style={{ backgroundColor: "#FFF" }}>
                        <TouchableOpacity onPress={this.addToCart().bind()}>
                            <Image style={{ marginLeft: 15 }} source={movcart} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.addToWishlist().bind()}>
                            <Image style={{ marginRight: 15 }} source={movbag} />
                        </TouchableOpacity>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    headeri: {
        backgroundColor: "#0097A7",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    baseContainer: {
        padding: 20,
        flexDirection: "column"
    }
});
