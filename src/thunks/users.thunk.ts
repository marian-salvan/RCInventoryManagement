import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, Firestore, collection,  getDoc, getDocs, query, where } from "firebase/firestore";

const getLoggedInUserMetaDataAsync = createAsyncThunk(
    'app/getLoggedInUserMetaData',
    async ({db, email}: {db: Firestore | null, email: string}) => {
        const querry = query(collection(db as Firestore, "users"), where("email", "==", email));
        return await getDocs(querry);
    }
);

export { getLoggedInUserMetaDataAsync };

