import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { appErrors, appMessages } from '../constants/messages.constants';
import { AddRemoveModalModel, ConfirmationModalModel, ErrorModalModel } from '../models/modal.models';
import { ProductModel } from '../models/products.models';
import { InventoryReport, PacakagesReport, ReportProductModel } from '../models/reports.models';
import { UserMetadataModel } from '../models/user.model';

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
    errorModalModel: ErrorModalModel;
    gridCategoryFilter: string | null;
}
  
export const initialState: AppState = {
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
        title: appMessages.get("confirmationModalDefaultTitle") as string,
        message: appMessages.get("confirmationModalDefaultMessage") as string,
        buttonColor: "primary"
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
    errorModalModel: {
        showError: false,
        errorMesage: appErrors.get("genericErrorMessage") as string,
    },
    gridCategoryFilter: null
};
