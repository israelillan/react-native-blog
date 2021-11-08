import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    View,
    Text,
    Button,
    ActivityIndicator
} from 'react-native';
import * as authActions from '../actions';

const LogoutScreen = props => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                Do you want to logout?
            </Text>
            <View>
                {isLoading ? (
                    <ActivityIndicator size="small" color="gray" />
                ) : (
                    <Button
                        title='Yes'
                        onPress={async () => {
                            setIsLoading(true);
                            try {
                                await dispatch(authActions.logout());
                            }
                            catch {
                                setIsLoading(false);
                            }
                        }}
                    />
                )}
            </View>
        </View>
    );
};

export default LogoutScreen;
