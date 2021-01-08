//
// import React, {Component} from 'react';
// import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
// export default class HomeScreen extends Component{
//
//     constructor() {
//         super();
//         this.state = {
//             userData: []
//         }
//     }
//
//
//     render(){
//         return(
//             <View style={Styles.container}>
//                 <FlatList style={Styles.flatList} data={JSON.stringify(this.state.userData)} renderItem={this.renderItem} >
//
//                 </FlatList>
//
//                 {/*<View style={Styles.buttonsContainer}>*/}
//                 {/*    <TouchableOpacity onPress={() => this.props.navigation.navigate('MainScreen')}>*/}
//                 {/*        <View style={Styles.tweetButton}>*/}
//                 {/*            <Text style = {{color: 'black'}}>Logout</Text>*/}
//                 {/*        </View>*/}
//                 {/*    </TouchableOpacity>*/}
//                 {/*    <TouchableOpacity onPress={() => this.props.navigation.navigate('addTweet')}>*/}
//                 {/*        <View style={Styles.tweetButton}>*/}
//                 {/*            <Text style = {{color: 'black'}}>Tweet?</Text>*/}
//                 {/*        </View>*/}
//                 {/*    </TouchableOpacity>*/}
//                 {/*    <TouchableOpacity onPress={() => this.props.navigation.navigate('SearchUsers')}>*/}
//                 {/*        <View style={Styles.tweetButton}>*/}
//                 {/*            <Text style = {{color: 'black'}}>Search</Text>*/}
//                 {/*        </View>*/}
//                 {/*    </TouchableOpacity>*/}
//                 {/*</View>*/}
//
//             </View>
//         )
//     }
//
//     renderItem = ({item}) => {
//
//         return(
//             <View style={Styles.chits}>
//                 {/*<Text>{Moment(dt).format('d MMM, YYYY')} </Text>*/}
//                 <Card Style={Styles.mainCard}>
//                     <View style={Styles.chitInfo}>
//                         <Card.Title title={item.given_name + ' ' + item.family_name}  />
//                     </View>
//                     <Card.Content>
//                         {/*<Title style={Styles.chit_content}>{item.chit_content}</Title>*/}
//                         {/*<Paragraph>{item.chit_content}</Paragraph>*/}
//                     </Card.Content>
//                     <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
//                     {/*<Card.Actions>*/}
//                     {/*    <Button>Cancel</Button>*/}
//                     {/*    <Button>Ok</Button>*/}
//                     {/*</Card.Actions>*/}
//                 </Card>
//             </View>
//         )
//     };
//
//     componentDidMount() {
//         this.getUserData();
//     }
//
//
//     getUserData() {
//         const id = this.props.navigation.state.params.item;
//         console.log(id);
//         fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id,{
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//         .then((response) =>
//             response.json()
//         )
//         .then((responseJson) => {
//             this.setState({userData: responseJson});
//             console.log(this.state.userData);
//             console.log("I am datasource"+this.state.userData);
//         })
//         .catch((error) => {
//             console.error(error);
//         });
//     }
// }
//
// const Styles = StyleSheet.create({
//
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//
//     mainCard: {
//         width: '95%'
//     },
//
//     flatList: {
//         flex: 1,
//         width: '100%',
//         backgroundColor: '#E8E8E8'
//     },
//
//     chits: {
//         padding: 5
//     },
//
//     chitInfo: {
//         borderColor: '#E8E8E8',
//         borderWidth: 1,
//     },
//
//     chit_content: {
//         backgroundColor: 'white',
//         // borderColor: '#E8E8E8',
//         // borderWidth: 1,
//         borderRadius: 4
//     },
//
//     tweetButton: {
//
//         backgroundColor: '#33CCFF',
//         alignItems: 'center',
//         borderRadius: 5,
//         padding: 20,
//         width: 120,
//         borderColor: '#E8E8E8',
//         borderWidth: 5
//     },
//
//     buttonsContainer: {
//         // flex: 1,
//         backgroundColor: '#E8E8E8',
//         flexDirection: 'row',
//     }
//
// });

