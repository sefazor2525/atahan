import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
import { useState, useEffect } from 'react';
import NamazVakitleri from './components/NamazVakitleri';
import HesapMakinesi from './components/HesapMakinesi';
import HavaDurumu from './components/HavaDurumu';
import YemekTarifleri from './components/YemekTarifleri';
import DovizAltin from './components/DovizAltin';
import Alarm from './components/Alarm';
import Notlar from './components/Notlar';


export default function App() {
  const [showNamazVakitleri, setShowNamazVakitleri] = useState(false);
  const [showHesapMakinesi, setShowHesapMakinesi] = useState(false);
  const [showHavaDurumu, setShowHavaDurumu] = useState(false);
  const [showYemekTarifleri, setShowYemekTarifleri] = useState(false);
  const [showDovizAltin, setShowDovizAltin] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState<'tr' | 'en' | 'ar'>('tr');
  const [pendingLanguage, setPendingLanguage] = useState<'tr' | 'en' | 'ar'>(language);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  useEffect(() => {
    const init = async () => {
      const savedLang = await AsyncStorage.getItem('app_language');
      if (savedLang === 'tr' || savedLang === 'en' || savedLang === 'ar') {
        setLanguage(savedLang);
        setPendingLanguage(savedLang);
      }
      const savedAvatar = await AsyncStorage.getItem('profile_avatar');
      if (savedAvatar) setAvatarUri(savedAvatar);
    };
    init();
  }, []);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      await AsyncStorage.setItem('profile_avatar', uri);
    }
  };

  const saveLanguage = async () => {
    setLanguage(pendingLanguage);
    await AsyncStorage.setItem('app_language', pendingLanguage);
    setShowSettings(false);
  };

  const t = {
    tr: {
      welcome: "Kişisel Asistan'a Hoşgeldiniz!",
      prayers: 'Namaz Vakitleri',
      calc: 'Hesap Makinesi',
      weather: 'Hava Durumu',
      recipes: 'Yemek Tarifleri',
      rates: 'Döviz ve Altın Kurları',
      alarm: 'Alarm',
      notes: 'Notlar',
      settings: 'Ayarlar',
      language: 'Dil',
      save: 'Kaydet',
    },
    en: {
      welcome: 'Welcome to Personal Assistant!',
      prayers: 'Prayer Times',
      calc: 'Calculator',
      weather: 'Weather',
      recipes: 'Recipes',
      rates: 'Currency & Gold',
      alarm: 'Alarm',
      notes: 'Notes',
      settings: 'Settings',
      language: 'Language',
      save: 'Save',
    },
    ar: {
      welcome: 'مرحبًا بك في المساعد الشخصي!',
      prayers: 'مواعيد الصلاة',
      calc: 'آلة حاسبة',
      weather: 'الطقس',
      recipes: 'وصفات الطعام',
      rates: 'العملات والذهب',
      alarm: 'منبّه',
      notes: 'ملاحظات',
      settings: 'الإعدادات',
      language: 'اللغة',
      save: 'حفظ',
    },
  };

  const withAlpha = (hex: string, aa: string = '99') => (hex?.startsWith('#') ? `${hex}${aa}` : hex);

  const features = [
    { key: 'prayers', icon: '🕌', label: t[language].prayers, color: '#4CAF50', onPress: () => setShowNamazVakitleri(true) },
    { key: 'calc', icon: '🧮', label: t[language].calc, color: '#00BCD4', onPress: () => setShowHesapMakinesi(true) },
    { key: 'weather', icon: '🌦️', label: t[language].weather, color: '#8BC34A', onPress: () => setShowHavaDurumu(true) },
    { key: 'recipes', icon: '🍽️', label: t[language].recipes, color: '#03A9F4', onPress: () => setShowYemekTarifleri(true) },
    { key: 'rates', icon: '💱', label: t[language].rates, color: '#FF9800', onPress: () => setShowDovizAltin(true) },
    { key: 'alarm', icon: '⏰', label: t[language].alarm, color: '#E91E63', onPress: () => setShowAlarm(true) },
    { key: 'notes', icon: '📝', label: t[language].notes, color: '#607D8B', onPress: () => setShowNotes(true) },
    { key: 'settings', icon: '⚙️', label: t[language].settings, color: '#9C27B0', onPress: () => setShowSettings(true) },
  ];


  return (
    <View style={styles.container}>
      {/* 🔹 Üstteki karşılama kutusu */}
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>{t[language].welcome}</Text>
        <TouchableOpacity onPress={pickAvatar} style={styles.avatarButton} activeOpacity={0.9}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 🔻 Butonlar grubu */}
      <FlatList
        data={features}
        numColumns={3}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.buttonGroup}
        columnWrapperStyle={styles.buttonRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.baseButton, { backgroundColor: withAlpha(item.color) }]}
            onPress={item.onPress}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonIcon}>{item.icon}</Text>
          </TouchableOpacity>
        )}
      />

      <StatusBar style="auto" />

      

      {/* Modals */}
      <Modal
        visible={showNamazVakitleri}
        animationType="slide"
        onRequestClose={() => setShowNamazVakitleri(false)}
      >
        <NamazVakitleri language={language} title={t[language].prayers} onClose={() => setShowNamazVakitleri(false)} />
      </Modal>

      <Modal
        visible={showHesapMakinesi}
        animationType="slide"
        onRequestClose={() => setShowHesapMakinesi(false)}
      >
        <HesapMakinesi title={t[language].calc} onClose={() => setShowHesapMakinesi(false)} />
      </Modal>

      <Modal
        visible={showHavaDurumu}
        animationType="slide"
        onRequestClose={() => setShowHavaDurumu(false)}
      >
        <HavaDurumu title={t[language].weather} onClose={() => setShowHavaDurumu(false)} />
      </Modal>

      <Modal
        visible={showYemekTarifleri}
        animationType="slide"
        onRequestClose={() => setShowYemekTarifleri(false)}
      >
        <YemekTarifleri language={language} title={t[language].recipes} onClose={() => setShowYemekTarifleri(false)} />
      </Modal>

      <Modal
        visible={showDovizAltin}
        animationType="slide"
        onRequestClose={() => setShowDovizAltin(false)}
      >
        <DovizAltin title={t[language].rates} onClose={() => setShowDovizAltin(false)} />
      </Modal>

      <Modal
        visible={showAlarm}
        animationType="slide"
        onRequestClose={() => setShowAlarm(false)}
      >
        <Alarm language={language} title={t[language].alarm} onClose={() => setShowAlarm(false)} />
      </Modal>

      <Modal
        visible={showNotes}
        animationType="slide"
        onRequestClose={() => setShowNotes(false)}
      >
        <Notlar language={language} title={t[language].notes} onClose={() => setShowNotes(false)} />
      </Modal>

      <Modal
        visible={showSettings}
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.settingsModalContainer}>
          <View style={styles.settingsModalHeader}>
            <Text style={styles.settingsModalTitle}>{t[language].settings}</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)} style={styles.settingsCloseButton}>
              <Text style={styles.settingsCloseButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingsModalContent}>
            <Text style={styles.languageLabel}>{t[language].language}</Text>
            <View style={styles.langColumn}>
              <TouchableOpacity
                style={[styles.langChip, pendingLanguage === 'tr' && styles.langChipActive]}
                onPress={() => setPendingLanguage('tr')}
              >
                <Text style={[styles.langText, pendingLanguage === 'tr' && styles.langTextActive]}>TR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langChip, pendingLanguage === 'en' && styles.langChipActive]}
                onPress={() => setPendingLanguage('en')}
              >
                <Text style={[styles.langText, pendingLanguage === 'en' && styles.langTextActive]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langChip, pendingLanguage === 'ar' && styles.langChipActive]}
                onPress={() => setPendingLanguage('ar')}
              >
                <Text style={[styles.langText, pendingLanguage === 'ar' && styles.langTextActive]}>AR</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={saveLanguage} style={styles.saveLangButton}>
              <Text style={styles.saveLangButtonText}>{t[language].save}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 35,
    paddingBottom: 10,
  },
  headerBox: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 24,
    paddingVertical: 28,
    paddingHorizontal: 16,
    marginBottom: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E6E9EF',
  },
  headerText: {
    fontSize: 22,
    color: '#111827',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E6E9EF',
    backgroundColor: '#F3F4F6',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  buttonGroup: {
    paddingHorizontal: 0,
    paddingBottom: 140,
  },

  baseButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  buttonRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

buttonText: {
  color: '#FFFFFF',
  fontSize: 0,
  fontWeight: '600',
  textAlign: 'center',
  marginTop: 0,
},
buttonIcon: {
  fontSize: 40,
  textAlign: 'center',
  marginBottom: 0,
},
  settingsBar: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  settingsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingsHeaderText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  languageLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
  },
  langRow: {
    flexDirection: 'row',
  },
  langColumn: {
    flexDirection: 'column',
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },
  langChipActive: {
    backgroundColor: '#111827',
  },
  langText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  settingsModalContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  settingsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#9C27B0',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  settingsModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsCloseButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  settingsModalContent: {
    padding: 20,
  },
  saveLangButton: {
    marginTop: 12,
    backgroundColor: '#9C27B0',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveLangButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
});
