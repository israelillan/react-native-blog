import { Platform, Share } from "react-native";
import * as Linking from 'expo-linking';

export const sharePost = async (post) => {
    const url = Linking.createURL(`post/${post.id}`);
    await Share.share({
        title: post.title,
        message: Platform.OS === 'android' ? `${post.description}: ${url}` : post.description,
        url
    });
}