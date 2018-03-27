import React, { Component } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, TouchableNativeFeedback, AsyncStorage } from "react-native";
import { WebBrowser } from "expo";
import { Container, Header, Content, Form, Item, Input, Label, Icon, Button, Toast, Root } from "native-base";

import { TabNavigator, NavigationActions } from "react-navigation";
import { MonoText } from "../components/StyledText";
import Home from "../screens/HomeScreen";

export default class UserauthScreen extends React.Component {
    render() {
        //...Realtime state observer for user login(In/Out)..set asyncsorage accordingly..invokes when state changes.
        var user = firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                alert("Signed in!");
            } else {
                // No user is signed in.
                alert("Signed out!");
            }
        });
        return <LStabnav />;
    }
}

//here begins the actual login page model..
class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    signInuser = (email, password) => () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(function(error) {
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

    signoutuser = () => () => {
        firebase
            .auth()
            .signOut()
            .then(function() {
                // Sign-out successful.
                alert("Signed out");
            })
            .catch(function(error) {
                // An error happened.
                alert(error);
            });
    };

    render() {
        return (
            <Container style={{ padding: 20 }}>
                <Content style={{ backgroundColor: "white", marginVertical: 30 }}>
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
                            <Text style={{ color: "white" }}>Sign in</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }
}

class SignupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    signUpuser = (email, password) => () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            alert("Enter a valid email address!");
            return;
        }
        if (password.length < 6) {
            alert("Please enter a password with atleat 6 chars");
            return;
        }

        //......signup using Email and password.....
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(function(error) {
                // Handle Errors here.
                var errorcode = error.code;
                var errorMessage = error.message;
                if (errorcode == "auth/email-already-in-use") {
                    alert("This email address is already in use");
                } else if (errorcode == "auth/weak-password") {
                    alert("The password is too weak.");
                } else if (errorcode == "auth/invalid-email") {
                    alert("Invalid Email ID");
                } else {
                    alert(errorMessage);
                }
            });
    };

    render() {
        return (
            <Container style={{ padding: 20 }}>
                <Content style={{ backgroundColor: "white", marginVertical: 30 }}>
                    <Form>
                        <Item style={styles.space} inlineLabel>
                            <Label>Email</Label>
                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={(email) => this.setState({ email })}
                                value={this.state.email}
                                clearTextOnFocus={true}
                            />
                        </Item>

                        <Item style={styles.space} inlineLabel>
                            <Label>Password</Label>
                            <Input
                                secureTextEntry={true}
                                autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={(password) => this.setState({ password })}
                                value={this.state.password}
                                clearTextOnFocus={true}
                            />
                        </Item>

                        <Button
                            onPress={this.signUpuser(this.state.email, this.state.password)}
                            style={{ marginTop: 50, marginLeft: 20, marginRight: 20, backgroundColor: "#0097A7" }}
                            full
                            rounded
                            success
                        >
                            <Text style={{ color: "white" }}>Sign Up</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }
}

const LStabnav = TabNavigator(
    {
        Login: {
            screen: LoginScreen
        },

        Signup: {
            screen: SignupScreen
        }
    },
    {
        tabBarPosition: "bottom",
        animationEnabled: true,
        tabBarOptions: {
            style: {
                backgroundColor: "#0097A7"
            },
            indicatorStyle: {
                backgroundColor: "#ffffff"
            }
        }
    }
);

const styles = StyleSheet.create({
    space: {
        marginTop: 20
    },
    toas: {
        marginTop: 25
    }
});
