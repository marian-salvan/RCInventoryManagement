import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, Firestore, collection, getDocs, query, where, runTransaction, orderBy } from "firebase/firestore";
import { appErrors } from "../constants/messages.constants";
import { getCategoryNameForSave } from "../helpers/categories.helper";
import { CategoryModel } from "../models/categories.models";

const categoriesCollection = "categories";
const productsCollection = "products";

const getAllCategoriesAsync = createAsyncThunk(
    'app/getAllCategoriesAsync',
    async ({db, orgId}: {db: Firestore | null, orgId: string}) => {
        const productsRef = collection(db as Firestore, categoriesCollection)

        return await getDocs(query(productsRef, 
            where("orgId", "==", orgId),
            orderBy("name", "asc")));
    }
);

const createCategoryAsync = createAsyncThunk(
    'app/createCategoryAsync',
    async ({db, categoryModel}: {db: Firestore | null, categoryModel: CategoryModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const newDocRef = doc(collection(db as Firestore, categoriesCollection));
            const categoryName = getCategoryNameForSave(categoryModel.name);

            const categoryRef = collection(db as Firestore, categoriesCollection);
            const categoriesQuerrySnapshot = await getDocs(query(categoryRef,
                where("orgId", "==", categoryModel.orgId), 
                where("name", "==", categoryName)));
        
            if (categoriesQuerrySnapshot.docs.length > 0) {
                return Promise.reject(appErrors.get("existingCategoryName"));
            }

            transaction.set(newDocRef, categoryModel);           
        });
    }
)

const editCategoryAsync = createAsyncThunk(
    'app/editCategoryAsync',
    async ({db, categoryModel}: {db: Firestore | null, categoryModel: CategoryModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const categoriesRef = collection(db as Firestore, categoriesCollection)
            const categoryName = getCategoryNameForSave(categoryModel.name);

            const querrySnapshot = await getDocs(query(categoriesRef, 
                where("orgId", "==", categoryModel.orgId), 
                where("uid", "==", categoryModel.uid)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            const categoryByBameQuerySnapshot = await getDocs(query(categoriesRef,
                where("orgId", "==", categoryModel.orgId), 
                where("name", "==", categoryName)));
        
            if (categoryByBameQuerySnapshot.docs.length > 0) {
                return Promise.reject(appErrors.get("existingCategoryName"));
            } 
            
            const existingType = querrySnapshot.docs[0].data() as CategoryModel;
            debugger
            const productsRef = collection(db as Firestore, productsCollection)
            const productsQuerrySnapshot = await getDocs(query(productsRef,
                where("orgId", "==", categoryModel.orgId), 
                where("type", "==", existingType.name)));

            if (productsQuerrySnapshot.docs.length > 0) {         
                return Promise.reject(appErrors.get("categoryUsedByAProduct") as string);
            }

            transaction.update(querrySnapshot.docs[0].ref, { ...categoryModel });
        });
    }
)

const deleteCategoryAsync = createAsyncThunk(
    'app/deleteCategoryAsync',
    async ({db, categoryModel}: {db: Firestore | null, categoryModel: CategoryModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const categoriesRef = collection(db as Firestore, categoriesCollection)
            const categoryName = getCategoryNameForSave(categoryModel.name);

            const querrySnapshot = await getDocs(query(categoriesRef, 
                where("orgId", "==", categoryModel.orgId), 
                where("uid", "==", categoryModel.uid)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            const productsRef = collection(db as Firestore, productsCollection)
            const productsQuerrySnapshot = await getDocs(query(productsRef,
                where("orgId", "==", categoryModel.orgId), 
                where("type", "==", categoryName)));

            if (productsQuerrySnapshot.docs.length > 0) {         
                return Promise.reject(appErrors.get("categoryUsedByAProduct") as string);
            }

            transaction.delete(querrySnapshot.docs[0].ref);
        });
    }
)

export {
    getAllCategoriesAsync,
    createCategoryAsync,
    editCategoryAsync,
    deleteCategoryAsync
}