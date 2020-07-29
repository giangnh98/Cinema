import React from "react";
import { withStyles, Grid, Typography, Container } from "@material-ui/core";
import Account from "../../Admin/Account/Account";
import MyReservationTable from "./components/MyReservationTable/MyReservationTable";
import { connect } from "react-redux";
import { getTicketsUser } from "../../../../store/showtime/showtime.thunk";
import CustomCircularProgress from "../../../Loading/CircularProgress";

const styles = theme => ({
   title: {
      fontSize: "3rem",
      lineHeight: "3rem",
      textAlign: "center",
      textTransform: "capitalize",
      marginTop: theme.spacing(15),
      marginBottom: theme.spacing(3)
   },
   [theme.breakpoints.down("sm")]: {
      fullWidth: { width: "100%" }
   }
});

const Dashboard = ({ classes, tickets, getTicketsUser, loading }) => {

   React.useEffect(() => {
      getTicketsUser();
      //eslint-disable-next-line
   }, []);

   return (
      <Container>
         <Grid container spacing={2}>
            <Grid item xs={12}>
               <Typography className={classes.title} variant="h2" color="inherit">
                  My Account
               </Typography>
            </Grid>
            <Grid item xs={12}>
               <Account/>
            </Grid>
            {loading && !tickets.length ? (
               <Grid container style={{marginTop: 50}}>
                  <CustomCircularProgress height={450} />
               </Grid>
            ) : (
               <>
                  <Grid item xs={12}>
                     <Typography
                        className={classes.title}
                        variant="h2"
                        color="inherit">
                        My Reservations
                     </Typography>
                  </Grid>
                  <Grid item xs={12}>
                     <MyReservationTable
                        reservations={tickets}
                     />
                  </Grid>
               </>
            )}
         </Grid>
      </Container>
   );
};

const mapStateToProps = state => ({
   tickets: state.showtimeState.tickets,
   loading: state.showtimeState.loading
});

export default connect(mapStateToProps, { getTicketsUser })(withStyles(styles)(Dashboard));