import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

import { FirebirdColors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
  participants: string[];
  avatar?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

const ChatRoomCard: React.FC<{ 
  room: ChatRoom; 
  onPress: () => void;
}> = ({ room, onPress }) => (
  <TouchableOpacity style={styles.chatRoomCard} onPress={onPress}>
    <View style={styles.avatarContainer}>
      <LinearGradient
        colors={[FirebirdColors.royalBlue, FirebirdColors.gold]}
        style={styles.avatarGradient}
      >
        <Ionicons 
          name={room.isGroup ? 'people' : 'person'} 
          size={24} 
          color={FirebirdColors.white} 
        />
      </LinearGradient>
      {room.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{room.unreadCount}</Text>
        </View>
      )}
    </View>
    
    <View style={styles.chatInfo}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatName}>{room.name}</Text>
        <Text style={styles.chatTime}>{room.lastMessageTime}</Text>
      </View>
      <Text style={styles.lastMessage} numberOfLines={1}>
        {room.lastMessage}
      </Text>
    </View>
  </TouchableOpacity>
);

const MessageBubble: React.FC<{
  message: ChatMessage;
  isOwnMessage: boolean;
}> = ({ message, isOwnMessage }) => (
  <View style={[
    styles.messageBubble,
    isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
  ]}>
    {!isOwnMessage && (
      <Text style={styles.senderName}>{message.userName}</Text>
    )}
    <Text style={[
      styles.messageText,
      isOwnMessage ? styles.ownMessageText : styles.otherMessageText
    ]}>
      {message.text}
    </Text>
    <Text style={styles.messageTime}>
      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Text>
  </View>
);

