import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AlarmProps = {
  onClose: () => void;
  title?: string;
  language?: 'tr' | 'en' | 'ar';
};

type AlarmItem = {
  id: string;
  day: string;
  hour: string;
  minute: string;
};

const Alarm: React.FC<AlarmProps> = ({ onClose, title, language = 'tr' }) => {
  const i18n = {
    tr: {
      title: '⏰ Alarm Yöneticisi',
      placeholders: { day: 'Gün (örn: 21.11.2025)', hour: 'Saat (0-23)', minute: 'Dakika (0-59)' },
      setButton: 'Alarmı Kur',
      deleteButton: 'Sil',
      closeButton: 'Kapat',
      missingTitle: '⚠️ Eksik Bilgi',
      missingBody: 'Lütfen gün, saat ve dakika girin.',
      alarmAlertTitle: '⏰ Alarm',
      alarmScheduledTitle: '✅ Alarm Kuruldu',
      alarmScheduledBody: (day: string, hour: string, minute: string) => `${day} günü ${hour}:${minute} için alarm ayarlandı.`,
    },
    en: {
      title: '⏰ Alarm Manager',
      placeholders: { day: 'Day (e.g., 11/21/2025)', hour: 'Hour (0-23)', minute: 'Minute (0-59)' },
      setButton: 'Set Alarm',
      deleteButton: 'Delete',
      closeButton: 'Close',
      missingTitle: '⚠️ Missing Info',
      missingBody: 'Please enter day, hour and minute.',
      alarmAlertTitle: '⏰ Alarm',
      alarmScheduledTitle: '✅ Alarm Set',
      alarmScheduledBody: (day: string, hour: string, minute: string) => `Alarm scheduled for ${day} at ${hour}:${minute}.`,
    },
    ar: {
      title: '⏰ مدير المنبه',
      placeholders: { day: 'اليوم (مثال: 21.11.2025)', hour: 'الساعة (0-23)', minute: 'الدقيقة (0-59)' },
      setButton: 'ضبط المنبه',
      deleteButton: 'حذف',
      closeButton: 'إغلاق',
      missingTitle: '⚠️ معلومات ناقصة',
      missingBody: 'يرجى إدخال اليوم والساعة والدقيقة.',
      alarmAlertTitle: '⏰ منبّه',
      alarmScheduledTitle: '✅ تم ضبط المنبه',
      alarmScheduledBody: (day: string, hour: string, minute: string) => `تم ضبط المنبه ليوم ${day} عند ${hour}:${minute}.`,
    },
  } as const;
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);

  // Alarmları yükle
  useEffect(() => {
    const loadAlarms = async () => {
      const saved = await AsyncStorage.getItem('alarms');
      if (saved) setAlarms(JSON.parse(saved));
    };
    loadAlarms();
  }, []);

  // Alarm kontrolü
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('tr-TR');
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      alarms.forEach((alarm) => {
        if (
          alarm.day === currentDay &&
          parseInt(alarm.hour) === currentHour &&
          parseInt(alarm.minute) === currentMinute
        ) {
          Vibration.vibrate(2000); // titreşim
          Alert.alert(i18n[language].alarmAlertTitle, `${alarm.hour}:${alarm.minute}`);
        }
      });
    }, 60000); // her dakika kontrol

    return () => clearInterval(interval);
  }, [alarms]);

  // Alarm ekle
  const addAlarm = async () => {
    if (!day || !hour || !minute) {
      Alert.alert(i18n[language].missingTitle, i18n[language].missingBody);
      return;
    }

    const newAlarm: AlarmItem = {
      id: Date.now().toString(),
      day,
      hour,
      minute,
    };

    const updated = [...alarms, newAlarm];
    setAlarms(updated);
    await AsyncStorage.setItem('alarms', JSON.stringify(updated));

    Alert.alert(i18n[language].alarmScheduledTitle, i18n[language].alarmScheduledBody(day, hour, minute));
    setDay('');
    setHour('');
    setMinute('');
  };

  // Alarm sil
  const deleteAlarm = async (id: string) => {
    const updated = alarms.filter((a) => a.id !== id);
    setAlarms(updated);
    await AsyncStorage.setItem('alarms', JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? i18n[language].title}</Text>

      <TextInput
        style={styles.input}
        placeholder={i18n[language].placeholders.day}
        value={day}
        onChangeText={setDay}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n[language].placeholders.hour}
        keyboardType="numeric"
        value={hour}
        onChangeText={setHour}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n[language].placeholders.minute}
        keyboardType="numeric"
        value={minute}
        onChangeText={setMinute}
      />

      <TouchableOpacity style={styles.setButton} onPress={addAlarm}>
        <Text style={styles.setButtonText}>{i18n[language].setButton}</Text>
      </TouchableOpacity>

      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.alarmItem}>
            <Text style={styles.alarmText}>
              📅 {item.day} ⏰ {item.hour}:{item.minute}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteAlarm(item.id)}
            >
              <Text style={styles.deleteButtonText}>{i18n[language].deleteButton}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>{i18n[language].closeButton}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Alarm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#FF5722',
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
  },
  setButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  setButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alarmItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFE0B2',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  alarmText: {
    fontSize: 18,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});