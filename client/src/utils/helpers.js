import { useQuery } from '@apollo/client';
import { GET_FOOD } from '../utils/queries';

export const useGetFood = (searchInput) => {
    const { data } = useQuery(GET_FOOD, {
        variables: { input: searchInput }
    });
    return data;
};
