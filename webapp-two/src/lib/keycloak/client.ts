import KeyCloak from "keycloak-js";

import { KeycloakConfig } from "@/lib/config";

export const keyCloak = new KeyCloak({
    url: KeycloakConfig.url,
    realm: KeycloakConfig.realm,
    clientId: KeycloakConfig.clientId,
});