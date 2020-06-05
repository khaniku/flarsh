import { USER } from "../constants/ActionTypes";
import { CARD } from "../constants/ActionTypes";
import { UPDATE_TOKEN } from "../constants/ActionTypes";
import { FETCH_CARD } from "../constants/ActionTypes";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';

const url = "http://localhost:3000"

export function User(details) {
    return { type: USER, payload: details}
}

export const updateToken = (token, expirationTime) => {
    return { type: UPDATE_TOKEN, payload: {
        token,
        expirationTime
        } 
    }
}

export const addCard = ( card ) => {
    return { type: CARD, payload: card}
}

export const newToken = ( refreshToken, apiKey ) => {
    return dispatch => {  
      axios
        .post('https://securetoken.googleapis.com/v1/token?key='+apiKey, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
        .then(res => {
            let now = new Date();
            let date = moment(now).add(res.data.expires_in, 's').toDate();            
            SecureStore.setItemAsync('token', res.data.access_token);
            dispatch(updateToken(res.data.access_token, date));
        })
        .catch(err => {
          console.log(err.message)
        });
    };
};

export const fetchPayments = ( token ) => {
    return dispatch => {  
      axios
        .get(url+'/payment/fetchCard', {
            headers: {
                Authorization: token
            }
        })
        .then(res => {
            dispatch(addCard(res.data));
        })
        .catch(err => {
          console.log(err.message)
        });
    };
};