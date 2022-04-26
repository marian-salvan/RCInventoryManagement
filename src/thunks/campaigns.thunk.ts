import { createAsyncThunk } from "@reduxjs/toolkit";
import { Firestore, collection, getDocs, query, where, orderBy, runTransaction, doc } from "firebase/firestore";
import { appErrors } from "../constants/messages.constants";
import { CampaignModel } from "../models/campaigns.models";

const campaignsCollection = "campaigns";

const getAllCampaignsForOrgAsync = createAsyncThunk(
    'app/getAllCampaignsForOrgAsync',
    async ({db, orgId}: {db: Firestore | null, orgId: string}) => {
        const campaignsRef = collection(db as Firestore, campaignsCollection);

        const querry = query(campaignsRef, 
            where("orgId", "==", orgId), 
            orderBy("name", "asc"));

        return await getDocs(querry);
    }
);

const createCampaignAsync = createAsyncThunk(
    'app/createCampaignAsync',
    async ({db, campaign}: {db: Firestore | null, campaign: CampaignModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const newDocRef = doc(collection(db as Firestore, campaignsCollection));
            const campaignsRef = collection(db as Firestore, campaignsCollection);
            const campaignsQuerrySnapshot = await getDocs(query(campaignsRef, where("name", "==", campaign.name)));
        
            if (campaignsQuerrySnapshot.docs.length > 0) {
                return Promise.reject(appErrors.get("existingCampaignName"));
            }

            transaction.set(newDocRef, campaign);           
        });
    }
)

export { getAllCampaignsForOrgAsync, createCampaignAsync };

