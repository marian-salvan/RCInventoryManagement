import { ProductModel } from "./products.models";

export interface ProductAddModel extends ProductModel {
    validName: boolean | null;
    validReferencePrice: boolean | null;
}

export interface EditQuantityModel {
    quantity: number;
    validQuantity: boolean | null;
}