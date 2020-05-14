import { USER } from "../constants/ActionTypes";

export default (state = null, action) => {
	switch (action.type) {
		case USER:
			return action.payload;
		default:
	 		return state;
	}
}