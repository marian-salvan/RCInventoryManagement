import { Timestamp } from "firebase/firestore";
import { ProductModel } from "./products.models";

export interface ReportBaseModel {
  uid: string;
  name: string;
  active: boolean;
  fromDate: Timestamp;
  toDate?: Timestamp | null;
  orgId: string;
  campaignId: string;
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

export interface NewReportModel {
  reportName: string;
  selectedProuducts: ProductModel[];
}