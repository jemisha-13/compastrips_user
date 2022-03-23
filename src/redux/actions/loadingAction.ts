import { IS_LOADING } from '../types';

export const setIsLoading = (value: any) => (dispatch: any) => {
    dispatch({
        type: IS_LOADING,
        payload: value,
    });
};