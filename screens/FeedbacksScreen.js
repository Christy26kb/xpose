import React from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, TextInput, FlatList } from "react-native";
import { Container, Header, Content, ListItem, List, Footer, FooterTab, Textarea, Button } from "native-base";

import { MonoText } from "../components/StyledText";

import { NavigationActions } from "react-navigation";
import navback from "../assets/images/navback.png";
import FeedbackTile from "../components/FeedbackTile";
import send from "../assets/images/send.png";

export default class FeedbacksScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            fproducts: []
        };
    }
    static navigationOptions = {
        title: "Feedbacks"
    };

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    submitFeedback = () => () => {
        msg = this.state.message;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        today = dd + "/" + mm + "/" + yyyy;
        //TODO:Use a id generator here.
        var rand1 = require("unique-random")(1, 100);
        var rand2 = require("unique-random")(101, 200);
        feedid = rand1() * rand2();
        //Adding new entry to wishlist of 'user1'(it will be dynamic) with finded custom key.
        var user = firebase.auth().currentUser;
        var uid;
        var feedbackentry = {
            id: feedid,
            message: msg,
            date: today
        };
        if (user != null) {
            uid = user.uid;
            firebase
                .database()
                .ref("/feedbacks")
                .child("users")
                .child(uid)
                .child(feedbackentry.id)
                .set(feedbackentry, function(error) {
                    if (error) {
                        alert(error);
                    }
                });
        }
    };
    componentWillMount() {
        //Adding new entry to feedbacks of 'user1'(it will be dynamic) with finded custom key.
        var user = firebase.auth().currentUser;
        var uid;
        if (user) {
            uid = user.uid;
            return firebase
                .database()
                .ref("/feedbacks")
                .child("users")
                .child(uid)
                .on("value", (data) => {
                    if (data.val() != undefined) {
                        this.setState({
                            fproducts: Object.values(data.val())
                        });
                    } else {
                        this.setState({ fproducts: [] });
                    }

                    //console.log("datas", Object.values(data.val()));
                });
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Header style={styles.headeri}>
                    <TouchableOpacity onPress={this.navigateToScreen("Gallery")}>
                        <Image source={navback} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 60, color: "#FFF", fontSize: 16, fontWeight: "bold" }}>Feedbacks</Text>
                </Header>
                <View style={{ flexDirection: "row" }}>
                    <Textarea
                        placeholder="Enter your valuable feedbacks"
                        style={{ marginTop: 20, marginHorizontal: 10, borderRadius: 20, width: 250, height: 60, backgroundColor: "#ECEFF1" }}
                        onChangeText={(message) => this.setState({ message })}
                    />
                    <TouchableOpacity onPress={this.submitFeedback().bind()}>
                        <Image source={send} style={{ marginTop: 20 }} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={this.state.fproducts}
                        initialNumToRender={1}
                        renderItem={({ item }) => <FeedbackTile item={item} />}
                        keyExtractor={(item) => item.id}
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
    contentContainer: {
        paddingTop: 20,
        alignItems: "center"
    }
});
