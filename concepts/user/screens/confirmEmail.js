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
const clearRefreshInterval = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const asyncRefreshUserData = async (user, dispatch, props) => {
    clearRefreshInterval();
    if (user.isLoggedIn) {
        if (!user.emailVerified) {
            await dispatch(authActions.refreshUserData(user.authData));
        } else {
            timer = setTimeout(() => {
                asyncRefreshUserData(user, dispatch, props);
            }, 5000);
        }
    }
};

const ConfirmEmailScreen = props => {
    const dispatch = useDispatch(); useEffect(() => {
        props.navigation.setOptions({
            title: 'Verify email'
        });
    }, []);


    const user = useSelector(state => state.user);

    useEffect(() => {
        asyncRefreshUserData(user, dispatch, props);
        return clearRefreshInterval;
    }, [user]);


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
                                        await dispatch(authActions.resendVerificationEmail(user.authData));
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

export default ConfirmEmailScreen;
