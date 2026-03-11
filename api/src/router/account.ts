import { Elysia, status } from "elysia";
import { verifyToken, getAdminToken } from "../lib/keycloak";

export const accountRouter = new Elysia({ prefix: "/account" })
    .derive(async ({ headers }) => {
        try {
            const user = await verifyToken(headers.authorization);
            return { user };
        } catch (error) {
            return status(401, { error: "Unauthorized" });
        }
    })
    .get("/me", async ({ user }) => {
        try {
            const userId = user.sub;

            // Get admin token to call Keycloak Admin API
            const adminToken = await getAdminToken();

            // Fetch user profile from Keycloak
            const response = await fetch(
                `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch user profile");
            }

            const userProfile = await response.json();
            return { data: userProfile };
        } catch (error) {
            return status(500, { error: "Failed to fetch user profile" });
        }
    })
    .post("/update-profile", async ({ request, user }) => {
        // Input validation
        const { first_name: firstName, last_name: lastName } = await request.json();

        if (!firstName || !lastName) {
            // Return a 400 Bad Request response if validation fails
            return status(400, {
                error: "First name and last name are required",
            });
        }

        try {
            // Get admin token to call Keycloak Admin API
            const adminToken = await getAdminToken();

            // Update user profile in Keycloak
            await fetch(
                `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${user.sub}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                    }),
                }
            );

            return { message: "Profile updated successfully" };
        } catch (error) {
            return status(500, { error: "Failed to update profile" });
        }
    })
    .post("/change-password", async ({ request, user }) => {
        // Input validation
        const {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
        } = await request.json();

        if (!oldPassword) {
            // Return a 400 Bad Request response if validation fails
            return status(400, {
                error: "Old password is required",
            });
        }

        if (!newPassword || newPassword.length < 8) {
            // Return a 400 Bad Request response if validation fails
            return status(400, {
                error: "New password must be at least 8 characters long",
            });
        }

        if (newPassword !== confirmPassword) {
            // Return a 400 Bad Request response if validation fails
            return status(400, {
                error: "New password and confirm password do not match",
            });
        }

        try {
            // Get admin token to call Keycloak Admin API
            const adminToken = await getAdminToken();

            // Verify current password by attempting to get a token with the user's credentials
            const verifyResponse = await fetch(
                `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        grant_type: "password",
                        client_id: process.env.KEYCLOAK_CLIENT_ID!,
                        username: user.preferred_username,
                        password: oldPassword,
                    }),
                }
            );

            if (!verifyResponse.ok) {
                return status(400, { error: "Old password is incorrect" });
            }

            // Update user password in Keycloak
            const response = await fetch(
                `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${user.sub}/reset-password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify({
                        type: "password",
                        value: newPassword,
                        temporary: false,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to change password");
            }

            return { message: "Password changed successfully" };
        } catch (error) {
            return status(500, { error: "Failed to change password" });
        }
    });