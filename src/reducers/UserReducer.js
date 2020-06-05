import { USER } from "../constants/ActionTypes";
import { UPDATE_TOKEN } from "../constants/ActionTypes";

export default (state = null, action) => {
	switch (action.type) {
		case USER:
			return action.payload;
		case UPDATE_TOKEN:
			return {...state, expirationTime: action.payload.expirationTime, token: action.payload.token};
		default:
	 		return state;
	}
}