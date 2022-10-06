import { productTypesEngToRoMap, productTypesRoToEngMap } from "../constants/product-types.constants";

export const getCategoryName = (name: string) => {
    const categoryName = productTypesEngToRoMap.get(name);
    return categoryName ? categoryName : name;
}

export const getCategoryNameForSave = (name: string) => {
    const categoryName = productTypesRoToEngMap.get(name);
    return categoryName ? categoryName : name;
}