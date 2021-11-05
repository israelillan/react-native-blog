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
        if (user.emailVerified) {
            props.navigation.navigate('Post');
        } else {
            await dispatch(authActions.refreshUserData(user.authData));
        }
        timer = setTimeout(() => {
            asyncRefreshUserData(user, dispatch, props);
        }, 5000);
    } else {
        props.navigation.navigate('User');
    }
};

const ConfirmEmail = props => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        asyncRefreshUserData(user, dispatch, props);
        return clearRefreshInterval;
    }, [user]);


    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                Verify your emal
            </Text>
            <ActivityIndicator size="small" color="grey" />
            <View>
                {isLoading ? (
                    <ActivityIndicator size="small" color="gray" />
                ) : (
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
                )}
            </View>
        </View>
    );
};

export default ConfirmEmail;
