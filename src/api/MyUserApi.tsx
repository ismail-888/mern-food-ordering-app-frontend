import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useGetMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyUserRequest = async (): Promise<User> => {
        const accessToken = await getAccessTokenSilently(); // Get the access token from Auth0
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`, // Attach the access token in the request header
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Faild to fetch user")
        }
        return response.json();
    }

    const {
        data: currentUser,
        isLoading,
        error,
    } = useQuery("fetchCurrentUser", getMyUserRequest);
    // Use react-query's useQuery hook to manage the data fetching
    // useQuery: This hook from react - query is used to handle the data fetching.It:
    // Takes a query key("fetchCurrentUser") and the data fetching function (getMyUserRequest).
    // Returns the current user data(currentUser), loading state(isLoading), and any error(error).

    if (error) {
        toast.error(error.toString())
    }
    return { currentUser, isLoading };
}




type CreateUserRequest = {
    auth0Id: string;
    email: string;
};

export const useCreateMyUser = () => {

    const { getAccessTokenSilently } = useAuth0();



    const createMyUserRequest = async (user: CreateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error("Failed to create user")
        }

    }

    const {
        mutateAsync: createUser,
        isLoading,
        isError,
        isSuccess,
    } = useMutation(createMyUserRequest)

    return {
        createUser,
        isLoading,
        isError,
        isSuccess
    }
}




type UpdateMyUserRequest = {
    name: string;
    addressLine1: string;
    city: string;
    country: string;

}

export const useUpdateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyuserRequest = async (formData: UpdateMyUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error("Failed to update user")
        }
        return response.json()
    };

    const {
        mutateAsync: updateUser,
        isLoading,
        isSuccess,
        error,
        reset,
    } = useMutation(updateMyuserRequest)

    if (isSuccess) {
        toast.success("User profile updated!")
    }
    if (error) {
        toast.error(error.toString())
        reset();
    }

    return { updateUser, isLoading }
}