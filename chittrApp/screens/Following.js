import React, { Component } from 'react';
import {
    Text,
    FlatList,
    View,
    TouchableOpacity,
    StyleSheet, Alert, Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, Title, Paragraph, Button, Avatar} from 'react-native-paper';

class Following extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isLoad: true,
            following: [],
            search: ''
        };
        this.getFollowing();
    }

    getFollowing = async () => {
        const id = await AsyncStorage.getItem("id");
        if(id) {
            return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id + '/following')
                .then(response => response.json())
                .then(responseJson => {
                    this.setState({
                        loading: false,
                        following: responseJson,
                    });
                })
                .catch(error => {
                    console.log("error: " + error);
                });
        }
        else
        {

        }
    }

    async unfollow(id) {
        console.log(await AsyncStorage.getItem("token"));
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id + '/follow', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": await AsyncStorage.getItem("token")
            }
        })
            .then(response => {
                console.log(response);
                Alert.alert("unfollowed");
            })
            .catch(error => {
                console.log("error: " + error);
            });
    }

    render() {
        const loading = this.state.loading;
        return (
            <View style={styles.container}>
                <Text style={styles.userText}> Following ({this.state.following.length})</Text>
                <FlatList
                    data={this.state.following}
                    renderItem={({item}) => (
                        <View>
                            <Card style={{minWidth: '90%', maxWidth: '90%', alignSelf: 'center', margin: 10}}>
                                <Card.Title title={item.given_name} subtitle={item.email} left={() => <Image source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+ item.user_id+ '/photo' + '?' + new Date()}}
                                                                                                             style={{width: 50, height: 50, borderRadius: 25}}/> } />
                            </Card>

                        </View>
                    )}
                    keyExtractor={({id}, index) => id}
                />
            </View>
        )
    }
}

export default Following;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dashboard: {
        textAlign: 'center'
    },
    userText: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10
    }
});
