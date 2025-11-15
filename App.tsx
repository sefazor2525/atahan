import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* 🔹 Üstteki karşılama kutusu */}
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Kişisel Asistan'a Hoşgeldiniz!</Text>
      </View>

      {/* 🔻 Butonlar grubu */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button1} onPress={() => alert('Namaz vakitleri')}>
          <Text style={styles.buttonText}>Namaz Vakitleri</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button2} onPress={() => alert('Hesap Makinesi')}>
          <Text style={styles.buttonText}>Hesap Makinesi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button3} onPress={() => alert('Hava Durumu')}>
          <Text style={styles.buttonText}>Hava Durumu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button4} onPress={() => alert('Yemek Tarifleri')}>
          <Text style={styles.buttonText}>Yemek Tarifleri</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button5} onPress={() => alert('Döviz Kurları')}>
          <Text style={styles.buttonText}>Döviz Kurları</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button6} onPress={() => alert('Alarm')}>
          <Text style={styles.buttonText}>Alarm</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button7} onPress={() => alert('Ayarlar')}>
          <Text style={styles.buttonText}>Ayarlar</Text>
        </TouchableOpacity> 
      </View>

      <StatusBar style="auto" />
      
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
    borderRadius: 28,
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
    borderRadius: 28,
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
    borderRadius: 28,
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
    borderRadius: 28,
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
    borderRadius: 28,
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
    borderRadius: 28,
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
    borderRadius: 28,
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