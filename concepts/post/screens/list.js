import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Button,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as navigationNames from '../../../navigation/names';

import * as actions from '../actions'

const PostsListScreen = props => {
    useEffect(() => {
        props.navigation.setOptions({
            title: 'Posts'
        });
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const posts = useSelector(state => state.post.posts);
    const dispatch = useDispatch();

    const loadPosts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(actions.fetchPosts());
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        // const willFocusSub = props.navigation.addListener(
        //     'willFocus',
        //     loadPosts
        // );

        // return () => {
        //     willFocusSub.remove();
        // };
    }, [loadPosts]);

    useEffect(() => {
        setIsLoading(true);
        loadPosts().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadPosts]);


    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button
                    title="Try again"
                    onPress={loadPosts}
                />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!isLoading && posts.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No posts found.</Text>
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate(navigationNames.ADD_POSTS);
                }}>
                    <Text style={{color: 'blue'}}>Maybe start adding some!</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return <View>
    </View>
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default PostsListScreen;