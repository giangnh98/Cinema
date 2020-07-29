export const SET_ALERT = "@@Alert/SetAlert";
export const REMOVE_ALERT = "@@Alert/RemoveAlert";

export const actions = {
   setAlert: (results) => {
      return { type: SET_ALERT, payload: results };
   },
   removeAlert: () => {
      return { type: REMOVE_ALERT };
   }
};