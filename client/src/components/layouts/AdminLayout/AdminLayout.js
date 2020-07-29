import React, { Fragment, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import PropTypes from "prop-types";
import { Drawer } from "@material-ui/core";
//import components
import Footer from "./components/Footer/Footer";
import Topbar from "./components/Topbar/Topbar";
import Sidebar from "./components/Sidebar/Sidebar";
// Component styles
import styles from "./styles";
import { getUser } from "../../../ultils/auth";
import { Redirect } from "react-router-dom";

const AdminLayout = (props) => {
   //define state
   const [isOpen, setOpen] = useState(false);
   //destructuring
   const { title, children, classes } = props;
   const user = getUser();

   const handleToggleOpen = () => {
      setOpen(!isOpen);
   };

   const handleClose = () => {
      setOpen(false);
   };

   if (user.role === "guest") {
      return (
         <Redirect
            to={{
               pathname: "/login",
               state: { from: props.location }
            }}
         />
      )
   }

   return (
      <Fragment>
         <Topbar
            title={title}
            ToolbarClasses={classes.topbar}
            isSidebarOpen={isOpen}
            onToggleSidebar={handleToggleOpen}
         />
         <Drawer
            anchor="left"
            classes={{ paper: classes.drawerPaper }}
            open={isOpen}
            onClose={handleClose}
            variant="persistent">
            <Sidebar className={classes.sidebar} user={user} />
         </Drawer>
         <main
            className={classnames({
               [classes.contentShift]: isOpen,
               [classes.content]: true
            })}>
            {children}
            <Footer/>
         </main>
      </Fragment>
   );
};

AdminLayout.defaultProps = {
   isSidebarOpen: false
};
AdminLayout.propTypes = {
   children: PropTypes.node,
   isSidebarOpen: PropTypes.bool,
   title: PropTypes.string
};

export default withStyles(styles)(AdminLayout);