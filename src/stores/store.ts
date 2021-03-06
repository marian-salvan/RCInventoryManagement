import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from '../reducers/app.reducer';

export const store = configureStore({
  reducer: {
    appReducer: appReducer 
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false

  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
