import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable
} from 'react-native';

import Signup from './signup';
import Login from './login';

const LoginOrSignUp = props => {
    const [isSignup, setIsSignup] = useState(false);

    return (
        <View style={{marginTop: 50}}>
            <View>
                {isSignup ? (<Signup {...props} />) : (<Login {...props}  />)}
            </View>
            <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Pressable onPress={() => {
                    setIsSignup(prevState => !prevState);
                }}>
                    <Text>{isSignup ? 'Login' : 'Sign up'}</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default LoginOrSignUp;