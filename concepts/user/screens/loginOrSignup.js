import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable
} from 'react-native';

import SignupScreen from './signup';
import LoginScreen from './login';

const LoginOrSignUpScreen = props => {
    const [isSignup, setIsSignup] = useState(false);

    return (
        <View style={{marginTop: 50}}>
            <View>
                {isSignup ? (<SignupScreen {...props} />) : (<LoginScreen {...props}  />)}
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

LoginOrSignUpScreen.navigationOptions = () => {
    console.log(`XXXXXXXXXXXXXXXXXX`);
    return {
      title: 'xxx'
    };
  };

export default LoginOrSignUpScreen;