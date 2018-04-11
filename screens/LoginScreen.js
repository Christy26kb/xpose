import React, { Component } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, TouchableNativeFeedback, AsyncStorage } from "react-native";
import { Container, Header, Content, Form, Item, Input, Label, Icon, Button, Toast, Root } from "native-base";
import { NavigationActions } from "react-navigation";
//here begins the actual login page model..
export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this._initializeAuth();
        this.state = {
            email: "",
            password: ""
        };
    }

    _initializeAuth = async () => {
        await firebase.auth().onAuthStateChanged((user) => {
            if (user == null) {
                // TODO: start sign-in flow
            } else {
                // TODO: start actual work
                alert("Signed on");
                this._signInAsync();
            }
        });
    };

    signInuser = (email, password) => () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(function (error) {
                // Handle Errors here.
                var errorcode = error.code;
                var errorMessage = error.message;
                if (errorcode == "auth/invalid-email") {
                    alert("Inavlid email entered!");
                } else if (errorcode == "auth/wrong-password") {
                    alert("Wrong password!");
                } else if (errorcode == "auth/user-not-found") {
                    alert("No users found for this email address");
                } else if (errorcode == "auth/user-disabled") {
                    alert("User is disabled for this email address");
                } else {
                    alert(errorMessage);
                }
            });

    };

    _signInAsync = async () => {
        await AsyncStorage.setItem("userToken", "true");
        this.props.navigation.navigate("Gallery");
    };

    render() {
        return (
            <Container style={{ padding: 20 }}>
                <Content style={{ backgroundColor: "white", marginVertical: 30 }}>
                    <Text style={{ color: "grey", fontSize: 20, marginVertical: 5 }}>Login</Text>
                    <Form>
                        <Item style={styles.space} inlineLabel>
                            <Label>Email</Label>
                            <Input autoCorrect={false} autoCapitalize="none" onChangeText={(email) => this.setState({ email })} value={this.state.email} />
                        </Item>

                        <Item style={styles.space} inlineLabel>
                            <Label>Password</Label>
                            <Input
                                secureTextEntry={true}
                                autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={(password) => this.setState({ password })}
                                value={this.state.password}
                            />
                        </Item>

                        <Button
                            onPress={this.signInuser(this.state.email, this.state.password)}
                            style={{ marginTop: 50, marginLeft: 20, marginRight: 20, backgroundColor: "#0097A7" }}
                            full
                            rounded
                            success
                        >
                            <Text style={{ color: "white" }}>Login</Text>
                        </Button>

                        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 }}>
                            <Button
                                onPress={() => this.props.navigation.navigate("Signup")}
                                style={{ marginTop: 100, marginLeft: 20, marginRight: 20, backgroundColor: "white", width: 80, height: 30 }}
                                full
                                rounded
                                success
                            >
                                <Text style={{ color: "#0097A7" }}>Sign up</Text>
                            </Button>
                        </View>
                    </Form>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    space: {
        marginTop: 20
    },
    toas: {
        marginTop: 25
    }
});
