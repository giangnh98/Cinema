import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Card, CardContent, Grid, Typography, Avatar, CircularProgress } from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

const useStyles = makeStyles(theme => ({
   root: {
      height: "100%",
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
   },
   content: {
      alignItems: "center",
      display: "flex"
   },
   title: {
      fontWeight: 700,
      fontSize: 9
   },
   avatar: {
      backgroundColor: theme.palette.white,
      color: theme.palette.primary.main,
      height: 50,
      width: 50
   },
   icon: {
      height: 32,
      width: 32
   },
   caption: {
      marginRight: theme.spacing(1)
   },
   difference: {
      marginTop: theme.spacing(2),
      display: "flex",
      alignItems: "center"
   },
   differenceIcon: {
      color: theme.palette.white
   },
   differenceValue: {
      color: theme.palette.white,
   }
}));

const TotalReservations = props => {
   const { className, reservations, price } = props;

   const classes = useStyles();

   return (
      <Card className={classnames(classes.root, className)}>
         <CardContent>
            <Grid container justify="space-between">
               <Grid item>
                  <Typography
                     className={classes.title}
                     color="inherit"
                     gutterBottom
                     variant="body2">
                     TOTAL RESERVATIONS
                  </Typography>
                  <Typography color="inherit" variant="h3">
                     {reservations ? reservations : (
                        <CircularProgress color={"secondary"}/>
                     )}
                  </Typography>
               </Grid>
               <Grid item>
                  <Avatar className={classes.avatar}>
                     <EventIcon className={classes.icon}/>
                  </Avatar>
               </Grid>
            </Grid>
            <div className={classes.difference}>
               <Typography className={classes.caption} variant="caption">
                  Total price
               </Typography>
               <Typography className={classes.differenceValue} variant="body2">
                  {price}
               </Typography>
               <AttachMoneyIcon className={classes.differenceIcon}/>
            </div>
         </CardContent>
      </Card>
   );
};

TotalReservations.propTypes = {
   className: PropTypes.string
};

export default TotalReservations;