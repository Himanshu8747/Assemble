import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { User } from '../types';
import { RootState } from './store';

// Define the UserState type
interface UserState {
  currentUser: User | null;
  list: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the initial state
const initialState: UserState = {
  currentUser: null,
  list: [],
  status: 'idle',
  error: null,
};

// Utility functions
const convertFirebaseUserToUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  name: firebaseUser.displayName || extractNameFromEmail(firebaseUser.email) || 'Anonymous',
  email: firebaseUser.email || '',
  avatar: firebaseUser.photoURL || '',
  role: 'user',
  skills: [],
  github: '',
});

const extractNameFromEmail = (email: string | null | undefined): string | null => {
  if (!email) return null;
  const username = email.split('@')[0];
  return username.charAt(0).toUpperCase() + username.slice(1);
};

// Async actions
export const login = createAsyncThunk<User, { email: string; password: string }>(
  'users/login',
  async ({ email, password }) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return convertFirebaseUserToUser(userCredential.user);
  }
);

export const signUp = createAsyncThunk<User, { email: string; password: string }>(
  'users/signUp',
  async ({ email, password }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return convertFirebaseUserToUser(userCredential.user);
  }
);

export const googleSignIn = createAsyncThunk<User>('users/googleSignIn', async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return convertFirebaseUserToUser(userCredential.user);
});

export const logoutUser = createAsyncThunk<void>('users/logoutUser', async () => {
  await signOut(auth);
});

export const fetchUserOnAuthChange = createAsyncThunk<User | null>('users/fetchUserOnAuthChange', async () => {
  return new Promise<User | null>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user ? convertFirebaseUserToUser(user) : null);
    });
  });
});

export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'user', skills: [], github: '' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '', role: 'user', skills: [], github: '' },
  ];
});

export const updateUserProfile = createAsyncThunk<User, User, { state: RootState }>(
  'users/updateUserProfile',
  async (updatedUser, { getState }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return updatedUser;
  }
);

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateUserName: (state, action: PayloadAction<{ id: string; name: string }>) => {
      if (state.currentUser?.id === action.payload.id) {
        state.currentUser.name = action.payload.name;
      }
      const userIndex = state.list.findIndex((user) => user.id === action.payload.id);
      if (userIndex !== -1) {
        state.list[userIndex].name = action.payload.name;
      }
    },
    addSkill: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.skills.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
      })
      .addCase(fetchUserOnAuthChange.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
        const userIndex = state.list.findIndex((user) => user.id === action.payload.id);
        if (userIndex !== -1) {
          state.list[userIndex] = action.payload;
        }
      });
  },
});

// Exports
export const { updateUserName, addSkill } = userSlice.actions;
export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectUsersList = (state: RootState) => state.users.list;

export default userSlice.reducer;
