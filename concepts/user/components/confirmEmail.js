import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    View,
    Text,
    Button,
    ActivityIndicator
} from 'react-native';
import * as authActions from '../actions';

let timer;
const clearRefreshTimeout = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
};

const asyncRefreshUserData = async (dispatch, props) => {
    clearRefreshTimeout();
    await dispatch(authActions.refreshUserData());
    timer = setTimeout(() => {
        asyncRefreshUserData(dispatch, props);
    }, 5000);
};

const ConfirmEmail = props => {
    const dispatch = useDispatch(); 
    useEffect(() => {
        props.navigation.setOptions({
            title: 'Verify email'
        });
    }, []);

    useEffect(() => {
        asyncRefreshUserData(dispatch, props);
        return clearRefreshTimeout;
    }, []);


    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
            <Text>
                Verify your emal
            </Text>
            <ActivityIndicator size="small" color="grey" />
            <View>
                {isLoading ? (
                    <ActivityIndicator size="small" color="gray" />
                ) : (
                    <View>
                        <View style={{marginTop: 20}}>
                            <Button
                                title='Resend confirmation email'
                                onPress={async () => {
                                    setIsLoading(true);
                                    try {
                                        await dispatch(authActions.resendVerificationEmail());
                                    }
                                    finally {
                                        setIsLoading(false);
                                    }
                                }}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <Button
                                title='Logout'
                                onPress={async () => {
                                    setIsLoading(true);
                                    try {
                                        await dispatch(authActions.logout());
                                    }
                                    finally {
                                        setIsLoading(false);
                                    }
                                }}
                            />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

export default ConfirmEmail;
