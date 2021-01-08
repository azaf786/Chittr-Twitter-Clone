// react-native unlink react-native-safe-area-co
import React, { Component } from 'react';
import {Text, View, Button, Image, StyleSheet, TouchableOpacity, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class HomeScreen extends Component{
    static navigationOptions = {
        header: null
    };

    logout= async () => {
        let token = await AsyncStorage.getItem('token');
        console.log(token);
        return fetch('http://10.0.2.2:3333/api/v0.0.5/logout',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'X-Authorization' : token
            }
        })
            .then((response) => {
                AsyncStorage.removeItem(token);
                alert('Logout successful.');
                console.log(response);
                this.props.navigation.navigate('Home')
            })
            .catch((error) => {
                console.error(error);
            });
    };


    render(){
        return(
            <View>
                <Image source={require('../images/chittr1.png')} />
                <View style={styles.mainContainer}>
                    <Icon name="heart" color="#0072ff" size={30} />
                    <Text style={styles.interestText}>Follow your interests.</Text>
                </View>
                <View style={styles.mainContainer}>
                    <Icon name="users" color="#41be95" size={30} />
                    <Text style={styles.interestText}>Hear what people are talking about.</Text>
                </View>
                <View style={styles.mainContainer}>
                    <Icon name="comments" color="#ff007d" size={30} />
                    <Text style={styles.interestText}>Join the conversation.</Text>
                </View>

                <View style={styles.bottomContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Tweet')}>
                        <View style = { styles.buttons}>
                            <Text style = {{color: 'white'}}>Wanna tweet?</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomButton}>
                    <TouchableOpacity onPress={this.logout}>
                        <View style = { styles.logOutButton}>
                            <Text style = {{color: 'white'}}>Log out</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingLeft: 20
    },

    bottomContainer: {
        padding: 100,
        flexDirection: 'row',
        justifyContent: 'center',
    },

    interestText: {
        fontSize: 20,
        paddingLeft: 10,
        color: '#33CCFF',
    },

    text: {
        borderWidth: 1,
        padding: 25,
        borderColor: 'black',
        backgroundColor: 'red'
    },

    buttons: {
        backgroundColor: '#33CCFF',
        alignItems: 'center',
        borderRadius: 5,
        padding: 30,
        width: 150,
        borderColor: 'white',
        borderWidth: 5
    },

    logOutButton: {
        backgroundColor: '#33CCFF',
        alignItems: 'center',
        borderRadius: 5,
        padding: 30,
        width: 150,
        borderColor: 'white',
        borderWidth: 5
    },

    bottomButton: {
        position: 'absolute',
        bottom:0,
        width: '100%',
        flex: 1,
        alignItems: 'center'
    }
});

export default HomeScreen;

