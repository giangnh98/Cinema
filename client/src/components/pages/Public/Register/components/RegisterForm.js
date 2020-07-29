import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
//import material ui
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button, Checkbox, TextField, Typography } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
//import validate
import { regexEmail, regexPhone } from "../../../../../ultils/utils";
import { connect } from "react-redux";
import { register } from "../../../../../store/user/user.thunk";

const RegisterForm = (props) => {
   const { classes } = props;
   //init state
   const [user, setUser] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      isChecked: false,
      showPassword: false
   });
   const [message, setMessage] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: ""
   });
   //destructuring
   const { name, phone, email, password, confirmPassword, isChecked, showPassword } = user;
   const { register, error, isAuthenticated, loading } = props;
   const isValid = (message.email !== "" || message.name !== "" || message.password !== "" || message.phone !== "");
   //life cycle
   useEffect(() => {
      if (isAuthenticated) {
         props.history.push("/");
      }
      //eslint-disable-next-line
   }, [error, isAuthenticated, props.history]);

   //handle event
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

   const onConfirmChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
      showErrors(e, "");
   };

   const handleClickShowPassword = () => setUser({ ...user, showPassword: !showPassword });

   const handleMouseDownPassword = event => event.preventDefault();

   const onChangeCheckBox = (e) => setUser({ ...user, isChecked: !isChecked });

   const onSubmit = (e) => {
      e.preventDefault();
      if (confirmPassword !== password) {
         setMessage({
            ...message,
            confirmPassword: "Confirm password is not the same as password."
         });
      } else {
         register({
            name,
            email,
            password,
            phone
         });
      }
   };

   return (
      <form className={classes.form} onSubmit={onSubmit}>
         <Typography className={classes.title} variant="h2">
            Create new account
         </Typography>
         <Typography className={classes.subtitle} variant="body1">
            Use your email to create new account... it's free.
         </Typography>
         <div className={classes.fields}>
            <TextField
               className={classes.textField}
               label="Full name"
               name="name"
               value={name}
               onChange={onChange}
               error={message.name !== ""}
               helperText={message.name}
               variant="outlined"
               required
               rowsMax={1}
               inputProps={{
                  minLength: 10,
                  maxLength: 40
               }}
            />
            <TextField
               className={classes.textField}
               label="Email"
               name="email"
               value={email}
               error={message.email !== ""}
               helperText={message.email}
               onChange={onEmailChange}
               variant="outlined"
               required
               rowsMax={1}
            />
            <TextField
               className={classes.textField}
               label="Mobile Phone"
               name="phone"
               value={phone}
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
               className={classes.textField}
               label="Password"
               type={showPassword ? "text" : "password"}
               name="password"
               value={password}
               variant="outlined"
               onChange={onPasswordChange}
               error={message.password !== ""}
               helperText={message.password}
               required
               rowsMax={1}
               inputProps={{
                  maxLength: 16,
                  minLength: 6
               }}
               InputProps={{
                  endAdornment: (
                     <InputAdornment position="end">
                        <IconButton
                           aria-label="toggle password visibility"
                           onClick={handleClickShowPassword}
                           onMouseDown={handleMouseDownPassword}
                           edge="end"
                        >
                           {showPassword ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                     </InputAdornment>
                  )
               }}
            />
            <TextField
               className={classes.textField}
               label="Confirm Password"
               type={showPassword ? "text" : "password"}
               name="confirmPassword"
               value={confirmPassword}
               error={message.confirmPassword !== ""}
               helperText={message.confirmPassword}
               variant="outlined"
               onChange={onConfirmChange}
               required
               rowsMax={1}
               inputProps={{
                  maxLength: 16,
                  minLength: 6
               }}
               InputProps={{
                  endAdornment: (
                     <InputAdornment position="end">
                        <IconButton
                           aria-label="toggle password visibility"
                           onClick={handleClickShowPassword}
                           onMouseDown={handleMouseDownPassword}
                           edge="end"
                        >
                           {showPassword ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                     </InputAdornment>
                  )
               }}
            />
            <div className={classes.policy}>
               <Checkbox
                  value={isChecked}
                  onChange={onChangeCheckBox}
                  className={classes.policyCheckbox}
                  color="primary"
                  name="isChecked"
               />
               <Typography
                  className={classes.policyText}
                  variant="body1">
                  I have read the &nbsp;
                  <Link className={classes.policyUrl} to="#">
                     Terms and Conditions
                  </Link>
                  .
               </Typography>
            </div>
         </div>

         <div className={classes.wrapper}>
            <Button
               className={classes.registerButton}
               color="primary"
               disabled={isValid || !isChecked || loading}
               type="submit"
               size="large"
               variant="contained">
               Register now
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
         </div>

         <Typography className={classes.login} variant="body1">
            Have an account?{" "}
            <Link className={classes.loginUrl} to="/login">
               Login
            </Link>
         </Typography>
      </form>
   );
};

const mapStateToProps = ({ userState }) => ({
   isAuthenticated: userState.isAuthenticated,
   loading: userState.loading,
   error: userState.error
});

export default connect(mapStateToProps, { register })(RegisterForm);
