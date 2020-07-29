import React from "react";
import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import { getUserById } from "../../../../../store/user/user.thunk";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { blue } from "@material-ui/core/colors";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
   avatar: {
      backgroundColor: blue[100],
      color: blue[600]
   }
});

const UserInfo = ({ id, user, getUserById, loading }) => {
   const classes = useStyles();
   React.useEffect(() => {
      getUserById(id);
      //eslint-disable-next-line
   }, [id]);

   return (
      <ListItem key={user.email}>
         {loading ? (
            <LinearProgress style={{width: 200}} />
         ) : (
            <>
               <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                     <PersonIcon/>
                  </Avatar>
               </ListItemAvatar>
               <ListItemText primary={user.email}/>
            </>
         )}
      </ListItem>
   );
};

const mapStateToProps = state => ({
   user: state.userState.user,
   loading: state.userState.loading
});

export default connect(mapStateToProps, { getUserById })(UserInfo);