import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, Firestore, getDocs, orderBy, query, where } from "firebase/firestore";

const getActiveReportsAsync = createAsyncThunk(
    'app/getActiveReportAsync',
    async (db: Firestore | null) => {
        const productsRef = collection(db as Firestore, "reports");

        return await getDocs(query(productsRef, where("active", "==", true)));
    }
);

export { getActiveReportsAsync };
