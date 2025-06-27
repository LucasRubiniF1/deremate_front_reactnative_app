import React, {useRef, useState} from 'react';
import {Modal, View, TextInput, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {confirmDelivery} from "../service/delivery.service";

const PinModal = ({visible, onClose, id, setSnackbarMode, setSnackbarVisible, setSnackbarMessage}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === 'Backspace') {
      if (pin[index] === '') {
        if (index > 0) {
          inputs.current[index - 1].focus();
        }
      } else {
        const newPin = [...pin];
        newPin[index] = '';
        setPin(newPin);
      }
    }
  };

  const confirm = async () => {
    try {
      await confirmDelivery(id, pin.join(''));
      setSnackbarMode("success");
      setSnackbarMessage("¡Entrega finalizada exitosamente!")
    } catch (e) {
      setSnackbarMode("danger")
      setSnackbarMessage("El pin es incorrecto")
    }
    setSnackbarVisible(true);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Confirmar entrega</Text>
          <Text style={styles.description}>Ingresá el pin que te diga el comprador.</Text>

          <View style={styles.inputRow}>
            {pin.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputs.current[index] = ref)}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={value => handleChange(index, value)}
                onKeyPress={({nativeEvent}) => handleKeyPress(index, nativeEvent.key)}
              />
            ))}
          </View>

          <View style={styles.buttons}>
            <Button mode="outlined" onPress={onClose} style={styles.button}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={confirm} style={styles.button}>
              Confirmar
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PinModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 20,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  input: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 20,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
