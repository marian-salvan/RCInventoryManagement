import { CategoryModel } from "./categories.models";
import { ReportProductModel } from "./reports.models";
import { UnitModel } from "./units.models";

export interface ConfirmationModalModel {
    title: string;
    message: string;
    buttonColor: string;
}

export interface AddRemoveModalModel {
  modalTitle: string;
  buttonText: string;
  buttonClass: string;
  addQty: boolean;
}

export interface ErrorModalModel {
  showError: boolean;
  errorMesage: string;
}

export interface ModifyInvProductsModalModel {
  showModal: boolean;
  inventoryProducts: ReportProductModel[];
}

export interface AddEditCategoryModalModel {
  showModal: true;
  categoryModel: CategoryModel | null;
}

export interface AddEditUnitModalModel {
  showModal: true;
  unitModel: UnitModel | null;
}