import React, { useEffect } from 'react';
import {
    View,
    Text,
    Button
} from 'react-native';
import { useSelector } from 'react-redux';

import EditPost from '../components/editPost';

import * as navigationNames from '../../../navigation/names';

const AddPostScreen = props => {
    useEffect(() => {
        props.navigation.setOptions({
            title: 'Add new post'
        });
    }, []);

    const loggedInAndEmailVerified = useSelector(state => state.user.loggedInAndEmailVerified);

    return (<View style={{ flex: 1 }}>
        {
            loggedInAndEmailVerified ? (
                <EditPost {...props} postId={null} />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                    <View>
                        <Text>
                            To be able to post new content, we need you to log in or sign up
                        </Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Button title='Login' onPress={() => props.navigation.navigate(navigationNames.AUTH)} />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Button title='Back' onPress={() => props.navigation.goBack()} />
                    </View>
                </View>
            )
        }
    </View>);
};

export default AddPostScreen;