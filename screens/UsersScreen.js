import React from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, Dimensions, View } from "react-native";
import { Container, Header, Content, Form, Item, Input, Label, Icon, Button } from "native-base";

import { NavigationActions } from "react-navigation";
import navback from "../assets/images/navback.png";
import options from "../assets/images/options.png";

export default class UsersScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            phone: "",
            address: ""
        };
    }
    static navigationOptions = {
        title: "Users"
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
            return firebase
                .database()
                .ref("/users")
                .child(uid)
                .on("value", (data) => {
                    if (data.val() != undefined) {
                        this.setState({
                            name: data.val().name,
                            phone: data.val().phone,
                            email: data.val().email,
                            address: data.val().address
                        });
                    } else {
                        this.setState({
                            email: user.email
                        });
                    }
                });
        }
    }

    updateUserData = () => () => {
        var user = firebase.auth().currentUser;
        var uid;
        if (user != null) {
            uid = user.uid;
        }
        var userinfo = {
            uid: uid,
            name: this.state.name,
            phone: this.state.phone,
            email: this.state.email,
            address: this.state.address
        };
        return firebase
            .database()
            .ref("/users")
            .child(uid)
            .set(userinfo, function(error) {
                if (error) {
                    alert(error);
                } else {
                    alert("Details Updated successfully");
                }
            });
    };
    render() {
        const width = Dimensions.get("window").width;
        return (
            <Container>
                <Header style={styles.headeri}>
                    <TouchableOpacity onPress={this.navigateToScreen("Gallery")}>
                        <Image source={navback} style={{ height: 35, width: 35 }} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: width / 5.5, color: "#FFF", fontSize: 16, fontWeight: "bold" }}>User Information</Text>
                    <TouchableOpacity>
                        <Image source={options} style={{ height: 35, width: 35 }} />
                    </TouchableOpacity>
                </Header>
                <Content>
                    <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                        <Item style={styles.inputstyle} stackedLabel>
                            <Label>Name</Label>
                            <Input autoCorrect={false} autoCapitalize="none" onChangeText={(name) => this.setState({ name })} value={this.state.name} />
                        </Item>
                        <Item style={styles.inputstyle} stackedLabel>
                            <Label>Email</Label>
                            <Input disabled value={this.state.email} />
                        </Item>
                        <Item style={styles.inputstyle} stackedLabel>
                            <Label>Mobile No</Label>
                            <Input autoCorrect={false} autoCapitalize="none" onChangeText={(phone) => this.setState({ phone })} value={this.state.phone} />
                        </Item>
                        <Item style={styles.inputstyle} stackedLabel>
                            <Label>Address</Label>
                            <Input
                                style={{ height: 100 }}
                                multiline={true}
                                numberOfLines={30}
                                autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={(address) => this.setState({ address })}
                                value={this.state.address}
                            />
                        </Item>
                        <Button
                            onPress={this.updateUserData().bind()}
                            style={{ marginTop: 30, marginLeft: 20, marginRight: 20, marginBottom: 20, backgroundColor: "#0097A7" }}
                            full
                            rounded
                            success
                        >
                            <Text style={{ color: "white" }}>Update</Text>
                        </Button>
                    </ScrollView>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
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
    inputstyle: {
        marginTop: 20,
        width: 250
    },
    contentContainer: {
        padding: 20,
        flex: 1,
        alignItems: "center",
        paddingTop: 30
    }
});
