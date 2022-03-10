import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, Firestore, getDoc, getDocs, orderBy, query, runTransaction, Timestamp, where } from "firebase/firestore";
import { genericErrorMessage } from "../constants/messages.constants";
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
        return await runTransaction(db as Firestore, async (transaction) =>       
        {
            const newDocRef = doc(collection(db as Firestore, "reports"));
            const reportsRef = collection(db as Firestore, "reports")
            const querrySnapshot = await getDocs(query(reportsRef, where("active", "==", true)));
            const querrySnapshotName = await getDocs(query(reportsRef, where("name", "==", report.name)));

            if (querrySnapshot.docs.length > 0) {
                return Promise.reject("Există deja un inventar activ");
            }

            if (querrySnapshotName.docs.length > 0) {
                return Promise.reject("Există un inventar cu acest nume");
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
            const querrySnapshot = await getDocs(query(reportsRef, where("active", "==", true)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(genericErrorMessage);
            }

            let docToBeUpdated = querrySnapshot.docs[0].data() as ReportModel;
            let productToBeUpdated = docToBeUpdated.inventory.find(p => p.name === report.name);
            
            if (!productToBeUpdated) {
                return Promise.reject("Nu am găsit produsul în inventar");
            }

            productToBeUpdated.quantity = productToBeUpdated.quantity + report.quantity;
            productToBeUpdated.totalPrice = productToBeUpdated.quantity * productToBeUpdated.referencePrice;

            transaction.update(querrySnapshot.docs[0].ref, {inventory: docToBeUpdated.inventory});
        });
    }
)

const removeQtyFromProductAsync = createAsyncThunk(
    'app/removeQtyFromProductAsync',
    async ({db, report}: {db: Firestore | null, report: ReportProductModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, "reports")
            const querrySnapshot = await getDocs(query(reportsRef, where("active", "==", true)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(genericErrorMessage);
            }

            let docToBeUpdated = querrySnapshot.docs[0].data() as ReportModel;
                let productToBeUpdated = docToBeUpdated.inventory.find(p => p.name === report.name);
            
            if (!productToBeUpdated) {
                return Promise.reject("Nu am găsit produsul în inventar");
            }

            if (productToBeUpdated.quantity - report.quantity < 0) {
                return Promise.reject("Stoc insuficient");
            }

            productToBeUpdated.quantity = productToBeUpdated.quantity - report.quantity;
            productToBeUpdated.totalPrice = productToBeUpdated.quantity * productToBeUpdated.referencePrice;

            transaction.update(querrySnapshot.docs[0].ref, {inventory: docToBeUpdated.inventory});
        });
    }
)

const closeCurrentReportAsync = createAsyncThunk(
    'app/closeCurrentReportAsync',
    async (db: Firestore | null) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, "reports")
            const querrySnapshot = await getDocs(query(reportsRef, where("active", "==", true)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(genericErrorMessage);
            }

            let docToBeUpdated = querrySnapshot.docs[0].data() as ReportModel;
            docToBeUpdated.active = false;
            docToBeUpdated.toDate = Timestamp.fromDate(new Date());

            transaction.update(querrySnapshot.docs[0].ref, {
                active: docToBeUpdated.active, 
                toDate: docToBeUpdated.toDate
            });
        });
    }
)

export { 
    getActiveReportsAsync, 
    createActiveReportAsync, 
    addQtyFromProductAsync, 
    removeQtyFromProductAsync,
    closeCurrentReportAsync
};
