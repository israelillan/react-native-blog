import React, { useEffect } from 'react';
import {
    View
} from 'react-native';

import EditPost from '../components/editPost';

const EditPostScreen = props => {
    const {post} = props.route.params;

    useEffect(() => {
        props.navigation.setOptions({
            title: 'Edit post'
        });
    }, []);

    return (<View style={{ flex: 1 }}>
        <EditPost {...props} post={post} />
    </View>);
};

export default EditPostScreen;