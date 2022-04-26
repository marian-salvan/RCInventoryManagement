import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, Firestore, collection, getDocs, query, where, runTransaction, orderBy } from "firebase/firestore";
import { appErrors } from "../constants/messages.constants";
import { ProductModel } from "../models/products.models";
import { InventoryReport, ReportProductModel } from "../models/reports.models";

const productsCollection = "products";
const reportsCollection = "inventory-reports";

const getAllProductsAsync = createAsyncThunk(
    'app/getAllProductsAsync',
    async (db: Firestore | null) => {
        const productsRef = collection(db as Firestore, productsCollection)

        return await getDocs(query(productsRef, orderBy("name", "asc")));
    }
);

const createProductAsync = createAsyncThunk(
    'app/createProductAsync',
    async ({db, product}: {db: Firestore | null, product: ProductModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const newDocRef = doc(collection(db as Firestore, productsCollection));
            const productsRef = collection(db as Firestore, productsCollection);
            const productsQuerrySnapshot = await getDocs(query(productsRef, where("name", "==", product.name)));
        
            if (productsQuerrySnapshot.docs.length > 0) {
                return Promise.reject(appErrors.get("existingProductName"));
            }

            const reportsRef = collection(db as Firestore, reportsCollection)
            const reportsQuerySnapshot = await getDocs(query(reportsRef, where("active", "==", true)));

            if (reportsQuerySnapshot.docs.length === 1) {
               
                let docToBeUpdated = reportsQuerySnapshot.docs[0].data() as InventoryReport;
                docToBeUpdated.inventory.push({
                   ...product,
                   quantity: 0,
                   totalPrice: 0
                });

                transaction.update(reportsQuerySnapshot.docs[0].ref, {inventory: docToBeUpdated.inventory});
            }

            transaction.set(newDocRef, product);           
        });
    }
)

const editProductAsync = createAsyncThunk(
    'app/editProductAsync',
    async ({db, product}: {db: Firestore | null, product: ProductModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const productsRef = collection(db as Firestore, productsCollection)
            const querrySnapshot = await getDocs(query(productsRef, where("uid", "==", product.uid)));

            if (querrySnapshot.docs.length != 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            const reportsRef = collection(db as Firestore, reportsCollection)
            const reportsQuerySnapshot = await getDocs(query(reportsRef, where("active", "==", true)));

            if (reportsQuerySnapshot.docs.length === 1) {               
                let docToBeUpdated = reportsQuerySnapshot.docs[0].data() as InventoryReport;
                const productIndex = docToBeUpdated.inventory.findIndex(p => p.uid === product.uid);

                if ( productIndex === -1 ) {
                    return Promise.reject(appErrors.get("genericErrorMessage") as string);
                }

                const newTotalPrice: number = docToBeUpdated.inventory[productIndex].quantity * product?.referencePrice;
                
                const updatedProduct: ReportProductModel = { 
                    ...product, 
                    quantity: docToBeUpdated.inventory[productIndex].quantity, 
                    totalPrice: newTotalPrice
                };

                docToBeUpdated.inventory[productIndex] = updatedProduct;
                
                transaction.update(reportsQuerySnapshot.docs[0].ref, {inventory: docToBeUpdated.inventory});
            }

            transaction.update(querrySnapshot.docs[0].ref, { ...product });
        });
    }
)

const deleteProductAsync = createAsyncThunk(
    'app/deleteProductAsync',
    async ({db, uid}: {db: Firestore | null, uid: string}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const productsRef = collection(db as Firestore, productsCollection)
            const querrySnapshot = await getDocs(query(productsRef, where("uid", "==", uid)));

            if (querrySnapshot.docs.length != 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            const reportsRef = collection(db as Firestore, reportsCollection)
            const reportsQuerySnapshot = await getDocs(query(reportsRef, where("active", "==", true)));

            if (reportsQuerySnapshot.docs.length === 1) {
               
                let docToBeUpdated = reportsQuerySnapshot.docs[0].data() as InventoryReport;
                const productIndex = docToBeUpdated.inventory.findIndex(p => p.uid === uid);

                if (productIndex === -1) {
                    return Promise.reject(appErrors.get("genericErrorMessage") as string);
                }

                docToBeUpdated.inventory.splice(productIndex, 1);

                transaction.update(reportsQuerySnapshot.docs[0].ref, {inventory: docToBeUpdated.inventory});
            }

            transaction.delete(querrySnapshot.docs[0].ref);
        });
    }
)

export { getAllProductsAsync, createProductAsync, editProductAsync, deleteProductAsync};

