import * as AlertActions from "./alert.action";

const initialState = {
   alerts: [],
   open: false
};

export default function alertsReducer(state = initialState, action) {
   switch (action.type) {
      case AlertActions.SET_ALERT:
         return {
            open: true,
            alerts: action.payload
         };
      case AlertActions.REMOVE_ALERT:
         return {
            alerts: [],
            open: false
         };
      default:
         return state;
   }
};