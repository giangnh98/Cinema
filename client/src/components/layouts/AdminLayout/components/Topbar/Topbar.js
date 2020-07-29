import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Badge, Toolbar, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";

// Component styles
import styles from "./styles";
import { connect } from "react-redux";
import { logout } from "../../../../../store/user/user.thunk";

const Topbar = (props) => {
   const {
      classes,
      ToolbarClasses,
      children,
      isSidebarOpen,
      logout,
      onToggleSidebar
   } = props;

   return (
      <div className={`${classes.root} , ${ToolbarClasses}`}>
         <Toolbar className={classes.toolbar}>
            <div className={classes.brandWrapper}>
               <div className={classes.logo}>Cinema+</div>
               <IconButton
                  className={classes.menuButton}
                  aria-label="Menu"
                  onClick={onToggleSidebar}>
                  {isSidebarOpen ? <CloseIcon/> : <MenuIcon/>}
               </IconButton>
            </div>

            <NavLink className={classes.title} to="/">
               Cinema App
            </NavLink>

            <IconButton
               className={classes.notificationsButton}
               onClick={() => console.log("Notification")}>
               <Badge badgeContent={4} color="primary" variant="dot">
                  <NotificationsIcon/>
               </Badge>
            </IconButton>
            <IconButton
               className={classes.signOutButton}
               onClick={logout}>
               <InputIcon/>
            </IconButton>
         </Toolbar>
         {children}
      </div>
   );
};

Topbar.defaultProps = {
   title: "Dashboard",
   isSidebarOpen: false
};

Topbar.propTypes = {
   children: PropTypes.node,
   classes: PropTypes.object.isRequired,
   isSidebarOpen: PropTypes.bool,
   title: PropTypes.string
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { logout })(withStyles(styles)(Topbar));