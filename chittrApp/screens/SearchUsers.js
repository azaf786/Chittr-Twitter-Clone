
import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Keyboard,
    AsyncStorage,
    Image,
} from 'react-native';
import {Card, Button, Title, Paragraph} from 'react-native-paper';
import {Icon} from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

let test = "follow";
let test1 = 0;

class SearchUsers extends Component{
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            dataSource: [],
            id: '',
            listOfFollowing: [],
            isSelected: 0,
            notFollowing: true
        }
    }

    checkToken = async () => {
        const id = await AsyncStorage.getItem("id");
        if(id) {
            return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id + '/following')
                .then(response => response.json())
                .then(responseJson => {
                    let tempArray = [];
                    for(let i=0; i < responseJson.length; i++) {
                        tempArray.push(responseJson[i].user_id);
                    }
                    this.setState({
                        listOfFollowing: tempArray,
                    });
                    console.log(this.state.listOfFollowing);
                })
                .catch(error => {
                    console.log("error: " + error);
                });
        }
        else
        {
            console.log('An error occurred.')
        }
    };

    componentDidMount() {
        this.checkToken();
    }

    render(){

        return(
            <View style={{flex: 1}}>
                <View style={{height: 120,  width: '100%', backgroundColor: '#33CCFF', justifyContent: 'center',  paddingHorizontal: 5, alignItems: 'center'}}>
                    <Animatable.View animation={'swing'} style={{height: 50, backgroundColor: 'white', flexDirection: 'row', padding: 5, alignItems: 'center' }}>
                        <TextInput onChangeText={(text) => this.handleSearch(text)} placeholder={'Search for Chittr users here ...'} style={{fontSize: 16, marginLeft: 0, width: '98%'}}/>
                    </Animatable.View>
                    <TouchableOpacity  onPress={() => this.submitSearch()}>
                        <View style={styles.tweetButton}>
                            <Text style = {{color: 'black'}}> 🔎 Search</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <FlatList data={this.state.dataSource} renderItem={this.renderItem}>

                </FlatList>

            </View>
        );
    }


    renderItem = ({item}) => {

        this.checkFollow(item.user_id);
        Keyboard.dismiss();
        return(
            <View>
                <Card style={{borderColor:'#33CCFF', borderWidth: 3, padding:10, borderRadius: 2}}>
                    <View style={styles.chitInfo}>
                        <Card.Title title={item.given_name + ' ' + item.family_name} subtitle={item.email} />
                    </View>
                    <Card.Content>
                        <Paragraph>{item.user_id}</Paragraph>
                    </Card.Content>
                    <Card.Cover source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+ item.user_id+ '/photo' + '?' + new Date()}}/>
                    <Card.Actions style={{backgroundColor: '#F0F0F0'}}>
                        <Button color="#33CCFF" dark={true} compact={true} onPress={() =>  this.props.navigation.navigate('ViewProfile',{item: item.user_id})}   mode="contained">View Profile</Button>
                    </Card.Actions>
                </Card>
            </View>
        )
    };


    handleSearch = (search) => {
        this.setState({search:search})
    };

    submitSearch() {
        let user = this.state.search;
        console.disableYellowBox = true;
        fetch('http://10.0.2.2:3333/api/v0.0.5/search_user' + '?q=' + user,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) =>{

            if(response.ok){
                return response.json()
            }
            else{
                alert('No users found.')
            }
        })
        .then((responseJson) => {
            if(''!==responseJson){
                this.setState({dataSource: responseJson})
            }
            else{
                alert('No users found.')
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    follow = async id => {
        console.log(await AsyncStorage.getItem("token"));
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id + '/follow', {
            method: 'POST',
            body: JSON.stringify({
                id: this.state.id
            }),
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": await AsyncStorage.getItem('token')
            }
        })
        .then((response) => {
            if(response.ok){
                alert('Added to followers')
            }
            else{
                console.log('An error occurred. Could not follow.')
            }
        })
        .catch((error) => {
            console.error(error);
        });
    };


    checkFollow(id) {
        for(let i=0; i < this.state.listOfFollowing.length; i++) {
            console.log(id+"id");
            console.log(this.state.listOfFollowing[i]+"this.state.listOfFollowing[i]");
            if(test1 ===0) {
                if (id === this.state.listOfFollowing[i]) {
                    console.log("Already following" + id);
                    this.setState({isSelected: id});
                    test = "unfollow";
                    console.log(id);
                } else {
                    test = "follow";
                }
                test1=1;
            }
            else{
                console.log("see what you got" +id);
                test1=0;
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginLeft: 'auto',
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: '#33CCFF',
        padding: 10,
        position: 'absolute', zIndex: 1
    },

    container1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },

    tweetButton: {
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 50,
        padding: 15,
        marginTop: 5,
        width: 120,
    },

    searchBar:  {
        backgroundColor: '#33CCFF',
        padding: 10,
        width: '70%',
    },

    mainContainerCard: {
        width: '95%',
        borderWidth: 5,
        borderColor: 'red',
        padding: 50,

    },

    flatList: {
        flex: 1,
        width: '100%',
        backgroundColor: '#E8E8E8'
    },
});

export default SearchUsers;
