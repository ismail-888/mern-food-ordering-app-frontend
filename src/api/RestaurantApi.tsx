import { RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useSearchRestaurants = (city?: string) => {
    const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/api/restaurant/search/${city}`
        );

        if (!response.ok) {
            throw new Error("Failed to get restaurant")
        }

        return response.json();
    };
    const { data: results, isLoading } = useQuery(
        ["searchRestaurants"],
        createSearchRequest,
        {enabled:!!city} //The enabled: !!city option ensures that the query is only executed when a city is provided.
    );

    return {
        results,
        isLoading,
    }
}