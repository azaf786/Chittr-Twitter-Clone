import React, { Component } from 'react';
import {StyleSheet, Text, TextInput, View, Button, AsyncStorage, Image, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheet, Root} from 'native-base';

class MyProfile extends Component {

    constructor(){

        super();

        this.state ={
            isValid: false,
            given_name: "",
            family_name: "",
            email: "",
            password: "",
            loading: false,
            userData: [],
            status:false,
            userFollowing: 0,
            userFollowers: 0,
            photo: null
        }
    }


    componentDidMount(){
        this.getUserData();
        this.getUserFollowInfo();
    }

    addPhoto = () => {
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
        let newImage = this.state.fileList;
        const source = {uri: image.path};
        this.setState({photo: source});

        this.accountPhoto();
    }

    accountPhoto = async () => {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/photo', {
            method: 'POST',
            body: this.state.photo,
            headers: {
                'Content-Type': 'image/jpeg',
                "X-Authorization": await AsyncStorage.getItem("token")
            }
        })
            .then((response) => {
                alert("Profile photo had now been updated:");
                this.setState({photo: null});
            })
            .catch((error) => {
                console.error(error);
            });
    }


    update = async () => {
        if (
            this.state.given_name ||
            this.state.family_name ||
            this.state.email ||
            this.state.password
        ) {
            const id = await AsyncStorage.getItem("id");
            return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + id, {
                method: "PATCH",
                body: JSON.stringify({
                    given_name: this.state.given_name,
                    family_name: this.state.family_name,
                    email: this.state.email,
                    password: this.state.password
                }),
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": await AsyncStorage.getItem("token")
                }
            })
                .then(response => {

                    try{
                        response.json()
                    }catch (e) {
                        console.log('an error occurred.')
                    }

                })
                .then(data => {
                    console.log("Account updated.");
                     alert("Account updated.");

                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            alert("Please enter at least one attribute value to update.");
        }
    };

    async getUserFollowInfo() {
        let id= await AsyncStorage.getItem('id');
        this.setState({loading: true});
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id + '/following')
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    isLoad: false,
                    userFollowing: responseJson.length
                });
                console.log("following"+this.state.userFollowing);
                return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id + '/followers')
                    .then(response => response.json())
                    .then(responseJson => {
                        this.setState({
                            isLoad: false,
                            userFollowers: responseJson.length,
                            loading: false
                        });
                        console.log("followers"+this.state.userFollowers);
                    })
                    .catch(error => {
                        this.setState({loading: false});
                        console.log("error: " + error);
                    });
            })
            .catch(error => {
                this.setState({loading: false});
                console.log("error: " + error);
            });
    }


    getUserData = async () => {
        const id = await AsyncStorage.getItem('id');
        if (id) {
            return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + id)
                .then(response => response.json())
                .then(responseJson => {
                    this.setState({
                        loading: false,
                        userData: responseJson
                    });
                    console.log(this.state.userData);
                    this.setState({ given_name: this.state.userData.given_name });
                    this.setState({ family_name: this.state.userData.family_name });
                    this.setState({ email: this.state.userData.email });
                    this.setState({ password: this.state.userData.password });
                })
                .catch(error => {
                    console.log("error: " + error);
                });
        } else {
        }
    };


    handleGivenName = text => {
        this.setState({ given_name: text });
        this.state.isValid = true;
        console.log(this.state.given_name);
    };
    handleFamilyName = text => {
        this.state.isValid = true;
        this.setState({ family_name: text });
        console.log(this.state.family_name);
    };

    handleEmail = text => {
        this.state.isValid = true;
        this.setState({ email: text });
        console.log(this.state.email);
    };
    handlePassword = text => {
        this.state.isValid = true;
        this.setState({ password: text });
        console.log(this.state.password);
    };

    ShowHideTextComponentView = () =>{

        if(this.state.status=== true)
        {
            this.setState({status: false})
        }
        else
        {
            this.setState({status: true})
        }
    };

    render() {

        return (
            <Root>
                <View style={styles.MainContainer}>
                    <Text style={styles.header}> Hello {this.state.userData.given_name}!</Text>
                    <Image source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+ this.state.userData.user_id+ '/photo' + '?' + new Date()}}
                           style={{width: 200, height: 200, alignSelf: 'center' }} />
                    <TouchableOpacity
                        style={{width: 200, alignSelf: 'center', tesxtAlign: 'center', backgroundColor:  "#ddd",
                            padding: 10,
                            marginHorizontal: 10,
                            borderRadius: 4,
                            marginBottom: 10}}
                        onPress={this.addPhoto}>
                        <Text
                            style={{color: 'black', fontSize: 14, alignSelf: 'center'}}> change Photo</Text>
                    </TouchableOpacity>

                    <View style={styles.formButtons}>
                        <TouchableOpacity  onPress={() => this.props.navigation.navigate('Followers')}>
                            <View style={styles.tweetButton}>
                                <Text
                                    style={{color: 'black', fontSize: 14}}> 👨‍👩‍👧‍👦 My Followers({this.state.userFollowers})</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Following')}>
                            <View style={styles.tweetButton}>
                                <Text style={{color: 'black', fontSize: 14}}> 👥 My Following ({this.state.userFollowing})</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formRow}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder={this.state.userData.given_name}
                            onChangeText={this.handleGivenName}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder={this.state.userData.family_name}
                            onChangeText={this.handleFamilyName}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder={this.state.userData.email}
                            onChangeText={this.handleEmail}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button color={'#303030'} title="New Password" onPress={this.ShowHideTextComponentView} />
                        {
                            this.state.status ? <TextInput style= {styles.TextInput} onChangeText={this.handlePassword} placeholder={'Enter your new password'}/> : null
                        }
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            disabled={!this.state.isValid}
                            color={'#33CCFF'}
                            style={styles.button}
                            title="Update"
                            onPress={() => this.update()}
                        />
                    </View>
                </View>
            </Root>
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        height: "100%",
        paddingHorizontal: 10
    },
    header: {
        textAlign: "center",
        fontSize: 25,
        padding: 20,
        fontStyle: 'italic'
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    form: {
        width: "90%"
    },
    formRow: {
        marginBottom: 10,

    },
    tweetButton: {
        backgroundColor:  "#ddd",
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 4
    },
    TextInput: {
        backgroundColor: "#ddd",
        height: 40,
        paddingHorizontal: 10,
        color: "#333"
    },


});
 export default MyProfile
