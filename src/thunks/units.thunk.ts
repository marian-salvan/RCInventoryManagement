import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, Firestore, collection, getDocs, query, where, runTransaction, orderBy } from "firebase/firestore";
import { appErrors } from "../constants/messages.constants";
import { UnitModel } from "../models/units.models";

const unitsCollection = "units";
const productsCollection = "products";

const getAllUnitsAsync = createAsyncThunk(
    'app/getAllUnitsAsync',
    async ({db, orgId}: {db: Firestore | null, orgId: string}) => {
        const productsRef = collection(db as Firestore, unitsCollection)

        return await getDocs(query(productsRef, 
            where("orgId", "==", orgId),
            orderBy("name", "asc")));
    }
);

const createUnitAsync = createAsyncThunk(
    'app/createUnitAsync',
    async ({db, unitModel}: {db: Firestore | null, unitModel: UnitModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const newDocRef = doc(collection(db as Firestore, unitsCollection));

            const unitRef = collection(db as Firestore, unitsCollection);
            const unitsQuerrySnapshot = await getDocs(query(unitRef,
                where("orgId", "==", unitModel.orgId), 
                where("name", "==", unitModel.name)));
        
            if (unitsQuerrySnapshot.docs.length > 0) {
                return Promise.reject(appErrors.get("existingUnitName"));
            }

            transaction.set(newDocRef, unitModel);           
        });
    }
)

const editUnitAsync = createAsyncThunk(
    'app/editUnitAsync',
    async ({db, unitModel}: {db: Firestore | null, unitModel: UnitModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const unitsRef = collection(db as Firestore, unitsCollection)

            const querrySnapshot = await getDocs(query(unitsRef, 
                where("orgId", "==", unitModel.orgId), 
                where("uid", "==", unitModel.uid)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            const unitByBameQuerySnapshot = await getDocs(query(unitsRef,
                where("orgId", "==", unitModel.orgId), 
                where("name", "==", unitModel.name)));
        
            if (unitByBameQuerySnapshot.docs.length > 0) {
                return Promise.reject(appErrors.get("existingUnitName"));
            } 
            
            const existingUnit = querrySnapshot.docs[0].data() as UnitModel;
            const productsRef = collection(db as Firestore, productsCollection)
            const productsQuerrySnapshot = await getDocs(query(productsRef,
                where("orgId", "==", unitModel.orgId), 
                where("unit", "==", existingUnit.name)));

            if (productsQuerrySnapshot.docs.length > 0) {         
                return Promise.reject(appErrors.get("unitUsedByAProduct") as string);
            }

            transaction.update(querrySnapshot.docs[0].ref, { ...unitModel });
        });
    }
)

const deleteUnitAsync = createAsyncThunk(
    'app/deleteUnitAsync',
    async ({db, unitModel}: {db: Firestore | null, unitModel: UnitModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const unitsRef = collection(db as Firestore, unitsCollection)

            const querrySnapshot = await getDocs(query(unitsRef, 
                where("orgId", "==", unitModel.orgId), 
                where("uid", "==", unitModel.uid)));

            if (querrySnapshot.docs.length !== 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            const productsRef = collection(db as Firestore, productsCollection)
            const productsQuerrySnapshot = await getDocs(query(productsRef,
                where("orgId", "==", unitModel.orgId), 
                where("unit", "==", unitModel.name)));

            if (productsQuerrySnapshot.docs.length > 0) {         
                return Promise.reject(appErrors.get("unitUsedByAProduct") as string);
            }

            transaction.delete(querrySnapshot.docs[0].ref);
        });
    }
)

export {
    getAllUnitsAsync,
    createUnitAsync,
    editUnitAsync,
    deleteUnitAsync
}