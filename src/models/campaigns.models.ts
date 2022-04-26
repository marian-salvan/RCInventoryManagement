import { Timestamp } from "firebase/firestore";

export interface CampaignModel {
    campaignId: string;
    orgId: string;
    name: string;
    active: boolean;
    createdDate: Timestamp | null;
}