import React, {Component} from 'react';
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, Paragraph, Button} from 'react-native-paper';

class Register extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      given_name: '',
      family_name: '',
      email: '',
      userData: [],
      usersFollowing: [],
      isSelected: 0,
      listOfFollowing: 0,
      notFollowing: true
    };
  }

  getUserData = () => {
    const id = this.props.navigation.state.params.item;
    if (id) {
      return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id)
          .then(response => response.json())
          .then(responseJson => {
            this.setState({
              loading: false,
              userData: responseJson,
            });
            console.log(this.state.userData);
            this.setState({given_name: this.state.userData.given_name});
            this.setState({family_name: this.state.userData.family_name});
            this.setState({email: this.state.userData.email});
          })
          .catch(error => {
            console.log('error: ' + error);
          });
    }
    else {

    }
  };

  componentDidMount() {
    this.getUserData();
  }

  render() {
    this.checkFollow(this.props.navigation.state.params.item);
    return (
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.form}>
              <View style={styles.chits}>
              {/*<Text>{Moment(dt).format('d MMM, YYYY')} </Text>*/}
              <Card Style={styles.mainCard}>
                <Card.Content>
                  <View style={styles.chitInfo}>
                    <Card.Title
                        title={
                          this.state.userData.given_name +
                          ' ' +
                          this.state.userData.family_name
                        }
                    />
                    <Paragraph>{this.state.userData.email}</Paragraph>
              </View>
                  </Card.Content>
                  <Card.Cover source={{uri: 'https://picsum.photos/700'}}/>
                  {/*<Card.Actions>*/}
                  {/*    <Button>Cancel</Button>*/}
                  {/*    <Button>Ok</Button>*/}
                  {/*</Card.Actions>*/}
                </Card>
                <View style={{marginBottom: 0, flexDirection: 'row', width: '100%'}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <TouchableOpacity onPress={() => this.followUsers()}>
                      <View style={styles.tweetButton}>
                        <Text style={{color: 'black'}}>{this.state.isSelected !== this.state.userData.user_id ? 'Follow': 'Unfollow'}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <TouchableOpacity onPress={() => this.getFollowing()}>
                      <View style={styles.tweetButton}>
                        <Text style={{color: 'black'}}> 👥 Following</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{marginBottom: 5, flexDirection: 'row', width: '100%'}}>
                  <View style={{flex: 1, flexDirection: 'column', padding: 0}}>
                    <TouchableOpacity onPress={() => this.renderChits()}>
                      <View style={styles.tweetButton}>
                        <Text style={{color: 'black', fontSize: 20}}> 📝 View Chits</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <FlatList
                    data={this.state.usersFollowing}
                    renderItem={this.renderFollowing}
                />
                <FlatList
                    data={this.state.userData}
                    renderItem={this.renderChits}
                />
              </View>
            </View>
          </View>
        </ScrollView>
    );
  }

  async getFollowing() {
    const id = this.props.navigation.state.params.item;
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id + '/following', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('token'),
      },
    })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(responseJson => {
          console.log('I am response following' + responseJson);
          this.setState({usersFollowing: responseJson});
          console.log('i am usersfollowing' + this.state.usersFollowing);
        })
        .catch(error => {
          console.error(error);
        });
  }

  async followUsers() {
    const id = this.props.navigation.state.params.item;
    console.log(await AsyncStorage.getItem('token'));
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id + '/follow', {
      method: 'POST',
      body: JSON.stringify({
        id: this.state.id,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('token'),
      },
    })
        .then(response => {
          if (response.ok) {
            alert('Added to followers');
              this.setState({notFollowing: !notFollowing});
          }
          else if (response = 400){
            alert('This user already exists in your following list.')
          }
        })
        .catch(error => {
          console.error(error);
        });
  }

  checkFollow(id) {
    // console.log("second loop ");
    for(let i=0; i < this.state.listOfFollowing.length; i++) {
      console.log(id+"id");
      console.log(this.state.listOfFollowing[i]+"this.state.listOfFollowing[i]");


      if(somin2 ===0) {


        if (id === this.state.listOfFollowing[i]) {
          console.log("Already following" + id);
          // following = true;
          this.setState({isSelected: id});
          somin = "unfollow";
          console.log(id);
        } else {
          somin = "follow";
        }
        somin2=1;
      }
      else{
        console.log("see what you got" +id);
        somin2=0;
      }



    }


  }

  renderFollowing = ({item}) => {
    return (
        <ScrollView>
          <Card
              style={{
                borderColor: 'grey',
                marginBottom: 10,
                borderWidth: 3,
                padding: 10,
                borderRadius: 2,
              }}>
            <View style={styles.chitInfo}>
              <Card.Title
                  title={item.given_name + ' ' + item.family_name}
                  subtitle={item.email}
              />
            </View>
            <Card.Actions style={{backgroundColor: '#F0F0F0'}}>
              {/*<Button color="blue" dark={true} compact={true} onPress={() => {this.follow(item.user_id)}} mode="contained">{this.state.isSelected !== item.user_id ? 'Follow': 'Unfollow'*/}
              {/*<Button color="blue" dark={true} compact={true} onPress={() => {this.follow(item.user_id)}} mode="contained">{somin}*/}
              {/*</Button>*/}
              {/*<Button color="#33CCFF" dark={true} compact={true} onPress={() =>  this.props.navigation.navigate('ViewProfile',{item: item.user_id})}   mode="contained">View Profile</Button>*/}
            </Card.Actions>
          </Card>
          {/*// <Text style={{padding: 20, fontSize: 20}}>*/}
          {/*//     {item.email}*/}
          {/*//     {item.family_name}*/}
          {/*//     {item.given_name}*/}
          {/*// </Text>*/}
        </ScrollView>
    );
  };


  renderChits = () => {
   // this.state.usersFollowing = false;
    console.log("I am chit content" +this.state.userData.recent_chits.timestamp)
    return (
        <ScrollView>
          <Card
              style={{
                borderColor: 'grey',
                marginBottom: 10,
                borderWidth: 3,
                padding: 10,
                borderRadius: 2,
              }}>
            <View style={styles.chitInfo}>
              <Card.Title
                  // title={this.state.userData.recent_chits.chit_content}

                  // subtitle={item.email}
              />
            </View>
            <Card.Actions style={{backgroundColor: '#F0F0F0'}}>
              {/*<Button color="blue" dark={true} compact={true} onPress={() => {this.follow(item.user_id)}} mode="contained">{this.state.isSelected !== item.user_id ? 'Follow': 'Unfollow'*/}
              {/*<Button color="blue" dark={true} compact={true} onPress={() => {this.follow(item.user_id)}} mode="contained">{somin}*/}
              {/*</Button>*/}
              {/*<Button color="#33CCFF" dark={true} compact={true} onPress={() =>  this.props.navigation.navigate('ViewProfile',{item: item.user_id})}   mode="contained">View Profile</Button>*/}
            </Card.Actions>
          </Card>
          {/*// <Text style={{padding: 20, fontSize: 20}}>*/}
          {/*//     {item.email}*/}
          {/*//     {item.family_name}*/}
          {/*//     {item.given_name}*/}
          {/*// </Text>*/}
        </ScrollView>
    );
  };

}

const styles = StyleSheet.create({
  container: {
    top: 0,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    width: '95%',
  },
  formRow: {
    marginBottom: 10,
  },
  TextInput: {
    backgroundColor: '#ddd',
    height: 40,
    paddingHorizontal: 10,
    color: '#333',
  },
  chitInfo: {
    alignItems: 'center',
    textAlign: 'center'
  },
  chit_content: {
    backgroundColor: 'white',
    // borderColor: '#E8E8E8',
    // borderWidth: 1,
    borderRadius: 4,
  },
  tweetButton: {
    backgroundColor: '#d9d7d7',
    alignItems: 'center',
    borderRadius: 5,
    padding: 15,
    marginTop: 10,
    width: '99%',
    alignSelf: 'center',
  },
  buttonsContainer: {
    // flex: 1,
    backgroundColor: '#E8E8E8',
    flexDirection: 'row',
  },
});

export default Register;
