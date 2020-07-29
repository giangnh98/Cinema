import React, { useState, useEffect } from "react";
import useStyles from "./styles";
//import from material ui
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
//import regex
import {
   regexEmail
} from "../../../../../ultils/utils";
import { connect } from "react-redux";
import { login } from "../../../../../store/user/user.thunk";

const LoginForm = (props) => {
   //define styles
   const classes = useStyles();
   //define state
   const [user, setUser] = useState({
      email: "",
      password: "",
      showPassword: false
   });
   const [message, setMessage] = useState({
      email: "",
      password: ""
   });
   //destructuring
   const { email, password, showPassword } = user;
   const { login, isAuthenticated, loading, history, user: userState, redirect } = props;
   const isValid = (message.email !== "" || message.password !== "");
   //life cycle
   useEffect(() => {
      if (isAuthenticated) {
         if (userState && userState.role === "superadmin")
            history.push("/admin/dashboard");
         history.push("/");
      }
      //eslint-disable-next-line
   }, [isAuthenticated, history, redirect]);

   //handle event
   const showErrors = (e, error) => setMessage({ ...message, [e.target.name]: error });

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

   const handleClickShowPassword = () => setUser({ ...user, showPassword: !showPassword });

   const handleMouseDownPassword = event => event.preventDefault();

   const onSubmit = (e) => {
      e.preventDefault();
      login({
         email,
         password
      });
   };

   //render
   return (
      <form className={classes.form} onSubmit={onSubmit}>
         <Typography className={classes.title} variant="h2">
            Sign in
         </Typography>
         <div className={classes.fields}>
            <TextField
               className={classes.textField}
               label="Email"
               name="email"
               onChange={onEmailChange}
               type="text"
               value={email}
               variant="outlined"
               error={message.email !== ""}
               helperText={message.email}
               required
               rowsMax={1}
            />
            <TextField
               className={classes.textField}
               label="Password"
               name="password"
               onChange={onPasswordChange}
               type={showPassword ? "text" : "password"}
               value={password}
               variant="outlined"
               error={message.password !== ""}
               helperText={message.password}
               required
               rowsMax={1}
               inputProps={{
                  maxLength: 16,
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
         </div>

         <div className={classes.wrapper}>
            <Button
               className={classes.loginButton}
               color="primary"
               type="submit"
               size="large"
               disabled={loading || isValid}
               variant="contained">
               Login now
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
         </div>
         <Typography className={classes.register} variant="body1">
            Don't have an account?
            <RouterLink className={classes.registerUrl} to="/register">
               register
            </RouterLink>
         </Typography>
      </form>
   );
};

const mapStateToProps = ({ userState }) => ({
   isAuthenticated: userState.isAuthenticated,
   user: userState.user,
   loading: userState.loading,
   error: userState.error
});

export default connect(mapStateToProps, { login })(
   LoginForm
);