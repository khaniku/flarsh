import { combineReducers } from 'redux';
import UserReducer from "./UserReducer";
import PaymentReducer from "./PaymentReducer";

export default combineReducers({
    user: UserReducer,
    card: PaymentReducer,
});