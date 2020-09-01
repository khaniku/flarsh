import { CARD } from "../constants/ActionTypes";
import { UPDATE_CARD } from "../constants/ActionTypes";

export default (state = null, action) => {
	switch (action.type) {
		case CARD:
			return action.payload;
		case UPDATE_CARD:
			return {...state, token: action.payload.token, expirationTime: action.payload.expirationTime};
		default:
	 		return state;
	}
}