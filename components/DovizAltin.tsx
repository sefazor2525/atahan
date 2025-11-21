import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';

interface CurrencyData {
  code: string;
  name: string;
  buying: number;
  selling: number;
  change: number;
}

interface GoldData {
  name: string;
  buying: number;
  selling: number;
  change: number;
}

export default function DovizAltin({ onClose, title }: { onClose: () => void; title?: string }) {
  const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
  const [gold, setGold] = useState<GoldData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError(null);

      // TCMB (Türkiye Cumhuriyet Merkez Bankası) Resmi API'si
      // En güvenilir kaynak - Resmi döviz kurları
      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      const tcmbUrl = `https://www.tcmb.gov.tr/kurlar/${dateStr}.xml`;
      
      // XML yerine alternatif olarak JSON API kullanıyoruz
      // Canlı Döviz API'si - TCMB verilerini JSON formatında sunuyor
      const altApiUrl = 'https://api.canlidoviz.com/web/items';
      
      const response = await fetch(altApiUrl);
      const data = await response.json();

      if (data && Array.isArray(data)) {
        // Döviz kurları
        const currencyMap: { [key: string]: CurrencyData } = {};
        const goldMap: { [key: string]: GoldData } = {};

        data.forEach((item: any) => {
          const code = item.code;
          const name = item.name;
          const buying = parseFloat(item.buying || '0');
          const selling = parseFloat(item.selling || '0');
          const change = parseFloat(item.change || '0');

          // Döviz kurları
          if (['USD', 'EUR', 'GBP'].includes(code)) {
            currencyMap[code] = {
              code,
              name: name || (code === 'USD' ? 'Amerikan Doları' : code === 'EUR' ? 'Euro' : 'İngiliz Sterlini'),
              buying,
              selling,
              change,
            };
          }

          // Altın fiyatları
          if (['GA', 'CEYREK', 'YARIM', 'TAM'].includes(code)) {
            const goldName = code === 'GA' ? 'Gram Altın' : 
                           code === 'CEYREK' ? 'Çeyrek Altın' :
                           code === 'YARIM' ? 'Yarım Altın' : 'Tam Altın';
            goldMap[code] = {
              name: goldName,
              buying,
              selling,
              change,
            };
          }
        });

        // Eğer API'den veri gelmezse, alternatif API deniyoruz
        if (Object.keys(currencyMap).length === 0) {
          const altResponse = await fetch('https://api.genelpara.com/embed/doviz.json');
          const altData = await altResponse.json();
          
          if (altData) {
            const currencyList: CurrencyData[] = [
              {
                code: 'USD',
                name: 'Amerikan Doları',
                buying: parseFloat(altData.USD?.alis || '0'),
                selling: parseFloat(altData.USD?.satis || '0'),
                change: parseFloat(altData.USD?.degisim || '0'),
              },
              {
                code: 'EUR',
                name: 'Euro',
                buying: parseFloat(altData.EUR?.alis || '0'),
                selling: parseFloat(altData.EUR?.satis || '0'),
                change: parseFloat(altData.EUR?.degisim || '0'),
              },
              {
                code: 'GBP',
                name: 'İngiliz Sterlini',
                buying: parseFloat(altData.GBP?.alis || '0'),
                selling: parseFloat(altData.GBP?.satis || '0'),
                change: parseFloat(altData.GBP?.degisim || '0'),
              },
            ];

            const goldList: GoldData[] = [
              {
                name: 'Gram Altın',
                buying: parseFloat(altData.GA?.alis || '0'),
                selling: parseFloat(altData.GA?.satis || '0'),
                change: parseFloat(altData.GA?.degisim || '0'),
              },
              {
                name: 'Çeyrek Altın',
                buying: parseFloat(altData.CEYREK?.alis || '0'),
                selling: parseFloat(altData.CEYREK?.satis || '0'),
                change: parseFloat(altData.CEYREK?.degisim || '0'),
              },
              {
                name: 'Yarım Altın',
                buying: parseFloat(altData.YARIM?.alis || '0'),
                selling: parseFloat(altData.YARIM?.satis || '0'),
                change: parseFloat(altData.YARIM?.degisim || '0'),
              },
              {
                name: 'Tam Altın',
                buying: parseFloat(altData.TAM?.alis || '0'),
                selling: parseFloat(altData.TAM?.satis || '0'),
                change: parseFloat(altData.TAM?.degisim || '0'),
              },
            ];

            setCurrencies(currencyList.filter(c => c.buying > 0));
            setGold(goldList.filter(g => g.buying > 0));
          }
        } else {
          setCurrencies(Object.values(currencyMap).filter(c => c.buying > 0));
          setGold(Object.values(goldMap).filter(g => g.buying > 0));
        }

        setLastUpdate(new Date().toLocaleTimeString('tr-TR'));
      } else {
        setError('Kur bilgileri alınamadı.');
      }
    } catch (err) {
      setError('Bir hata oluştu. İnternet bağlantınızı kontrol edin.');
      console.error('Döviz/Altın hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',');
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return '#4CAF50';
    if (change < 0) return '#E91E63';
    return '#666';
  };

  const getChangeSymbol = (change: number) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title ?? 'Döviz & Altın'}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9C27B0" />
            <Text style={styles.loadingText}>Kurlar yükleniyor...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchRates} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {lastUpdate && (
              <View style={styles.updateBox}>
                <Text style={styles.updateText}>Son Güncelleme: {lastUpdate}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💵 Döviz Kurları</Text>
              {currencies.map((currency, index) => (
                <View key={index} style={styles.rateCard}>
                  <View style={styles.rateHeader}>
                    <View>
                      <Text style={styles.currencyCode}>{currency.code}</Text>
                      <Text style={styles.currencyName}>{currency.name}</Text>
                    </View>
                    <View style={styles.changeBox}>
                      <Text style={[styles.changeText, { color: getChangeColor(currency.change) }]}>
                        {getChangeSymbol(currency.change)} {Math.abs(currency.change).toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rateRow}>
                    <View style={styles.rateItem}>
                      <Text style={styles.rateLabel}>Alış</Text>
                      <Text style={styles.rateValue}>{formatPrice(currency.buying)} ₺</Text>
                    </View>
                    <View style={styles.rateItem}>
                      <Text style={styles.rateLabel}>Satış</Text>
                      <Text style={styles.rateValue}>{formatPrice(currency.selling)} ₺</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🥇 Altın Fiyatları</Text>
              {gold.map((item, index) => (
                <View key={index} style={styles.rateCard}>
                  <View style={styles.rateHeader}>
                    <Text style={styles.goldName}>{item.name}</Text>
                    <View style={styles.changeBox}>
                      <Text style={[styles.changeText, { color: getChangeColor(item.change) }]}>
                        {getChangeSymbol(item.change)} {Math.abs(item.change).toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rateRow}>
                    <View style={styles.rateItem}>
                      <Text style={styles.rateLabel}>Alış</Text>
                      <Text style={styles.rateValue}>{formatPrice(item.buying)} ₺</Text>
                    </View>
                    <View style={styles.rateItem}>
                      <Text style={styles.rateLabel}>Satış</Text>
                      <Text style={styles.rateValue}>{formatPrice(item.selling)} ₺</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity onPress={fetchRates} style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>🔄 Yenile</Text>
            </TouchableOpacity>
          </>
        )}
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
    backgroundColor: '#9C27B0',
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
    padding: 15,
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
    backgroundColor: '#9C27B0',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  updateBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  updateText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingLeft: 5,
  },
  rateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  currencyCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  currencyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  goldName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  changeBox: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  changeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateItem: {
    flex: 1,
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  rateValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  refreshButton: {
    backgroundColor: '#9C27B0',
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

