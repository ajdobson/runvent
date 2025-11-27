import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../services/StorageService';
import { DayChallenge, UnitType } from '../types';
import { formatDate, getDecemberDays, isDateInPast, isDateToday } from '../utils/dateUtils';
import SettingsScreen from './SettingsScreen';

export default function CalendarScreen() {
  const [challenges, setChallenges] = useState<DayChallenge[]>([]);
  const [unitType, setUnitType] = useState<UnitType>('km');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayChallenge | null>(null);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);

  const loadData = async () => {
    const settings = await StorageService.getSettings();
    if (settings) {
      setUnitType(settings.unitType);
      
      const decemberDays = getDecemberDays(settings.year);
      const challengeData: DayChallenge[] = [];

      for (let i = 0; i < 24; i++) {
        const date = decemberDays[i];
        const dateStr = formatDate(date);
        const run = await StorageService.getRunByDate(dateStr);
        
        challengeData.push({
          day: i + 1,
          targetDistance: i + 1,
          completed: run?.completed || false,
          hours: run?.hours,
          minutes: run?.minutes,
          seconds: run?.seconds,
          date,
        });
      }

      setChallenges(challengeData);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDayPress = (challenge: DayChallenge) => {
    const canLog = isDateToday(challenge.date) || isDateInPast(challenge.date);
    
    if (!canLog) {
      Alert.alert(
        'Future Date',
        'You can only log runs for today or past dates!',
        [{ text: 'OK' }]
      );
      return;
    }

    setSelectedDay(challenge);
    setHours(challenge.hours?.toString() || '');
    setMinutes(challenge.minutes?.toString() || '');
    setSeconds(challenge.seconds?.toString() || '');
    setModalVisible(true);
  };

  const handleSaveRun = async () => {
    if (!selectedDay) return;

    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    
    if (h === 0 && m === 0 && s === 0) {
      Alert.alert('Invalid Time', 'Please enter a valid time.');
      return;
    }

    if (m < 0 || m > 59 || s < 0 || s > 59 || h < 0) {
      Alert.alert('Invalid Time', 'Please enter valid hours (0+), minutes (0-59), and seconds (0-59).');
      return;
    }

    try {
      await StorageService.saveRun({
        date: formatDate(selectedDay.date),
        hours: h,
        minutes: m,
        seconds: s,
        completed: true,
        timestamp: Date.now(),
      });

      await loadData();
      setModalVisible(false);
      setHours('');
      setMinutes('');
      setSeconds('');
      
      Alert.alert('Great Job!', `You completed Day ${selectedDay.day}! 🎉`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save run. Please try again.');
    }
  };

  const renderDay = ({ item, index }: { item: DayChallenge; index: number }) => {
    const isToday = isDateToday(item.date);
    const isPast = isDateInPast(item.date);
    const canLog = isToday || isPast;
    const isLeft = index % 2 === 0;

    return (
      <View style={styles.roadSection}>
        {/* Road Path */}
        <View style={styles.roadPath}>
          <View style={styles.roadLine} />
          <View style={[styles.roadDot, item.completed && styles.roadDotCompleted]} />
          <View style={styles.roadLine} />
        </View>

        {/* Day Card - alternating left/right */}
        <View style={[styles.cardContainer, isLeft ? styles.cardLeft : styles.cardRight]}>
          <TouchableOpacity
            style={[
              styles.dayCard,
              item.completed && styles.dayCardCompleted,
              isToday && styles.dayCardToday,
              !canLog && styles.dayCardLocked,
            ]}
            onPress={() => handleDayPress(item)}
            disabled={!canLog}
          >
            <View style={styles.dayHeader}>
              <Text style={styles.dayNumber}>
                Day {item.day} {item.completed && '⭐'}
              </Text>
            </View>
            <Text style={styles.targetText}>
              Target: {item.targetDistance} {unitType}
            </Text>
            {item.completed && (
              <Text style={styles.actualText}>
                Time: {item.hours || 0}h {item.minutes || 0}m {item.seconds || 0}s
              </Text>
            )}
            {isToday && <Text style={styles.todayBadge}>🎅 TODAY 🎅</Text>}
            {!canLog && <Text style={styles.lockedBadge}>LOCKED</Text>}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.fullScreen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff4d2" translucent={false} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons name="settings-outline" size={28} color="#8a2a39" />
          </TouchableOpacity>
        </View>

      <FlatList
        data={challenges}
        renderItem={renderDay}
        keyExtractor={(item) => item.day.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <SafeAreaView style={styles.settingsModal}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsHeaderTitle}>Settings</Text>
            <TouchableOpacity 
              onPress={() => {
                setSettingsVisible(false);
                loadData(); // Reload data when settings close
              }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <SettingsScreen />
        </SafeAreaView>
      </Modal>

      {/* Run Logging Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Day {selectedDay?.day}
            </Text>
            <Text style={styles.modalSubtitle}>
              Target: {selectedDay?.targetDistance} {unitType}
            </Text>
            <Text style={styles.timeLabel}>How long did it take?</Text>

            <View style={styles.timeInputContainer}>
              <View style={styles.timeInputGroup}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="0"
                  keyboardType="number-pad"
                  value={hours}
                  onChangeText={setHours}
                  maxLength={2}
                />
                <Text style={styles.timeUnit}>hours</Text>
              </View>
              
              <View style={styles.timeInputGroup}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="0"
                  keyboardType="number-pad"
                  value={minutes}
                  onChangeText={setMinutes}
                  maxLength={2}
                />
                <Text style={styles.timeUnit}>mins</Text>
              </View>
              
              <View style={styles.timeInputGroup}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="0"
                  keyboardType="number-pad"
                  value={seconds}
                  onChangeText={setSeconds}
                  maxLength={2}
                />
                <Text style={styles.timeUnit}>secs</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setHours('');
                  setMinutes('');
                  setSeconds('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveRun}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#fff4d2',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff4d2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#228b22',
    position: 'relative',
  },
  logo: {
    height: 50,
    width: '70%',
    maxWidth: 300,
  },
  settingsButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  settingsModal: {
    flex: 1,
    backgroundColor: '#fff4d2',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8a2a39',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingsHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },
  roadSection: {
    width: '100%',
    marginBottom: 0,
    position: 'relative',
  },
  roadPath: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 60,
    marginLeft: -30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  roadLine: {
    width: 4,
    flex: 1,
    backgroundColor: '#fff',
    opacity: 0.8,
    shadowColor: '#87ceeb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  roadDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#8a2a39',
    zIndex: 2,
    shadowColor: '#87ceeb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  roadDotCompleted: {
    backgroundColor: '#228b22',
    borderColor: '#ffd700',
  },
  cardContainer: {
    width: '60%',
    zIndex: 3,
    marginBottom: 20,
  },
  cardLeft: {
    alignSelf: 'flex-start',
    marginLeft: 0,
  },
  cardRight: {
    alignSelf: 'flex-end',
    marginRight: 0,
  },
  dayCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#8a2a39',
    minHeight: 100,
    shadowColor: '#87ceeb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCardCompleted: {
    borderColor: '#228b22',
    backgroundColor: '#f0fff0',
    borderWidth: 4,
  },
  dayCardToday: {
    borderColor: '#ffd700',
    backgroundColor: '#fffef0',
    borderWidth: 4,
  },
  dayCardLocked: {
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  targetText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  completedIcon: {
    fontSize: 24,
  },
  actualText: {
    fontSize: 13,
    color: '#228b22',
    fontWeight: '600',
    textAlign: 'center',
  },
  todayBadge: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8a2a39',
    textAlign: 'center',
  },
  lockedBadge: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  timeInputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    marginBottom: 4,
  },
  timeUnit: {
    fontSize: 12,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  saveButton: {
    backgroundColor: '#FF4444',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

