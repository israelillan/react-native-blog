import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, Share, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { sharePost } from "../share";


const PostItem = props => {
    const creationDate = moment.unix(props.item.creationDate.seconds).fromNow();
    const updateDate = moment.unix(props.item.updateDate.seconds).fromNow();
    return (
        <View style={{ borderColor: '#ccc', borderWidth: 2, marginBottom: 5, marginTop: 5 }}>
            <TouchableOpacity onPress={() => props.onTouch(props.item)}>
                <ImageBackground style={{ flex: 1, height: 150 }} source={{ uri: props.item.imageUrl }}>
                    <View style={{ flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', padding: 5 }}>
                        <View>
                            <Text style={{ fontSize: 20, color: 'white' }}>{props.item.title}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={async () => {
                                try {
                                    sharePost(props.item);
                                } catch (error) {
                                    alert(error.message);
                                }
                            }}>
                                <MaterialIcons
                                    name='share'
                                    size={30}
                                    color='white'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        {props.item.creationDate.seconds !== props.item.updateDate.seconds ? (
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ color: 'white' }}>{`created: ${creationDate}`}</Text>
                                <Text style={{ color: 'white' }}>{`updated: ${updateDate}`}</Text>
                            </View>
                        ) : (
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ color: 'white' }}>{`created: ${creationDate}`}</Text>
                            </View>
                        )
                        }
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        </View>
    );
};

export default PostItem;