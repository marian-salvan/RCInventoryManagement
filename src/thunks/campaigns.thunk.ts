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
    async ({db, orgId, campaign}: {db: Firestore | null, orgId: string, campaign: CampaignModel}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const newDocRef = doc(collection(db as Firestore, campaignsCollection));
            const campaignsRef = collection(db as Firestore, campaignsCollection);
            const campaignsQuerrySnapshot = await getDocs(query(campaignsRef, 
                where("name", "==", campaign.name),
                where("orgId", "==", orgId)));
        
            if (campaignsQuerrySnapshot.docs.length > 0) {
                return Promise.reject(appErrors.get("existingCampaignName"));
            }

            transaction.set(newDocRef, campaign);           
        });
    }
)

const changeActiveCampaignAsync = createAsyncThunk(
    'app/changeActiveCampaignAsync',
    async ({db, orgId, newCampaignId, activeCampaignId}: 
        {db: Firestore | null, orgId: string, newCampaignId: string, activeCampaignId: string}) => {
        return await runTransaction(db as Firestore, async (transaction) => {
            const campaignsRef = collection(db as Firestore, campaignsCollection);

            const newCampaignQuerySnapshot = await getDocs(query(campaignsRef, 
                where("campaignId", "==", newCampaignId),
                where("orgId", "==", orgId)));

            const activeCampaignQuerySnapshot = await getDocs(query(campaignsRef,
                 where("campaignId", "==", activeCampaignId),
                 where("orgId", "==", orgId)));

            if (newCampaignQuerySnapshot.docs.length !== 1 || activeCampaignQuerySnapshot.docs.length !== 1) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            const existingNewCampaign = newCampaignQuerySnapshot.docs[0].data() as CampaignModel;
            const existingActiveCampaign = activeCampaignQuerySnapshot.docs[0].data() as CampaignModel;

            if (existingNewCampaign.active && !existingActiveCampaign.active) {
                return Promise.reject(appErrors.get("genericErrorMessage") as string);
            }

            existingNewCampaign.active = true;
            existingActiveCampaign.active = false;

            transaction.update(newCampaignQuerySnapshot.docs[0].ref, { ...existingNewCampaign });
            transaction.update(activeCampaignQuerySnapshot.docs[0].ref, { ...existingActiveCampaign });
        });
    }
)

export { getAllCampaignsForOrgAsync, createCampaignAsync, changeActiveCampaignAsync };

