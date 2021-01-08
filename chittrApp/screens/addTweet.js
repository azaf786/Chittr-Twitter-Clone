import React, { Component } from 'react';
import {
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    View,
    Alert,
    PermissionsAndroid,
    Keyboard,
    StyleSheet
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import { Switch } from 'react-native-paper';

async function requestLocationPermission(){
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message:
                    'This app requires access to your location.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can access location');
            return true;
        } else {
            console.log('Location permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
    }
}

class NewChit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locationPermission: false,
            location: null,
            userData: [],
            newChitText: '',
            activities: '',
            checked: true,
            loading: false,
            text: '',
            value: ''
        }
    }



    findCoordinates = () => {

        if(!this.state.locationPermission){
            this.state.locationPermission = requestLocationPermission();
        }
        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({location: position});
            },
            (error) => {
                Alert.alert(error.message)
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000
            }
        );
    };

    getUserDetails = async () => {
        const id = await AsyncStorage.getItem("id");
        if (id) {
            console.warn(id);
            return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + id)
                .then(response => response.json())
                .then(responseJson => {
                    this.setState({
                        userData: responseJson,
                    });
                    console.log(this.state.userData);
                })
                .catch(error => {
                    console.log("error: " + error);
                });
        } else {

        }
    }

    componentDidMount() {
        this.findCoordinates();
        this.getUserDetails();
    }

    handleChit = (text) => {
        this.setState({newChitText: text});
        console.log(this.state.newChitText);
        if(text.length === 141) {
            alert("Character limit (141) reached");
            Keyboard.dismiss();
        }
    }

    addToDrafts =  async () => {
        if (this.state.newChitText) {
            let objectToSend = [{
                "chit_id": 0,
                "timestamp": this.state.location.timestamp,
                "chit_content": this.state.newChitText,
                location: {
                    "longitude": this.state.location.coords.longitude,
                    "latitude": this.state.location.coords.latitude
                },
                user: {
                    "email": this.state.userData.email,
                    "family_name": this.state.userData.family_name,
                    "given_name": this.state.userData.given_name,
                    "user_id": this.state.userData.user_id
                }
            }];
            if (this.state.checked !== true) {
                objectToSend.location.latitude = 0;
                objectToSend.location.longitude = 0;
            }
            console.log(objectToSend);

            try {
                await AsyncStorage.setItem('draftChits', JSON.stringify(objectToSend));
            } catch (error) {
                // Error saving data
            }
        } else {
            alert("Please enter text before adding to drafts");
        }
    };

    post = async (value) => {
        if (this.state.newChitText) {
            let objectToSend = {
                "chit_id": 0,
                "timestamp": this.state.location.timestamp,
                "chit_content": this.state.newChitText,
                location: {
                    "longitude": this.state.location.coords.longitude,
                    "latitude": this.state.location.coords.latitude
                },
                user: {
                    "email": this.state.userData.email,
                    "family_name": this.state.userData.family_name,
                    "given_name": this.state.userData.given_name,
                    "user_id": this.state.userData.user_id
                }
            };
            if(this.state.checked !== true) {
                objectToSend.location.latitude = 0;
                objectToSend.location.longitude = 0;
            }
            console.log(objectToSend);
            this.setState({objectToSend: objectToSend});
            return fetch('http://10.0.2.2:3333/api/v0.0.5/chits', {
                method: 'POST',
                body: JSON.stringify(objectToSend),
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": await AsyncStorage.getItem("token")
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Chit Posted:', data);
                    if(value !== ''){
                        alert("Chit added successfully. Requested: "+ value + ' mins ago');
                    }else{
                        alert("Chit added successfully." );
                    }
                    this.props.navigation.navigate('Dashboard');
                })
                .catch((error) => {
                    console.error(error);
                });

        } else {
            alert("Please enter text before posting");
        }
    };

    render() {
        const checked  = this.state.checked;
        const loading = this.state.loading;
        return (
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.header}> New Chit </Text>
                    <View style={{marginBottom: 10, flexDirection: 'row', width: '100%'}}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <View style={{flex: 1, flexDirection: 'column'}}>

                                <Text style={{width: 100, alignSelf: 'flex-start'}}>
                                    {this.state.checked ? 'Location: ON' : 'Location: OFF'}
                                </Text>
                            </View>
                            <Switch style={{alignSelf: 'flex-end'}}
                                    value={checked}
                                    onValueChange={() => { this.setState({ checked: !checked }); }}
                            />
                        </View>
                    </View>
                    <View style={styles.formRow}>
                        <TextInput
                            style={styles.TextInput}
                            multiline
                            placeholder="What do you wanna Chittr about?"
                            maxLength={141}
                            onChangeText={this.handleChit}
                        />
                    </View>
                    <View style={{marginBottom: 10, flexDirection: 'row', width: '100%'}}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <TouchableOpacity
                                style={styles.newChitButton}
                                activeOpacity={0.7}
                                onPress={() => this.post()}>
                                <Text style={styles.newChitText}> {loading ? "Loading..." : "Post Chit"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginBottom: 10, flexDirection: 'row', width: '100%'}}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <TouchableOpacity
                                style={{
                                    ...styles.addPicButton,
                                    backgroundColor: loading ? "#ddd" : ""
                                }}
                                activeOpacity={0.7}
                                onPress={() => this.addToDrafts()}>
                                <Text style={styles.addPicText}> {loading ? "Loading..." : "Add to Drafts"} </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <TouchableOpacity
                                style={styles.newChitButton}
                                activeOpacity={0.7}
                                onPress={() =>this.props.navigation.navigate('ViewDrafts')}>
                                <Text style={styles.newChitText}> {loading ? "Loading..." : "View Drafts"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                        <TouchableOpacity
                            style={styles.scheduleButton}
                            activeOpacity={0.7}
                            onPress={this.ShowHideTextComponentView}>
                            <Text style={styles.Text}> Schedule Chits </Text>
                        </TouchableOpacity>

                        {
                            this.state.status ?
                                <RNPickerSelect
                                    onValueChange={(value) => this.checkingTime(value)}
                                    items={[
                                        { label: '1min', value: 60000 },
                                        { label: '5min', value: 300000 },
                                        { label: '10mins', value: 600000 },
                                        { label: '30mins', value: 1800000 },
                                        { label: '1h', value: 3600000 },
                                        { label: '1h30mins', value: 5400000 }
                                    ]}
                                />
                            : null
                        }
                </View>
            </View>
        );
    }

    checkingTime = (value) =>{
        let time = value/60000;

        if(this.state.newChitText === '')
        {
            alert('Please write something.')
        }else{
            alert('Your chit will be posted in: '+time + " mins");
            setTimeout(() => {
                //alert('Your chit will be posted in: '+value.label);
                console.log(value)
                this.post(time);
            }, value);
        }
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

}

export default NewChit;


const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center'
    },
    form: {
        width: '90%'
    },
    formRow: {
        marginBottom: 10
    },
    TextInput: {
        backgroundColor: "#ddd",
        height: 100,
        paddingHorizontal: 20,
        color: "#333"
    },
    newChitButton: {
        paddingVertical: 5,
        width: '98%',
        alignSelf: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'green',
        marginBottom: 5
    },
    scheduleButton: {
        backgroundColor: '#303030',
        padding: 10,
    },
    newChitText: {
        textAlign: 'center',
        color: "green",
        fontSize: 18,
        fontWeight: "bold"
    },
    addPicButton: {
        paddingVertical: 5,
        width: '98%',
        alignSelf: 'flex-start',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#303030',
        marginBottom: 5
    },
    addPicText: {
        textAlign: 'center',
        color: "#303030",
        fontSize: 18,
        fontWeight: "bold"
    },
    Button: {
        paddingVertical: 2,
        width: 110,
        alignSelf: 'center',
        borderRadius: 2,
        borderWidth: 1,
        backgroundColor: '#303030',
        padding: 20
    },
    Text: {
        textAlign: 'center',
        color: "white",
        fontSize: 14,
    }
});
