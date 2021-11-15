import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    Button,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useDispatch } from 'react-redux';

import * as authActions from '../actions';

import Input from "../../../components/UI/Input";
import { required, email, minLength } from '../../../components/UI/inputValidators';

const formReducer = (state, action) => {
    const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value
    };
    const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues
    };
};

const Login = props => {
    useEffect(() => {
        props.navigation.setOptions({
            title: 'Login'
        });
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const authHandler = async () => {
        if (formState.formIsValid) {
            setError(null);
            setIsLoading(true);
            try {
                await dispatch(authActions.login(
                    formState.inputValues.email,
                    formState.inputValues.password
                ));
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        }
    };


    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}>
            <ScrollView>
                <Input
                    id="email"
                    label="E-Mail"
                    keyboardType="email-address"
                    validators={[
                        { fn: required(), error: "Please enter your email." },
                        { fn: email(), error: "Please enter a valid email address." }]}
                    autoCapitalize="none"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                />
                <Input
                    id="password"
                    label="Password"
                    keyboardType="default"
                    secureTextEntry
                    validators={[
                        { fn: required(), error: "Please enter a valid password." },
                        { fn: minLength(6), error: "Your password should be longer than 6 characters." }]}
                    autoCapitalize="none"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                />
                <View>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="gray" />
                    ) : (
                        <Button
                            title='Login'
                            onPress={authHandler}
                            color={formState.formIsValid ? '' : 'grey'}
                        />
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default Login;