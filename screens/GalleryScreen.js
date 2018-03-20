import React, { Component } from "react";
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, Text, FlatList, Modal, Button, ActivityIndicator, Dimensions } from "react-native";

import { Container, Header, Content, Right, Left, Body, ListItem, List, Icon } from "native-base";
//library for creating grid layouts..
import { NavigationActions, StackNavigator } from "react-navigation";
import * as firebase from "firebase";
import menu from "../assets/images/menu.png";
import searchw from "../assets/images/searchw.png";
import sorte from "../assets/images/sort.png";

import { MonoText } from "../components/StyledText";
import ProTile from "../components/ProTile";

export default class GalleryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortmodalv: false,
            searchmodalv: false,
            products: [],
            isLoading: true,
            isEmpty: false
        };
    }

    sortModalState = (val) => () => {
        this.setState({ sortmodalv: val });
    };

    searchModalState = (val) => () => {
        this.setState({ searchmodalv: val });
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

    componentWillMount() {
        return firebase
            .database()
            .ref("/products/")
            .on("value", (data) => {
                /*data.forEach(function(Snapshot) {
                    var childkey = Snapshot.key;
                    console.log("productsvalue", childkey);
                    // ...
                });*/
                if (data.val() != undefined) {
                    this.setState({
                        products: Object.values(data.val()),
                        isLoading: false
                        //console.log("datas", Object.values(data.val()));
                    });
                } else {
                    this.setState({ products: [], isEmpty: true });
                }
            });
    }

    render() {
        this.navigate = this.props.navigation.navigate;
        const width = Dimensions.get("window").width;
        const height = Dimensions.get("window").height;
        const loader = <ActivityIndicator size="large" color="#0097A7" />;
        const dataview = (
            <FlatList
                data={this.state.products}
                horizontal={false}
                numColumns={2}
                initialNumToRender={1}
                renderItem={({ item }) => (
                    <ListItem>
                        <ProTile item={item} _handleTileNavigation={this._handleTileNavigation.bind(this)} />
                    </ListItem>
                )}
                keyExtractor={(item) => item.pid}
            />
        );
        const empty = <Text style={{ marginHorizontal: width / 3.5, marginVertical: height / 4, fontSize: 16, color: "grey" }}>No Products on Showcase!</Text>;
        const networkerror = <Text>Check your internet connection</Text>;

        return (
            <View style={styles.container}>
                <Header style={styles.headeri}>
                    <TouchableOpacity onPress={this.navigateToScreen("DrawerOpen")}>
                        <Image source={menu} style={{ height: 35, width: 35 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.searchModalState(true).bind()}>
                        <Image source={searchw} style={{ height: 35, width: 35, marginHorizontal: width / 4 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.sortModalState(true).bind()}>
                        <Image source={sorte} style={{ height: 35, width: 35 }} />
                    </TouchableOpacity>
                </Header>

                <Modal
                    visible={this.state.sortmodalv}
                    animationType={"fade"}
                    onRequestClose={this.sortModalState(false).bind()}
                    transparent={true}
                    hardwareAccelerated={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.innerContainer}>
                            <Text>This is content inside of Sort modal component</Text>
                            <Button onPress={this.sortModalState(false).bind()} title="Close modal" />
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={this.state.searchmodalv}
                    animationType={"fade"}
                    onRequestClose={this.searchModalState(false).bind()}
                    transparent={true}
                    hardwareAccelerated={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.innerContainer}>
                            <Text>This is content inside of Search modal component</Text>
                            <Button onPress={this.searchModalState(false).bind()} title="Close modal" />
                        </View>
                    </View>
                </Modal>

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
        //make it to the specific element which need to be positioned.
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
    },
    getStartedContainer: {
        alignItems: "center",
        marginHorizontal: 10
    },
    homeScreenFilename: {
        marginVertical: 7
    },
    codeHighlightText: {
        color: "rgba(96,100,109, 0.8)"
    },
    codeHighlightContainer: {
        backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: 3,
        paddingHorizontal: 4
    },
    getStartedText: {
        fontSize: 17,
        color: "rgba(96,100,109, 1)",
        lineHeight: 24,
        textAlign: "center"
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
    },
    tabBarInfoText: {
        fontSize: 17,
        color: "rgba(96,100,109, 1)",
        textAlign: "center"
    },
    navigationFilename: {
        marginTop: 5
    },
    helpContainer: {
        marginTop: 15,
        alignItems: "center"
    },
    helpLink: {
        paddingVertical: 15
    },
    helpLinkText: {
        fontSize: 14,
        color: "#2e78b7"
    }
});
