import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, Firestore, getDocs, query, runTransaction, Timestamp, where } from "firebase/firestore";
import { genericErrorMessage } from "../constants/messages.constants";
import { InventoryReport, PacakagesReport, ReportProductModel } from "../models/reports.models";

const inventoryReportsCollection = "inventory-reports";
const packagesReportsCollection = "packages-reports";

const getActiveInventoryReportsAsync = createAsyncThunk(
    'app/getActiveInventoryReportsAsync',
    async (db: Firestore | null) => {
        const productsRef = collection(db as Firestore, inventoryReportsCollection);

        return await getDocs(query(productsRef, where("active", "==", true)));
    }
);

const getInactiveInventoryReportsAsync = createAsyncThunk(
    'app/getInactiveInventoryReportsAsync',
    async (db: Firestore | null) => {
        debugger
        const productsRef = collection(db as Firestore, inventoryReportsCollection);

        return await getDocs(query(productsRef, where("active", "==", false)));
    }
);

const getInventoryReportsByUidAsync = createAsyncThunk(
    'app/getInventoryReportsByUidAsync',
    async ({db, uid}: {db: Firestore | null, uid: string}) => {
        const productsRef = collection(db as Firestore, inventoryReportsCollection);

        return await getDocs(query(productsRef, where("uid", "==", uid)));
    }
);

const createActiveReportAsync = createAsyncThunk(
    'app/createActiveReportAsync',
    async ({db, inventoryReport, packagesReport}: {db: Firestore | null, inventoryReport: InventoryReport, packagesReport: PacakagesReport }) => {
        return await runTransaction(db as Firestore, async (transaction) =>       
        {
            const newDocRef = doc(collection(db as Firestore, inventoryReportsCollection));
            const invReportsRef = collection(db as Firestore, inventoryReportsCollection)
            const querrySnapshot = await getDocs(query(invReportsRef, where("active", "==", true)));
            const querrySnapshotName = await getDocs(query(invReportsRef, where("name", "==", inventoryReport.name)));

            if (querrySnapshot.docs.length > 0) {
                return Promise.reject("Există deja un inventar activ");
            }

            if (querrySnapshotName.docs.length > 0) {
                return Promise.reject("Există un inventar cu acest nume");
            }

            const newPackDocRef = doc(collection(db as Firestore, packagesReportsCollection));
            
            transaction.set(newDocRef, inventoryReport);   
            transaction.set(newPackDocRef, packagesReport);   
        });
    }
)

const addQtyFromProductAsync = createAsyncThunk(
    'app/addQtyFromProductAsync',
    async ({db, report}: {db: Firestore | null, report: ReportProductModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, inventoryReportsCollection)
            const querrySnapshot = await getDocs(query(reportsRef, where("active", "==", true)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(genericErrorMessage);
            }

            let docToBeUpdated = querrySnapshot.docs[0].data() as InventoryReport;
            let productToBeUpdated = docToBeUpdated.inventory.find(p => p.uid === report.uid);
            
            if (!productToBeUpdated) {
                return Promise.reject("Nu am găsit produsul în inventar");
            }

            productToBeUpdated.quantity += report.quantity;
            productToBeUpdated.totalPrice = productToBeUpdated.quantity * productToBeUpdated.referencePrice;

            transaction.update(querrySnapshot.docs[0].ref, {inventory: docToBeUpdated.inventory});
        });
    }
)

const removeQtyFromProductAsync = createAsyncThunk(
    'app/removeQtyFromProductAsync',
    async ({db, report}: {db: Firestore | null, report: ReportProductModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, inventoryReportsCollection)
            const querrySnapshot = await getDocs(query(reportsRef, where("active", "==", true)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(genericErrorMessage);
            }

            let docToBeUpdated = querrySnapshot.docs[0].data() as InventoryReport;
                let productToBeUpdated = docToBeUpdated.inventory.find(p => p.uid === report.uid);
            
            if (!productToBeUpdated) {
                return Promise.reject("Nu am găsit produsul în inventar");
            }

            if (productToBeUpdated.quantity - report.quantity < 0) {
                return Promise.reject("Stoc insuficient");
            }

            productToBeUpdated.quantity -= report.quantity;
            productToBeUpdated.totalPrice = productToBeUpdated.quantity * productToBeUpdated.referencePrice;

            transaction.update(querrySnapshot.docs[0].ref, {inventory: docToBeUpdated.inventory});
        });
    }
)

const closeCurrentReportAsync = createAsyncThunk(
    'app/closeCurrentReportAsync',
    async (db: Firestore | null) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const inventoryTeportsRef = collection(db as Firestore, inventoryReportsCollection)
            const invenntoryQuerrySnapshot = await getDocs(query(inventoryTeportsRef, where("active", "==", true)));

            const packagesReportsRef = collection(db as Firestore, packagesReportsCollection)
            const packagesQuerrySnapshot = await getDocs(query(packagesReportsRef, where("active", "==", true)));

            if (invenntoryQuerrySnapshot.docs.length !== 1 || packagesQuerrySnapshot.docs.length !== 1) {
                return Promise.reject(genericErrorMessage);
            }

            let invDocToBeUpdated = invenntoryQuerrySnapshot.docs[0].data() as InventoryReport;
            invDocToBeUpdated.active = false;
            invDocToBeUpdated.toDate = Timestamp.fromDate(new Date());

            let pkgDocToBeUpdated = packagesQuerrySnapshot.docs[0].data() as PacakagesReport;
            pkgDocToBeUpdated.active = false;
            pkgDocToBeUpdated.toDate = Timestamp.fromDate(new Date());
            
            transaction.update(invenntoryQuerrySnapshot.docs[0].ref, {
                active: invDocToBeUpdated.active, 
                toDate: invDocToBeUpdated.toDate
            });

            transaction.update(packagesQuerrySnapshot.docs[0].ref, {
                active: pkgDocToBeUpdated.active, 
                toDate: pkgDocToBeUpdated.toDate
            });
        });
    }
)

export { 
    getActiveInventoryReportsAsync, 
    createActiveReportAsync, 
    addQtyFromProductAsync, 
    removeQtyFromProductAsync,
    closeCurrentReportAsync,
    getInactiveInventoryReportsAsync,
    getInventoryReportsByUidAsync
};
