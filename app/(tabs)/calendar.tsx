import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

import { FirebirdColors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'game' | 'practice' | 'workout' | 'meeting';
  description?: string;
  location?: string;
}

const EventTypeColors = {
  game: FirebirdColors.error,
  practice: FirebirdColors.royalBlue,
  workout: FirebirdColors.success,
  meeting: FirebirdColors.gold,
};

const EventCard: React.FC<{ 
  event: CalendarEvent; 
  isCoach: boolean;
  onPress: () => void;
  onEdit?: () => void;
}> = ({ event, isCoach, onPress, onEdit }) => (
  <TouchableOpacity style={styles.eventCard} onPress={onPress}>
    <View style={[styles.eventColorBar, { backgroundColor: EventTypeColors[event.type] }]} />
    <View style={styles.eventContent}>
      <View style={styles.eventHeader}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventTime}>{event.time}</Text>
        </View>
        {isCoach && onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Ionicons name="create" size={16} color={FirebirdColors.mediumGray} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.eventDetails}>
        <View style={styles.eventType}>
          <Ionicons 
            name={
              event.type === 'game' ? 'trophy' :
              event.type === 'practice' ? 'fitness' :
              event.type === 'workout' ? 'barbell' : 'people'
            } 
            size={14} 
            color={EventTypeColors[event.type]} 
          />
          <Text style={[styles.eventTypeText, { color: EventTypeColors[event.type] }]}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Text>
        </View>
        {event.location && (
          <View style={styles.eventLocation}>
            <Ionicons name="location" size={14} color={FirebirdColors.mediumGray} />
            <Text style={styles.eventLocationText}>{event.location}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

export default function CalendarScreen() {
  const { user } = useAuth();
  const isCoach = user?.role === 'coach';
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    type: 'practice' as CalendarEvent['type'],
    description: '',
    location: '',
  });

  // Mock data - replace with actual data from your backend
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Practice',
      date: new Date().toISOString().split('T')[0],
      time: '4:00 PM',
      type: 'practice',
      location: 'Main Gym',
      description: 'Regular team practice session',
    },
    {
      id: '2',
      title: 'vs Eagles',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '7:00 PM',
      type: 'game',
      location: 'Home Stadium',
      description: 'Championship game against Eagles',
    },
    {
      id: '3',
      title: 'Strength Training',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '6:00 AM',
      type: 'workout',
      location: 'Weight Room',
      description: 'Upper body strength training',
    },
    {
      id: '4',
      title: 'Team Meeting',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '3:00 PM',
      type: 'meeting',
      location: 'Conference Room',
      description: 'Strategy discussion for upcoming games',
    },
  ];

  const getEventsForDate = (date: string) => {
    return mockEvents.filter(event => event.date === date);
  };

  const getMarkedDates = () => {
    const marked: any = {};
    mockEvents.forEach(event => {
      marked[event.date] = {
        marked: true,
        dotColor: EventTypeColors[event.type],
      };
    });
    
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: FirebirdColors.royalBlue,
    };
    
    return marked;
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.time) {
      Alert.alert('Error', 'Please fill in event title and time');
      return;
    }
    // Add event creation logic here
    Alert.alert('Success', 'Event created successfully!');
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      time: '',
      type: 'practice',
      description: '',
      location: '',
    });
  };

  const renderEventDetail = () => {
    if (!selectedEvent) return null;

    const onSwipeDown = (event: any) => {
      if (event.nativeEvent.translationY > 100) {
        setSelectedEvent(null);
      }
    };

    return (
      <Modal visible={!!selectedEvent} animationType="slide" presentationStyle="pageSheet">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={onSwipeDown}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.swipeIndicator} />
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setSelectedEvent(null)}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color={FirebirdColors.darkGray} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Event Details</Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.eventDetailCard}>
                  <View style={[styles.eventColorBar, { backgroundColor: EventTypeColors[selectedEvent.type] }]} />
                  <View style={styles.eventDetailContent}>
                    <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
                    
                    <View style={styles.eventDetailItem}>
                      <Ionicons name="calendar" size={20} color={FirebirdColors.royalBlue} />
                      <Text style={styles.eventDetailText}>{selectedEvent.date}</Text>
                    </View>
                    
                    <View style={styles.eventDetailItem}>
                      <Ionicons name="time" size={20} color={FirebirdColors.gold} />
                      <Text style={styles.eventDetailText}>{selectedEvent.time}</Text>
                    </View>
                    
                    {selectedEvent.location && (
                      <View style={styles.eventDetailItem}>
                        <Ionicons name="location" size={20} color={FirebirdColors.success} />
                        <Text style={styles.eventDetailText}>{selectedEvent.location}</Text>
                      </View>
                    )}
                    
                    <View style={styles.eventDetailItem}>
                      <Ionicons 
                        name={
                          selectedEvent.type === 'game' ? 'trophy' :
                          selectedEvent.type === 'practice' ? 'fitness' :
                          selectedEvent.type === 'workout' ? 'barbell' : 'people'
                        } 
                        size={20} 
                        color={EventTypeColors[selectedEvent.type]} 
                      />
                      <Text style={[styles.eventDetailText, { color: EventTypeColors[selectedEvent.type] }]}>
                        {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                      </Text>
                    </View>

                    {selectedEvent.description && (
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionLabel}>Description</Text>
                        <Text style={styles.descriptionText}>{selectedEvent.description}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </Modal>
    );
  };

  const renderCreateModal = () => {
    const onSwipeDown = (event: any) => {
      if (event.nativeEvent.translationY > 100) {
        setShowCreateModal(false);
      }
    };

    return (
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={onSwipeDown}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.swipeIndicator} />
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShowCreateModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={FirebirdColors.darkGray} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Create Event</Text>
                <TouchableOpacity onPress={handleCreateEvent} style={styles.saveButtonContainer}>
                  <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Event Title</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newEvent.title}
                    onChangeText={(text) => setNewEvent({...newEvent, title: text})}
                    placeholder="Enter event title"
                    placeholderTextColor={FirebirdColors.mediumGray}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Time</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newEvent.time}
                    onChangeText={(text) => setNewEvent({...newEvent, time: text})}
                    placeholder="e.g., 3:00 PM"
                    placeholderTextColor={FirebirdColors.mediumGray}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Event Type</Text>
                  <View style={styles.typeSelector}>
                    {(['practice', 'game', 'workout', 'meeting'] as const).map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeButton,
                          newEvent.type === type && styles.activeTypeButton,
                          { borderColor: EventTypeColors[type] }
                        ]}
                        onPress={() => setNewEvent({...newEvent, type})}
                      >
                        <Ionicons
                          name={
                            type === 'game' ? 'trophy' :
                            type === 'practice' ? 'fitness' :
                            type === 'workout' ? 'barbell' : 'people'
                          }
                          size={16}
                          color={newEvent.type === type ? FirebirdColors.white : EventTypeColors[type]}
                        />
                        <Text
                          style={[
                            styles.typeText,
                            newEvent.type === type && styles.activeTypeText,
                            { color: newEvent.type === type ? FirebirdColors.white : EventTypeColors[type] }
                          ]}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Location (Optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newEvent.location}
                    onChangeText={(text) => setNewEvent({...newEvent, location: text})}
                    placeholder="Enter location"
                    placeholderTextColor={FirebirdColors.mediumGray}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Description (Optional)</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={newEvent.description}
                    onChangeText={(text) => setNewEvent({...newEvent, description: text})}
                    placeholder="Enter description"
                    placeholderTextColor={FirebirdColors.mediumGray}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </Modal>
    );
  };

  const todayEvents = getEventsForDate(selectedDate);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendar</Text>
          {isCoach && (
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => setShowCreateModal(true)}
            >
              <LinearGradient
                colors={[FirebirdColors.royalBlue, FirebirdColors.gold]}
                style={styles.createButtonGradient}
              >
                <Ionicons name="add" size={20} color={FirebirdColors.white} />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
              markedDates={getMarkedDates()}
              theme={{
                backgroundColor: FirebirdColors.white,
                calendarBackground: FirebirdColors.white,
                textSectionTitleColor: FirebirdColors.darkGray,
                selectedDayBackgroundColor: FirebirdColors.royalBlue,
                selectedDayTextColor: FirebirdColors.white,
                todayTextColor: FirebirdColors.royalBlue,
                dayTextColor: FirebirdColors.darkGray,
                textDisabledColor: FirebirdColors.mediumGray,
                dotColor: FirebirdColors.royalBlue,
                selectedDotColor: FirebirdColors.white,
                arrowColor: FirebirdColors.royalBlue,
                monthTextColor: FirebirdColors.darkGray,
                indicatorColor: FirebirdColors.royalBlue,
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />
          </View>

          <View style={styles.eventsSection}>
            <Text style={styles.sectionTitle}>
              Events for {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            
            {todayEvents.length > 0 ? (
              todayEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isCoach={isCoach}
                  onPress={() => setSelectedEvent(event)}
                  onEdit={isCoach ? () => Alert.alert('Edit', 'Edit event functionality') : undefined}
                />
              ))
            ) : (
              <View style={styles.noEventsContainer}>
                <Ionicons name="calendar-outline" size={48} color={FirebirdColors.mediumGray} />
                <Text style={styles.noEventsText}>No events scheduled for this day</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {renderEventDetail()}
        {renderCreateModal()}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FirebirdColors.softWhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
  },
  createButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  createButtonGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: FirebirdColors.white,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventsSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginBottom: 15,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: FirebirdColors.white,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventColorBar: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: 15,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: FirebirdColors.mediumGray,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: FirebirdColors.lightGray,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTypeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationText: {
    fontSize: 12,
    color: FirebirdColors.mediumGray,
    marginLeft: 4,
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noEventsText: {
    fontSize: 16,
    color: FirebirdColors.mediumGray,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: FirebirdColors.softWhite,
  },
  swipeIndicator: {
    width: 40,
    height: 4,
    backgroundColor: FirebirdColors.mediumGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: FirebirdColors.lightGray,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: FirebirdColors.lightGray,
  },
  saveButtonContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: FirebirdColors.royalBlue + '20',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: FirebirdColors.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: FirebirdColors.royalBlue,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  eventDetailCard: {
    flexDirection: 'row',
    backgroundColor: FirebirdColors.white,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventDetailContent: {
    flex: 1,
    padding: 20,
  },
  eventDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginBottom: 20,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  eventDetailText: {
    fontSize: 16,
    color: FirebirdColors.darkGray,
    marginLeft: 12,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: FirebirdColors.darkGray,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: FirebirdColors.mediumGray,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: FirebirdColors.darkGray,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: FirebirdColors.white,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: FirebirdColors.darkGray,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: FirebirdColors.white,
  },
  activeTypeButton: {
    backgroundColor: FirebirdColors.royalBlue,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  activeTypeText: {
    color: FirebirdColors.white,
  },
}); 