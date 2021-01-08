import React, { Fragment } from 'react'
import {StyleSheet, SafeAreaView, View, PermissionsAndroid, default as Alert} from 'react-native';
import { Button } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import moment, {Moment} from 'moment';
import AwesomeAlert from 'react-native-awesome-alerts';

const validationSchema = Yup.object().shape({
    chittr_content: Yup.string()
        .label('chittr_content')
        .required('Please write something' )
        .max(144, 'Characters must not exceed the limit of 144.')
        .min(0, 'Please write something')
});

async function requestLocationPermission(){
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission required',
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


export default class addTweet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            currentDate: new Date(),
            markedDate: moment(new Date()).format("YYYY-MM-dd HH:mm:ss"),
            locationPermission: false,
            location: null,
            userInfo: []
        }
    }

    showAlert = () => {
        this.setState({
            showAlert: true
        });
    };

    viewChitr = () => {
        this.setState({
            showAlert: false
        });
        this.props.navigation.navigate('Tweet');
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });
    };

    goToTweet = () => this.props.navigation.navigate('Tweet');

    findCoordinates = () => {


        if(!this.state.locationPermission){
            this.state.locationPermission = requestLocationPermission();
        }

        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({location: position});
                console.log(this.state.position);
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
    }


    componentDidMount() {
        this.getUser()
        this.findCoordinates()
    }

    handleSubmit = async values => {
        let objectToSend = {
            "chit_id": 0,
            "timestamp": this.state.location.timestamp,
            "chit_content": values.chittr_content,
            location: {
                "longitude": this.state.location.coords.longitude,
                "latitude": this.state.location.coords.latitude
            },
            user: {
                "email": this.state.userInfo.email,
                "family_name": this.state.userInfo.family_name,
                "given_name": this.state.userInfo.given_name,
                "user_id": this.state.userInfo.user_id
            }
        };
        console.log(objectToSend);
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
                this.showAlert();
                values.chittr_content = '';
                //alert("Chit posted: " + data);
                //this.props.navigation.navigate('Tweet');
            })
            .catch((error) => {
                console.error(error);
            });

    }

    render() {
        const {showAlert} = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <Formik
                    initialValues={{
                        chittr_content: ''
                    }}
                    onText={this.handleError}
                    onSubmit={values => {
                        this.handleSubmit(values)
                    }}
                    validationSchema={validationSchema}>
                    {({
                          handleChange,
                          values,
                          handleSubmit,
                          errors,
                          isValid,
                          touched,
                          handleBlur
                      }) => (
                        <Fragment>

                            <FormInput
                                label={'Chits'}
                                multiline
                                inputStyle={styles.textInput}
                                name='chittr_content'
                                value={values.chittr_content}
                                onChangeText={handleChange('chittr_content')}
                                // maxLength={141}
                                placeholder='what do you wanna chittr about?'
                                onBlur={handleBlur('chittr_content')}

                            />
                            <ErrorMessage errorValue={touched.chittr_content && errors.chittr_content} />


                            <View style={styles.buttonContainer}>
                                <FormButton
                                    buttonType='outline'
                                    onPress={handleSubmit}
                                        title='Add'
                                    buttonColor='#33CCFF'
                                    disabled={!isValid }
                                />
                            </View>
                        </Fragment>
                    )}
                </Formik>
                {/*<View style={styles.container1}>*/}
                    <AwesomeAlert
                        show={showAlert}
                        showProgress={false}
                        title="Chit Added"
                        message="What would you like to do?"
                        //closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        showConfirmButton={true}
                        cancelText=" ✍🏻 Add More!"
                        confirmText=" 👀 View Chits"
                        cancelButtonColor="#33CCFF"
                        confirmButtonColor="blue"
                        onCancelPressed={() => {
                            this.hideAlert();
                        }}
                        onConfirmPressed={() => {
                            this.viewChitr();
                        }}
                    />
                {/*</View>*/}
                <Button
                    title='Changed your mind? View Chits from Others'
                    onPress={this.goToTweet}
                    titleStyle={{
                        color: '#33CCFF'
                    }}
                    type='clear'
                />
            </SafeAreaView>
        )
    }

    handleError() {
        alert('max numbers')
    }

    async getUser() {
        let userid = await AsyncStorage.getItem('id');
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userid, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                alert('An error occurred. Please contact the admin.')
            }
        })
        .then((responseText) => {
            try {
                console.log('i am response text', responseText);
                //AsyncStorage.setItem('user', responseText);
                this.setState({userInfo:responseText});
                console.log('I am user info: '+ this.state.userInfo.json())
            } catch {
                console.log('no response text')
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    buttonContainer: {
        margin: 25
    },
    textInput: {
        height: 200,
        fontSize: 20,
        backgroundColor: '#DCDCDC',
        color: 'black',
        width: '100%',
        paddingLeft: 20,
        marginTop: 10,
        marginBottom: 10
    },
    container1: {
        width: 500,
        height: 500,
        left: 0,
        right: 0, bottom: 0,
        alignSelf: 'center',
        justifyContent:"flex-start",
        alignItems: 'center',
        backgroundColor: 'white',
    }

});
