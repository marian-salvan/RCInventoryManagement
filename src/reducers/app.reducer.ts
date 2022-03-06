import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseApp } from 'firebase/app';
import { AppThunk, RootState } from '../stores/store';

export interface AppState {
  firebaseApp: FirebaseApp | null;
  appValue: number;
}

const initialState: AppState = {
  firebaseApp: null,
  appValue: 0
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    incrementAppState: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.appValue += 1;
      console.log(state);

    },
    setFirebaseApp: (state, action: PayloadAction<FirebaseApp | null>) => {
      state.firebaseApp = action.payload;

      console.log(state.firebaseApp);
    }
  },
});

export const { setFirebaseApp, incrementAppState } = appSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const firebaseApp = (state: RootState) => state.appReducer.firebaseApp;

export default appSlice.reducer;
