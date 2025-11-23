import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import * as Location from 'expo-location';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

type Lang = 'tr' | 'en' | 'ar';

const i18n = {
  tr: {
    loading: 'Konum alınıyor...',
    retry: 'Tekrar Dene',
    nextLabel: 'Sıradaki Namaz',
    refresh: '🔄 Yenile',
    prayers: {
      Fajr: 'İmsak',
      Sunrise: 'Güneş',
      Dhuhr: 'Öğle',
      Asr: 'İkindi',
      Maghrib: 'Akşam',
      Isha: 'Yatsı',
    },
    nextSuffixToday: '',
    nextSuffixTomorrow: ' (Yarın)',
    locationPrefix: '📍 ',
  },
  en: {
    loading: 'Fetching location...',
    retry: 'Retry',
    nextLabel: 'Next Prayer',
    refresh: '🔄 Refresh',
    prayers: {
      Fajr: 'Fajr',
      Sunrise: 'Sunrise',
      Dhuhr: 'Dhuhr',
      Asr: 'Asr',
      Maghrib: 'Maghrib',
      Isha: 'Isha',
    },
    nextSuffixToday: '',
    nextSuffixTomorrow: ' (Tomorrow)',
    locationPrefix: '📍 ',
  },
  ar: {
    loading: 'جاري جلب الموقع...',
    retry: 'إعادة المحاولة',
    nextLabel: 'الصلاة القادمة',
    refresh: '🔄 تحديث',
    prayers: {
      Fajr: 'الفجر',
      Sunrise: 'الشروق',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء',
    },
    nextSuffixToday: '',
    nextSuffixTomorrow: ' (غدًا)',
    locationPrefix: '📍 ',
  },
};

export default function NamazVakitleri({ onClose, title, language = 'tr' }: { onClose: () => void; title?: string; language?: Lang }) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Konum izni iste
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Konum izni verilmedi. Lütfen ayarlardan konum iznini açın.');
        setLoading(false);
        return;
      }

      // Mevcut konumu al
      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;

      // Şehir adını al (opsiyonel)
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const cityName = reverseGeocode[0]?.city || reverseGeocode[0]?.region || 'Konumunuz';
      setLocation(cityName);

      // Bugünün tarihini al
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      // Aladhan API'den namaz vakitlerini çek
      const apiUrl = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=2`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.code === 200 && data.data) {
        const timings = data.data.timings;
        setPrayerTimes({
          Fajr: timings.Fajr,
          Sunrise: timings.Sunrise,
          Dhuhr: timings.Dhuhr,
          Asr: timings.Asr,
          Maghrib: timings.Maghrib,
          Isha: timings.Isha,
        });
      } else {
        setError('Namaz vakitleri alınamadı. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      setError('Bir hata oluştu. İnternet bağlantınızı kontrol edin.');
      console.error('Namaz vakitleri hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // HH:MM formatı
  };

  const getNextPrayer = () => {
    if (!prayerTimes) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: i18n[language].prayers.Fajr, time: prayerTimes.Fajr },
      { name: i18n[language].prayers.Sunrise, time: prayerTimes.Sunrise },
      { name: i18n[language].prayers.Dhuhr, time: prayerTimes.Dhuhr },
      { name: i18n[language].prayers.Asr, time: prayerTimes.Asr },
      { name: i18n[language].prayers.Maghrib, time: prayerTimes.Maghrib },
      { name: i18n[language].prayers.Isha, time: prayerTimes.Isha },
    ];

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      
      if (prayerTime > currentTime) {
        return { ...prayer, time: formatTime(prayer.time) };
      }
    }

    return { name: i18n[language].prayers.Fajr + i18n[language].nextSuffixTomorrow, time: formatTime(prayerTimes.Fajr) };
  };

  const nextPrayer = getNextPrayer();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title ?? 'Namaz Vakitleri'}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>{i18n[language].loading}</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchPrayerTimes} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>{i18n[language].retry}</Text>
            </TouchableOpacity>
          </View>
        ) : prayerTimes ? (
          <>
            {location && (
              <View style={styles.locationBox}>
                <Text style={styles.locationText}>{i18n[language].locationPrefix}{location}</Text>
              </View>
            )}

            {nextPrayer && (
              <View style={styles.nextPrayerBox}>
                <Text style={styles.nextPrayerLabel}>{i18n[language].nextLabel}</Text>
                <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
                <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
              </View>
            )}

            <View style={styles.prayerTimesContainer}>
              <View style={styles.prayerRow}>
                <Text style={styles.prayerName}>{i18n[language].prayers.Fajr}</Text>
                <Text style={styles.prayerTime}>{formatTime(prayerTimes.Fajr)}</Text>
              </View>
              <View style={styles.prayerRow}>
                <Text style={styles.prayerName}>{i18n[language].prayers.Sunrise}</Text>
                <Text style={styles.prayerTime}>{formatTime(prayerTimes.Sunrise)}</Text>
              </View>
              <View style={styles.prayerRow}>
                <Text style={styles.prayerName}>{i18n[language].prayers.Dhuhr}</Text>
                <Text style={styles.prayerTime}>{formatTime(prayerTimes.Dhuhr)}</Text>
              </View>
              <View style={styles.prayerRow}>
                <Text style={styles.prayerName}>{i18n[language].prayers.Asr}</Text>
                <Text style={styles.prayerTime}>{formatTime(prayerTimes.Asr)}</Text>
              </View>
              <View style={styles.prayerRow}>
                <Text style={styles.prayerName}>{i18n[language].prayers.Maghrib}</Text>
                <Text style={styles.prayerTime}>{formatTime(prayerTimes.Maghrib)}</Text>
              </View>
              <View style={styles.prayerRow}>
                <Text style={styles.prayerName}>{i18n[language].prayers.Isha}</Text>
                <Text style={styles.prayerTime}>{formatTime(prayerTimes.Isha)}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={fetchPrayerTimes} style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>{i18n[language].refresh}</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
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
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  errorText: {
    fontSize: 18,
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationBox: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  nextPrayerBox: {
    backgroundColor: '#4CAF50',
    padding: 25,
    borderRadius: 20,
    marginBottom: 25,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  nextPrayerLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 5,
  },
  nextPrayerName: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nextPrayerTime: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  prayerTimesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  prayerName: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  prayerTime: {
    fontSize: 22,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

