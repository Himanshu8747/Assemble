import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, dummyUsers } from '../data/dummyUsers';

interface UserState {
  list: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  list: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return dummyUsers;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addFriend: (state, action: PayloadAction<string>) => {
      console.log('Add friend:', action.payload);
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      console.log('Remove friend:', action.payload);
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      console.log('Add favorite:', action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      console.log('Remove favorite:', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { addFriend, removeFriend, addFavorite, removeFavorite } = userSlice.actions;

export default userSlice.reducer;

