import { Timestamp } from "firebase/firestore";
import { ProductModel } from "./products.models";

export interface ReportModel {
    name: string;
    active: boolean;
    fromDate: Timestamp;
    toDate?: Timestamp | null;
    inventory: ReportProductModel[],
    packages: ReportPackageModel
}

export interface ReportPackageModel {
  quantity: number;
  totalPackages: number;
}

export interface ReportProductModel extends ProductModel {
    quantity: number;
    totalPrice: number;
}
