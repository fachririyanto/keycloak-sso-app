import { useState, useEffect, useCallback } from "react";
import { LoaderCircle, AlertCircle, CheckCircle } from "lucide-react";

import { useKeycloak } from "@/components/authenticator";
import { useAccount } from "@/lib/hooks/useAccount";
import { getErrorMessage } from "@/lib/utils/error";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function FormEditProfile() {
    const { user, updateUser } = useKeycloak();
    const { updateProfile } = useAccount();

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    useEffect(() => {
        if (user) {
            setFirstName(user.given_name);
            setLastName(user.family_name);
        }
    }, [user]);

    const saveProfile = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading || !user) {
            return;
        }

        setError("");
        setSuccess("");

        if (firstName === "") {
            setError("First name is required");
            return;
        }

        if (lastName === "") {
            setError("Last name is required");
            return;
        }

        setIsLoading(true);

        try {
            await updateProfile({
                firstName,
                lastName,
            });

            // show success message
            setSuccess("Profile updated");

            // update user info in context
            updateUser({
                ...user,
                name: `${firstName} ${lastName}`,
                given_name: firstName,
                family_name: lastName,
            });
        } catch (error) {
            console.error("Update profile error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during update profile");
        } finally {
            setIsLoading(false);
        }
    }, [firstName, lastName, isLoading, updateProfile]);

    return (
        <form onSubmit={saveProfile}>
            {
                error && (
                    <Alert variant="destructive" className="mb-4 border-red-100 bg-red-50">
                        <AlertCircle />
                        <AlertDescription className="leading-snug">{error}</AlertDescription>
                    </Alert>
                )
            }
            {
                success && (
                    <Alert className="mb-4 border-green-100 bg-green-50">
                        <CheckCircle className="!text-green-600" />
                        <AlertDescription className="text-green-700 leading-snug">
                            {success}
                        </AlertDescription>
                    </Alert>
                )
            }
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="inputFirstName" className="font-normal">First Name</FieldLabel>
                    <Input
                        id="inputFirstName"
                        type="text"
                        placeholder="e.g. John"
                        value={firstName}
                        className="h-10"
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="inputLastName" className="font-normal">Last Name</FieldLabel>
                    <Input
                        id="inputLastName"
                        type="text"
                        placeholder="e.g. Doe"
                        value={lastName}
                        className="h-10"
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                </Field>
            </FieldGroup>
            <div className="flex mt-6 justify-end">
                <Button
                    type="submit"
                    className="h-10"
                    disabled={isLoading}
                    >
                    {isLoading && <LoaderCircle className="animate-spin" />}
                    Update Profile
                </Button>
            </div>
        </form>
    );
}