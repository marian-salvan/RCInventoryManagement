export interface UserMetadataModel {
    email: string;
    orgId: string;
    role: string;
}

export interface OrganiationModel {
    orgId: string;
    orgName: string;
}

export interface UserSettings {
    settingId: string;
    orgId: string;
    name: string;
    value: string;
}