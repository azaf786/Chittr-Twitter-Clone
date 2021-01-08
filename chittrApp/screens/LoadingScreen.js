
import React, { Component } from 'react';
import {View, AsyncStorage, ActivityIndicator} from 'react-native';
import {NavigationEvents} from 'react-navigation';

class HomeScreen extends Component{
    constructor() {
        super();
        this.viewToken();
    }
    static navigationOptions = {
        header: null
    }

    viewToken = async() => {

        const user_token = await AsyncStorage.getItem('token')
        if(user_token) {
            this.props.navigation.navigate('App');
        }
        else {
            this.props.navigation.navigate('Auth');
        }
    }


    render(){
        console.disableYellowBox = true;
        return(
            <View>
                <NavigationEvents onDidFocus={() => this.viewToken()}/>
                <ActivityIndicator/>
            </View>
        );
    }
}

export default HomeScreen;

