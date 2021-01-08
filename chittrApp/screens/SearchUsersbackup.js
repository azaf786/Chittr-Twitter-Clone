
import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList, Keyboard, AsyncStorage} from 'react-native';
import {Card, Button, Title, Paragraph} from 'react-native-paper';
import {Icon} from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable'
import Moment from 'moment';

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

        }
    }

    componentDidMount() {
        this.checkToken();
    }


    render(){

        return(
            <View style={{flex: 1}}>
                <View style={{height: 120,  width: '100%', backgroundColor: '#33CCFF', justifyContent: 'center',  paddingHorizontal: 5, alignItems: 'center'}}>
                    <Animatable.View animation={'swing'} style={{height: 50, backgroundColor: 'white', flexDirection: 'row', padding: 5, alignItems: 'center' }}>
                        <TextInput  onChangeText={this.handleSearch} placeholder={'Search for Chittr users here ...'} style={{fontSize: 16, marginLeft: 0, width: '98%'}}/>
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
            // <View style={styles.container}>
            //     <TextInput style={styles.searchBar} onChangeText={this.handleSearch} placeholder = 'Search for Chittr users here ...'>
            //     </TextInput>
            //     <TouchableOpacity  onPress={() => this.submitSearch()}>
            //         <View style={styles.tweetButton}>
            //             <Text style = {{color: 'black'}}> 🔎 Search</Text>
            //         </View>
            //     </TouchableOpacity>
            //     <View style={styles.container1}>
            //         <FlatList style={styles.flatList} data={this.state.dataSource} renderItem={this.renderItem} extraData={this.state} >
            //         </FlatList>
            //     </View>
            //
            // </View>

        );
    }

    renderItem = ({item}) => {
        this.checkFollow(item.user_id);
        //this.setState({id: item.user_id});
        //console.log('I am the set id: '+this.state.id);
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
                {/*<Card.Cover source={{ uri: 'https://picsum.photos/700' }} />*/}
                <Card.Actions style={{backgroundColor: '#F0F0F0'}}>
                    <Button color="blue" dark={true} compact={true} onPress={() => this.follow(item.user_id)} mode="contained">{this.state.isSelected !== item.user_id ? 'Follow': 'Unfollow'}
                    </Button>
                    <Button color="#33CCFF" dark={true} compact={true} onPress={() =>  this.props.navigation.navigate('ViewProfile',{item: item.user_id})}   mode="contained">View Profile</Button>
                </Card.Actions>
            </Card>
            {/*// <Text style={{padding: 20, fontSize: 20}}>*/}
            {/*//     {item.email}*/}
            {/*//     {item.family_name}*/}
            {/*//     {item.given_name}*/}
            {/*// </Text>*/}
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
        .then((response) =>
            response.json()
        )
        .then((responseJson) => {
            this.setState({dataSource: responseJson})
            // console.log(responseJson)
        })
        .catch((error) => {
            console.error(error);
        });

    }

      follow = async id => {
         // const notFollowing = this.state.notFollowing;
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
               // console.log('i am text value'+notFollowing);

                 //   this.setState({notFollowing: !notFollowing});

                  alert('Added to followers')
               }
              // else{
              //     console.log('An error occurred.')
              // }
          })
          .catch((error) => {
              console.error(error);
          });
      }

    checkFollow(id) {
        console.log(this.state.listOfFollowing.length);
        for(let i=0; i < this.state.listOfFollowing.length; i++) {
            if(id === this.state.listOfFollowing[i]) {
                console.log("Already following" + id);
                this.setState({isSelected: id});

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
