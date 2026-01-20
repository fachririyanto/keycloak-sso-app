export interface ProfilePayload {
    sub: string;
    email_verified: boolean;
    email: string;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    enabled: boolean;
    createdTimestamp: number;
    totp: boolean;
    disableableCredentialTypes: string[];
    requiredActions: string[];
    notBefore: number;
    access: {
        manageGroupMembership: boolean;
        view: boolean;
        mapRoles: boolean;
        impersonate: boolean;
        manage: boolean;
    };
}