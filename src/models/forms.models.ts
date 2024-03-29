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
    productOption: string;
    validName: boolean | null;
}

export interface EditPackagesStateModel {
    quantity: number;
    totalPackages: number;
    validQuantity: boolean | null;
    validTotalPackages: boolean | null;
}

export interface NewCampaignStateModel {
    name: string;
    validName: boolean | null;
}

export interface NewCategoryStateModel {
    name: string;
    validName: boolean | null;
}

export interface NewUniStateModel {
    name: string;
    validName: boolean | null;
}