import React, { useEffect } from "react";
import { withStyles, Grid, Typography, Container } from "@material-ui/core";
import CinemaCard from "../components/CinemaCard/CinemaCard";
//import static data
import SkeletonCinema from "../skeletons/SkeletonCinema";
import { clearCinemas, getCinemas } from "../../../../store/cinema/cinema.thunk";
import { connect } from "react-redux";

const styles = theme => ({
   title: {
      fontSize: "3rem",
      lineHeight: "3rem",
      textAlign: "center",
      marginTop: theme.spacing(15),
      marginBottom: theme.spacing(3)
   }
});

const CinemasPage = (props) => {

   const { getCinemas, loading, clearCinemas, classes, cinemas } = props;

   useEffect(() => {
      getCinemas();

      return () => {
         clearCinemas();
      };
      //eslint-disable-next-line
   }, []);

   if (loading) {
      return (
         <SkeletonCinema/>
      );
   }
   return (
      <Container maxWidth="xl">
         <Grid container spacing={2} style={{ marginBottom: 50 }}>
            <Grid item xs={12}>
               <Typography className={classes.title} variant="h2" color="inherit">
                  Our Cinemas
               </Typography>
            </Grid>
            <Grid
               container
               item
               xs={12}
               alignItems="center"
               justify="flex-start"
               spacing={2}>
               {cinemas.map(cinema => (
                  <Grid key={cinema.id} item xs={12} md={4} lg={3}>
                     <CinemaCard cinema={cinema}/>
                  </Grid>
               ))}
            </Grid>
         </Grid>
      </Container>
   );
};

const mapStateToProps = ({ cinemaState }) => ({
   cinemas: cinemaState.cinemas,
   loading: cinemaState.loading
});

const mapDispatchToProps = {
   getCinemas,
   clearCinemas
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CinemasPage));