export default function MessagesScreen() {
  const { user } = useAuth();
  const isCoach = user?.role === 'coach';
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Mock data - replace with actual data from your backend
  const mockChatRooms: ChatRoom[] = [
    {
      id: '1',
      name: 'Team Chat',
      lastMessage: 'Great practice today everyone!',
      lastMessageTime: '2:30 PM',
      unreadCount: 3,
      isGroup: true,
      participants: ['coach', 'athlete1', 'athlete2', 'athlete3'],
    },
    {
      id: '2',
      name: isCoach ? 'John Doe' : 'Coach Smith',
      lastMessage: 'Can we discuss the workout plan?',
      lastMessageTime: '1:45 PM',
      unreadCount: 1,
      isGroup: false,
      participants: ['coach', 'athlete1'],
    },
    {
      id: '3',
      name: 'Captains Group',
      lastMessage: 'Meeting scheduled for tomorrow',
      lastMessageTime: '12:15 PM',
      unreadCount: 0,
      isGroup: true,
      participants: ['coach', 'captain1', 'captain2'],
    },
    {
      id: '4',
      name: isCoach ? 'Sarah Johnson' : 'Coach Smith',
      lastMessage: 'Thanks for the feedback!',
      lastMessageTime: '11:30 AM',
      unreadCount: 0,
      isGroup: false,
      participants: ['coach', 'athlete2'],
    },
  ];

  const mockAthletes = [
    { id: 'athlete1', name: 'John Doe' },
    { id: 'athlete2', name: 'Sarah Johnson' },
    { id: 'athlete3', name: 'Mike Wilson' },
    { id: 'athlete4', name: 'Emma Davis' },
    { id: 'athlete5', name: 'Chris Brown' },
  ];

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      text: 'Great practice today everyone! Keep up the good work.',
      userId: 'coach',
      userName: 'Coach Smith',
      timestamp: new Date(),
    },
    {
      id: '2',
      text: 'Thanks coach! Feeling stronger every day.',
      userId: 'athlete1',
      userName: 'John Doe',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '3',
      text: 'Same here! The new workout routine is really challenging but effective.',
      userId: 'athlete2',
      userName: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 120000),
    },
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      userId: user?.id || '1',
      userName: user?.name || 'User',
      timestamp: new Date(),
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage('');
  };

  const handleOpenChat = (room: ChatRoom) => {
    setSelectedRoom(room);
    setMessages(mockMessages);
  };

  const handleCreateChat = () => {
    if (!newChatTitle) {
      Alert.alert('Error', 'Please enter a chat title');
      return;
    }
    if (selectedParticipants.length === 0) {
      Alert.alert('Error', 'Please select at least one participant');
      return;
    }
    
    // Add chat creation logic here
    Alert.alert('Success', 'Chat created successfully!');
    setShowNewChatModal(false);
    setNewChatTitle('');
    setSelectedParticipants([]);
  };

  const renderChatModal = () => {
    if (!selectedRoom) return null;

    const onSwipeDown = (event: any) => {
      if (event.nativeEvent.translationY > 100) {
        setSelectedRoom(null);
      }
    };

    return (
      <Modal visible={!!selectedRoom} animationType="slide" presentationStyle="pageSheet">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={onSwipeDown}>
            <SafeAreaView style={styles.chatContainer}>
              <View style={styles.swipeIndicator} />
              <View style={styles.chatModalHeader}>
                <TouchableOpacity 
                  onPress={() => setSelectedRoom(null)}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color={FirebirdColors.white} />
                </TouchableOpacity>
                <View style={styles.chatHeaderInfo}>
                  <Text style={styles.chatHeaderTitle}>{selectedRoom.name}</Text>
                  <Text style={styles.chatHeaderSubtitle}>
                    {selectedRoom.isGroup ? `${selectedRoom.participants.length} members` : 'Online'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.callButton}>
                  <Ionicons name="call" size={24} color={FirebirdColors.white} />
                </TouchableOpacity>
              </View>

          <KeyboardAvoidingView 
            style={styles.chatContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MessageBubble
                  message={item}
                  isOwnMessage={item.userId === user?.id}
                />
              )}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContainer}
              inverted
            />

            <View style={styles.inputContainer}>
              <View style={styles.messageInputContainer}>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Type a message..."
                  placeholderTextColor={FirebirdColors.mediumGray}
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Ionicons 
                    name="send" 
                    size={20} 
                    color={newMessage.trim() ? FirebirdColors.royalBlue : FirebirdColors.mediumGray} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
            </SafeAreaView>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </Modal>
    );
  };

  const renderNewChatModal = () => {
    const onSwipeDown = (event: any) => {
      if (event.nativeEvent.translationY > 100) {
        setShowNewChatModal(false);
      }
    };

    return (
      <Modal visible={showNewChatModal} animationType="slide" presentationStyle="pageSheet">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={onSwipeDown}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.swipeIndicator} />
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShowNewChatModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={FirebirdColors.darkGray} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>New Chat</Text>
                <TouchableOpacity onPress={handleCreateChat} style={styles.createButton}>
                  <Text style={styles.saveButton}>Create</Text>
                </TouchableOpacity>
              </View>

        <View style={styles.modalContent}>
          <View style={styles.inputField}>
            <Text style={styles.inputLabel}>Chat Title</Text>
            <TextInput
              style={styles.textInput}
              value={newChatTitle}
              onChangeText={setNewChatTitle}
              placeholder="Enter chat title"
            />
          </View>

          <Text style={styles.participantsTitle}>Select Participants</Text>
          <FlatList
            data={mockAthletes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.participantItem}
                onPress={() => {
                  if (selectedParticipants.includes(item.id)) {
                    setSelectedParticipants(prev => prev.filter(id => id !== item.id));
                  } else {
                    setSelectedParticipants(prev => [...prev, item.id]);
                  }
                }}
              >
                <View style={styles.participantAvatar}>
                  <Ionicons name="person" size={20} color={FirebirdColors.royalBlue} />
                </View>
                <Text style={styles.participantName}>{item.name}</Text>
                <Ionicons
                  name={selectedParticipants.includes(item.id) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={selectedParticipants.includes(item.id) ? FirebirdColors.success : FirebirdColors.mediumGray}
                />
              </TouchableOpacity>
            )}
          />
        </View>
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
        <Text style={styles.headerTitle}>Messages</Text>
        {isCoach && (
          <TouchableOpacity 
            style={styles.newChatButton}
            onPress={() => setShowNewChatModal(true)}
          >
            <LinearGradient
              colors={[FirebirdColors.royalBlue, FirebirdColors.gold]}
              style={styles.newChatButtonGradient}
            >
              <Ionicons name="add" size={20} color={FirebirdColors.white} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={mockChatRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatRoomCard
            room={item}
            onPress={() => handleOpenChat(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatList}
      />

      {renderChatModal()}
      {renderNewChatModal()}
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
  newChatButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  newChatButtonGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  chatRoomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FirebirdColors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatarGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: FirebirdColors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: FirebirdColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
  },
  chatTime: {
    fontSize: 12,
    color: FirebirdColors.mediumGray,
  },
  lastMessage: {
    fontSize: 14,
    color: FirebirdColors.mediumGray,
  },
  chatContainer: {
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
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  callButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: FirebirdColors.lightGray,
  },
  createButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: FirebirdColors.royalBlue + '20',
  },
  chatModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: FirebirdColors.royalBlue,
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 15,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: FirebirdColors.white,
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: FirebirdColors.white + 'CC',
  },
  chatContent: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContainer: {
    paddingVertical: 10,
  },
  messageBubble: {
    backgroundColor: FirebirdColors.white,
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    maxWidth: '80%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  ownMessageBubble: {
    backgroundColor: FirebirdColors.royalBlue,
    alignSelf: 'flex-end',
  },
  otherMessageBubble: {
    backgroundColor: FirebirdColors.white,
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: FirebirdColors.royalBlue,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: FirebirdColors.white,
  },
  otherMessageText: {
    color: FirebirdColors.darkGray,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  inputContainer: {
    backgroundColor: FirebirdColors.white,
    borderTopWidth: 1,
    borderTopColor: FirebirdColors.lightGray,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: FirebirdColors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: FirebirdColors.darkGray,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: FirebirdColors.softWhite,
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
  inputField: {
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
  },
  participantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: FirebirdColors.darkGray,
    marginBottom: 15,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FirebirdColors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 8,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: FirebirdColors.royalBlue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  participantName: {
    flex: 1,
    fontSize: 16,
    color: FirebirdColors.darkGray,
    fontWeight: '500',
  },
}); 