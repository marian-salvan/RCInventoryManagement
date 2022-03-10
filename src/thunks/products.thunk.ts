import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, Firestore, collection, getDocs, query, where, runTransaction, orderBy } from "firebase/firestore";
import { genericErrorMessage } from "../constants/messages.constants";
import { ProductModel } from "../models/products.models";

const getAllProductsAsync = createAsyncThunk(
    'app/getAllProductsAsync',
    async (db: Firestore | null) => {
        const productsRef = collection(db as Firestore, "products")

        return await getDocs(query(productsRef, orderBy("name", "asc")));
    }
);

const createProductAsync = createAsyncThunk(
    'app/createProductAsync',
    async ({db, product}: {db: Firestore | null, product: ProductModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const newDocRef = doc(collection(db as Firestore, "products"));
            const productsRef = collection(db as Firestore, "products");
            const querrySnapshot = await getDocs(query(productsRef, where("name", "==", product.name)));

            if (querrySnapshot.docs.length > 0) {
                return Promise.reject("Cannot add duplicate product");
            }

            transaction.set(newDocRef, product);           
        });
    }
)

const deleteProductAsync = createAsyncThunk(
    'app/deleteProductAsync',
    async ({db, productName}: {db: Firestore | null, productName: string}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const productsRef = collection(db as Firestore, "products")
            const querrySnapshot = await getDocs(query(productsRef, where("name", "==", productName)));

            if (querrySnapshot.docs.length != 1) {
                return Promise.reject(genericErrorMessage);
            }

            transaction.delete(querrySnapshot.docs[0].ref);
        });
    }
)

export { getAllProductsAsync, createProductAsync, deleteProductAsync};

