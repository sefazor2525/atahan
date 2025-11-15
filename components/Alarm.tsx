import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AlarmItem {
  id: string;
  time: Date;
  label: string;
  enabled: boolean;
  repeat: boolean;
}

export default function Alarm({ onClose }: { onClose: () => void }) {
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [editingAlarm, setEditingAlarm] = useState<string | null>(null);

  useEffect(() => {
    // Örnek alarmlar
    const defaultAlarms: AlarmItem[] = [
      {
        id: '1',
        time: new Date(),
        label: 'Sabah Alarmı',
        enabled: false,
        repeat: true,
      },
    ];
    setAlarms(defaultAlarms);
  }, []);

  const addAlarm = () => {
    const newAlarm: AlarmItem = {
      id: Date.now().toString(),
      time: selectedTime,
      label: `Alarm ${alarms.length + 1}`,
      enabled: true,
      repeat: false,
    };
    setAlarms([...alarms, newAlarm]);
    setShowPicker(false);
  };

  const updateAlarm = (id: string, updates: Partial<AlarmItem>) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, ...updates } : alarm
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const onTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (date) {
      setSelectedTime(date);
      if (editingAlarm) {
        updateAlarm(editingAlarm, { time: date });
        setEditingAlarm(null);
      } else if (event.type !== 'dismissed') {
        addAlarm();
      }
    }
  };

  const openTimePicker = (alarmId?: string) => {
    if (alarmId) {
      const alarm = alarms.find(a => a.id === alarmId);
      if (alarm) {
        setSelectedTime(alarm.time);
        setEditingAlarm(alarmId);
      }
    } else {
      setSelectedTime(new Date());
      setEditingAlarm(null);
    }
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alarm</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {alarms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz alarm yok</Text>
            <Text style={styles.emptySubtext}>Yeni alarm eklemek için + butonuna basın</Text>
          </View>
        ) : (
          alarms.map((alarm) => (
            <View key={alarm.id} style={styles.alarmCard}>
              <TouchableOpacity 
                style={styles.alarmContent}
                onPress={() => openTimePicker(alarm.id)}
              >
                <View style={styles.alarmTimeContainer}>
                  <Text style={styles.alarmTime}>{formatTime(alarm.time)}</Text>
                  <Text style={styles.alarmLabel}>{alarm.label}</Text>
                  {alarm.repeat && (
                    <Text style={styles.repeatText}>Her gün</Text>
                  )}
                </View>
                <Switch
                  value={alarm.enabled}
                  onValueChange={(value) => updateAlarm(alarm.id, { enabled: value })}
                  trackColor={{ false: '#767577', true: '#E91E63' }}
                  thumbColor={alarm.enabled ? '#FFFFFF' : '#f4f3f4'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteAlarm(alarm.id)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openTimePicker()}
        >
          <Text style={styles.addButtonText}>+ Yeni Alarm Ekle</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
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
    backgroundColor: '#E91E63',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
  },
  alarmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  alarmContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  alarmTimeContainer: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333',
    marginBottom: 5,
  },
  alarmLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  repeatText: {
    fontSize: 14,
    color: '#E91E63',
  },
  deleteButton: {
    padding: 15,
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 24,
  },
  addButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

