export enum PRODUCT_TYPE_ENG {
    FOOD = "food",
    HYGIENE = "hygiene",
    SANITARY = "sanitary",
    OTHERS = "others"
}

export enum PRODUCT_TYPE_RO {
    FOOD = "alimente",
    HYGIENE = "materiale de igienă",
    SANITARY = "materiale sanitare",
    OTHERS = "altele"
}

export const productTypesRoToEngMap = new Map<string, string>([
    [PRODUCT_TYPE_RO.FOOD, PRODUCT_TYPE_ENG.FOOD],
    [PRODUCT_TYPE_RO.HYGIENE, PRODUCT_TYPE_ENG.HYGIENE],
    [PRODUCT_TYPE_RO.SANITARY, PRODUCT_TYPE_ENG.SANITARY],
    [PRODUCT_TYPE_RO.OTHERS, PRODUCT_TYPE_ENG.OTHERS],
]);

export const productTypesEngToRoMap = new Map<string, string>([
    [PRODUCT_TYPE_ENG.FOOD, PRODUCT_TYPE_RO.FOOD],
    [PRODUCT_TYPE_ENG.HYGIENE, PRODUCT_TYPE_RO.HYGIENE],
    [PRODUCT_TYPE_ENG.SANITARY, PRODUCT_TYPE_RO.SANITARY],
    [PRODUCT_TYPE_ENG.OTHERS, PRODUCT_TYPE_RO.OTHERS],
]);

export const productTypesOptions = [
    PRODUCT_TYPE_RO.FOOD, 
    PRODUCT_TYPE_RO.HYGIENE, 
    PRODUCT_TYPE_RO.SANITARY,
    PRODUCT_TYPE_RO.OTHERS
];