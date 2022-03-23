import {CHANGE_LOGIN_STATE} from '../types'

export const changeLoginState = (value :boolean) => (dispatch: any) =>{
    dispatch({
        type:CHANGE_LOGIN_STATE,
        payload:value,
    })

}