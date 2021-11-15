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
import { sharePost } from '../share';

const ViewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const post = useSelector(state =>
        state.post.selectedPost
    );

    useEffect(() => {
        if (post) {
            props.navigation.setOptions({
                title: post.title
            });
        } else {
            props.navigation.dispatch(StackActions.pop(1));
        }
    }, [post]);

    const userId = useSelector(state => state.user.id);

    const dispatch = useDispatch();

    const deleteHandler = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            await dispatch(actions.deletePost(post));
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    }, [dispatch, post, props.navigation]);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('beforeRemove', () => {
            dispatch(actions.selectPost(null));
        });
        return unsubscribe;
    }, [props.navigation]);

    if (isLoading || !post) {
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
                    <View style={{ flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', padding: 5 }}>
                        <View>
                            <TouchableOpacity onPress={async () => {
                                try {
                                    sharePost(post);
                                } catch (error) {
                                    alert(error.message);
                                }
                            }}>
                                <MaterialIcons
                                    name='share'
                                    size={40}
                                    color='white'
                                />
                            </TouchableOpacity>
                        </View>
                        <View>
                            {post.creationDate !== post.updateDate ? (
                                <View>
                                    <Text>{`created: ${moment.unix(post.creationDate.seconds).fromNow()}`}</Text>
                                    <Text>{`updated: ${moment.unix(post.updateDate.seconds).fromNow()}`}</Text>
                                </View>
                            ) : (
                                <View>
                                    <Text>{`created: ${moment(post.creationDate).fromNow()}`}</Text>
                                </View>
                            )
                            }
                        </View>
                    </View>
                    <Text style={{ margin: 20, backgroundColor: '#ccc', minHeight: 200 }}>{post.description}</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default ViewScreen;