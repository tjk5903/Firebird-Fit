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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

import { FirebirdColors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: string;
  notes?: string;
}

interface Workout {
  id: string;
  title: string;
  date: string;
  duration: string;
  exercises: Exercise[];
  completed: boolean;
  assignedBy?: string;
}

interface NewWorkout {
  title: string;
  duration: string;
  exercises: Exercise[];
}

const WorkoutCard: React.FC<{
  workout: Workout;
  isCoach: boolean;
  onPress: () => void;
  onEdit?: () => void;
}> = ({ workout, isCoach, onPress, onEdit }) => (
  <TouchableOpacity style={styles.workoutCard} onPress={onPress}>
    <LinearGradient
      colors={[FirebirdColors.white, FirebirdColors.softWhite]}
      style={styles.cardGradient}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Ionicons 
            name={workout.completed ? 'checkmark-circle' : 'fitness'} 
            size={24} 
            color={workout.completed ? FirebirdColors.success : FirebirdColors.royalBlue} 
          />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{workout.title}</Text>
            <Text style={styles.cardDate}>{workout.date}</Text>
          </View>
        </View>
        {isCoach && onEdit && (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Ionicons name="create" size={20} color={FirebirdColors.mediumGray} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.cardStat}>
          <Ionicons name="time" size={16} color={FirebirdColors.mediumGray} />
          <Text style={styles.cardStatText}>{workout.duration}</Text>
        </View>
        <View style={styles.cardStat}>
          <Ionicons name="barbell" size={16} color={FirebirdColors.mediumGray} />
          <Text style={styles.cardStatText}>{workout.exercises.length} exercises</Text>
        </View>
        {workout.assignedBy && (
          <View style={styles.cardStat}>
            <Ionicons name="person" size={16} color={FirebirdColors.mediumGray} />
            <Text style={styles.cardStatText}>by {workout.assignedBy}</Text>
          </View>
        )}
      </View>

      {!workout.completed && (
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>
            {isCoach ? 'View Details' : 'Start Workout'}
          </Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

export default function WorkoutsScreen() {
  const { user } = useAuth();
  const isCoach = user?.role === 'coach';
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState<NewWorkout>({
    title: '',
    duration: '',
    exercises: [],
  });

  // Mock data - replace with actual data from your backend
  const workouts: Workout[] = [
    {
      id: '1',
      title: 'Upper Body Strength',
      date: 'Today, 3:00 PM',
      duration: '45 min',
      exercises: [
        { name: 'Push-ups', sets: 3, reps: 15 },
        { name: 'Pull-ups', sets: 3, reps: 8 },
        { name: 'Bench Press', sets: 4, reps: 10, weight: '135 lbs' },
      ],
      completed: false,
      assignedBy: isCoach ? undefined : 'Coach Smith',
    },
    {
      id: '2',
      title: 'Cardio & Core',
      date: 'Yesterday, 4:00 PM',
      duration: '30 min',
      exercises: [
        { name: 'Running', sets: 1, reps: 1, notes: '20 minutes steady pace' },
        { name: 'Planks', sets: 3, reps: 1, notes: '60 seconds each' },
        { name: 'Mountain Climbers', sets: 3, reps: 20 },
      ],
      completed: true,
      assignedBy: isCoach ? undefined : 'Coach Smith',
    },
    {
      id: '3',
      title: 'Leg Day',
      date: 'Dec 15, 2:00 PM',
      duration: '60 min',
      exercises: [
        { name: 'Squats', sets: 4, reps: 12, weight: '185 lbs' },
        { name: 'Deadlifts', sets: 3, reps: 8, weight: '225 lbs' },
        { name: 'Lunges', sets: 3, reps: 10 },
      ],
      completed: false,
      assignedBy: isCoach ? undefined : 'Coach Smith',
    },
  ];

  const handleCreateWorkout = () => {
    if (!newWorkout.title || !newWorkout.duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    // Add workout creation logic here
    Alert.alert('Success', 'Workout created successfully!');
    setShowCreateModal(false);
    setNewWorkout({ title: '', duration: '', exercises: [] });
  };

  const renderWorkoutDetail = () => {
    if (!selectedWorkout) return null;

    const onSwipeDown = (event: any) => {
      if (event.nativeEvent.translationY > 100) {
        setSelectedWorkout(null);
      }
    };

    return (
      <Modal visible={!!selectedWorkout} animationType="slide" presentationStyle="pageSheet">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={onSwipeDown}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.swipeIndicator} />
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setSelectedWorkout(null)}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color={FirebirdColors.darkGray} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedWorkout.title}</Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.workoutInfo}>
                  <View style={styles.infoItem}>
                    <Ionicons name="time" size={20} color={FirebirdColors.royalBlue} />
                    <Text style={styles.infoText}>{selectedWorkout.duration}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="calendar" size={20} color={FirebirdColors.gold} />
                    <Text style={styles.infoText}>{selectedWorkout.date}</Text>
                  </View>
                </View>

                <Text style={styles.exercisesTitle}>Exercises</Text>
                {selectedWorkout.exercises.map((exercise, index) => (
                  <View key={index} style={styles.exerciseCard}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDetail}>
                      {exercise.sets} sets × {exercise.reps} reps
                    </Text>
                    {exercise.weight && (
                      <Text style={styles.exerciseDetail}>Weight: {exercise.weight}</Text>
                    )}
                    {exercise.notes && (
                      <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
                    )}
                  </View>
                ))}
              </ScrollView>

              {!selectedWorkout.completed && !isCoach && (
                <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.startWorkoutButton}>
                    <LinearGradient
                      colors={[FirebirdColors.royalBlue, FirebirdColors.gold]}
                      style={styles.startWorkoutGradient}
                    >
                      <Text style={styles.startWorkoutText}>Start Workout</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
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
                <Text style={styles.modalTitle}>Create Workout</Text>
                <TouchableOpacity onPress={handleCreateWorkout} style={styles.saveButtonContainer}>
                  <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Workout Title</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newWorkout.title}
                    onChangeText={(text) => setNewWorkout({...newWorkout, title: text})}
                    placeholder="Enter workout title"
                    placeholderTextColor={FirebirdColors.mediumGray}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Duration</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newWorkout.duration}
                    onChangeText={(text) => setNewWorkout({...newWorkout, duration: text})}
                    placeholder="e.g., 45 min"
                    placeholderTextColor={FirebirdColors.mediumGray}
                  />
                </View>

                <Text style={styles.exercisesTitle}>Exercises</Text>
                <TouchableOpacity style={styles.addExerciseButton}>
                  <Ionicons name="add" size={20} color={FirebirdColors.royalBlue} />
                  <Text style={styles.addExerciseText}>Add Exercise</Text>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </Modal>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isCoach ? 'Manage Workouts' : 'My Workouts'}
          </Text>
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
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              isCoach={isCoach}
              onPress={() => setSelectedWorkout(workout)}
              onEdit={isCoach ? () => Alert.alert('Edit', 'Edit workout functionality') : undefined}
            />
          ))}
        </ScrollView>

        {renderWorkoutDetail()}
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
    paddingHorizontal: 20,
  },
  workoutCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
  },
  cardDate: {
    fontSize: 14,
    color: FirebirdColors.mediumGray,
    marginTop: 2,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: FirebirdColors.lightGray,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardStatText: {
    fontSize: 12,
    color: FirebirdColors.mediumGray,
    marginLeft: 4,
  },
  startButton: {
    backgroundColor: FirebirdColors.royalBlue + '20',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: FirebirdColors.royalBlue,
    fontWeight: '600',
    fontSize: 14,
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
  workoutInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    backgroundColor: FirebirdColors.white,
    borderRadius: 15,
    padding: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: FirebirdColors.darkGray,
    marginLeft: 8,
    fontWeight: '500',
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginBottom: 15,
  },
  exerciseCard: {
    backgroundColor: FirebirdColors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginBottom: 5,
  },
  exerciseDetail: {
    fontSize: 14,
    color: FirebirdColors.mediumGray,
    marginBottom: 5,
  },
  exerciseNotes: {
    fontSize: 12,
    color: FirebirdColors.mediumGray,
    fontStyle: 'italic',
  },
  modalFooter: {
    padding: 20,
  },
  startWorkoutButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  startWorkoutGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  startWorkoutText: {
    color: FirebirdColors.white,
    fontSize: 18,
    fontWeight: '600',
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
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FirebirdColors.white,
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: FirebirdColors.royalBlue + '30',
    borderStyle: 'dashed',
  },
  addExerciseText: {
    fontSize: 16,
    color: FirebirdColors.royalBlue,
    marginLeft: 8,
    fontWeight: '500',
  },
}); 