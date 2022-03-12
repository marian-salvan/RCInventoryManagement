import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { confirmationModalDefaultMessage, confirmationModalDefaultTitle } from '../constants/messages.constants';
import { AddRemoveModalModel, ConfirmationModalModel } from '../models/modal.models';
import { ProductModel } from '../models/products.models';
import { InventoryReport, PacakagesReport, ReportProductModel } from '../models/reports.models';
import { UserMetadataModel } from '../models/user.model';
import { RootState } from '../stores/store';
import { signInUserAsync, signOutUserAsync } from '../thunks/auth.thunk';
import { getAllProductsAsync, createProductAsync, deleteProductAsync} from '../thunks/products.thunk';
import { addQtyFromProductAsync, closeCurrentReportAsync, createActiveReportAsync, getActiveInventoryReportsAsync, getInactiveInventoryReportsAsync, getInventoryReportsByUidAsync, removeQtyFromProductAsync } from '../thunks/inventory-reports.thunk';
import { getLoggedInUserMetaDataAsync, } from '../thunks/users.thunk';
import { addPackagesAsync, getActivePackagesReportsAsync, getPackagesReportsByUidAsync, removePackagesAsync } from '../thunks/packages-reports.thunk';

export interface AppState {
  firebaseApp: FirebaseApp | null;
  sideBarIsOpen: boolean;
  fromLocation: string;
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
  activeInventoryReport: InventoryReport | null;
  activePackagesReport: PacakagesReport | null;
  quantityModalModel: AddRemoveModalModel | null;
  inventoryEntryToAdd: ReportProductModel | null;
  inventoryEntryToSubstract: ReportProductModel | null;
  showNewReportModal: boolean;
  newReportName: string | null;
  packagesModalModel: AddRemoveModalModel | null;
  gridSearchText: string | null;
  inactiveInventoryReports: InventoryReport[] | null;
  selectedInventoryReport: InventoryReport | null;
  selectedPackageReport: PacakagesReport | null;
}

