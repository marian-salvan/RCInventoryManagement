import { ProductModel } from "./products.models";

export interface ProductAddStateModel extends ProductModel {
    validName: boolean | null;
    validReferencePrice: boolean | null;
}

export interface EditQuantityStateModel {
    quantity: number;
    validQuantity: boolean | null;
}

export interface NewReportStateModel {
    name: string;
    validName: boolean | null;
}