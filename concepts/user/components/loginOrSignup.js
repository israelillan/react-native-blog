import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    Modal,
    Button,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';

import * as authActions from '../actions';

import Input from '../../../components/UI/Input';
import { required, email } from '../../../components/UI/inputValidators';

import Signup from './signup';
import Login from './login';

const LoginOrSignUp = props => {
    const [isSignup, setIsSignup] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetPasswordEmail, setResetPasswordEmail] = useState('');
    const [resetPasswordEmailValid, setResetPasswordEmailValid] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const dispatch = useDispatch();

    return (
        <View>
            <Modal
                transparent={true}
                visible={showResetPassword}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20, backgroundColor: '#fffffff0', borderRadius: 20 }}>
                    {emailSent ? (
                        <View>
                            <Text>
                                Email sent, check your inbox and follow the instructions
                            </Text>
                        </View>
                    ) : (
                        <View style={{ width: '100%', padding: 10 }}>
                            <View>
                                <Text>
                                    Enter your email, we will send you a link to reset your password
                                </Text>
                            </View>
                            <View style={{ width: '100%', padding: 10 }}>
                                <Input
                                    id="email"
                                    label="E-Mail"
                                    keyboardType="email-address"
                                    validators={[
                                        { fn: required(), error: "Please enter your email." },
                                        { fn: email(), error: "Please enter a valid email address." }]}
                                    autoCapitalize="none"
                                    onInputChange={(_, inputValue, inputValidity) => {
                                        setResetPasswordEmail(inputValue);
                                        setResetPasswordEmailValid(inputValidity);
                                    }}
                                    initialValue=""
                                />
                            </View>
                            <View style={{ marginTop: 20 }}>
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="gray" />
                                ) : (
                                    <Button title='Send email' onPress={async () => {
                                        if (resetPasswordEmailValid) {
                                            setError(null);
                                            setIsLoading(true);
                                            try {
                                                await dispatch(authActions.resetPassword(
                                                    resetPasswordEmail
                                                ));
                                                setEmailSent(true);
                                            } catch (err) {
                                                setError(err.message);
                                            }
                                            finally {
                                                setIsLoading(false);
                                            }
                                        }
                                    }} />
                                )}
                            </View>
                        </View>
                    )}
                    <View style={{ marginTop: 20 }}>
                        <Button title='Back' onPress={() => setShowResetPassword(false)} />
                    </View>
                </View>
            </Modal>

            <View style={{ marginTop: 50 }}>
                <View>
                    {isSignup ? (<Signup {...props} />) : (<Login {...props} />)}
                </View>
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <Pressable onPress={() => {
                        setIsSignup(prevState => !prevState);
                    }}>
                        <Text>{isSignup ? 'I already have an account' : 'I don\'t have an account'}</Text>
                    </Pressable>
                </View>
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <Pressable onPress={() => {
                        setEmailSent(false);
                        setShowResetPassword(true);
                    }}>
                        <Text>I forgot my password</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default LoginOrSignUp;