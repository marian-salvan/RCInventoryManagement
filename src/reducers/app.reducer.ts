import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { ProductModel } from '../models/products.models';
import { UserMetadataModel } from '../models/user.model';
import { RootState } from '../stores/store';
import { signInUserAsync, signOutUserAsync } from '../thunks/auth.thunk';
import { getAllProductsAsync } from '../thunks/products.thunk';
import { getLoggedInUserMetaDataAsync } from '../thunks/users.thunk';

export interface AppState {
  firebaseApp: FirebaseApp | null;
  sideBarIsOpen: boolean;
  loggedUser: User | null;
  showLoader: boolean;
  database: Firestore | null;
  loggedInUserMetadata: UserMetadataModel | null;
  allProducts: ProductModel[] | null;
  showAddProductModal: boolean;
}

const initialState: AppState = {
  firebaseApp: null,
  sideBarIsOpen: true,
  loggedUser: null,
  showLoader: false,
  database: null,
  loggedInUserMetadata: null,
  allProducts: null,
  showAddProductModal: false
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
    },
    setLoggedInUser: (state, action: PayloadAction<User | null>) => {
      state.loggedUser = action.payload;
    },
    setAddProductModal: (state) => {
      state.showAddProductModal = !state.showAddProductModal;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(signInUserAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(signInUserAsync.fulfilled, (state, action) => {
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
        state.loggedInUserMetadata = action.payload.docs[0].data() as UserMetadataModel;
        console.log(state.loggedInUserMetadata);
        state.showLoader = false;
      })
      .addCase(getLoggedInUserMetaDataAsync.rejected, (state, action) => {
        state.showLoader = false;
        console.log("not allowed");
      })

      .addCase(getAllProductsAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(getAllProductsAsync.fulfilled, (state, action) => {
        state.allProducts = action.payload.docs.map(doc => doc.data() as ProductModel);
        state.showLoader = false;
      })
      .addCase(getAllProductsAsync.rejected, (state, action) => {
        state.showLoader = false;
        console.log("not allowed");
      })
  },
});

export const { setFirebaseApp, setFirebaseDb, setSideBarIsOpen, setLoggedInUser, setAddProductModal } = appSlice.actions;

export const firebaseApp = (state: RootState) => state.appReducer.firebaseApp;
export const sideBarIsOpen = (state: RootState) => state.appReducer.sideBarIsOpen;
export const showAddProductModal = (state: RootState) => state.appReducer.showAddProductModal;
export const loggedUser = (state: RootState) => state.appReducer.loggedUser;
export const showLoader = (state: RootState) => state.appReducer.showLoader;
export const fireStoreDatabase = (state: RootState) => state.appReducer.database;
export const loggedInUserMetadata = (state: RootState) => state.appReducer.loggedInUserMetadata;
export const allProducts = (state: RootState) => state.appReducer.allProducts;

export default appSlice.reducer;
