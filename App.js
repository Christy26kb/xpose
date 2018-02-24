import React from "react";
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from "react-native";
import { AppLoading, Asset, Font } from "expo";
import { Ionicons } from "@expo/vector-icons";
import RootNavigation from "./navigation/RootNavigation";
import UserauthScreen from "./screens/UserauthScreen";
import { TabNavigator, NavigationActions } from "react-navigation";

import * as firebase from "firebase";
//..Setting the necessary firebase config options
const firebaseconfig = {
    apiKey: "AIzaSyAiy6NBxiH3UebfQwAu0e2TJOrqCIYkSjk",
    authDomain: "xpose-8e518.firebaseapp.com",
    databaseURL: "https://xpose-8e518.firebaseio.com",
    projectId: "xpose-8e518",
    storageBucket: "xpose-8e518.appspot.com"
};

//..Initializing firebase with the config...
firebase.initializeApp(firebaseconfig);

export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
        login: false
    };

    //TODO:Use componentDidMount or other lifecycle method to solve login state problem,read from async storage there.

    render() {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return <AppLoading startAsync={this._loadResourcesAsync} onError={this._handleLoadingError} onFinish={this._handleFinishLoading} />;
        } else {
            if (this.state.login) {
                return <UserauthScreen />;
            } else {
                return (
                    <View style={styles.container}>
                        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                        {Platform.OS === "android" && <View style={styles.statusBarUnderlay} />}
                        <RootNavigation />
                    </View>
                );
            }
        }
    }

    _loadResourcesAsync = async () => {
        return Promise.all([
            Asset.loadAsync([
                require("./assets/images/gallery.png"),
                require("./assets/images/search.png"),
                require("./assets/images/search2.png"),
                require("./assets/images/cart.png"),
                require("./assets/images/users.png"),
                require("./assets/images/orders.png"),
                require("./assets/images/menu.png"),
                require("./assets/images/navback.png"),
                require("./assets/images/searchw.png"),
                require("./assets/images/movbag.png"),
                require("./assets/images/movcart.png"),
                require("./assets/images/rmv.png"),
                require("./assets/images/sort.png")
            ]),
            Expo.Font.loadAsync({
                // Fonts can be loaded here
                Roboto: require("native-base/Fonts/Roboto.ttf"),
                Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
                Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
            })

            //.. Load data from asynstorage  for the  login state:{true/false}..
        ]);
    };

    _handleLoadingError = error => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
    };

    _handleFinishLoading = () => {
        //..set the login state according to asyncstorage....

        this.setState({ isLoadingComplete: true });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    statusBarUnderlay: {
        height: 24,
        backgroundColor: "rgba(0,0,0,0.2)"
    }
});
