import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const Input = props => {
  const { onInputChange, id, validators, label, initialValue, touched } = props;

  const [isTouched, setIsTouched] = useState(touched);
  const [value, setValue] = useState(initialValue ? initialValue : '');
  const [error, setError] = useState(null);

  const changeTextHandler = (text) => {
    text = text.trim();
    let error = null;
    if (validators) {
      for (const validator of validators) {
        if (!validator.fn(text)) {
          error = validator.error;
          break;
        }
      }
    }
    setError(error);
    setValue(text);
  };

  if (touched) {
    changeTextHandler(value);
  }

  useEffect(() => {
    let valid = true;
    if (validators) {
      for (const validator of validators) {
        if (!validator.fn(value)) {
          valid = false;
          break;
        }
      }
    }
    onInputChange(id, value, valid);
  }, [onInputChange, id, value]);

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        value={value}
        onChangeText={changeTextHandler}
        onBlur={() => setIsTouched(true)}
      />
      {!!error && isTouched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};
  
  const styles = StyleSheet.create({
    formControl: {
      width: '100%',
    },
    label: {
      marginVertical: 8
    },
    input: {
      paddingHorizontal: 2,
      paddingVertical: 5,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1
    },
    errorContainer: {
      marginVertical: 5
    },
    errorText: {
      color: 'red',
      fontSize: 13
    }
  });

export default Input;
