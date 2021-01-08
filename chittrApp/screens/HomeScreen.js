// react-native unlink react-native-safe-area-co
import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

class HomeScreen extends Component{

 render(){
 return(

    <View>
        <Image source={require('../images/chittr1.png')} />
        <View style={styles.topContainer}>
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
        </View>


        <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('UnauthorisedChits')}>
                <View style = { styles.buttons}>
                    <Text style = {{color: 'white'}}>View Chits</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                <View style = { styles.buttons}>
                    <Text style = {{color: 'white'}}>Register</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                <View style = { styles.buttons}>
                <Text style = {{color: 'white'}}>Login</Text>
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
       paddingLeft: 20,
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

    topContainer: {
       justifyContent: 'center'
    },

    buttons: {
        backgroundColor: '#33CCFF',
        alignItems: 'center',
        borderRadius: 5,
        padding: 25,
        width: 130,
        borderColor: 'white',
        borderWidth: 5
    }
});

export default HomeScreen;
