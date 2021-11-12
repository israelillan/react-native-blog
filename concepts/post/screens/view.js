import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    ImageBackground,
    Alert,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { StackActions } from '@react-navigation/native';

import * as actions from '../actions';
import * as navigationNames from '../../../navigation/names';

const ViewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const { post } = props.route.params;
    useEffect(() => {
        props.navigation.setOptions({
            title: post.title
        });
    }, []);

    const userId = useSelector(state => state.user.id);

    const dispatch = useDispatch();

    const deleteHandler = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            await dispatch(actions.deletePost(post));
            props.navigation.dispatch(StackActions.pop(1));
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    }, [dispatch, post, props.navigation]);

    if (isLoading) {
        return (
            <View>
                <ActivityIndicator size="large" color="grey" />
            </View>
        );
    }

    const UserControls = !!userId && userId === post.author ? (
        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'space-between', padding: 10 }}>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate(navigationNames.EDIT_POST, {
                    post
                })
            }}>
                <MaterialIcons
                    name='edit'
                    size={30}
                    color='white'
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                Alert.alert('Please confirm', 'Are you sure you want to delete this post?', [
                    {
                        text: 'Yes',
                        style: 'destructive',
                        onPress: deleteHandler
                    },
                    {
                        text: 'No',
                        style: 'default'
                    }
                ])
            }}>
                <MaterialIcons
                    name='delete'
                    size={30}
                    color='red'
                />
            </TouchableOpacity>
        </View>
    ) : (<View />);

    return (
        <View>
            <ScrollView>
                <View>
                    <ImageBackground style={{ height: 300 }} source={{ uri: post.imageUrl }}>
                        {UserControls}
                    </ImageBackground>
                    <View style={{ alignItems: 'flex-end' }}>
                        {post.creationDate !== post.updateDate ? (
                            <View>
                                <Text>{`created: ${moment(post.creationDate).fromNow()}`}</Text>
                                <Text>{`updated: ${moment(post.updateDate).fromNow()}`}</Text>
                            </View>
                        ) : (
                            <View>
                                <Text>{`created: ${moment(post.creationDate).fromNow()}`}</Text>
                            </View>
                        )
                        }
                    </View>
                    <Text style={{ margin: 20, backgroundColor: '#ccc', minHeight: 200 }}>{post.description}</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default ViewScreen;