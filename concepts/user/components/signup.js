import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    Button,
    ActivityIndicator,
    Alert
} from "react-native";
import { useDispatch } from 'react-redux';

import Input from "../../../components/UI/input";

import * as authActions from '../actions';

const Signup = props => {
    useEffect(() => {
        props.navigation.setOptions({
            title: 'Sign up'
        });
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer((state, action) => {
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
    }, {
        inputValues: {
            email: '',
            password: '',
        },
        inputValidities: {
            email: false,
            password: false,
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
                await dispatch(authActions.signup(
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
                    required
                    email
                    autoCapitalize="none"
                    errorText="Please enter a valid email address."
                    onInputChange={inputChangeHandler}
                    initialValue=""
                />
                <Input
                    id="password"
                    label="Password"
                    keyboardType="default"
                    secureTextEntry
                    required
                    minLength={6}
                    autoCapitalize="none"
                    errorText="Please enter a valid password."
                    onInputChange={inputChangeHandler}
                    initialValue=""
                />
                <View>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="gray" />
                    ) : (
                        <Button
                            title='Sign up'
                            onPress={authHandler}
                        />
                    )}
                </View>
                <View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default Signup;