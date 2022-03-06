import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseApp } from 'firebase/app';
import { UserCredential } from 'firebase/auth';
import { AppThunk, RootState } from '../stores/store';

export interface AppState {
  firebaseApp: FirebaseApp | null;
  sideBarIsOpen: boolean;
  loggedUser: UserCredential | null;
}

const initialState: AppState = {
  firebaseApp: null,
  sideBarIsOpen: true,
  loggedUser: null
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setSideBarIsOpen: (state) => {
      state.sideBarIsOpen = !state.sideBarIsOpen;
    },
    setFirebaseApp: (state, action: PayloadAction<FirebaseApp | null>) => {
      state.firebaseApp = action.payload;
    },
    setLoggedUser: (state, action: PayloadAction<UserCredential | null>) => {
      state.loggedUser = action.payload;
    }
  },
});

export const { setFirebaseApp, setSideBarIsOpen, setLoggedUser } = appSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const firebaseApp = (state: RootState) => state.appReducer.firebaseApp;
export const sideBarIsOpen = (state: RootState) => state.appReducer.sideBarIsOpen;
export const loggedUser = (state: RootState) => state.appReducer.loggedUser;

export default appSlice.reducer;
