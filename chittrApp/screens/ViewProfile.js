import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ScrollView, Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, Paragraph, Button, ActivityIndicator} from 'react-native-paper';

class ViewProfile extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            given_name: '',
            loading2: true,
            followingAlready2: false,
            family_name: '',
            email: '',
            userData: [],
            usersFollowing: [],
            recentChits: [],
            isSelected: 0,
            listOfFollowing: 0,
            myFollowing: [],
            followingAlready: false,
            notFollowing: true,
            photo: null
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
                    console.log("userData below");
                    console.log(this.state.userData);
                    this.getMyFollowing();
                    this.setState({given_name: this.state.userData.given_name});
                    this.setState({family_name: this.state.userData.family_name});
                    this.setState({email: this.state.userData.email});
                    this.setState({recentChits: this.state.userData.recent_chits});
                    console.log(this.state.recentChits);
                })
                .catch(error => {
                    console.log('error: ' + error);
                });
        }
        else {

        }
    };

    getMyFollowing = async () => {
        this.setState({loading: true});
        const id = await AsyncStorage.getItem("id");
        if (id) {
            return fetch('http://10.0.2.2:3333/api/v0.0.5/user/9/following')
                .then(response => response.json())
                .then(responseJson => {
                    this.setState({
                        loading: false,
                        myFollowing: responseJson,
                    });
                    console.log("myFollowing below");
                    console.log(this.state.myFollowing);

                    let tempArray = [];
                    for(let i=0; i < this.state.myFollowing.length; i++) {
                        tempArray.push(this.state.myFollowing[i].user_id);
                    }
                    console.log("tempArray below");
                    console.log(tempArray);

                    let yes = tempArray.includes(this.props.navigation.state.params.item);
                    console.log(yes);
                    if( yes === true ){
                        console.log("already following");
                        this.setState({loading2: false});
                        this.setState({followingAlready: true});
                    }
                    else
                    {
                        this.setState({followingAlready: false});
                        this.setState({loading2: false});
                        console.log("Not following");
                    }

                })
                .catch(error => {
                    this.setState({loading: false,});
                    console.log('error: ' + error);
                });
        } else {
            console.log('An error occurred.')
        }
    };

    componentDidMount() {
        this.getUserData();
    }

    render() {
        console.log(this.state.recentChits);
        if (this.state.loading2) {
            return (
                <ActivityIndicator/>
            );
        }
        else {
            return (
                <ScrollView>
                    <View style={styles.chits}>
                        <Card Style={styles.mainCard}>
                            <View style={styles.chitInfo}>
                                <Card.Title title={this.state.userData.given_name + ' ' + this.state.userData.family_name} subtitle={this.state.userData.email} />
                            </View>
                            <Card.Cover source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+ this.state.userData.user_id+ '/photo' + '?' + new Date()}} />
                        </Card>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.form}>
                                <View style={{marginBottom: 0, flexDirection: 'row', width: '100%'}}>
                                    <View style={{flex: 1, flexDirection: 'column'}}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('UserFollowers', {id: this.state.userData.user_id})}>
                                            <View style={styles.tweetButton}>
                                                <Text
                                                    style={{color: 'black'}}> 👨‍👩‍👧‍👦 Followers</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 1, flexDirection: 'column'}}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('UserFollowing', {id: this.state.userData.user_id})}>
                                            <View style={styles.tweetButton}>
                                                <Text style={{color: 'black'}}> 👥 Following</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{marginBottom: 5, flexDirection: 'row', width: '100%'}}>
                                    <View style={{flex: 1, flexDirection: 'column'}}>
                                        <TouchableOpacity onPress={() => {this.unfollowUsers()}}>
                                            <View style={styles.tweetButton}>
                                                <Text
                                                    style={{color: 'black',  fontWeight: 'bold'}}>{!this.state.followingAlready ? 'Follow ☑️' : 'Unfollow ❌'}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 1, flexDirection: 'column'}}>
                                        <TouchableOpacity onPress={() => {this.followUsers()}}>
                                            <View style={styles.tweetButton}>
                                                <Text
                                                    style={{color: 'black',  fontWeight: 'bold'}}>{!this.state.followingAlready ? 'Follow ☑️' : 'Follow ✓'}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Text style={{fontSize: 20, paddingHorizontal: 130}}>Recent Chits</Text>
                                <FlatList
                                    data={this.state.usersFollowing}
                                    renderItem={this.renderFollowing}
                                />
                                <FlatList
                                    data={this.state.recentChits}
                                    renderItem={this.renderChits}
                                />
                        </View>
                    </View>
                </ScrollView>
            );
        }
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
            }
            else if (response = 400){
                alert('This user already exists in your following list.')
            }
        })
        .catch(error => {
            console.error(error);
        });
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
                    <View>
                        <Card.Title title={item.given_name + ' ' + item.family_name} subtitle={item.email}/>
                    </View>
                </Card>
            </ScrollView>
        );
    };

    renderChits = ({item}) => {
        return (
            <ScrollView>
                <View style={styles.singleChits}>
                     <Card style={{ justifyContent: 'center', paddingHorizontal: 20}}>
                         <Card.Content  >
                             <View style={styles.chitInfo}>
                                 <Paragraph>{item.chit_content}</Paragraph>
                             </View>
                         </Card.Content>
                     </Card>
                 </View>
            </ScrollView>
        );
    };


    async unfollowUsers() {
        const id = this.props.navigation.state.params.item;
        console.log(await AsyncStorage.getItem('token'));
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id + '/follow', {
            method: 'DELETE',
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
                alert('User unfollowed.');
                this.setState({followingAlready: true});
            }
        })
        .catch(error => {
            console.error(error);
        });
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    chits: {
        padding: 10
    },
    singleChits: {
        paddingTop: 5
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
        width: '100%',
    },
    chit_content: {
        backgroundColor: 'white',
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
        backgroundColor: '#E8E8E8',
        flexDirection: 'row',
    },
});

export default ViewProfile;
