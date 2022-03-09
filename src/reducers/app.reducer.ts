import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { confirmationModalDefaultMessage, confirmationModalDefaultTitle } from '../constants/messages.constants';
import { ConfirmationModalModel } from '../models/modal.models';
import { ProductModel } from '../models/products.models';
import { ReportModel } from '../models/reports.models';
import { UserMetadataModel } from '../models/user.model';
import { RootState } from '../stores/store';
import { signInUserAsync, signOutUserAsync } from '../thunks/auth.thunk';
import { getAllProductsAsync, createProductAsync, deleteProductAsync} from '../thunks/products.thunk';
import { addQtyFromProductAsync, createActiveReportAsync, getActiveReportsAsync } from '../thunks/reports.thunk';
import { getLoggedInUserMetaDataAsync, } from '../thunks/users.thunk';

export interface AppState {
  firebaseApp: FirebaseApp | null;
  sideBarIsOpen: boolean;
  loggedUser: User | null;
  showLoader: boolean;
  database: Firestore | null;
  loggedInUserMetadata: UserMetadataModel | null;
  allProducts: ProductModel[] | null;
  showAddProductModal: boolean;
  showConfirmationModal: boolean;
  confirmationModalModel: ConfirmationModalModel;
  actionAccepted: boolean;
  productToBeAdded: ProductModel | null;
  reloadProductsTable: boolean;
  reloadReportsTable: boolean;
  activeReport: ReportModel | null;
  showQuantityModal: boolean;
}

const initialState: AppState = {
  firebaseApp: null,
  sideBarIsOpen: true,
  loggedUser: null,
  showLoader: false,
  database: null,
  loggedInUserMetadata: null,
  allProducts: null,
  showAddProductModal: false,
  showConfirmationModal: false,
  confirmationModalModel: {
    title: confirmationModalDefaultTitle,
    message: confirmationModalDefaultMessage
  },
  actionAccepted: false,
  productToBeAdded: null,
  reloadProductsTable: false,
  reloadReportsTable: false,
  activeReport: null,
  showQuantityModal: false
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
    },
    setConfirmationModal: (state) => {
      state.showConfirmationModal = !state.showConfirmationModal;
    },
    setConfirmationModalModel: (state, payload: PayloadAction<ConfirmationModalModel>) => {
      state.confirmationModalModel = payload.payload;
    },
    setActionAccepted: (state) => {
      state.actionAccepted = !state.actionAccepted;
    },
    setProductToBeAdded: (state,  action: PayloadAction<ProductModel | null>) => {
      state.productToBeAdded = action.payload;
    },
    setReloadProductsTable: (state) => {
      state.reloadProductsTable = !state.reloadProductsTable;
    },
    setReloadReportsTable: (state) => {
      state.reloadReportsTable = !state.reloadReportsTable;
    },  
    setQuantityModal: (state) => {
      state.showQuantityModal = !state.showQuantityModal;
    }
  },

  extraReducers: (builder) => {
    builder
      //users
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
        state.showLoader = false;
      })
      .addCase(getLoggedInUserMetaDataAsync.rejected, (state, action) => {
        state.showLoader = false;
      })

      //products
      .addCase(getAllProductsAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(getAllProductsAsync.fulfilled, (state, action) => {
        state.allProducts = action.payload.docs.map(doc => doc.data() as ProductModel);
        state.showLoader = false;
      })
      .addCase(getAllProductsAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.reloadProductsTable = true;
        state.showLoader = false;
      })
      .addCase(createProductAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
      .addCase(deleteProductAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.reloadProductsTable = true;
        state.showLoader = false;
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.showLoader = false;
      })

      //reports
      .addCase(getActiveReportsAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(getActiveReportsAsync.fulfilled, (state, action) => {
        if (action.payload.docs.length > 0) {
          const report = action.payload.docs[0].data() as ReportModel;
          state.activeReport = report;
        }

        state.showLoader = false;
      })
      .addCase(getActiveReportsAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
      .addCase(createActiveReportAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(createActiveReportAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(createActiveReportAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
      .addCase(addQtyFromProductAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(addQtyFromProductAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(addQtyFromProductAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
  },
});

export const { setFirebaseApp, setFirebaseDb, setSideBarIsOpen, setLoggedInUser, 
  setAddProductModal, setConfirmationModal, setConfirmationModalModel, setActionAccepted,
  setProductToBeAdded, setReloadProductsTable, setReloadReportsTable,
  setQuantityModal } = appSlice.actions;

export const firebaseApp = (state: RootState) => state.appReducer.firebaseApp;
export const sideBarIsOpen = (state: RootState) => state.appReducer.sideBarIsOpen;
export const showAddProductModal = (state: RootState) => state.appReducer.showAddProductModal;
export const showConfirmationModal = (state: RootState) => state.appReducer.showConfirmationModal;
export const actionAccepted = (state: RootState) => state.appReducer.actionAccepted;
export const confirmationModalModel = (state: RootState) => state.appReducer.confirmationModalModel;
export const loggedUser = (state: RootState) => state.appReducer.loggedUser;
export const showLoader = (state: RootState) => state.appReducer.showLoader;
export const fireStoreDatabase = (state: RootState) => state.appReducer.database;
export const loggedInUserMetadata = (state: RootState) => state.appReducer.loggedInUserMetadata;
export const allProducts = (state: RootState) => state.appReducer.allProducts;
export const productToBeAdded = (state: RootState) => state.appReducer.productToBeAdded;
export const reloadProductsTable = (state: RootState) => state.appReducer.reloadProductsTable;
export const reloadReportsTable = (state: RootState) => state.appReducer.reloadReportsTable;
export const activeReport = (state: RootState) => state.appReducer.activeReport;
export const showQuantityModal = (state: RootState) => state.appReducer.showQuantityModal;

export default appSlice.reducer;
