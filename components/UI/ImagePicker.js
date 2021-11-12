import React, { useState } from 'react';
import { View, Button, Image, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageBackground } from 'react-native';

const PickedImage = props => {
    const [pickedImage, setPickedImage] = useState(props.initialValue);

    const verifyPermissions = async () => {
        const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant camera permissions to use this app.',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    };

    const takeImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchCameraAsync({
            quality: 0.8
        });

        setPickedImage(image.uri);
        props.onImageTaken(image.uri);
    };
    const pickImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.8
        });

        setPickedImage(image.uri);
        props.onImageTaken(image.uri);
    };

    return (
        <View {...props}>
            <ImageBackground style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} source={{ uri: pickedImage }}>
                <View>
                    <Button
                        title="Take Image"
                        onPress={takeImageHandler}
                    />
                </View>
                <View style={{marginTop: 10}}>
                    <Button
                        title="Choose from gallery"
                        onPress={pickImageHandler}
                    />
                </View>
            </ImageBackground>
        </View>
    );
};


export default PickedImage;
