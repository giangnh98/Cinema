import * as UserActions from "./user.action";
import setAuthHeaders from "../../ultils/setAuthToken";
import { isLoggedIn, removeUser, setUser } from "../../ultils/auth";
import { showErrors } from "../alert/alert.thunk";

const {
   fetchRequest,
   authError,
   endSession,
   loginFail,
   fetchFail,
   loginSuccess,
   registerFail,
   registerSuccess,
   updateSuccess,
   updateFail,
   userLoaded,
   setUserRef,
   deleteUser,
   updateAccount,
   setUsers
} = UserActions.actions;

export const getUsers = () => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/users/all`;
      const response = await fetch(url, {
         method: "GET",
         headers: setAuthHeaders()
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(setUsers(data));
      }
      if (data.error) {
         dispatch(fetchFail());
         dispatch(showErrors(data.message, "error"));
      }
   } catch (error) {
      dispatch(fetchFail());
      dispatch(showErrors(error.message, "error"));
   }
};

export const getUserById = (userId) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/users/${userId}`;
      const response = await fetch(url, {
         method: "GET",
         headers: setAuthHeaders()
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(setUserRef(data));
      }
      if (data.error) {
         dispatch(fetchFail());
         dispatch(showErrors(data.message, "error"));
      }
   } catch (error) {
      dispatch(fetchFail());
      dispatch(showErrors(error.message, "error"));
   }
};

export const deleteAccount = (userId) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/users/${userId}`;
      const response = await fetch(url, {
         method: "DELETE",
         headers: setAuthHeaders()
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(deleteUser());
         dispatch(showErrors("Delete User Success!", "success"));
      }
      if (data.error) {
         dispatch(fetchFail());
         dispatch(showErrors(data.message, "error"));
      }
   } catch (error) {
      dispatch(fetchFail());
      dispatch(showErrors(error.message, "error"));
   }
};

export const loadUser = () => async dispatch => {
   if (!isLoggedIn()) return;
   try {
      const url = "/api/users/auth";
      const response = await fetch(url, {
         method: "GET",
         headers: setAuthHeaders()
      });
      const data = await response.json();
      if (!data.error) {
         data && setUser(data);
         dispatch(userLoaded(data));
      }
      if (data.error) {
         dispatch(authError());
      }
   } catch (error) {
      dispatch(authError());
   }
};

export const login = ({ email, password }) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = "/api/users/login";
      const response = await fetch(url, {
         method: "POST",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!data.error) {
         data.user && setUser(data.user);
         dispatch(loginSuccess(data));
      }
      if (data.error) {
         dispatch(loginFail());
         dispatch(showErrors(data.message, "error"));
      }
   } catch (error) {
      dispatch(loginFail());
      dispatch(showErrors(error.message, "error"));
   }
};

export const createUser = (
   {
      name,
      email,
      phone,
      password
   }
) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = "/api/users";
      const body = { name, email, phone, password };
      const response = await fetch(url, {
         method: "POST",
         headers: setAuthHeaders({
            Accept: "application/json",
            "Content-Type": "application/json"
         }),
         body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(registerSuccess());
         dispatch(showErrors("Register success!", "success"));
      }
      if (data.error) {
         dispatch(registerFail());
         dispatch(showErrors(data.message, "error"));
      }
   } catch (error) {
      dispatch(registerFail());
      dispatch(showErrors(error.message, "error"));
   }
};

export const register = (
   {
      name,
      email,
      password,
      phone
   }
) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = "/api/users/register";
      const body = { name, email, phone, password };
      const response = await fetch(url, {
         method: "POST",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
         },
         body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(registerSuccess());
         dispatch(showErrors("Register success!", "success"));
      }
      if (data.error) {
         dispatch(registerFail());
         dispatch(showErrors(data.message, "error"));
      }
   } catch (error) {
      dispatch(registerFail());
      dispatch(showErrors(error.message, "error"));
   }
};

export const updateUser = (
   id,
   {
      name,
      email,
      password,
      phone
   }
) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/users/${id}`;
      const body = { name, email, phone, password };
      const response = await fetch(url, {
         method: "PUT",
         headers: setAuthHeaders({
            Accept: "application/json",
            "Content-Type": "application/json"
         }),
         body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!data.error) {
         data.user && setUser(data.user);
         dispatch(updateSuccess(data));
         dispatch(showErrors("Update Success!", "success"));
      }
      if (data.error) {
         dispatch(updateFail());
         dispatch(showErrors(data.message, "error"));
      }
   } catch (error) {
      dispatch(updateFail());
      dispatch(showErrors(error.message, "error"));
   }
};

export const update = (
   id,
   {
      name,
      email,
      password,
      phone
   }
) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/users/${id}`;
      const body = { name, email, phone, password };
      const response = await fetch(url, {
         method: "PUT",
         headers: setAuthHeaders({
            Accept: "application/json",
            "Content-Type": "application/json"
         }),
         body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(updateAccount());
         dispatch(showErrors("Update Success!", "success"));
      }
      if (data.error) {
         dispatch(updateFail());
         dispatch(showErrors(data.message, "error"));
      }
   } catch (error) {
      dispatch(updateFail());
      dispatch(showErrors(error.message, "error"));
   }
};

export const logout = () => async dispatch => {
   dispatch(endSession());
   removeUser();
};