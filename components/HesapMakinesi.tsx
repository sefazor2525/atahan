import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function HesapMakinesi({ onClose, title }: { onClose: () => void; title?: string }) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    if (previousValue !== null && operation) {
      const inputValue = parseFloat(display);
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const Button = ({ onPress, style, text, textStyle }: any) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title ?? 'Hesap Makinesi'}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.displayContainer}>
        <Text style={styles.display}>{display}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <Button onPress={clear} style={styles.functionButton} text="C" />
          <Button onPress={() => inputOperation('÷')} style={styles.operatorButton} text="÷" />
        </View>
        <View style={styles.row}>
          <Button onPress={() => inputNumber('7')} text="7" />
          <Button onPress={() => inputNumber('8')} text="8" />
          <Button onPress={() => inputNumber('9')} text="9" />
          <Button onPress={() => inputOperation('×')} style={styles.operatorButton} text="×" />
        </View>
        <View style={styles.row}>
          <Button onPress={() => inputNumber('4')} text="4" />
          <Button onPress={() => inputNumber('5')} text="5" />
          <Button onPress={() => inputNumber('6')} text="6" />
          <Button onPress={() => inputOperation('-')} style={styles.operatorButton} text="-" />
        </View>
        <View style={styles.row}>
          <Button onPress={() => inputNumber('1')} text="1" />
          <Button onPress={() => inputNumber('2')} text="2" />
          <Button onPress={() => inputNumber('3')} text="3" />
          <Button onPress={() => inputOperation('+')} style={styles.operatorButton} text="+" />
        </View>
        <View style={styles.row}>
          <Button onPress={() => inputNumber('0')} style={styles.zeroButton} text="0" />
          <Button onPress={inputDecimal} text="." />
          <Button onPress={performCalculation} style={styles.equalsButton} text="=" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00BCD4',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  display: {
    fontSize: 64,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  buttonsContainer: {
    padding: 10,
    backgroundColor: '#000000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    backgroundColor: '#333333',
  },
  buttonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  functionButton: {
    backgroundColor: '#a6a6a6',
  },
  operatorButton: {
    backgroundColor: '#00BCD4',
  },
  equalsButton: {
    backgroundColor: '#00BCD4',
  },
  zeroButton: {
    flex: 2,
  },
});

