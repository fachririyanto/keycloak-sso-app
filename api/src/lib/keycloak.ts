import { jwtVerify, createRemoteJWKSet } from "jose";

import {
    KEYCLOAK_URL,
    KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID,
    KEYCLOAK_USERNAME,
    KEYCLOAK_PASSWORD,
} from "./config";

const JWKS = createRemoteJWKSet(
    new URL(`${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`)
);

interface AuthPayload {
    exp: string;
    iat: string;
    auth_time: string;
    jti: string;
    iss: string;
    aud: string[];
    sub: string;
    typ: string;
    azp: string;
    sid: string;
    acr: string;
    "allowed-origins": string[];
    realm_access: {
        roles: string[];
    };
    resource_access: {
        "realm-management": {
            roles: string[],
        };
        broker: {
            roles: string[],
        };
        account: {
            roles: string[],
        };
    };
    scope: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
}

export const verifyToken = async (authorization?: string): Promise<AuthPayload> => {
    if (!authorization) throw new Error("No token");

    const token = authorization.replace("Bearer ", "");

    const { payload } = await jwtVerify<AuthPayload>(token, JWKS, {
        issuer: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`,
    });

    return payload;
};

export const getAdminToken = async (): Promise<string> => {
    const response = await fetch(
        `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "password",
                client_id: KEYCLOAK_CLIENT_ID!,
                username: KEYCLOAK_USERNAME!,
                password: KEYCLOAK_PASSWORD!,
            }),
        }
    );

    const data = await response.json();
    return data.access_token;
};