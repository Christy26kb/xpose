import React from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import { Container, Header, Content, ListItem, List, Footer, FooterTab } from "native-base";

import { MonoText } from "../components/StyledText";

import { NavigationActions } from "react-navigation";
import navback from "../assets/images/navback.png";
import FeedbackTile from "../components/FeedbackTile";

export default class FeedbacksScreen extends React.Component {
    static navigationOptions = {
        title: "Feedbacks"
    };

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    render() {
        return (
            <View style={styles.container}>
                <Header style={styles.headeri}>
                    <TouchableOpacity onPress={this.navigateToScreen("Gallery")}>
                        <Image source={navback} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 60, color: "#FFF", fontSize: 16, fontWeight: "bold" }}>Feedbacks</Text>
                </Header>

                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <FeedbackTile />
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
