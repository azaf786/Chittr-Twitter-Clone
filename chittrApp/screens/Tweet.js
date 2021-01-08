import React, {Component} from 'react';
import {AsyncStorage, FlatList, StyleSheet, Text, Alert, TouchableOpacity, View} from 'react-native';
import { Card, Title } from 'react-native-paper';
import Moment from 'moment';
import {NavigationEvents} from 'react-navigation';
import {ActionSheet,Root} from "native-base";
import ImagePicker from "react-native-image-crop-picker";
export default class HomeScreen extends Component{

    constructor() {
        super();
        this.state = {
            dataSource: [],
            chit_id: 0,
            myId: 0,
        }
    }


    addPhoto = (chit_id) => {
        this.setState({chit_id: chit_id})
        const Buttons = ['Take Photo', 'Choose Photo', 'Cancel'];
        ActionSheet.show({
            options: Buttons,
            cancelButtonIndex: 2,
            title: 'Select a photo'
        }, buttonIndex => {
            switch (buttonIndex) {
                case 0:
                    this.cameraPhoto();
                    break;
                case 1:
                    this.photoChoose();
                    break;
                default:
                    break;
            }
        })
    }


    photoChoose = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            this.chosenPhoto(image);
        });
    };

    cameraPhoto = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            this.chosenPhoto(image);
        });
    };

    chosenPhoto = (image) => {
        const source = {uri: image.path};
        this.setState({photo: source});

        this.chitPhoto();
    }

    chitPhoto = async () => {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/'+ this.state.chit_id +'/photo', {
            method: 'POST',
            body: this.state.photo,
            headers: {
                'Content-Type': 'image/jpeg',
                "X-Authorization": await AsyncStorage.getItem("token")
            }
        })
            .then((response) => {
                alert("Photo added to chit");
                this.setState({photo: null});
                this.getChits();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    logout = async () => {
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
                AsyncStorage.removeItem('token');
                alert('Logout successful.');
                console.log(response);
                this.props.navigation.navigate('Home')
            })
            .catch((error) => {
                console.error(error);
            });
    };

    logoutAlert =()=> {
        Alert.alert(
            'Are you sure you want to ',
            'Logout?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Logout', onPress: () => this.logout()},
            ],
            { cancelable: false }
        )
    };

    render(){
        return(
            <Root>
                <View style={Styles.container}>
                    <FlatList style={Styles.flatList} data={this.state.dataSource} renderItem={this.renderItem} extraData={this.state.dataSource}>
                </FlatList>
                    <View style={Styles.buttonsContainer}>
                        <TouchableOpacity onPress={() => this.logoutAlert()}>
                            <View style={Styles.tweetButton}>
                                <Text style = {{color: 'black'}}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('addTweet')}>
                            <View style={Styles.tweetButton}>
                                <Text style = {{color: 'black'}}>Tweet?</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SearchUsers')}>
                            <View style={Styles.tweetButton}>
                                <Text style = {{color: 'black'}}>Search</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('MyProfile')}>
                            <View style={Styles.tweetButton}>
                                <Text style = {{color: 'black'}}>My Profile</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Root>
        )
    }

    renderItem = ({item}) => {
        Moment.locale('en')
        var ts = item.timestamp;
        return(
            <View style={Styles.chits}>
                <NavigationEvents onDidFocus={() => this.getChits()}/>
                <Card Style={Styles.mainCard}>
                    <View style={Styles.chitInfo}>
                        <Card.Title title={item.user.given_name + ' ' + item.user.family_name} subtitle={'Posted on: '+Moment(ts).format('d MMM, YYYY H:mma')} />
                    </View>
                    <Card.Content>
                        <Title style={Styles.chit_content}>{item.chit_content}</Title>
                        <Card.Cover source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/'+item.chit_id+'/photo' + '?' + new Date()}} />
                        {
                            this.state.myId != item.user.user_id
                                ?
                                <Text> </Text>
                                :
                                <TouchableOpacity
                                    style={{width: 200, alignSelf: 'center', textAlign: 'center', backgroundColor:  "#ddd",
                                        padding: 10,
                                        marginHorizontal: 10,
                                        borderRadius: 4,
                                        marginTop: 10}}
                                    onPress={() => this.addPhoto(item.chit_id)}>
                                    <Text style={{color: 'black', fontSize: 14, alignSelf: 'center'}}> Add Chit Photo </Text>
                                </TouchableOpacity>
                        }

                    </Card.Content>
                </Card>

            </View>

        )
    };

    async getChits() {
        let id = await AsyncStorage.getItem('id');
        console.disableYellowBox = true;
        fetch('http://10.0.2.2:3333/api/v0.0.5/chits', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) =>
                response.json()
            )
            .then((responseJson) => {
                this.setState({dataSource: responseJson});
                this.setState({myId: id});
                console.log("I am datasource" + this.state.dataSource);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.getChits();
    }


}

const Styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    mainCard: {
        width: '95%'
    },

    flatList: {
        flex: 1,
        width: '100%',
        backgroundColor: '#E8E8E8'
    },

    chits: {
        padding: 5
    },

    chitInfo: {
        borderColor: '#E8E8E8',
        borderWidth: 1,
    },

    chit_content: {
        backgroundColor: 'white',
        borderRadius: 4
    },

    tweetButton: {
        backgroundColor: '#33CCFF',
        alignItems: 'center',
        borderRadius: 7,
        padding: 15,
        width: '100%',
        paddingHorizontal: 20,
        borderColor: 'white',
        borderWidth: 4,
    },

    buttonsContainer: {
        height: 70, paddingHorizontal: 5, alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
    }

});
