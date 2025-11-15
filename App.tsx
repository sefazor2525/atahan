import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import NamazVakitleri from './components/NamazVakitleri';
import HesapMakinesi from './components/HesapMakinesi';
import HavaDurumu from './components/HavaDurumu';
import YemekTarifleri from './components/YemekTarifleri';
import DovizAltin from './components/DovizAltin';
import Alarm from './components/Alarm';

export default function App() {
  const [showNamazVakitleri, setShowNamazVakitleri] = useState(false);
  const [showHesapMakinesi, setShowHesapMakinesi] = useState(false);
  const [showHavaDurumu, setShowHavaDurumu] = useState(false);
  const [showYemekTarifleri, setShowYemekTarifleri] = useState(false);
  const [showDovizAltin, setShowDovizAltin] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);

  return (
    <View style={styles.container}>
      {/* 🔹 Üstteki karşılama kutusu */}
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Kişisel Asistan'a Hoşgeldiniz!</Text>
      </View>

      {/* 🔻 Butonlar grubu */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button1} onPress={() => setShowNamazVakitleri(true)}>
          <Text style={styles.buttonText}>Namaz Vakitleri</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button2} onPress={() => setShowHesapMakinesi(true)}>
          <Text style={styles.buttonText}>Hesap Makinesi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button3} onPress={() => setShowHavaDurumu(true)}>
          <Text style={styles.buttonText}>Hava Durumu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button4} onPress={() => setShowYemekTarifleri(true)}>
          <Text style={styles.buttonText}>Yemek Tarifleri</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button5} onPress={() => setShowDovizAltin(true)}>
          <Text style={styles.buttonText}>Döviz Kurları</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button6} onPress={() => setShowAlarm(true)}>
          <Text style={styles.buttonText}>Alarm</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button7} onPress={() => alert('Ayarlar')}>
          <Text style={styles.buttonText}>Ayarlar</Text>
        </TouchableOpacity> 
      </View>

      <StatusBar style="auto" />

      {/* Modals */}
      <Modal
        visible={showNamazVakitleri}
        animationType="slide"
        onRequestClose={() => setShowNamazVakitleri(false)}
      >
        <NamazVakitleri onClose={() => setShowNamazVakitleri(false)} />
      </Modal>

      <Modal
        visible={showHesapMakinesi}
        animationType="slide"
        onRequestClose={() => setShowHesapMakinesi(false)}
      >
        <HesapMakinesi onClose={() => setShowHesapMakinesi(false)} />
      </Modal>

      <Modal
        visible={showHavaDurumu}
        animationType="slide"
        onRequestClose={() => setShowHavaDurumu(false)}
      >
        <HavaDurumu onClose={() => setShowHavaDurumu(false)} />
      </Modal>

      <Modal
        visible={showYemekTarifleri}
        animationType="slide"
        onRequestClose={() => setShowYemekTarifleri(false)}
      >
        <YemekTarifleri onClose={() => setShowYemekTarifleri(false)} />
      </Modal>

      <Modal
        visible={showDovizAltin}
        animationType="slide"
        onRequestClose={() => setShowDovizAltin(false)}
      >
        <DovizAltin onClose={() => setShowDovizAltin(false)} />
      </Modal>

      <Modal
        visible={showAlarm}
        animationType="slide"
        onRequestClose={() => setShowAlarm(false)}
      >
        <Alarm onClose={() => setShowAlarm(false)} />
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    paddingTop: 40,
  },
  headerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    marginHorizontal: 30,
    paddingVertical: 35,
    paddingHorizontal: 10,
    marginBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#5ff34c',
  },
  headerText: {
    fontSize: 32,
    color: '#2d5016',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonGroup: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  button1: {
    width: 220,
    height: 55,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  button2: {
    width: 220,
    height: 55,
    backgroundColor: '#00BCD4',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  button3: {
    width: 220,
    height: 55,
    backgroundColor: '#8BC34A',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  button4: {
    width: 220,
    height: 55,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    },

    button5:{
    width: 220,
    height: 55,
    backgroundColor: '#9C27B0',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  button6:{
    width: 220,
    height: 55,
    backgroundColor: '#E91E63',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    },

    button7:{
    width: 220,
    height: 55,
    backgroundColor: '#607D8B',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    },
});