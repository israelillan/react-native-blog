import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Button,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Image
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';

import PostItem from '../components/postItem';

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
    }, [dispatch, setIsRefreshing, setIsLoading, setError]);

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
                <TouchableOpacity onPress={() => props.navigation.navigate(navigationNames.ADD_POSTS)}>
                    <Text style={{ color: 'blue' }}>Maybe start adding some!</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                onRefresh={loadPosts}
                refreshing={isRefreshing}
                data={posts}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <PostItem item={itemData.item} />
                )}
            />
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => props.navigation.navigate(navigationNames.ADD_POSTS)}
                style={styles.touchableOpacityStyle}>
                <MaterialIcons
                    name='add'
                    size={50}
                />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    touchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        backgroundColor: '#ccc',
        borderRadius: 25,
    }
});

export default PostsListScreen;