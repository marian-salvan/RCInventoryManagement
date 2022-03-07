import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseApp } from 'firebase/app';
import { UserCredential } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { RootState } from '../stores/store';
import { signInUserAsync, signOutUserAsync } from '../thunks/auth.thunk';
import { getLoggedInUserMetaDataAsync } from '../thunks/users.thunk';

export interface AppState {
  firebaseApp: FirebaseApp | null;
  sideBarIsOpen: boolean;
  loggedUser: UserCredential | null;
  showLoader: boolean;
  database: Firestore | null;
}

const initialState: AppState = {
  firebaseApp: null,
  sideBarIsOpen: true,
  loggedUser: null,
  showLoader: false,
  database: null
};

export const appSlice = createSlice({
  name: 'app',
  initialState,

  reducers: {
    setSideBarIsOpen: (state) => {
      state.sideBarIsOpen = !state.sideBarIsOpen;
    },
    setFirebaseApp: (state, action: PayloadAction<FirebaseApp | null>) => {
      state.firebaseApp = action.payload;
    },
    setFirebaseDb: (state, action: PayloadAction<Firestore | null>) => {
      state.database = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(signInUserAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(signInUserAsync.fulfilled, (state, action) => {
        state.loggedUser = action.payload;
        state.showLoader = false;
      })
      .addCase(signInUserAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
      .addCase(signOutUserAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(signOutUserAsync.fulfilled, (state, action) => {
        state.showLoader = false;
        state.loggedUser = null;
      })
      .addCase(getLoggedInUserMetaDataAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(getLoggedInUserMetaDataAsync.fulfilled, (state, action) => {
        
        action.payload.forEach(doc => {
          console.log(doc.data())
        })

        state.showLoader = false;
      })
      .addCase(getLoggedInUserMetaDataAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
  },
});

export const { setFirebaseApp, setFirebaseDb, setSideBarIsOpen } = appSlice.actions;

export const firebaseApp = (state: RootState) => state.appReducer.firebaseApp;
export const sideBarIsOpen = (state: RootState) => state.appReducer.sideBarIsOpen;
export const loggedUser = (state: RootState) => state.appReducer.loggedUser;
export const showLoader = (state: RootState) => state.appReducer.showLoader;
export const fireStoreDatabase = (state: RootState) => state.appReducer.database;

export default appSlice.reducer;
