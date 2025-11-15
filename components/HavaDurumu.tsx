import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import * as Location from 'expo-location';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function HavaDurumu({ onClose }: { onClose: () => void }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Konum izni verilmedi. Lütfen ayarlardan konum iznini açın.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // WeatherAPI.com - Ücretsiz ve güvenilir hava durumu API'si
      // Not: Ücretsiz tier için günlük 1 milyon istek hakkı var
      // API key almak için: https://www.weatherapi.com/signup.aspx
      const API_KEY = 'YOUR_API_KEY'; // WeatherAPI.com'dan ücretsiz API key alın
      const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&lang=tr`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.current && data.location) {
        // WeatherAPI formatını uygulamamızın formatına çeviriyoruz
        setWeather({
          name: data.location.name,
          main: {
            temp: data.current.temp_c,
            feels_like: data.current.feelslike_c,
            humidity: data.current.humidity,
            pressure: data.current.pressure_mb,
          },
          weather: [{
            main: data.current.condition.text,
            description: data.current.condition.text,
            icon: data.current.condition.icon,
          }],
          wind: {
            speed: data.current.wind_kph / 3.6, // km/h'yi m/s'ye çeviriyoruz
          },
        });
      } else if (data.error) {
        setError(data.error.message || 'Hava durumu bilgisi alınamadı.');
      } else {
        setError('Hava durumu bilgisi alınamadı.');
      }
    } catch (err) {
      setError('Bir hata oluştu. İnternet bağlantınızı kontrol edin.');
      console.error('Hava durumu hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (icon: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌦️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️',
    };
    return iconMap[icon] || '🌤️';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hava Durumu</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8BC34A" />
            <Text style={styles.loadingText}>Hava durumu alınıyor...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.infoText}>
              Not: WeatherAPI.com'dan ücretsiz API key almanız gerekiyor.{'\n'}
              Kayıt: https://www.weatherapi.com/signup.aspx{'\n'}
              Günlük 1 milyon ücretsiz istek hakkı var.
            </Text>
            <TouchableOpacity onPress={fetchWeather} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        ) : weather ? (
          <>
            <View style={styles.mainWeatherBox}>
              <Text style={styles.cityName}>{weather.name}</Text>
              <Text style={styles.weatherIcon}>
                {getWeatherIcon(weather.weather[0].icon)}
              </Text>
              <Text style={styles.temperature}>{Math.round(weather.main.temp)}°C</Text>
              <Text style={styles.description}>
                {weather.weather[0].description.charAt(0).toUpperCase() + 
                 weather.weather[0].description.slice(1)}
              </Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Hissedilen</Text>
                <Text style={styles.detailValue}>{Math.round(weather.main.feels_like)}°C</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Nem</Text>
                <Text style={styles.detailValue}>%{weather.main.humidity}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Basınç</Text>
                <Text style={styles.detailValue}>{weather.main.pressure} hPa</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Rüzgar</Text>
                <Text style={styles.detailValue}>{weather.wind.speed} m/s</Text>
              </View>
            </View>

            <TouchableOpacity onPress={fetchWeather} style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>🔄 Yenile</Text>
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
    backgroundColor: '#8BC34A',
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
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#8BC34A',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainWeatherBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  weatherIcon: {
    fontSize: 80,
    marginVertical: 10,
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#8BC34A',
    marginVertical: 10,
  },
  description: {
    fontSize: 20,
    color: '#666',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8BC34A',
  },
  refreshButton: {
    backgroundColor: '#8BC34A',
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

