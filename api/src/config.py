import os

from dotenv import load_dotenv


load_dotenv()


class AppConfig:
    # Env
    ENV: str = os.getenv("ENV", "development")

    # DB URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

    # Keycloak
    KEYCLOAK_URL: str = os.getenv("KEYCLOAK_URL", "http://localhost:8080")
    KEYCLOAK_REALM: str = os.getenv("KEYCLOAK_REALM", "realm_name")
    KEYCLOAK_CLIENT_ID: str = os.getenv("KEYCLOAK_CLIENT_ID", "client_id")
    KEYCLOAK_USERNAME: str = os.getenv("KEYCLOAK_USERNAME", "username")
    KEYCLOAK_PASSWORD: str = os.getenv("KEYCLOAK_PASSWORD", "password")

    # Frontend
    FRONTEND_APP_URL: str = os.getenv("FRONTEND_APP_URL", "http://localhost:5173")


app_config = AppConfig()
