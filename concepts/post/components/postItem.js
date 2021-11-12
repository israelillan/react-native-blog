import React from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import moment from 'moment';


const PostItem = props => {
    const creationDate = moment(props.item.creationDate).fromNow();
    const updateDate = moment(props.item.updateDate).fromNow();
    return (
        <View style={{ borderColor: '#ccc', borderWidth: 2, marginBottom: 5, marginTop: 5 }}>
            <ImageBackground style={{ flex: 1, height: 150 }} source={{ uri: props.item.imageUrl }}>
                <View>
                    <Text style={{fontSize: 20, color: 'white'}}>{props.item.title}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    {props.item.creationDate !== props.item.updateDate ? (
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{color: 'white'}}>{`created: ${creationDate}`}</Text>
                            <Text style={{color: 'white'}}>{`updated: ${updateDate}`}</Text>
                        </View>
                    ) : (
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{color: 'white'}}>{`created: ${creationDate}`}</Text>
                        </View>
                    )
                    }
                </View>
            </ImageBackground>
        </View>
    );
};

export default PostItem;