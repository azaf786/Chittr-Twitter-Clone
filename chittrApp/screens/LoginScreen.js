
import React, { Fragment } from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Button } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'


const validationSchema = Yup.object().shape({
    email: Yup.string()
        .label('Email')
        .email('Enter a valid email')
        .required('Please enter a registered email'),
    password: Yup.string()
        .label('Password')
        .required()
        .min(4, 'Password must have more than 4 characters ')
})

export default class Login extends React.Component {
    goToSignup = () => this.props.navigation.navigate('SignUp')


    handleSubmit = values => {
        if (values.email.length > 0 && values.password.length > 0) {
            setTimeout(() => {
                return fetch('http://10.0.2.2:3333/api/v0.0.5/login',{
                    method: 'POST',
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if(response.ok){
                            this.props.navigation.navigate('Tweet')
                            return response.json();
                        }
                        else {
                            this.props.navigation.navigate('Login')
                        }
                    })
                    .then( (responseText) => {
                        try{
                            console.log('i am response text',responseText)
                            AsyncStorage.setItem('token', responseText.token);
                            AsyncStorage.setItem('id', JSON.stringify(responseText.id));
                            console.log(responseText.id)
                        }catch {
                            alert('Email or password incorrect.')

                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            }, 1)

        }
    }

    render() {

        return (

            <SafeAreaView style={styles.container}>
                <Formik
                    initialValues={{ email: '', password: '' }}
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
                                label={'Email'}
                                name='email'
                                value={values.email}
                                onChangeText={handleChange('email')}
                                placeholder='Enter email'
                                autoCapitalize='none'
                                iconName='ios-mail'
                                iconColor='#2C384A'
                                onBlur={handleBlur('email')}
                                autoFocus
                            />
                            <ErrorMessage errorValue={touched.email && errors.email} />
                            <FormInput
                                label={'Password'}
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
                            <View style={styles.buttonContainer}>
                                <FormButton
                                    buttonType='outline'
                                    onPress={handleSubmit}
                                    title='LOGIN'
                                    buttonColor='#33CCFF'
                                    disabled={!isValid}
                                />
                            </View>
                        </Fragment>
                    )}
                </Formik>
                <Button
                    title="Don't have an account? Sign Up"
                    onPress={this.goToSignup}
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
        margin: 20
    }
})
