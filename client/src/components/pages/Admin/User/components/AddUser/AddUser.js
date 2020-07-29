import React, { useState } from "react";
import { withStyles, Button, Typography, TextField } from "@material-ui/core";
import styles from "./styles";
import classNames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { regexEmail, regexPhone } from "../../../../../../ultils/utils";
import { connect } from "react-redux";
import { update, createUser } from "../../../../../../store/user/user.thunk";

const AddUser = (props) => {
   const { classes, className, update, selectedUser, loading, createUser } = props;
   const rootClassName = classNames(classes.root, className);
   const [user, setUser] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: ""
   });
   const [message, setMessage] = useState({
      name: "",
      email: "",
      password: "",
      phone: ""
   });

   React.useEffect(() => {
      if (selectedUser) {
         setUser({
            ...user,
            name: selectedUser.name,
            email: selectedUser.email,
            phone: selectedUser.phone,
            role: selectedUser.role
         });
      }
      //eslint-disable-next-line
   }, [selectedUser]);

   const isValid = (message.email !== "" || message.name !== "" || message.password !== "" || message.phone !== "");

   const showErrors = (e, error) => setMessage({ ...message, [e.target.name]: error });

   const onChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
      if (e.target.name === "name"
         && e.target.value.length > 0
         && (e.target.value.length < 10 || e.target.value.length > 40)) {
         showErrors(e, "Full Name must be greater than 10 characters and less than 40 characters.");
      } else {
         showErrors(e, "");
      }
   };

   const onEmailChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
      if (e.target.name === "email"
         && e.target.value.length > 0
         && regexEmail.exec(e.target.value) === null) {
         showErrors(e, "Please enter a valid email. VD : ngoctrinh89@gmail.com");
      } else {
         showErrors(e, "");
      }
   };

   const onPhoneChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
      if (e.target.name === "phone"
         && e.target.value.length > 0
         && regexPhone.exec(e.target.value) === null) {
         showErrors(e, "Phone must have 10 characters. VD : 0941942295");
      } else {
         showErrors(e, "");
      }
   };

   const onPasswordChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
      if (e.target.name === "password"
         && e.target.value.length > 0
         && e.target.value.length < 6) {
         showErrors(e, "Password must be greater than 6 characters and less than 16 characters.");
      } else {
         showErrors(e, "");
      }
   };

   const onAddUser = (e) => {
      e.preventDefault();
      const { name, email, password, phone } = user;
      createUser({
         name,
         email,
         password,
         phone
      });
   };

   const onUpdateUser = (e, id) => {
      e.preventDefault();
      const { name, email, password, phone } = user;
      update(
         id,
         {
            name,
            email,
            password,
            phone
         }
      );
   };

   const title = selectedUser ? "Edit User" : "Add User";
   const submitButton = selectedUser ? "Update User" : "Add User";
   const submitAction = selectedUser
      ? (e) => onUpdateUser(e, selectedUser.id)
      : (e) => onAddUser(e);

   return (
      <div className={rootClassName}>
         {loading && (
            <Grid container justify={"center"} alignItems={"center"}>
               <CircularProgress color="secondary"/>
            </Grid>
         )}
         <Typography variant="h4" className={classes.title}>
            {title}
         </Typography>
         <form onSubmit={submitAction}>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Full Name"
                  margin="dense"
                  name="name"
                  required
                  value={user.name}
                  onChange={onChange}
                  error={message.name !== ""}
                  helperText={message.name || "Please specify the Full Name"}
                  variant="outlined"
                  rowsMax={1}
                  inputProps={{
                     minLength: 10,
                     maxLength: 40
                  }}
               />
            </div>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Email"
                  margin="dense"
                  name="email"
                  value={user.email}
                  error={message.email !== ""}
                  helperText={message.email}
                  onChange={onEmailChange}
                  variant="outlined"
                  required
                  rowsMax={1}
               />
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Password"
                  margin="dense"
                  name="password"
                  value={user.password}
                  variant="outlined"
                  onChange={onPasswordChange}
                  error={message.password !== ""}
                  helperText={message.password}
                  required={!selectedUser}
                  rowsMax={1}
                  inputProps={{
                     maxLength: 16,
                     minLength: 6
                  }}
               />
            </div>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Phone"
                  margin="dense"
                  name="phone"
                  value={user.phone}
                  error={message.phone !== ""}
                  helperText={message.phone}
                  variant="outlined"
                  onChange={onPhoneChange}
                  required
                  rowsMax={1}
                  inputProps={{
                     maxLength: 10,
                     minLength: 10
                  }}
               />
               <TextField
                  fullWidth
                  className={classes.textField}
                  helperText="Admin or Guest"
                  label="Role"
                  margin="dense"
                  disabled={true}
                  name="role"
                  value={user.role || "admin"}
                  variant="outlined"
               />
            </div>
            <Button
               className={classes.buttonFooter}
               color="primary"
               type="submit"
               variant="contained"
               disabled={isValid || loading}>
               {submitButton}
            </Button>
         </form>
      </div>
   );
};

const mapStateToProps = state => ({
   loading: state.userState.loading
});

export default connect(mapStateToProps, { update, createUser })(withStyles(styles)(AddUser));