const initialState: AppState = {
  firebaseApp: null,
  sideBarIsOpen: true,
  fromLocation: "/products",
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
  activeInventoryReport: null,
  quantityModalModel: null,
  inventoryEntryToAdd: null,
  inventoryEntryToSubstract: null,
  showNewReportModal: false,
  newReportName: "",
  packagesModalModel: null,
  gridSearchText: null,
  activePackagesReport: null,
  inactiveInventoryReports: null,
  selectedInventoryReport: null,
  selectedPackageReport:  null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,

  reducers: {
    setSideBarIsOpen: (state) => {
      state.sideBarIsOpen = !state.sideBarIsOpen;
    },
    setFromLocation: (state, action: PayloadAction<string>) => {
      state.fromLocation = action.payload;
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
    setProductToBeAdded: (state, action: PayloadAction<ProductModel | null>) => {
      state.productToBeAdded = action.payload;
    },
    setReloadProductsTable: (state) => {
      state.reloadProductsTable = !state.reloadProductsTable;
    },
    setReloadReportsTable: (state) => {
      state.reloadReportsTable = !state.reloadReportsTable;
    },  
    setQuantityModalModel: (state, action: PayloadAction<AddRemoveModalModel | null>) => {
      state.quantityModalModel = action.payload;
    },
    setInventoryEntryToAdd: (state, action: PayloadAction<ReportProductModel | null>) => {
      state.inventoryEntryToAdd = action.payload;
    },
    setInventoryEntryToSubstract: (state, action: PayloadAction<ReportProductModel | null>) => {
      state.inventoryEntryToSubstract = action.payload;
    },
    setNewReportModal: (state) => {
      state.showNewReportModal = !state.showNewReportModal;
    },
    setNewReportName: (state, action: PayloadAction<string | null>) => {
      state.newReportName = action.payload;
    },
    setPackagesModalModel: (state, action: PayloadAction<AddRemoveModalModel | null>) => {
      state.packagesModalModel = action.payload;
    },
    setGridSearchText: (state, action: PayloadAction<string | null>) => {
      state.gridSearchText = action.payload;
    },
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
        state.loggedInUserMetadata = null;
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

      //inventory - reports
      .addCase(getActiveInventoryReportsAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(getActiveInventoryReportsAsync.fulfilled, (state, action) => {
        if (action.payload.docs.length > 0) {
          const report = action.payload.docs[0].data() as InventoryReport;
          state.activeInventoryReport = report;
        } else {
          state.activeInventoryReport = null
        }

        state.showLoader = false;
      })
      .addCase(getActiveInventoryReportsAsync.rejected, (state, action) => {
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
      .addCase(removeQtyFromProductAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(removeQtyFromProductAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(removeQtyFromProductAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
      .addCase(closeCurrentReportAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(closeCurrentReportAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(closeCurrentReportAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
      .addCase(getInactiveInventoryReportsAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(getInactiveInventoryReportsAsync.fulfilled, (state, action) => {
        if (action.payload.docs.length > 0) {
          const reports: InventoryReport[] = [];
          
          action.payload.docs.forEach(doc => {
            reports.push(doc.data() as InventoryReport);
          });

          state.inactiveInventoryReports = reports;
        } else {
          state.inactiveInventoryReports = null
        }
        state.showLoader = false;
      })
      .addCase(getInactiveInventoryReportsAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
      .addCase(getInventoryReportsByUidAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(getInventoryReportsByUidAsync.fulfilled, (state, action) => {
        if (action.payload.docs.length > 0) {
          const report = action.payload.docs[0].data() as InventoryReport;
          state.selectedInventoryReport = report;
        } else {
          state.selectedInventoryReport = null
        }
        state.showLoader = false;
      })
      .addCase(getInventoryReportsByUidAsync.rejected, (state, action) => {
        state.showLoader = false;
      })

      //packages-reports  
      .addCase(getActivePackagesReportsAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(getActivePackagesReportsAsync.fulfilled, (state, action) => {
        if (action.payload.docs.length > 0) {
          const report = action.payload.docs[0].data() as PacakagesReport;
          state.activePackagesReport = report;
        } else {
          state.activePackagesReport = null
        }

        state.showLoader = false;
      })
      .addCase(getActivePackagesReportsAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
      .addCase(addPackagesAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(addPackagesAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(addPackagesAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
      .addCase(removePackagesAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(removePackagesAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(removePackagesAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
      .addCase(getPackagesReportsByUidAsync.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(getPackagesReportsByUidAsync.fulfilled, (state, action) => {
        if (action.payload.docs.length > 0) {
          const report = action.payload.docs[0].data() as PacakagesReport;
          state.selectedPackageReport = report;
        } else {
          state.selectedPackageReport = null
        }
        state.showLoader = false;
      })
      .addCase(getPackagesReportsByUidAsync.rejected, (state, action) => {
        state.showLoader = false;
      })
  },
});

export const { setFromLocation, setFirebaseApp, setFirebaseDb, setSideBarIsOpen, setLoggedInUser, 
  setAddProductModal, setConfirmationModal, setConfirmationModalModel, setActionAccepted,
  setProductToBeAdded, setReloadProductsTable, setReloadReportsTable, setNewReportName,
  setQuantityModalModel, setInventoryEntryToAdd, setInventoryEntryToSubstract, setNewReportModal,
  setPackagesModalModel, setGridSearchText } = appSlice.actions;

export const fromLocation = (state: RootState) => state.appReducer.fromLocation;
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
export const activeInventoryReport = (state: RootState) => state.appReducer.activeInventoryReport;
export const activePackagesReport = (state: RootState) => state.appReducer.activePackagesReport;
export const quantityModalModel = (state: RootState) => state.appReducer.quantityModalModel;
export const inventoryEntryToAdd = (state: RootState) => state.appReducer.inventoryEntryToAdd;
export const inventoryEntryToSubstract = (state: RootState) => state.appReducer.inventoryEntryToSubstract;
export const showNewReportModal = (state: RootState) => state.appReducer.showNewReportModal;
export const newReportName = (state: RootState) => state.appReducer.newReportName;
export const packagesModalModel = (state: RootState) => state.appReducer.packagesModalModel;
export const gridSearchText = (state: RootState) => state.appReducer.gridSearchText;
export const inactiveInventoryReports = (state: RootState) => state.appReducer.inactiveInventoryReports;
export const selectedInventoryReport = (state: RootState) => state.appReducer.selectedInventoryReport;
export const selectedPackageReport = (state: RootState) => state.appReducer.selectedPackageReport;

export default appSlice.reducer;
