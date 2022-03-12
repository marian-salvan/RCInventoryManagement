import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, Firestore, getDocs, orderBy, query } from "firebase/firestore";

const inventoryCollection =  "inventory";

const getInventoryAsync = createAsyncThunk(
    'app/getInventoryAsync',
    async (db: Firestore | null) => {
        const productsRef = collection(db as Firestore, inventoryCollection)

        return await getDocs(query(productsRef, orderBy("name", "asc")));
    }
);

export { getInventoryAsync };
