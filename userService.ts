
import { User, UserProgress } from '../types';

const USERS_KEY = 'nalibo_users';
const CURRENT_USER_KEY = 'nalibo_currentUser';

// Helper to get all users from localStorage
const getUsers = (): Record<string, User> => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch (error) {
    console.error("Error parsing users from localStorage", error);
    return {};
  }
};

// Helper to save all users to localStorage
const saveUsers = (users: Record<string, User>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signup = (username: string, password: string): User | null => {
  const users = getUsers();
  if (users[username.toLowerCase()]) {
    alert('Username already exists.');
    return null;
  }
  const newUser: User = {
    username,
    password, // In a real app, this should be hashed and salted!
    progress: {
      currentLessonId: '1',
      completedLessons: [],
      xp: 0,
      gems: 10,
      lives: 5,
      streak: 0,
      proficiencyLevel: 'Novice Low',
    },
    apiKey: '',
  };
  users[username.toLowerCase()] = newUser;
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, username);
  return newUser;
};

export const login = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users[username.toLowerCase()];
  if (user && user.password === password) {
    localStorage.setItem(CURRENT_USER_KEY, username);
    return user;
  }
  alert('Invalid username or password.');
  return null;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const username = localStorage.getItem(CURRENT_USER_KEY);
  if (!username) return null;
  const users = getUsers();
  return users[username.toLowerCase()] || null;
};

export const saveUser = (user: User) => {
  const users = getUsers();
  if (users[user.username.toLowerCase()]) {
    users[user.username.toLowerCase()] = user;
    saveUsers(users);
  }
};

export const getAllUsers = (): User[] => {
  const users = getUsers();
  return Object.values(users);
};
