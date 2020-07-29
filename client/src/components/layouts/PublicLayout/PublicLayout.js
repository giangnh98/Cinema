import React from "react";
import { withStyles } from "@material-ui/core";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

const styles = theme => ({
   root: {
      backgroundColor: theme.palette.background.dark,
      color: theme.palette.common.white,
      height: "100%"
   }
});

const PublicLayout = (props) => {
   const {
      children,
      withFooter = true,
      withNavbar = true,
      classes,
   } = props;

   return (
      <div className={classes.root}>
         {withNavbar && <Navbar/>}
         {children}
         {withFooter && <Footer/>}
      </div>
   );
};

export default withStyles(styles)(PublicLayout);
