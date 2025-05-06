import React, { useState } from 'react';
import { View, TextInput, Text, Button } from 'react-native';
import { styles } from './InputStyles';

const InputDemo = () => {
    const [inputText, setInputText] = useState('');
    const [displayText, setDisplayText] = useState('');

    const handleButtonPress = () => {
        setDisplayText(inputText);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Escribe algo aquí"
            />
            <Button title="Mostrar Texto" onPress={handleButtonPress} />
            <Text style={styles.displayText}>{displayText}</Text>
            <Text style={{ marginTop: 20, textAlign: 'center', color: '#555' }}>
                Presiona el botón para mostrar el texto ingresado.
            </Text>
        </View>
    );
};

export default InputDemo;