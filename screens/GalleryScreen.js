import React, { Component } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    TextInput,
    FlatList,
    Modal,
    Button,
    ActivityIndicator,
    Dimensions,
    Slider
} from "react-native";

import { Container, Header, Content, Right, Left, Body, ListItem, List, Icon } from "native-base";
//library for creating grid layouts..
import { NavigationActions, StackNavigator } from "react-navigation";
import * as firebase from "firebase";
import menu from "../assets/images/menu.png";
import searchw from "../assets/images/searchw.png";
import sorte from "../assets/images/sort.png";
import searchback from "../assets/images/searchback.png";
import searchclear from "../assets/images/searchclear.png";

import { MonoText } from "../components/StyledText";
import ProTile from "../components/ProTile";

export default class GalleryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortmodalv: false,
            searchmodalv: false,
            products: [],
            orgproducts: [],
            isLoading: true,
            isEmpty: false,
            searchText: "",
            priceSlider: 1
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

    searchProducts = (p1) => () => {
        const data = this.state.orgproducts;
        var updated = [];
        updated = data.filter(function(product) {
            let s1 = product.name.toLowerCase();
            let s2 = p1.toLowerCase();
            if (s1 == s2) {
                return product;
            }
        });
        this.setState({ products: updated });
        //console.log("filtered data", updated);
    };

    priceFilter(f1) {
        const data = this.state.orgproducts;
        var update = [];
        update = data.filter((product) => product.price < f1);
        this.setState({ products: update });
    }

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
                        orgproducts: Object.values(data.val()),
                        isLoading: false
                        //console.log("datas", Object.values(data.val()));
                    });
                } else {
                    this.setState({ products: [], orgproducts: [], isEmpty: true });
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
                    <View style={{ height: height, backgroundColor: "#FAFAFA" }}>
                        <Text style={{ marginLeft: 20, marginTop: 50, fontSize: 20, color: "grey" }}>Filters</Text>
                        <Slider
                            style={{ marginTop: 50, height: 40, width: 300 }}
                            step={1}
                            minimumValue={10}
                            maximumValue={1000}
                            thumbTintColor="#0097A7"
                            minimumTrackTintColor="#0097A7"
                            value={this.state.priceSlider}
                            onValueChange={(val) => this.setState({ priceSlider: val })}
                            onSlidingComplete={(value) => this.priceFilter(value)}
                        />
                        <Text style={{ marginTop: 30, marginLeft: 20, color: "grey" }}>Price Below: {this.state.priceSlider}</Text>
                    </View>
                </Modal>

                <Modal
                    visible={this.state.searchmodalv}
                    transparent={true}
                    animationType={"fade"}
                    onRequestClose={this.searchModalState(false).bind()}
                    hardwareAccelerated={true}
                >
                    <Header style={{ backgroundColor: "white" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity onPress={this.searchModalState(false).bind()}>
                                <Image source={searchback} style={{ height: 25, width: 25 }} />
                            </TouchableOpacity>
                            <TextInput
                                placeholder="Search by product name"
                                value={this.state.searchText}
                                onChangeText={(searchText) => this.setState({ searchText })}
                                onSubmitEditing={this.searchProducts(this.state.searchText).bind()}
                                underlineColorAndroid="transparent"
                                style={{ marginLeft: 20, width: width / 1.5 }}
                            />
                            <TouchableOpacity onPress={(searchText) => this.setState({ searchText: "", products: this.state.orgproducts })}>
                                <Image source={searchclear} style={{ height: 25, width: 25 }} />
                            </TouchableOpacity>
                        </View>
                    </Header>
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
