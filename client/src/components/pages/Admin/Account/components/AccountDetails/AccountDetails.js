import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Button, TextField, withStyles } from "@material-ui/core";
import Portlet from "../../../../../Portlet/Portlet";
import PortletContent from "../../../../../PortletContent/PortletContent";
import PortletFooter from "../../../../../PortletFooter/PortletFooter";
import PortletHeader from "../../../../../PortletHeader/PortletHeader";
import PortletLabel from "../../../../../PortletLabel/PortletLabel";
//import validate
import { regexPhone } from "../../../../../../ultils/utils";
// Component styles
import styles from "./styles";
import { connect } from "react-redux";
import { showErrors } from "../../../../../../store/alert/alert.thunk";
import { updateUser } from "../../../../../../store/user/user.thunk";

const AccountDetails = ({ user, className, classes, showErrors: setAlert, updateUser }) => {
   // define state
   const [account, setAccount] = useState({
      id: "",
      name: "",
      phone: "",
      password: ""
   });
   const [message, setMessage] = useState({
      name: "",
      phone: "",
      password: ""
   });
   //destructuring
   const rootClassName = classNames(classes.root, className);
   const { name, phone, password } = account;

   useEffect(() => {
      const { id, name, phone } = user;
      setAccount({
         ...account,
         id,
         name,
         phone
      });
      //eslint-disable-next-line
   }, []);

   //handle event
   const showErrors = (e, error) => setMessage({ ...message, [e.target.name]: error });

   const onNameChange = (e) => {
      setAccount({ ...account, [e.target.name]: e.target.value });
      if (e.target.value.length > 0 && e.target.value.length < 10) {
         showErrors(e, "Full name must be greater than 10 and less than 40 characters.");
      } else {
         showErrors(e, "");
      }
   };

   const onPasswordChange = (e) => {
      setAccount({ ...account, [e.target.name]: e.target.value });
      if (e.target.value.length > 0 && e.target.value.length < 6) {
         showErrors(e, "Password must be greater than 6 and less than 16 characters.");
      } else {
         showErrors(e, "");
      }
   };

   const onPhoneChange = (e) => {
      setAccount({ ...account, [e.target.name]: e.target.value });
      if (e.target.value.length > 0 && regexPhone.exec(e.target.value) === null) {
         showErrors(e, "Phone must be 10 number. VD : 0941942295");
      } else {
         showErrors(e, "");
      }
   };

   const onUpdateAccount = (e) => {
      e.preventDefault();
      if (name === user.name && phone === user.phone && password === "") {
         setAlert("Account fields nothing changes? Please enter the field differences.", "warning");
      } else {
         if (message.name === "" && message.password === "" && message.phone === "") {
            updateUser(account.id, {
               name: account.name,
               phone: account.phone,
               password: account.password
            });
         } else {
            setAlert("Please enter a valid for all fields.", "error");
         }
      }
   };

   return (
      <form onSubmit={onUpdateAccount}>
         <Portlet className={rootClassName}>
            <PortletHeader>
               <PortletLabel
                  subtitle="The information can be edited"
                  title="Profile"
               />
            </PortletHeader>
            <PortletContent noPadding>
               <div className={classes.field}>
                  <TextField
                     className={classes.textField}
                     margin="dense"
                     label="Full name"
                     required
                     value={name}
                     name="name"
                     error={message.name !== ""}
                     helperText={message.name !== "" ? message.name : "Please specify the first name"}
                     variant="outlined"
                     onChange={onNameChange}
                     rowsMax={1}
                     inputProps={{
                        maxLength: 40
                     }}
                  />
               </div>
               <div className={classes.field1}>
                  <TextField
                     className={classes.textField}
                     margin="dense"
                     label="Phone"
                     required
                     value={phone}
                     error={message.phone !== ""}
                     helperText={message.phone}
                     name="phone"
                     variant="outlined"
                     onChange={onPhoneChange}
                     rowsMax={1}
                     inputProps={{
                        maxLength: 10,
                        minLength: 10
                     }}
                  />
                  <TextField
                     className={classes.textField}
                     label="Password"
                     margin="dense"
                     type="password"
                     value={password}
                     error={message.password !== ""}
                     helperText={message.password}
                     name="password"
                     variant="outlined"
                     onChange={onPasswordChange}
                     rowsMax={1}
                     inputProps={{
                        maxLength: 16,
                        minLength: 6
                     }}
                  />
               </div>
            </PortletContent>
            <PortletFooter className={classes.portletFooter}>
               <Button
                  color="primary"
                  variant="contained"
                  type="submit">
                  Save details
               </Button>
            </PortletFooter>
         </Portlet>
      </form>
   );
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { showErrors, updateUser })(withStyles(styles)(AccountDetails));
