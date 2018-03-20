import React from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, FlatList, Modal, ActivityIndicator, Button } from "react-native";

import { ListItem, List, Header, Picker, Footer, FooterTab } from "native-base";

import { NavigationActions } from "react-navigation";
import * as firebase from "firebase";
import navback from "../assets/images/navback.png";
import Home from "../screens/HomeScreen";

import { MonoText } from "../components/StyledText";
import CarTile from "../components/CarTile";

export default class CartScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addressmodalv: false,
            cartproducts: [],
            carttotal: "",
            isLoading: true,
            isEmpty: false
        };
    }
    static navigationOptions = {
        title: "Cart"
    };

    componentWillMount() {
        this.fetchCartData();
    }

    fetchCartData = () => {
        var update = [];
        var sum = 0;
        var user = firebase.auth().currentUser;
        var uid;
        if (user != null) {
            uid = user.uid;
        }
        firebase
            .database()
            //TODO:user1 is actually a dynamic key that need to be fetched from actual user.
            .ref("/carts")
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
                                if (dat.val() != undefined) {
                                    sum = sum + dat.val().price;
                                    var x = dat.val();
                                    update.push(x);
                                }
                            });
                    });
                    this.setState({ cartproducts: update, carttotal: sum, isLoading: false });
                } else {
                    this.setState({ cartproducts: [], isEmpty: true, isLoading: false });
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
        this.navigate(pageName, propsObject);
    };
    addressModalState = (val) => () => {
        this.setState({ addressmodalv: val });
    };

    //VIM:Function that listen for changes in child and update current state in parent.
    updateCartState(childItemValue, childItemPid) {
        var products = this.state.cartproducts;
        var updatedProducts = {};
        updatedProducts = products.map((product) => {
            if (product.pid == childItemPid) {
                product.quantity = childItemValue;
            }
            return product;
        });
        //console.log("updateProduct:", updatedProducts);
        this.setState({
            cartproducts: updatedProducts
        });

        this.cartTotal();
    }

    cartTotal() {
        //console.log("hai");
        var total = 0;
        var pdata = this.state.cartproducts;
        var upddata = {};
        upddata = pdata.map((product) => {
            if (product) {
                total = total + product.quantity * product.price;
            }
        });

        this.setState({ carttotal: total });
    }

    orderFromCart = () => () => {
        var upd = {};
        var cdata = this.state.cartproducts;

        //VIM TODO: use a random unique number generator to generate unique orderid.
        var rand1 = require("unique-random")(5001, 10000);
        var rand2 = require("unique-random")(500, 1000);
        var orderid = rand1() * rand2();
        var tot = this.state.carttotal;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        today = dd + "/" + mm + "/" + yyyy;
        //1st Data Structure to enter to orders/users/'user1'/order/'orderid' path.
        var orderentry1 = {
            oid: orderid,
            status: "Not Ready",
            total: tot,
            date: today
        };

        //Adding new entry to orders 1st data structure,'user1'(it will be dynamic) with custom key.
        var user = firebase.auth().currentUser;
        var uid;
        if (user != null) {
            uid = user.uid;
        }
        firebase
            .database()
            .ref("/orders/users")
            .child(uid)
            .child("order")
            .child(orderentry1.oid)
            .set(orderentry1, function(error) {
                if (error) {
                    alert(error);
                } else {
                    upd = cdata.map((product) => {
                        //2nd Data Structure to enter to orders/user_order_products/'user1'/'orderid'/'productid' path.
                        var orderentry2 = {
                            pid: product.pid,
                            quantity: product.quantity
                        };
                        if (product) {
                            firebase
                                .database()
                                .ref("/orders/user_order_products")
                                .child(uid)
                                .child(orderentry1.oid)
                                .child(orderentry2.pid)
                                .set(orderentry2, function(error) {
                                    if (error) {
                                        alert(error);
                                    }
                                });
                        }
                    });

                    //Success alert for order placement from cart.
                    alert("Order placed successfully");
                }
            });
    };

    render() {
        //console.log("updatedcartproductsstate:", this.state.cartproducts);
        this.navigate = this.props.navigation.navigate;
        const width = Dimensions.get("window").width;
        const height = Dimensions.get("window").height;
        const dataview = (
            <FlatList
                data={this.state.cartproducts}
                initialNumToRender={2}
                renderItem={({ item }) => (
                    <ListItem>
                        <CarTile
                            item={item}
                            updateCartState={this.updateCartState.bind(this)}
                            _handleTileNavigation={this._handleTileNavigation.bind(this)}
                            fetchCartData={this.fetchCartData.bind(this)}
                        />
                    </ListItem>
                )}
                keyExtractor={(item) => item.pid}
            />
        );
        const loader = <ActivityIndicator size="large" color="#0097A7" />;
        const empty = <Text style={{ marginHorizontal: width / 3.5, marginVertical: height / 4, fontSize: 16, color: "grey" }}>Your cart is empty</Text>;
        const networkerror = <Text>Check your internet connection</Text>;
        return (
            <View style={styles.container}>
                <Header style={styles.headeri}>
                    <TouchableOpacity onPress={this.navigateToScreen("Gallery")}>
                        <Image source={navback} style={{ height: 35, width: 35 }} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 60, color: "#FFF", fontSize: 16, fontWeight: "bold" }}>My Cart</Text>
                </Header>

                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {this.state.isLoading ? loader : dataview}
                    {this.state.isEmpty ? empty : null}
                </ScrollView>

                <Footer style={{ height: 50, borderTopWidth: 0.5, borderTopColor: "#0097A7" }}>
                    <FooterTab style={{ backgroundColor: "#FFF", borderRightWidth: 0.5, borderRightColor: "#0097A7" }}>
                        <TouchableOpacity>
                            <Text style={{ alignSelf: "center", marginVertical: 10, marginHorizontal: 20, color: "#17B7C7", fontSize: 20, fontWeight: "bold" }}>
                                Rs. {this.state.carttotal}
                            </Text>
                        </TouchableOpacity>
                    </FooterTab>
                    <FooterTab style={{ backgroundColor: "#FFF" }}>
                        <TouchableOpacity onPress={this.orderFromCart().bind()}>
                            <Text style={{ alignSelf: "center", marginVertical: 10, marginHorizontal: 20, color: "#17B7C7", fontSize: 20, fontWeight: "bold" }}>
                                ORDER NOW
                            </Text>
                        </TouchableOpacity>
                    </FooterTab>
                </Footer>

                <Modal
                    visible={this.state.addressmodalv}
                    animationType={"fade"}
                    onRequestClose={this.addressModalState(false).bind()}
                    transparent={true}
                    hardwareAccelerated={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.innerContainer}>
                            <Text>This is content inside of Address modal component</Text>
                            <Button onPress={this.addressModalState(false).bind()} title="Close modal" />
                        </View>
                    </View>
                </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "grey"
    },
    innerContainer: {
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
        //padding:10,
    }
});
