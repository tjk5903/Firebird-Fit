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
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

import { FirebirdColors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileStat {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface SettingItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

const StatCard: React.FC<{ stat: ProfileStat }> = ({ stat }) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={[stat.color + '20', stat.color + '10']}
      style={styles.statGradient}
    >
      <Ionicons name={stat.icon} size={24} color={stat.color} />
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </LinearGradient>
  </View>
);

const SettingRow: React.FC<{ setting: SettingItem }> = ({ setting }) => (
  <TouchableOpacity 
    style={styles.settingRow} 
    onPress={setting.onPress}
    disabled={setting.type === 'toggle'}
  >
    <View style={styles.settingLeft}>
      <Ionicons name={setting.icon} size={20} color={FirebirdColors.royalBlue} />
      <Text style={styles.settingLabel}>{setting.label}</Text>
    </View>
    {setting.type === 'toggle' ? (
      <Switch
        value={setting.value}
        onValueChange={setting.onToggle}
        trackColor={{ false: FirebirdColors.lightGray, true: FirebirdColors.royalBlue + '40' }}
        thumbColor={setting.value ? FirebirdColors.royalBlue : FirebirdColors.mediumGray}
      />
    ) : (
      <Ionicons name="chevron-forward" size={20} color={FirebirdColors.mediumGray} />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const isCoach = user?.role === 'coach';
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    team: user?.team || '',
    position: user?.position || '',
  });

  // Mock settings state
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSync: true,
    biometrics: false,
  });

  const athleteStats: ProfileStat[] = [
    {
      label: 'Workouts',
      value: '24',
      icon: 'fitness',
      color: FirebirdColors.royalBlue,
    },
    {
      label: 'Streak',
      value: '7 days',
      icon: 'flame',
      color: FirebirdColors.gold,
    },
    {
      label: 'PR\'s',
      value: '12',
      icon: 'trophy',
      color: FirebirdColors.success,
    },
    {
      label: 'Hours',
      value: '48h',
      icon: 'time',
      color: FirebirdColors.error,
    },
  ];

  const coachStats: ProfileStat[] = [
    {
      label: 'Athletes',
      value: '28',
      icon: 'people',
      color: FirebirdColors.royalBlue,
    },
    {
      label: 'Programs',
      value: '15',
      icon: 'library',
      color: FirebirdColors.gold,
    },
    {
      label: 'Sessions',
      value: '156',
      icon: 'calendar',
      color: FirebirdColors.success,
    },
    {
      label: 'Experience',
      value: '5 yrs',
      icon: 'medal',
      color: FirebirdColors.error,
    },
  ];

  const settingsItems: SettingItem[] = [
    {
      label: 'Push Notifications',
      icon: 'notifications',
      type: 'toggle',
      value: settings.notifications,
      onToggle: (value) => setSettings(prev => ({ ...prev, notifications: value })),
    },
    {
      label: 'Dark Mode',
      icon: 'moon',
      type: 'toggle',
      value: settings.darkMode,
      onToggle: (value) => setSettings(prev => ({ ...prev, darkMode: value })),
    },
    {
      label: 'Auto Sync',
      icon: 'sync',
      type: 'toggle',
      value: settings.autoSync,
      onToggle: (value) => setSettings(prev => ({ ...prev, autoSync: value })),
    },
    {
      label: 'Biometric Login',
      icon: 'finger-print',
      type: 'toggle',
      value: settings.biometrics,
      onToggle: (value) => setSettings(prev => ({ ...prev, biometrics: value })),
    },
    {
      label: 'Privacy Policy',
      icon: 'shield-checkmark',
      type: 'action',
      onPress: () => Alert.alert('Privacy Policy', 'Privacy policy content'),
    },
    {
      label: 'Terms of Service',
      icon: 'document-text',
      type: 'action',
      onPress: () => Alert.alert('Terms of Service', 'Terms of service content'),
    },
    {
      label: 'Help & Support',
      icon: 'help-circle',
      type: 'action',
      onPress: () => Alert.alert('Help & Support', 'Contact support at help@firebirdfit.com'),
    },
  ];

  const handleSaveProfile = () => {
    // Add profile update logic here
    Alert.alert('Success', 'Profile updated successfully!');
    setShowEditModal(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const renderEditModal = () => {
    const onSwipeDown = (event: any) => {
      if (event.nativeEvent.translationY > 100) {
        setShowEditModal(false);
      }
    };

    return (
      <Modal visible={showEditModal} animationType="slide" presentationStyle="pageSheet">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={onSwipeDown}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.swipeIndicator} />
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShowEditModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={FirebirdColors.darkGray} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButtonContainer}>
                  <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editedProfile.name}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
                    placeholder="Enter your name"
                    placeholderTextColor={FirebirdColors.mediumGray}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editedProfile.email}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
                    placeholder="Enter your email"
                    placeholderTextColor={FirebirdColors.mediumGray}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Team</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editedProfile.team}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, team: text }))}
                    placeholder="Enter your team"
                    placeholderTextColor={FirebirdColors.mediumGray}
                  />
                </View>

                {!isCoach && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Position</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editedProfile.position}
                      onChangeText={(text) => setEditedProfile(prev => ({ ...prev, position: text }))}
                      placeholder="Enter your position"
                      placeholderTextColor={FirebirdColors.mediumGray}
                    />
                  </View>
                )}
              </ScrollView>
            </SafeAreaView>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </Modal>
    );
  };

  const stats = isCoach ? coachStats : athleteStats;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={[FirebirdColors.royalBlue, FirebirdColors.gold]}
              style={styles.avatarGradient}
            >
              <Ionicons name="person" size={40} color={FirebirdColors.white} />
            </LinearGradient>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userRole}>
              {isCoach ? 'Coach' : 'Athlete'} • {user?.team}
            </Text>
            {!isCoach && user?.position && (
              <Text style={styles.userPosition}>{user.position}</Text>
            )}
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setShowEditModal(true)}
            >
              <Ionicons name="create" size={16} color={FirebirdColors.royalBlue} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>
              {isCoach ? 'Coaching Stats' : 'Your Stats'}
            </Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsContainer}>
              {settingsItems.map((setting, index) => (
                <SettingRow key={index} setting={setting} />
              ))}
            </View>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color={FirebirdColors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {renderEditModal()}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FirebirdColors.softWhite,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: FirebirdColors.mediumGray,
    marginBottom: 5,
  },
  userPosition: {
    fontSize: 14,
    color: FirebirdColors.royalBlue,
    fontWeight: '500',
    marginBottom: 15,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FirebirdColors.royalBlue + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    color: FirebirdColors.royalBlue,
    fontWeight: '500',
    marginLeft: 6,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: FirebirdColors.white,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: FirebirdColors.mediumGray,
    fontWeight: '500',
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  settingsContainer: {
    backgroundColor: FirebirdColors.white,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: FirebirdColors.lightGray,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: FirebirdColors.darkGray,
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FirebirdColors.white,
    borderRadius: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: FirebirdColors.error + '30',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: FirebirdColors.error,
    marginLeft: 8,
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
}); 