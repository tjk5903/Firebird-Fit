import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { FirebirdColors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

interface WidgetProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void;
}

const Widget: React.FC<WidgetProps> = ({ title, value, subtitle, icon, color, onPress }) => (
  <TouchableOpacity style={styles.widget} onPress={onPress}>
    <LinearGradient
      colors={[color + '20', color + '10']}
      style={styles.widgetGradient}
    >
      <View style={styles.widgetHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.widgetTitle}>{title}</Text>
      </View>
      <Text style={styles.widgetValue}>{value}</Text>
      {subtitle && <Text style={styles.widgetSubtitle}>{subtitle}</Text>}
    </LinearGradient>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const isCoach = user?.role === 'coach';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleWorkoutAction = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
        // Ignore haptics errors
      });
      
      router.push('/(tabs)/workouts');
    } catch (error) {
      console.error('Error in handleWorkoutAction:', error);
      // Fallback navigation
      router.push('/(tabs)/workouts');
    }
  };

  const handleMessageAction = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
        // Ignore haptics errors
      });
      
      router.push('/(tabs)/messages');
    } catch (error) {
      console.error('Error in handleMessageAction:', error);
      // Fallback navigation
      router.push('/(tabs)/messages');
    }
  };

  const handleScheduleAction = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
        // Ignore haptics errors
      });
      
      router.push('/(tabs)/calendar');
    } catch (error) {
      console.error('Error in handleScheduleAction:', error);
      // Fallback navigation
      router.push('/(tabs)/calendar');
    }
  };

  const athleteWidgets = [
    {
      title: 'Workouts This Week',
      value: '4',
      subtitle: '2 remaining',
      icon: 'fitness' as const,
      color: FirebirdColors.royalBlue,
    },
    {
      title: 'Next Workout',
      value: 'Tomorrow',
      subtitle: 'Upper Body - 6:00 AM',
      icon: 'time' as const,
      color: FirebirdColors.gold,
    },
    {
      title: 'Team Messages',
      value: '3',
      subtitle: 'New messages',
      icon: 'chatbubbles' as const,
      color: FirebirdColors.success,
    },
    {
      title: 'Upcoming Games',
      value: 'Friday',
      subtitle: 'vs Eagles - 7:00 PM',
      icon: 'trophy' as const,
      color: FirebirdColors.warning,
    },
  ];

  const coachWidgets = [
    {
      title: 'Total Athletes',
      value: '24',
      subtitle: '18 active today',
      icon: 'people' as const,
      color: FirebirdColors.royalBlue,
    },
    {
      title: 'Workouts Created',
      value: '12',
      subtitle: 'This week',
      icon: 'create' as const,
      color: FirebirdColors.gold,
    },
    {
      title: 'Team Messages',
      value: '7',
      subtitle: 'Unread messages',
      icon: 'mail' as const,
      color: FirebirdColors.success,
    },
    {
      title: 'Next Game',
      value: 'Friday',
      subtitle: 'vs Eagles - 7:00 PM',
      icon: 'calendar' as const,
      color: FirebirdColors.warning,
    },
  ];

  const widgets = isCoach ? coachWidgets : athleteWidgets;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name} {isCoach ? '(Coach)' : ''}</Text>
            <Text style={styles.teamName}>{user?.team}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={logout}>
            <LinearGradient
              colors={[FirebirdColors.royalBlue, FirebirdColors.gold]}
              style={styles.profileGradient}
            >
              <Ionicons name="person" size={20} color={FirebirdColors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleWorkoutAction}>
              <LinearGradient
                colors={[FirebirdColors.royalBlue + '20', FirebirdColors.royalBlue + '10']}
                style={styles.actionGradient}
              >
                <Ionicons name={isCoach ? 'add-circle' : 'play-circle'} size={24} color={FirebirdColors.royalBlue} />
                <Text style={styles.actionText}>
                  {isCoach ? 'Create Workout' : 'Start Training'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleScheduleAction}>
              <LinearGradient
                colors={[FirebirdColors.success + '20', FirebirdColors.success + '10']}
                style={styles.actionGradient}
              >
                <Ionicons name="calendar-outline" size={24} color={FirebirdColors.success} />
                <Text style={styles.actionText}>
                  {isCoach ? 'Manage Schedule' : 'My Schedule'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleMessageAction}>
              <LinearGradient
                colors={[FirebirdColors.gold + '20', FirebirdColors.gold + '10']}
                style={styles.actionGradient}
              >
                <Ionicons name="chatbubble-ellipses" size={24} color={FirebirdColors.gold} />
                <Text style={styles.actionText}>Team Chat</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard Widgets */}
        <View style={styles.widgetsSection}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          <View style={styles.widgetsGrid}>
            {widgets.map((widget, index) => (
              <Widget key={index} {...widget} />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle" size={20} color={FirebirdColors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {isCoach ? 'Workout assigned to John Doe' : 'Completed Upper Body workout'}
                </Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="chatbubble" size={20} color={FirebirdColors.royalBlue} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {isCoach ? 'Message from Sarah Johnson' : 'New message from Coach'}
                </Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="calendar" size={20} color={FirebirdColors.gold} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Game vs Eagles scheduled for Friday
                </Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  greeting: {
    fontSize: 16,
    color: FirebirdColors.mediumGray,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginTop: 2,
  },
  teamName: {
    fontSize: 14,
    color: FirebirdColors.royalBlue,
    marginTop: 2,
  },
  profileButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginBottom: 15,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: FirebirdColors.darkGray,
    marginTop: 5,
    textAlign: 'center',
  },
  widgetsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  widgetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  widget: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  widgetGradient: {
    padding: 15,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  widgetTitle: {
    fontSize: 12,
    color: FirebirdColors.mediumGray,
    marginLeft: 8,
    fontWeight: '500',
  },
  widgetValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginBottom: 5,
  },
  widgetSubtitle: {
    fontSize: 12,
    color: FirebirdColors.mediumGray,
  },
  activitySection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  activityCard: {
    backgroundColor: FirebirdColors.white,
    borderRadius: 15,
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FirebirdColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: FirebirdColors.darkGray,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: FirebirdColors.mediumGray,
  },
});
