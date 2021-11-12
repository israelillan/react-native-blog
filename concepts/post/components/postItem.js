import React from "react";
import { View, Text, Image, ImageBackground } from "react-native";


const PostItem = props => {
    // console.log(props);
    return (
        <View style={{ borderColor: '#ccc', borderWidth: 2 }}>
            <ImageBackground style={{ flex: 1, height: 150 }} source={{ uri: props.item.imageUrl }}>
                <View>
                    <Text style={{fontSize: 20}}>{props.item.title}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    {props.item.creationDate !== props.item.updateDate ? (
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text>{`created: ${props.item.creationDate}`}</Text>
                            <Text>{`updated: ${props.item.updateDate}`}</Text>
                        </View>
                    ) : (
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text>{`created: ${props.item.creationDate}`}</Text>
                        </View>
                    )
                    }
                </View>
            </ImageBackground>
            <Text>{props.item.description}</Text>
        </View>
    );
};

export default PostItem;