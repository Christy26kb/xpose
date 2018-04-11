import React, { Component } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, TouchableNativeFeedback, AsyncStorage } from "react-native";
import { Container, Header, Content, Form, Item, Input, Label, Icon, Button, Toast, Root } from "native-base";
import { NavigationActions } from "react-navigation";

export default class SignupScreen extends Component {
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
            .then(function (user) {
                alert("Signed up successfully");
            })
            .catch(function (error) {
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

    _signInAsync = async () => {
        await AsyncStorage.setItem("userToken", "true");
        console.log("From Signup");
        this.props.navigation.navigate("Users");
    };

    render() {
        return (
            <Container style={{ padding: 20 }}>
                <Content style={{ backgroundColor: "white", marginVertical: 30 }}>
                    <Text style={{ color: "grey", fontSize: 20, marginVertical: 5 }}>Sign Up</Text>
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

const styles = StyleSheet.create({
    space: {
        marginTop: 20
    },
    toas: {
        marginTop: 25
    }
});
