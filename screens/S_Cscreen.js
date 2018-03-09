import React, { Component } from "react";
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, Text, FlatList } from "react-native";
import { Container, Header, Content, Body, ListItem, List, Icon, Footer, FooterTab } from "native-base";
import { NavigationActions, StackNavigator } from "react-navigation";
import navback from "../assets/images/navback.png";
import BuynowTile from "../components/BuynowTile";

export default class S_Cscreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderproducts: []
        };
    }

    componentDidMount() {
        //->Recieving data sent from CartScreen and S_Gscreen(detailproductdisplay).

        this.setState({
            orderproducts: Object.values(this.props.navigation.state.params)
        });
    }
    /*
//TODO:Attemp to clear the data which sent from navigation.params when the component unmounts.
    componentWillUnmount() {
        console.log("cwm");
        this.props.navigation.setParams({ undefined });
        console.log("after", this.props.navigation.state.params);
    }
*/
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    orderNow = () => () => {
        //console.log("check", this.props.navigation.state.params);
        var buydata = Object.values(this.props.navigation.state.params);
        var productid = buydata[0].pid;

        //VIM TODO: use a random unique number generator to generate unique orderid.
        var orderid = "11" + productid;
        var tot = buydata[0].price;
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
        //2nd Data Structure to enter to orders/user_order_products/'user1'/'orderid'/'productid' path.
        var orderentry2 = {
            pid: productid,
            quantity: "1"
        };

        //Adding new entry to orders 1st data structure,'user1'(it will be dynamic) with custom key.
        firebase
            .database()
            .ref("/orders/users")
            .child("user1")
            .child("order")
            .child(orderentry1.oid)
            .set(orderentry1, function(error) {
                if (error) {
                    alert(error);
                } else {
                    firebase
                        .database()
                        .ref("/orders/user_order_products")
                        .child("user1")
                        .child(orderentry1.oid)
                        .child(orderentry2.pid)
                        .set(orderentry2, function(error) {
                            if (error) {
                                alert(error);
                            } else {
                                alert("Order placed successfully");
                            }
                        });
                }
            });
    };

    render() {
        return (
            <View style={styles.container}>
                <Header style={styles.headeri}>
                    <TouchableOpacity onPress={this.navigateToScreen("Gallery")}>
                        <Image source={navback} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 60, color: "#FFF", fontSize: 16, fontWeight: "bold" }}>Buy Now</Text>
                </Header>

                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={this.state.orderproducts}
                        renderItem={({ item }) => (
                            <ListItem>
                                <BuynowTile item={item} />
                            </ListItem>
                        )}
                        keyExtractor={(item) => item.pid}
                    />
                </ScrollView>

                <Footer style={{ height: 50, borderTopWidth: 0.5, borderTopColor: "#0097A7" }}>
                    <FooterTab style={{ backgroundColor: "#FFF", borderRightWidth: 0.5, borderRightColor: "#0097A7" }}>
                        <Text style={{ alignSelf: "center", marginVertical: 10, marginHorizontal: 20, color: "#17B7C7", fontSize: 20, fontWeight: "bold" }}>
                            Rs.
                        </Text>
                    </FooterTab>
                    <FooterTab style={{ backgroundColor: "#FFF" }}>
                        <TouchableOpacity onPress={this.orderNow().bind()}>
                            <Text style={{ alignSelf: "center", marginVertical: 10, marginHorizontal: 20, color: "#17B7C7", fontSize: 20, fontWeight: "bold" }}>
                                ORDER NOW
                            </Text>
                        </TouchableOpacity>
                    </FooterTab>
                </Footer>
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
