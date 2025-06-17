import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'athlete' | 'coach';
  team?: string;
  teamId?: string;
  sport?: string;
  position?: string;
  avatar?: string;
  joinedAt?: Date;
  isActive?: boolean;
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  code: string; // 6-digit join code
  coachId: string;
  coachName: string;
  createdAt: Date;
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  name: string;
  email: string;
  position?: string;
  joinedAt: Date;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isFirstTime: boolean;
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  login: (email: string, password: string, role: 'athlete' | 'coach') => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  createTeam: (teamName: string, sport: string) => Promise<string>;
  joinTeam: (teamCode: string) => Promise<void>;
  removeTeamMember: (memberId: string) => Promise<void>;
  updateMemberPosition: (memberId: string, position: string) => Promise<void>;
  generateNewTeamCode: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const [userData, onboardingComplete, teamData, membersData] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('onboardingComplete'),
        AsyncStorage.getItem('currentTeam'),
        AsyncStorage.getItem('teamMembers')
      ]);

      if (userData) {
        setUser(JSON.parse(userData));
      }

      if (teamData) {
        setCurrentTeam(JSON.parse(teamData));
      }

      if (membersData) {
        setTeamMembers(JSON.parse(membersData));
      }

      setIsFirstTime(onboardingComplete !== 'true');
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, role: 'athlete' | 'coach') => {
    try {
      // Simulate API call - replace with actual authentication
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        role,
        team: 'Firebird High School',
        sport: 'Football',
        position: role === 'athlete' ? 'Quarterback' : undefined,
        avatar: undefined
      };

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      setIsFirstTime(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const generateTeamCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createTeam = async (teamName: string, sport: string) => {
    if (!user || user.role !== 'coach') {
      throw new Error('Only coaches can create teams');
    }

    try {
      const teamCode = generateTeamCode();
      const team: Team = {
        id: Date.now().toString(),
        name: teamName,
        sport,
        code: teamCode,
        coachId: user.id,
        coachName: user.name,
        createdAt: new Date(),
        isActive: true,
      };

      // Save team data
      await AsyncStorage.setItem('currentTeam', JSON.stringify(team));
      await AsyncStorage.setItem('teamMembers', JSON.stringify([]));
      
      // Update user with team info
      const updatedUser = { ...user, teamId: team.id, team: teamName };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setCurrentTeam(team);
      setUser(updatedUser);
      setTeamMembers([]);

      return teamCode;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  };

  const joinTeam = async (teamCode: string) => {
    if (!user || user.role !== 'athlete') {
      throw new Error('Only athletes can join teams');
    }

    try {
      // In a real app, this would query your backend to find the team by code
      // For now, we'll simulate finding a team
      const mockTeam: Team = {
        id: 'team_' + teamCode,
        name: 'Mock Team',
        sport: 'Football',
        code: teamCode,
        coachId: 'coach_1',
        coachName: 'Coach Smith',
        createdAt: new Date(),
        isActive: true,
      };
      
      // Create new team member
      const newMember: TeamMember = {
        id: Date.now().toString(),
        userId: user.id,
        teamId: mockTeam.id,
        name: user.name,
        email: user.email,
        position: user.position,
        joinedAt: new Date(),
        isActive: true,
      };

      // Update local storage
      const existingMembers = await AsyncStorage.getItem('teamMembers');
      const members = existingMembers ? JSON.parse(existingMembers) : [];
      members.push(newMember);
      
      await AsyncStorage.setItem('teamMembers', JSON.stringify(members));
      await AsyncStorage.setItem('currentTeam', JSON.stringify(mockTeam));
      
      // Update user
      const updatedUser = { ...user, teamId: mockTeam.id, team: mockTeam.name };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setCurrentTeam(mockTeam);
      setTeamMembers(members);
      setUser(updatedUser);
      
    } catch (error) {
      console.error('Error joining team:', error);
      throw error;
    }
  };

  const removeTeamMember = async (memberId: string) => {
    if (!user || user.role !== 'coach' || !currentTeam) {
      throw new Error('Only coaches can remove team members');
    }

    try {
      const updatedMembers = teamMembers.filter(member => member.id !== memberId);
      await AsyncStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      setTeamMembers(updatedMembers);
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  };

  const updateMemberPosition = async (memberId: string, position: string) => {
    if (!user || user.role !== 'coach' || !currentTeam) {
      throw new Error('Only coaches can update member positions');
    }

    try {
      const updatedMembers = teamMembers.map(member =>
        member.id === memberId ? { ...member, position } : member
      );
      await AsyncStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      setTeamMembers(updatedMembers);
    } catch (error) {
      console.error('Error updating member position:', error);
      throw error;
    }
  };

  const generateNewTeamCode = async () => {
    if (!user || user.role !== 'coach' || !currentTeam) {
      throw new Error('Only coaches can generate new team codes');
    }

    try {
      const newCode = generateTeamCode();
      const updatedTeam = { ...currentTeam, code: newCode };
      
      await AsyncStorage.setItem('currentTeam', JSON.stringify(updatedTeam));
      setCurrentTeam(updatedTeam);
      
      return newCode;
    } catch (error) {
      console.error('Error generating new team code:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isFirstTime,
    currentTeam,
    teamMembers,
    login,
    logout,
    completeOnboarding,
    createTeam,
    joinTeam,
    removeTeamMember,
    updateMemberPosition,
    generateNewTeamCode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 