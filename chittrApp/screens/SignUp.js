// import React, {Component} from 'react';
// import {
//     Alert,
//     StyleSheet,
//     Button,
//     View,
//     Text,
//     TextInput,
//
// } from 'react-native';
//
// class register extends Component {
//
//     static navigationOptions = {
//         header: null
//     }
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             given_name: '',
//             given_name_validate: true,
//             family_name: '',
//             email: '',
//             password: '',
//             text: ''
//         };
//     }
//
//     handleGivenName = (text) => {
//         this.setState({given_name: text});
//     }
//
//     handleFamilyName = (text) => {
//         this.setState({family_name: text});
//     }
//
//     handleEmail = (text) => {
//          // let check = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//          // if(check.test(text)){
//         //     console.disableYellowBox = true;
//             this.setState({email: text});
//          // }
//         // else{
//         //     console.log(this.state.text)
//         //     console.warn('Invalid Format.')
//         // }
//     }
//
//     handlePassword = (text) => {
//         this.setState({password: text});
//     }
//
//     addUser(){
//         return fetch('http://10.0.2.2:3333/api/v0.0.5/user',{
//             method: 'POST',
//             body: JSON.stringify({
//                 given_name: this.state.given_name,
//                 family_name: this.state.family_name,
//                 email: this.state.email,
//                 password: this.state.password
//             }),
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         })
//             .then((response) => {
//                 alert("User Added!");
//                 console.log(JSON.stringify({
//                     given_name: this.state.given_name,
//                     family_name: this.state.family_name,
//                     email: this.state.email,
//                     password: this.state.password
//                 }))
//                 this.props.navigation.navigate('Login');
//             })
//             .catch((error) => {
//                 console.error(error);
//             });
//     }
//
//     render(){
//         if (this.state.isLoading) {
//             return (
//                 <View>
//                     <ActivityIndicator />
//                 </View>
//             );
//         }
//
//
//         return(
//             <View style={styles.container}>
//                 <Text style={styles.register}>Register</Text>
//                 {/*<View>*/}
//                 {/*    /!*onChangeText={this.handleGivenName}*!/*/}
//                 {/*    <TextInput style={[styles.fields,!this.state.given_name_validate? styles.error:null]} placeholder={'First Name'} onChangeText={this.handleGivenName}/>*/}
//                 {/*    <TextInput style={styles.fields} placeholder={'Last Name'} onChangeText={this.handleFamilyName}/>*/}
//                 {/*    <TextInput style={styles.fields} placeholder={'Email@email.com'} onChangeText={(text) => this.handleEmail(text)}/>*/}
//                 {/*    <TextInput style={styles.fields} placeholder={'Password'} onChangeText={this.handlePassword}/>*/}
//                 {/*</View>*/}
//                 {/*<View>*/}
//                 {/*    <Button color={'#33CCFF'} title={'Register'} onPress={*/}
//                 {/*        () => this.addUser()*/}
//                 {/*    } />*/}
//                 {/*</View>*/}
//
//                 <View>
//                     <TextInput
//                         style={styles.fields}
//                         onChangeText={this.handleGivenName}
//                         placeholder={'First Name'}
//                         value={this.state.given_name}
//                     />
//                     {!!this.state.nameError && (
//                         <Text style={styles.error}>{this.state.nameError}</Text>
//                     )}
//                     <TextInput
//                         style={styles.fields}
//                         onChangeText={this.handleFamilyName}
//                         placeholder={'Last Name'}
//                         value={this.state.family_name}
//                     />
//                     {!!this.state.lastNameError && (
//                         <Text style={styles.error}>{this.state.lastNameError}</Text>
//                     )}
//                     <TextInput
//                         style={styles.fields}
//                         onChangeText={(text) => this.handleEmail(text)}
//                         placeholder={'Email'}
//                         value={this.state.email}
//                     />
//                     {!!this.state.emailError && (
//                         <Text style={styles.error}>{this.state.emailError}</Text>
//                     )}
//                     <TextInput
//                         style={styles.fields}
//                         onChangeText={this.handlePassword}
//                         placeholder={'Password'}
//                         value={this.state.password}
//                     />
//                     {!!this.state.passError && (
//                         <Text style={styles.error}>{this.state.passError}</Text>
//                     )}
//                     <Button  color={'#33CCFF'} title={'Register'}
//                         onPress={() => {
//                             if(this.state.lastNameError === null && this.state.nameError === null && this.state.emailError === null && this.state.passError === null ){
//                                 this.addUser()
//                             }
//
//                             if (this.state.given_name.trim() === "") {
//                                 this.setState(() => ({ nameError: "First name required." }));
//                             } else {
//                                 this.setState(() => ({ nameError: null }));
//                             }
//
//                             if (this.state.family_name.trim() === "") {
//                                 this.setState(() => ({ lastNameError: "Last name required." }));
//                             } else {
//                                 this.setState(() => ({ lastNameError: null }));
//                             }
//
//                             if (this.state.email.trim() === "") {
//                                 this.setState(() => ({ emailError: "Email required." }));
//                             } else {
//                                 this.setState(() => ({ emailError: null }));
//                             }
//
//                             if (this.state.password.trim() === "") {
//                                 this.setState(() => ({ passError: "Password required." }));
//                             } else {
//                                 this.setState(() => ({ passError: null }));
//                             }
//                         }}
//                     />
//                 </View>
//
//             </View>
//         )};
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 5,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     fields: {
//         fontSize: 20,
//         textAlign: 'center',
//         fontWeight: 'bold',
//     },
//     register: {
//         color: '#33CCFF',
//         fontSize: 50,
//         top: -50,
//         textAlign: 'center',
//         fontWeight: 'bold',
//     },
//     error: {
//         color: 'red',
//         textAlign: 'center',
//         fontWeight: 'bold',
//         fontSize: 14
//     }
// });
// export default register
//
//
// // import React, { Component } from 'react';
// // import { View, StyleSheet, Button } from 'react-native';
// //
// // import t from 'tcomb-form-native';
// //
// // const Form = t.form.Form;
// //
// // const userDetails = t.struct({
// //     givenName: t.String,
// //     familyName: t.String,
// //     email: t.String,
// //     password: t.String,
// // });
// //
// // const formStyles = {
// //     ...Form.stylesheet,
// //     formGroup: {
// //         normal: {
// //             marginBottom: 10
// //         },
// //     },
// //     controlLabel: {
// //         normal: {
// //             color: 'green',
// //             fontSize: 18,
// //             marginBottom: 7,
// //             fontWeight: '600'
// //         },
// //         // the style applied when a validation error occours
// //         error: {
// //             color: 'red',
// //             fontSize: 18,
// //             marginBottom: 7,
// //             fontWeight: '600'
// //         }
// //     }
// // }
// //
// // const options = {
// //     fields: {
// //         email: {
// //             error: 'Without an email address how are you going to reset your password when you forget it?'
// //         },
// //         password: {
// //             error: 'Choose something you use on a dozen other sites or something you won\'t remember'
// //         },
// //         terms: {
// //             label: 'Agree to Terms',
// //         },
// //     },
// //     stylesheet: formStyles,
// // };
// //
// // export default class App extends Component {
// //     handleSubmit = () => {
// //         const value = this._form.getValue();
// //         console.log('value: ', value);
// //     }
// //
// //     render() {
// //         return (
// //             <View style={styles.container}>
// //                 <Form
// //                     ref={c => this._form = c}
// //                     type={userDetails}
// //                     options={options}
// //                 />
// //                 <Button
// //                     title="Sign Up!"
// //                     onPress={this.handleSubmit}
// //                 />
// //             </View>
// //         );
// //     }
// // }
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         justifyContent: 'center',
// //         marginTop: 50,
// //         padding: 20,
// //         backgroundColor: '#ffffff',
// //     },
// // });


import React, { Fragment } from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import { Button } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'

const validationSchema = Yup.object().shape({
    given_name: Yup.string()
        .label('given_name')
        .required('First name required')
        .min(2, 'Must have at least 2 characters'),
    family_name: Yup.string()
        .label('family_name')
        .required('Family name required')
        .min(2, 'Must have at least 2 characters'),
    email: Yup.string()
        .label('Email')
        .email('Enter a valid email')
        .required('Please enter a registered email'),
    password: Yup.string()
        .label('Password')
        .required()
        .min(4, 'Password must have more than 4 characters '),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Both passwords do not match')
        .required('Confirm Password is required')
})

export default class Signup extends React.Component {
    goToLogin = () => this.props.navigation.navigate('Login')

    handleSubmit = values => {
        if (values.email.length > 0 && values.password.length > 0) {
            setTimeout(() => {
                return fetch('http://10.0.2.2:3333/api/v0.0.5/user',{
                method: 'POST',
            body: JSON.stringify({
                given_name: values.given_name,
                family_name: values.family_name,
                email: values.email,
                password: values.password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            alert("User Added!");
            console.log(JSON.stringify({
                given_name: values.given_name,
                family_name: values.family_name,
                email: values.email,
                password: values.password
            }));
            this.props.navigation.navigate('Login');
        })
        .catch((error) => {
            console.error(error);
        });
        }, 3000)
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Formik
                    initialValues={{
                        given_name: '',
                        family_name: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }}
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
                          handleBlur,
                          isSubmitting
                      }) => (
                        <Fragment>
                            <FormInput
                                name='given_name'
                                value={values.given_name}
                                onChangeText={handleChange('given_name')}
                                placeholder='Enter your first name'
                                iconName='md-person'
                                iconColor='#2C384A'
                                onBlur={handleBlur('given_name')}
                                autoFocus
                            />
                            <ErrorMessage errorValue={touched.given_name && errors.given_name} />
                            <FormInput
                                name='family_name'
                                value={values.family_name}
                                onChangeText={handleChange('family_name')}
                                placeholder='Enter your surname/family name'
                                iconName='md-person'
                                iconColor='#2C384A'
                                onBlur={handleBlur('family_name')}
                                autoFocus
                            />
                            <ErrorMessage errorValue={touched.family_name && errors.family_name} />
                            <FormInput
                                name='email'
                                value={values.email}
                                onChangeText={handleChange('email')}
                                placeholder='Enter email'
                                autoCapitalize='none'
                                iconName='ios-mail'
                                iconColor='#2C384A'
                                onBlur={handleBlur('email')}
                            />
                            <ErrorMessage errorValue={touched.email && errors.email} />
                            <FormInput
                                name='password'
                                value={values.password}
                                onChangeText={handleChange('password')}
                                placeholder='Enter password'
                                secureTextEntry
                                iconName='ios-lock'
                                iconColor='#2C384A'
                                onBlur={handleBlur('password')}
                            />
                            <ErrorMessage errorValue={touched.password && errors.password} />
                            <FormInput
                                name='password'
                                value={values.confirmPassword}
                                onChangeText={handleChange('confirmPassword')}
                                placeholder='Confirm password'
                                secureTextEntry
                                iconName='ios-lock'
                                iconColor='#2C384A'
                                onBlur={handleBlur('confirmPassword')}
                            />
                            <ErrorMessage
                                errorValue={touched.confirmPassword && errors.confirmPassword}
                            />
                            <View style={styles.buttonContainer}>
                                <FormButton
                                    buttonType='outline'
                                    onPress={handleSubmit}
                                    title='SIGNUP'
                                    buttonColor='#33CCFF'
                                    disabled={!isValid || isSubmitting}
                                    loading={isSubmitting}
                                />
                            </View>
                        </Fragment>
                    )}
                </Formik>
                <Button
                    title='Have an account? Login'
                    onPress={this.goToLogin}
                    titleStyle={{
                        color: '#33CCFF'
                    }}
                    type='clear'
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    buttonContainer: {
        margin: 25
    }
})
