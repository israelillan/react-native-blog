import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item, HeaderButton } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';

import PickedImage from '../../../components/UI/ImagePicker';
import Input from '../../../components/UI/input';

import * as postsActions from '../actions';

const EditPost = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const postId = props.postId;
  const editedPost = useSelector(state =>
    state.post.posts.find(prod => prod.id === postId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(
    (state, action) => {
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      const ret = {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues
      };
      return ret;  
    }, {
    inputValues: {
      title: editedPost ? editedPost.title : '',
      imageUrl: editedPost ? editedPost.imageUrl : '',
      description: editedPost ? editedPost.description : ''
    },
    inputValidities: {
      title: editedPost ? true : false,
      imageUrl: editedPost ? true : false,
      description: editedPost ? true : false
    },
    formIsValid: editedPost ? true : false
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay' }
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedPost) {
        // await dispatch(
        //   postsActions.updatePost(
        //     postId,
        //     formState.inputValues.title,
        //     formState.inputValues.description,
        //     formState.inputValues.imageUrl
        //   )
        // );
      } else {
        await dispatch(
          postsActions.createPost(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [dispatch, postId, formState]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            iconName={'save'}
            IconComponent={MaterialIcons}
            iconSize={23}
            onPress={submitHandler}
          />
        </HeaderButtons>
      )
    });
  }, [submitHandler]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  return (
    <View>
      <ScrollView>
        <View>
          <PickedImage style={{height: 200, backgroundColor: '#00000020', borderColor: '#ccc', margin: 10}} onImageTaken={(imagePath) => {
            inputChangeHandler('imageUrl', imagePath, !!imagePath);
          }} />
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={0}
          >
            <Input
              id="title"
              label="Title"
              errorText="Please enter a valid title!"
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={editedPost ? editedPost.title : ''}
              initiallyValid={!!editedPost}
              required
            />
          </KeyboardAvoidingView>
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={0}
          >
            <Input
              id="description"
              label="Description"
              errorText="Please enter a valid description!"
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect
              multiline
              numberOfLines={3}
              onInputChange={inputChangeHandler}
              initialValue={editedPost ? editedPost.description : ''}
              initiallyValid={!!editedPost}
              required
              minLength={5}
            />
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditPost;
