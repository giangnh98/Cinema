import React from "react";
import { Grid } from "@material-ui/core";
import AccountDetails from "./components/AccountDetails/AccountDetails";
import withStyles from "@material-ui/core/styles/withStyles";

import AccountProfile from "./components/AccountProfile/AccountProfile";
//loading
import { getUser } from "../../../../ultils/auth";

// Component styles
const styles = theme => ({
   root: {
      padding: `${theme.spacing(4)}px ${theme.spacing(4)}px 0`
   }
});

const Account = ({ classes }) => {
   const user = getUser();
   return (
      <div className={classes.root}>
         <Grid container spacing={4}>
            <Grid item lg={4} md={6} xl={4} xs={12}>
               <AccountProfile
                  user={user}
               />
            </Grid>
            <Grid item lg={8} md={6} xl={8} xs={12}>
               <AccountDetails user={user}/>
            </Grid>
         </Grid>
      </div>
   );
};

export default withStyles(styles)(Account);