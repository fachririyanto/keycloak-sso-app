import { useQuery, useQueryClient } from "@tanstack/react-query";

import { APIUrl, TanstackQuery } from "@/lib/config";
import { useApi } from "@/lib/hooks/useApi";
import type { ProfilePayload, UserProfile } from "@/lib/types/account";

export interface GetProfilePayloadResponse {
    data: ProfilePayload;
}

export interface GetProfileResponse {
    data: UserProfile;
}

export const useAccount = () => {
    const api = useApi();
	const queryClient = useQueryClient();

    const {
        retry,
        staleTime,
        refetchOnReconnect,
        refetchOnWindowFocus,
    } = TanstackQuery;

    // get profile payload
    const getProfilePayload = ({
        autoload = true,
    }: {
        autoload?: boolean;
    }) => {
        return useQuery({
            queryKey: ["get_profile_payload"],
            queryFn: async () => {
                const response = await api.GET<GetProfilePayloadResponse>(
                    `${APIUrl}/account/profile/payload`
                );
                return response.data;
            },
            enabled: autoload,
            retry,
            staleTime,
            refetchOnReconnect,
            refetchOnWindowFocus,
        });
    };

    // get current user profile
    const getProfile = ({
        autoload = true,
    }: {
        autoload?: boolean;
    }) => {
		return useQuery({
			queryKey: ["get_profile"],
			queryFn: async () => {
				const response = await api.GET<GetProfileResponse>(
					`${APIUrl}/account/profile`
				);

				return response.data;
			},
			enabled: autoload,
			retry,
			staleTime,
			refetchOnReconnect,
			refetchOnWindowFocus,
		});
	};

    // update profile
    const updateProfile = async ({
        firstName,
        lastName,
    }: {
        firstName: string;
        lastName: string;
    }) => {
        const response = await api.POST(
            `${APIUrl}/account/update-profile`,
            {
                first_name: firstName,
                last_name: lastName,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // change password
    const changePassword = async ({
        oldPassword,
        newPassword,
        confirmPassword,
    }: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        const response = await api.POST(
            `${APIUrl}/account/change-password`,
            {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // refetch profile
    const refetchProfile = () => {
        queryClient.invalidateQueries({ queryKey: ["get_profile"] });
    };

    return {
        getProfilePayload,
        getProfile,
        updateProfile,
        changePassword,
        refetchProfile,
    };
};