from keycloak import KeycloakOpenID, KeycloakAdmin, KeycloakOpenIDConnection

from src.config import app_config


keycloak_openid = KeycloakOpenID(
    server_url=app_config.KEYCLOAK_URL,
    client_id=app_config.KEYCLOAK_CLIENT_ID,
    realm_name=app_config.KEYCLOAK_REALM,
)

keycloak_openid_connection = KeycloakOpenIDConnection(
    server_url=app_config.KEYCLOAK_URL,
    username=app_config.KEYCLOAK_USERNAME,
    password=app_config.KEYCLOAK_PASSWORD,
    realm_name=app_config.KEYCLOAK_REALM,
    user_realm_name=app_config.KEYCLOAK_REALM,
)

keycloak_admin = KeycloakAdmin(
    connection=keycloak_openid_connection,
)
