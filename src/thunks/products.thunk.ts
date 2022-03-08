import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, Firestore, collection,  getDoc, getDocs, query, where, runTransaction, orderBy } from "firebase/firestore";
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
        const newDocRef = doc(collection(db as Firestore, "products"));

        return await runTransaction(db as Firestore, async (transaction) => {
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

            querrySnapshot.forEach(foundDoc => {
                console.log(foundDoc.data())
                //transaction.delete(foundDoc.ref);
            })
        });
    }
)


export { getAllProductsAsync, createProductAsync, deleteProductAsync};
