import * as AlertActions from "./alert.action";
import { v4 as uuidV4 } from "uuid";

const { removeAlert, setAlert } = AlertActions.actions;

export const showErrors = (error, type) => dispatch => {
   let results = [];
   if (error instanceof Array) {
      error.forEach(item => {
         const id = uuidV4();
         const msg = item.msg;
         results.push({ msg, type, id });
      });
   } else {
      const id = uuidV4();
      results.push({ msg: error, type, id });
   }
   dispatch(setAlert(results));
};

export const clearErrors = () => dispatch => {
   dispatch(removeAlert());
};