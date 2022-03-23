import { CHANGE_LOGIN_STATE } from '../types';

const initialState = {
    is_loggedin: false,
};

export const isUserLoginReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case CHANGE_LOGIN_STATE:
            return {
                ...state,
                is_loggedin: action.payload,
            };
        default:
            return state;
    }
};
