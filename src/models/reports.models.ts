import { Timestamp } from "firebase/firestore";
import { ProductModel } from "./products.models";

export interface ReportBaseModel {
  uid: string;
  name: string;
  active: boolean;
  fromDate: Timestamp;
  toDate?: Timestamp | null;
}

export interface ReportPackageModel {
  quantity: number;
  totalPackages: number;
}

export interface ReportProductModel extends ProductModel {
    quantity: number;
    totalPrice: number;
}

export interface InventoryReport extends ReportBaseModel {
  inventory: ReportProductModel[];
}

export interface PacakagesReport extends ReportBaseModel {
  packages: ReportPackageModel;
}