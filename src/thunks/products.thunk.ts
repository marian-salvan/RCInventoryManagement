import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, Firestore, collection,  getDoc, getDocs, query, where } from "firebase/firestore";

const getAllProductsAsync = createAsyncThunk(
    'app/getAllProductsAsync',
    async (db: Firestore | null) => {
        return await getDocs(collection(db as Firestore, "products"));
    }
);

export { getAllProductsAsync };

