import PropTypes from "prop-types";
import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import { List, ListItem } from "native-base";

export default class SideBar extends Component {
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <TouchableOpacity onPress={this.navigateToScreen("Users")}>
                            <Image
                                source={{ uri: "https://t4.ftcdn.net/jpg/01/16/06/45/240_F_116064582_KlXENacGmdt4xl8H6fQRYfSZLntLNKSX.jpg" }}
                                style={{ width: 150, height: 150, marginHorizontal: 40 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <List>
                        <View style={styles.navSectionStyle}>
                            <ListItem style={styles.listitemi} onPress={this.navigateToScreen("Gallery")}>
                                <Text style={styles.navItemStyle}>Gallery</Text>
                            </ListItem>
                            <ListItem style={styles.listitemi} onPress={this.navigateToScreen("Wishlist")}>
                                <Text style={styles.navItemStyle}>Wishlist</Text>
                            </ListItem>
                            <ListItem style={styles.listitemi} onPress={this.navigateToScreen("Cart")}>
                                <Text style={styles.navItemStyle}>Cart</Text>
                            </ListItem>
                            <ListItem style={styles.listitemi} onPress={this.navigateToScreen("Orders")}>
                                <Text style={styles.navItemStyle}>Orders</Text>
                            </ListItem>
                            <ListItem style={styles.listitemi} onPress={this.navigateToScreen("Feedbacks")}>
                                <Text style={styles.navItemStyle}>Feedbacks</Text>
                            </ListItem>
                        </View>
                    </List>
                </ScrollView>
            </View>
        );
    }
}

SideBar.propTypes = {
    navigation: PropTypes.object
};

const styles = {
    container: {
        paddingTop: 20,
        flex: 1
    },
    listitemi: {
        borderBottomLeftRadius: 20
    },
    navItemStyle: {
        padding: 2,
        marginHorizontal: 20
    },
    navSectionStyle: {
        backgroundColor: "white"
    },
    sectionHeadingStyle: {
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    footerContainer: {
        padding: 20,
        backgroundColor: "lightgrey"
    }
};
