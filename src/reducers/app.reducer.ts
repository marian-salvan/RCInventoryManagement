import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { AddEditCategoryModalModel, AddEditUnitModalModel, AddRemoveModalModel, ConfirmationModalModel, ErrorModalModel, ModifyInvProductsModalModel } from '../models/modal.models';
import { ProductModel } from '../models/products.models';
import { InventoryReport, NewReportModel, PacakagesReport, ReportProductModel } from '../models/reports.models';
import { UserMetadataModel } from '../models/user.model';
import { RootState } from '../stores/store';
import { signInUserAsync, signOutUserAsync } from '../thunks/auth.thunk';
import { getAllProductsAsync, createProductAsync, deleteProductAsync, editProductAsync} from '../thunks/products.thunk';
import { addQtyFromProductAsync, closeCurrentReportAsync, createActiveReportAsync,
         getActiveInventoryReportsAsync, getInactiveInventoryReportsAsync,
         getInventoryReportsByUidAsync, removeQtyFromProductAsync, updateInventoryAsync } from '../thunks/inventory-reports.thunk';
import { getLoggedInUserMetaDataAsync, } from '../thunks/users.thunk';
import { addPackagesAsync, getActivePackagesReportsAsync, getPackagesReportsByUidAsync, removePackagesAsync } from '../thunks/packages-reports.thunk';
import { initialState } from './app.state';
import { appErrors } from '../constants/messages.constants';
import { changeActiveCampaignAsync, createCampaignAsync, getAllCampaignsForOrgAsync } from '../thunks/campaigns.thunk';
import { CampaignModel } from '../models/campaigns.models';
import { createCategoryAsync, deleteCategoryAsync, editCategoryAsync, getAllCategoriesAsync } from '../thunks/categories.thunk';
import { CategoryModel } from '../models/categories.models';
import { UnitModel } from '../models/units.models';
import { createUnitAsync, deleteUnitAsync, editUnitAsync, getAllUnitsAsync } from '../thunks/units.thunk';

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
    setAddEditProductModal: (state, action: PayloadAction<boolean | null>) => {
      state.showAddEditProductModal = action.payload;
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
    setProductToBeEdited: (state, action: PayloadAction<ProductModel | null>) => {
      state.productToBeEdited = action.payload;
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
    setNewReportModel: (state, action: PayloadAction<NewReportModel | null>) => {
      state.newReportModel = action.payload;
    },
    setPackagesModalModel: (state, action: PayloadAction<AddRemoveModalModel | null>) => {
      state.packagesModalModel = action.payload;
    },
    setGridSearchText: (state, action: PayloadAction<string | null>) => {
      state.gridSearchText = action.payload;
    },
    setErrorModalModel: (state, action: PayloadAction<ErrorModalModel>) => {
      state.errorModalModel = action.payload;
    },
    setGridCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.gridCategoryFilter = action.payload;
    },
    setNewCampaignModal: (state) => {
      state.showNewCampaignModal = !state.showNewCampaignModal;
    },
    setNewCampaign: (state, action: PayloadAction<CampaignModel | null>) => {
      state.newCampaign = action.payload;
    },
    setReloadCampaignTable: (state) => {
      state.reloadCampaignTable = !state.reloadCampaignTable;
    }, 
    setActiveCampaign: (state, action: PayloadAction<CampaignModel | null>) => {
      state.activeCampaign = action.payload;
    },
    setModifyInvProductsModalModel (state, action: PayloadAction<ModifyInvProductsModalModel>) {
      state.modifyInvProductsModalModel = action.payload;
    },
    setCategoryToBeDeleted (state, action: PayloadAction<CategoryModel | null>) {
      state.categoryToBeDeleted = action.payload;
    },
    setAddEditCategoryModalModel (state, action: PayloadAction<AddEditCategoryModalModel | null>) {
      state.addEditCategoryModalModel = action.payload;
    },
    setUnitToBeDeleted (state, action: PayloadAction<UnitModel | null>) {
      state.unitToBeDeleted = action.payload;
    },
    setAddEditUnitModalModel (state, action: PayloadAction<AddEditUnitModalModel | null>) {
      state.addEditUnitModalModel = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      //users
      .addCase(signInUserAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(signInUserAsync.fulfilled, (state, action) => {
        state.showLoader = false;
      })
      .addCase(signInUserAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;                                                    
      })  
      .addCase(signOutUserAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(signOutUserAsync.fulfilled, (state, action) => {
        state.showLoader = false;
        state.loggedUser = null;
        state.loggedInUserMetadata = null;
      })
      .addCase(signOutUserAsync.rejected, (state, action) => {
        state.showLoader = true;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;     
      })
      .addCase(getLoggedInUserMetaDataAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(getLoggedInUserMetaDataAsync.fulfilled, (state, action) => {
        state.loggedInUserMetadata = action.payload.docs[0].data() as UserMetadataModel;
        state.showLoader = false;
      })
      .addCase(getLoggedInUserMetaDataAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;     
      })

      //products
      .addCase(getAllProductsAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(getAllProductsAsync.fulfilled, (state, action) => {
        state.allProducts = action.payload.docs.map(doc => doc.data() as ProductModel);
        state.showLoader = false;
      })
      .addCase(getAllProductsAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;    
      })
      .addCase(createProductAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.reloadProductsTable = true;
        state.showLoader = false;
      })
      .addCase(createProductAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(editProductAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(editProductAsync.fulfilled, (state, action) => {
        state.reloadProductsTable = true;
        state.showLoader = false;
      })
      .addCase(editProductAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(deleteProductAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.reloadProductsTable = true;
        state.showLoader = false;
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })

      //inventory - reports
      .addCase(getActiveInventoryReportsAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
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
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(createActiveReportAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(createActiveReportAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(createActiveReportAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(addQtyFromProductAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(addQtyFromProductAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(addQtyFromProductAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(removeQtyFromProductAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(removeQtyFromProductAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(removeQtyFromProductAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(closeCurrentReportAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(closeCurrentReportAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(closeCurrentReportAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(getInactiveInventoryReportsAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
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
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(getInventoryReportsByUidAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
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
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(updateInventoryAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(updateInventoryAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(updateInventoryAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })

      //packages-reports  
      .addCase(getActivePackagesReportsAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
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
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(addPackagesAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(addPackagesAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(addPackagesAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(removePackagesAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(removePackagesAsync.fulfilled, (state, action) => {
        state.reloadReportsTable = true;
        state.showLoader = false;
      })
      .addCase(removePackagesAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message: appErrors.get("genericErrorMessage") as string;
      })
      .addCase(getPackagesReportsByUidAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
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
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })

      //campaigns
      .addCase(getAllCampaignsForOrgAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(getAllCampaignsForOrgAsync.fulfilled, (state, action) => {
        if (action.payload.docs.length > 0) {
          const campaigns: CampaignModel[] = [];
  
          action.payload.docs.forEach(doc => {
            const canspaign = doc.data() as CampaignModel

            if (canspaign.active) {
              state.activeCampaign = canspaign;
            }
            
            campaigns.push(canspaign);
          });

          state.campaigns = campaigns;
        } else {
          state.campaigns = null
        }
        state.showLoader = false;
      })
      .addCase(getAllCampaignsForOrgAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })

      .addCase(createCampaignAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(createCampaignAsync.fulfilled, (state, action) => {
        state.reloadCampaignTable = true;
        state.showLoader = false;
      })
      .addCase(createCampaignAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      
      .addCase(changeActiveCampaignAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(changeActiveCampaignAsync.fulfilled, (state, action) => {
        state.reloadCampaignTable = true;
        state.showLoader = false;
      })
      .addCase(changeActiveCampaignAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })

      //categories
      .addCase(getAllCategoriesAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(getAllCategoriesAsync.fulfilled, (state, action) => {
        state.allCategories = action.payload.docs.map(doc => doc.data() as CategoryModel);
        state.showLoader = false;
      })
      .addCase(getAllCategoriesAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;    
      })
      .addCase(createCategoryAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.reloadProductsTable = true;
        state.showLoader = false;
      })
      .addCase(createCategoryAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(editCategoryAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(editCategoryAsync.fulfilled, (state, action) => {
        state.reloadProductsTable = true;
        state.showLoader = false;
      })
      .addCase(editCategoryAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.reloadProductsTable = true;
        state.categoryToBeDeleted = null;
        state.showLoader = false;
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.categoryToBeDeleted = null;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })

       //units
      .addCase(getAllUnitsAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(getAllUnitsAsync.fulfilled, (state, action) => {
        state.allUnits = action.payload.docs.map(doc => doc.data() as UnitModel);
        state.showLoader = false;
      })
      .addCase(getAllUnitsAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;    
      })    
      .addCase(createUnitAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(createUnitAsync.fulfilled, (state, action) => {
        state.reloadProductsTable = true;
        state.showLoader = false;
      })
      .addCase(createUnitAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(editUnitAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(editUnitAsync.fulfilled, (state, action) => {
        state.reloadProductsTable = true;
        state.showLoader = false;
      })
      .addCase(editUnitAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
      .addCase(deleteUnitAsync.pending, (state) => {
        state.showLoader = true;
        state.errorModalModel = { showError: false, errorMesage: appErrors.get("genericErrorMessage") as string }
      })
      .addCase(deleteUnitAsync.fulfilled, (state, action) => {
        state.reloadProductsTable = true;
        state.unitToBeDeleted = null;
        state.showLoader = false;
      })
      .addCase(deleteUnitAsync.rejected, (state, action) => {
        state.showLoader = false;
        state.unitToBeDeleted = null;
        state.errorModalModel.showError = true;
        state.errorModalModel.errorMesage = action.error.message ? action.error.message : appErrors.get("genericErrorMessage") as string;
      })
    },
    
});

export const { setFromLocation, setFirebaseApp, setFirebaseDb, setSideBarIsOpen, setLoggedInUser, 
  setAddEditProductModal, setConfirmationModal, setConfirmationModalModel, setActionAccepted,
  setProductToBeAdded, setProductToBeEdited, setReloadProductsTable, setReloadReportsTable, setNewReportModel,
  setQuantityModalModel, setInventoryEntryToAdd, setInventoryEntryToSubstract, setNewReportModal,
  setPackagesModalModel, setGridSearchText, setErrorModalModel, setGridCategoryFilter, setNewCampaignModal,
  setNewCampaign, setReloadCampaignTable, setActiveCampaign, setModifyInvProductsModalModel,
  setCategoryToBeDeleted, setAddEditCategoryModalModel, setUnitToBeDeleted, setAddEditUnitModalModel } = appSlice.actions;

export const fromLocation = (state: RootState) => state.appReducer.fromLocation;
export const firebaseApp = (state: RootState) => state.appReducer.firebaseApp;
export const sideBarIsOpen = (state: RootState) => state.appReducer.sideBarIsOpen;
export const showAddEditProductModal = (state: RootState) => state.appReducer.showAddEditProductModal;
export const showConfirmationModal = (state: RootState) => state.appReducer.showConfirmationModal;
export const actionAccepted = (state: RootState) => state.appReducer.actionAccepted;
export const confirmationModalModel = (state: RootState) => state.appReducer.confirmationModalModel;
export const loggedUser = (state: RootState) => state.appReducer.loggedUser;
export const showLoader = (state: RootState) => state.appReducer.showLoader;
export const fireStoreDatabase = (state: RootState) => state.appReducer.database;
export const loggedInUserMetadata = (state: RootState) => state.appReducer.loggedInUserMetadata;
export const allProducts = (state: RootState) => state.appReducer.allProducts;
export const productToBeAdded = (state: RootState) => state.appReducer.productToBeAdded;
export const productToBeEdited = (state: RootState) => state.appReducer.productToBeEdited;
export const reloadProductsTable = (state: RootState) => state.appReducer.reloadProductsTable;
export const reloadReportsTable = (state: RootState) => state.appReducer.reloadReportsTable;
export const activeInventoryReport = (state: RootState) => state.appReducer.activeInventoryReport;
export const activePackagesReport = (state: RootState) => state.appReducer.activePackagesReport;
export const quantityModalModel = (state: RootState) => state.appReducer.quantityModalModel;
export const inventoryEntryToAdd = (state: RootState) => state.appReducer.inventoryEntryToAdd;
export const inventoryEntryToSubstract = (state: RootState) => state.appReducer.inventoryEntryToSubstract;
export const showNewReportModal = (state: RootState) => state.appReducer.showNewReportModal;
export const newReportModel = (state: RootState) => state.appReducer.newReportModel;
export const packagesModalModel = (state: RootState) => state.appReducer.packagesModalModel;
export const gridSearchText = (state: RootState) => state.appReducer.gridSearchText;
export const inactiveInventoryReports = (state: RootState) => state.appReducer.inactiveInventoryReports;
export const selectedInventoryReport = (state: RootState) => state.appReducer.selectedInventoryReport;
export const selectedPackageReport = (state: RootState) => state.appReducer.selectedPackageReport;
export const errorModalModel = (state: RootState) => state.appReducer.errorModalModel;
export const gridCategoryFilter = (state: RootState) => state.appReducer.gridCategoryFilter;
export const campaigns = (state: RootState) => state.appReducer.campaigns;
export const showNewCampaignModal = (state: RootState) => state.appReducer.showNewCampaignModal;
export const newCampaign = (state: RootState) => state.appReducer.newCampaign;
export const reloadCampaignTable = (state: RootState) => state.appReducer.reloadCampaignTable;
export const activeCampaign = (state: RootState) => state.appReducer.activeCampaign;
export const modifyInvProductsModalModel = (state: RootState) => state.appReducer.modifyInvProductsModalModel;
export const allCategories = (state: RootState) => state.appReducer.allCategories;
export const allUnits = (state: RootState) => state.appReducer.allUnits;
export const categoryToBeDeleted = (state: RootState) => state.appReducer.categoryToBeDeleted;
export const addEditCategoryModalModel = (state: RootState) => state.appReducer.addEditCategoryModalModel;
export const unitToBeDeleted = (state: RootState) => state.appReducer.unitToBeDeleted;
export const addEditUnitModalModel = (state: RootState) => state.appReducer.addEditUnitModalModel;

export default appSlice.reducer;
