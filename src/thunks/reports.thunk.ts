import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, Firestore, getDocs, orderBy, query, runTransaction, where } from "firebase/firestore";
import { ReportModel, ReportProductModel } from "../models/reports.models";

const getActiveReportsAsync = createAsyncThunk(
    'app/getActiveReportAsync',
    async (db: Firestore | null) => {
        const productsRef = collection(db as Firestore, "reports");

        return await getDocs(query(productsRef, where("active", "==", true)));
    }
);

const createActiveReportAsync = createAsyncThunk(
    'app/createActiveReportAsync',
    async ({db, report}: {db: Firestore | null, report: ReportModel}) => {
        const newDocRef = doc(collection(db as Firestore, "reports"));

        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, "reports")
            const querrySnapshot = await getDocs(query(reportsRef, where("active", "==", true)));

            if (querrySnapshot.docs.length > 0) {
                return Promise.reject("Cannot have 2 active reports");
            }

            transaction.set(newDocRef, report);           
        });
    }
)

const addQtyFromProductAsync = createAsyncThunk(
    'app/addQtyFromProductAsync',
    async ({db, report}: {db: Firestore | null, report: ReportProductModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, "reports")
            const querrySnapshot = await getDocs(query(reportsRef, 
                where("inventory", "array-contains", report),
                where("active", "==", true)));

            querrySnapshot.forEach(foundDoc => {
              
                const newPopulation = foundDoc.data().population + 1;
                transaction.update(foundDoc.ref, { population: newPopulation });
            })
        });
    }
)

const removeQtyFromProductAsync = createAsyncThunk(
    'app/removeQtyFromProductAsync',
    async ({db, report}: {db: Firestore | null, report: ReportProductModel}) => {

        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, "reports")
            const querrySnapshot = await getDocs(query(reportsRef, where("active", "==", true)));

            if (querrySnapshot.docs.length > 0) {
                return Promise.reject("Cannot have 2 active reports");
            }

        });
    }
)

export { getActiveReportsAsync, createActiveReportAsync, addQtyFromProductAsync, removeQtyFromProductAsync};
