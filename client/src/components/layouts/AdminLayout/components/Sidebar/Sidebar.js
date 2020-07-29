import React from "react";
import { NavLink } from "react-router-dom";
import {
   withStyles,
   Divider,
   List,
   ListItem,
   ListItemIcon,
   ListItemText,
   ListSubheader
} from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import PeopleIcon from "@material-ui/icons/PeopleOutlined";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import TheatersIcon from '@material-ui/icons/Theaters';
import MovieIcon from '@material-ui/icons/Movie';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
// Component styles
import styles from "./styles";

const Sidebar = (props) => {
   const { classes, user } = props;

   return (
      <section className={classes.root}>
         <List component="div" disablePadding>
            {user && user.role === "superadmin" && (
               <ListItem
                  activeClassName={classes.activeListItem}
                  className={classes.listItem}
                  component={NavLink}
                  to="/admin/dashboard">
                  <ListItemIcon className={classes.listItemIcon}>
                     <DashboardIcon/>
                  </ListItemIcon>
                  <ListItemText
                     classes={{ primary: classes.listItemText }}
                     primary="Dashboard"
                  />
               </ListItem>
            )}
            <ListItem
               activeClassName={classes.activeListItem}
               className={classes.listItem}
               component={NavLink}
               to="/admin/movies">
               <ListItemIcon className={classes.listItemIcon}>
                  <MovieIcon/>
               </ListItemIcon>
               <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Movies"
               />
            </ListItem>
            <ListItem
               activeClassName={classes.activeListItem}
               className={classes.listItem}
               component={NavLink}
               to="/admin/cinemas">
               <ListItemIcon className={classes.listItemIcon}>
                  <TheatersIcon/>
               </ListItemIcon>
               <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Cinemas"
               />
            </ListItem>
            <ListItem
               activeClassName={classes.activeListItem}
               className={classes.listItem}
               component={NavLink}
               to="/admin/rooms">
               <ListItemIcon className={classes.listItemIcon}>
                  <MeetingRoomIcon/>
               </ListItemIcon>
               <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Rooms"
               />
            </ListItem>
            <ListItem
               activeClassName={classes.activeListItem}
               className={classes.listItem}
               component={NavLink}
               to="/admin/showtimes">
               <ListItemIcon className={classes.listItemIcon}>
                  <CalendarTodayIcon/>
               </ListItemIcon>
               <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Showtimes"
               />
            </ListItem>
            <ListItem
               activeClassName={classes.activeListItem}
               className={classes.listItem}
               component={NavLink}
               to="/admin/reservations">
               <ListItemIcon className={classes.listItemIcon}>
                  <PeopleIcon/>
               </ListItemIcon>
               <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Reservations"
               />
            </ListItem>
            <ListItem
               activeClassName={classes.activeListItem}
               className={classes.listItem}
               component={NavLink}
               to="/admin/prebooking">
               <ListItemIcon className={classes.listItemIcon}>
                  <PeopleIcon/>
               </ListItemIcon>
               <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Prebooking"
               />
            </ListItem>
            {user && user.role === "superadmin" && (
               <ListItem
                  activeClassName={classes.activeListItem}
                  className={classes.listItem}
                  component={NavLink}
                  to="/admin/users">
                  <ListItemIcon className={classes.listItemIcon}>
                     <PeopleIcon/>
                  </ListItemIcon>
                  <ListItemText
                     classes={{ primary: classes.listItemText }}
                     primary="Users"
                  />
               </ListItem>
            )}
         </List>
         <Divider className={classes.listDivider}/>
         <List
            component="div"
            disablePadding
            subheader={
               <ListSubheader className={classes.listSubheader}>
                  Support
               </ListSubheader>
            }>
            <ListItem
               className={classes.listItem}
               component="a"
               href="https://www.facebook.com/giang.hong.nguyen1998"
               target="_blank">
               <ListItemIcon className={classes.listItemIcon}>
                  <InfoIcon/>
               </ListItemIcon>
               <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Customer support"
               />
            </ListItem>
         </List>
      </section>
   );
};

export default withStyles(styles)(Sidebar);