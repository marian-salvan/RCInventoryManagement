import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, Firestore, getDocs, query, runTransaction, Timestamp, where } from "firebase/firestore";
import { appErrors } from "../constants/messages.constants";
import { InventoryReport, PacakagesReport, ReportProductModel } from "../models/reports.models";

const inventoryReportsCollection = "inventory-reports";
const packagesReportsCollection = "packages-reports";

const getActiveInventoryReportsAsync = createAsyncThunk(
    'app/getActiveInventoryReportsAsync',
    async ({db, orgId, campaignId}: {db: Firestore | null, orgId: string, campaignId: string}) => {
        const productsRef = collection(db as Firestore, inventoryReportsCollection);

        return await getDocs(query(productsRef, 
            where("active", "==", true),
            where("orgId", "==", orgId),
            where("campaignId", "==", campaignId)));
    }
);

const getInactiveInventoryReportsAsync = createAsyncThunk(
    'app/getInactiveInventoryReportsAsync',
    async ({db, orgId, campaignId}: {db: Firestore | null, orgId: string, campaignId: string}) => {
        const productsRef = collection(db as Firestore, inventoryReportsCollection);

        return await getDocs(query(productsRef, 
            where("active", "==", false),
            where("orgId", "==", orgId),
            where("campaignId", "==", campaignId)));
    }
);

const getInventoryReportsByUidAsync = createAsyncThunk(
    'app/getInventoryReportsByUidAsync',
    async ({db, uid, orgId, campaignId}: {db: Firestore | null, uid: string, orgId: string, campaignId: string}) => {
        const productsRef = collection(db as Firestore, inventoryReportsCollection);

        return await getDocs(query(productsRef, 
            where("uid", "==", uid),
            where("orgId", "==", orgId),
            where("campaignId", "==", campaignId)));
    }
);

const createActiveReportAsync = createAsyncThunk(
    'app/createActiveReportAsync',
    async ({db, inventoryReport, packagesReport, orgId, campaignId}: 
        {db: Firestore | null, inventoryReport: InventoryReport, packagesReport: PacakagesReport, orgId: string, campaignId: string }) => {
        return await runTransaction(db as Firestore, async (transaction) =>       
        {
            const newDocRef = doc(collection(db as Firestore, inventoryReportsCollection));
            const invReportsRef = collection(db as Firestore, inventoryReportsCollection)
            const querrySnapshot = await getDocs(query(invReportsRef, 
                where("active", "==", true),
                where("orgId", "==", orgId),
                where("campaignId", "==", campaignId)));
            const querrySnapshotName = await getDocs(query(invReportsRef, 
                where("name", "==", inventoryReport.name),
                where("orgId", "==", orgId),
                where("campaignId", "==", campaignId)));

            if (querrySnapshot.docs.length > 0) {
                return Promise.reject(appErrors.get("existingActiveInventory"));
            }

            if (querrySnapshotName.docs.length > 0) {
                return Promise.reject(appErrors.get("existingInventoryName"));
            }

            const newPackDocRef = doc(collection(db as Firestore, packagesReportsCollection));
            
            transaction.set(newDocRef, inventoryReport);   
            transaction.set(newPackDocRef, packagesReport);   
        });
    }
)

const addQtyFromProductAsync = createAsyncThunk(
    'app/addQtyFromProductAsync',
    async ({db, report,  orgId, campaignId}: 
        {db: Firestore | null, report: ReportProductModel, orgId: string, campaignId: string}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, inventoryReportsCollection)
            const querrySnapshot = await getDocs(query(reportsRef, 
                where("active", "==", true),
                where("orgId", "==", orgId),
                where("campaignId", "==", campaignId)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            let docToBeUpdated = querrySnapshot.docs[0].data() as InventoryReport;
            let productToBeUpdated = docToBeUpdated.inventory.find(p => p.uid === report.uid);
            
            if (!productToBeUpdated) {
                return Promise.reject(appErrors.get("noProductInInventory"));
            }

            productToBeUpdated.quantity += report.quantity;
            productToBeUpdated.totalPrice = productToBeUpdated.quantity * productToBeUpdated.referencePrice;

            transaction.update(querrySnapshot.docs[0].ref, {inventory: docToBeUpdated.inventory});
        });
    }
)

const updateInventoryAsync = createAsyncThunk(
    'app/updateInventoryAsync',
    async ({db, products, orgId, campaignId}: 
        {db: Firestore | null, products: ReportProductModel[], orgId: string, campaignId: string}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, inventoryReportsCollection)
            const querrySnapshot = await getDocs(query(reportsRef, 
                where("active", "==", true),
                where("orgId", "==", orgId),
                where("campaignId", "==", campaignId)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            transaction.update(querrySnapshot.docs[0].ref, {inventory: products});
        });
    }
)

const removeQtyFromProductAsync = createAsyncThunk(
    'app/removeQtyFromProductAsync',
    async ({db, report,  orgId, campaignId}: 
        {db: Firestore | null, report: ReportProductModel, orgId: string, campaignId: string}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, inventoryReportsCollection)
            const querrySnapshot = await getDocs(query(reportsRef, 
                where("active", "==", true),
                where("orgId", "==", orgId),
                where("campaignId", "==", campaignId)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            let docToBeUpdated = querrySnapshot.docs[0].data() as InventoryReport;
                let productToBeUpdated = docToBeUpdated.inventory.find(p => p.uid === report.uid);
            
            if (!productToBeUpdated) {
                return Promise.reject(appErrors.get("noProductInInventory"));
            }

            if (productToBeUpdated.quantity - report.quantity < 0) {
                return Promise.reject(appErrors.get("insufficientStock"));
            }

            productToBeUpdated.quantity -= report.quantity;
            productToBeUpdated.totalPrice = productToBeUpdated.quantity * productToBeUpdated.referencePrice;

            transaction.update(querrySnapshot.docs[0].ref, {inventory: docToBeUpdated.inventory});
        });
    }
)

const closeCurrentReportAsync = createAsyncThunk(
    'app/closeCurrentReportAsync',
    async ({db, orgId, campaignId}: {db: Firestore | null, orgId: string, campaignId: string}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const inventoryTeportsRef = collection(db as Firestore, inventoryReportsCollection)
            const invenntoryQuerrySnapshot = await getDocs(query(inventoryTeportsRef, 
                where("active", "==", true),
                where("orgId", "==", orgId),
                where("campaignId", "==", campaignId)));

            const packagesReportsRef = collection(db as Firestore, packagesReportsCollection)
            const packagesQuerrySnapshot = await getDocs(query(packagesReportsRef, 
                where("active", "==", true),
                where("orgId", "==", orgId),
                where("campaignId", "==", campaignId)));

            if (invenntoryQuerrySnapshot.docs.length !== 1 || packagesQuerrySnapshot.docs.length !== 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
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
    getInventoryReportsByUidAsync,
    updateInventoryAsync
};
