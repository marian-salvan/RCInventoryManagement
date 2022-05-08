import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, Firestore, getDocs, query, runTransaction, where } from "firebase/firestore";
import { appErrors } from "../constants/messages.constants";
import { PacakagesReport, ReportPackageModel } from "../models/reports.models";

const packagesReportsCollection = "packages-reports";

const getActivePackagesReportsAsync = createAsyncThunk(
    'app/getActivePackagesReportAsync',
    async ({db, orgId, campaignId}: {db: Firestore | null, orgId: string, campaignId: string}) => {
        const productsRef = collection(db as Firestore, packagesReportsCollection);

        return await getDocs(query(productsRef, 
            where("active", "==", true),
            where("orgId", "==", orgId),
            where("campaignId", "==", campaignId)));
    }
);

const getPackagesReportsByUidAsync = createAsyncThunk(
    'app/getPackagesReportsByUidAsync',
    async ({db, uid, orgId, campaignId}: {db: Firestore | null, uid: string, orgId: string, campaignId: string}) => {
        const productsRef = collection(db as Firestore, packagesReportsCollection);

        return await getDocs(query(productsRef, 
            where("uid", "==", uid),
            where("orgId", "==", orgId),
            where("campaignId", "==", campaignId)));
    }
);

const addPackagesAsync = createAsyncThunk(
    'app/addPackagesAsync',
    async ({db, packageReport, orgId, campaignId}: 
        {db: Firestore | null, packageReport: ReportPackageModel, orgId: string, campaignId: string}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, packagesReportsCollection)
            const querrySnapshot = await getDocs(query(reportsRef, 
                where("active", "==", true),
                where("orgId", "==", orgId),
                where("campaignId", "==", campaignId)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            let docToBeUpdated = querrySnapshot.docs[0].data() as PacakagesReport;

            docToBeUpdated.packages.totalPackages += packageReport.totalPackages;
            docToBeUpdated.packages.quantity += packageReport.quantity;

            transaction.update(querrySnapshot.docs[0].ref, {packages: docToBeUpdated.packages});
        });
    }
)

const removePackagesAsync = createAsyncThunk(
    'app/removePackagesAsync',
    async ({db, packageReport, orgId, campaignId}: 
        {db: Firestore | null, packageReport: ReportPackageModel,  orgId: string, campaignId: string}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const reportsRef = collection(db as Firestore, packagesReportsCollection)
            const querrySnapshot = await getDocs(query(reportsRef, 
                where("active", "==", true),
                where("orgId", "==", orgId),
                where("campaignId", "==", campaignId)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            let docToBeUpdated = querrySnapshot.docs[0].data() as PacakagesReport;
            
            if (docToBeUpdated.packages.totalPackages - packageReport.totalPackages < 0) {
                return Promise.reject(appErrors.get("insufficientStock"));
            }
            if (docToBeUpdated.packages.quantity - packageReport.quantity < 0) {
                return Promise.reject(appErrors.get("insufficientStock"));
            }

            docToBeUpdated.packages.totalPackages -= packageReport.totalPackages;
            docToBeUpdated.packages.quantity -= packageReport.quantity;

            transaction.update(querrySnapshot.docs[0].ref, {packages: docToBeUpdated.packages});
        });
    }
)

export {
    getActivePackagesReportsAsync,
    addPackagesAsync,
    removePackagesAsync,
    getPackagesReportsByUidAsync
}