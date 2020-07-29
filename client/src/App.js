import React, { useEffect } from "react";
import Alert from "./components/Alert/Alert";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import Routes from "./Routes";
import "typeface-montserrat";
import { Provider } from "react-redux";
import { loadUser, logout } from "./store/user/user.thunk";
import store from "./store";

const App = () => {
   useEffect(() => {
      if (!localStorage.token) {
         store.dispatch(logout());
      }
      store.dispatch(loadUser());
      //eslint-disable-next-line
   }, [localStorage.token]);

   return (
      <Provider store={store}>
         <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Alert/>
            <Routes/>
         </ThemeProvider>
      </Provider>
   );
};

export default App;
