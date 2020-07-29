import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { PayPalButton } from "react-paypal-button-v2";
import setAuthHeaders from "../../../../../../ultils/setAuthToken";

const useStyles = makeStyles(theme => ({
   bannerTitle: {
      fontSize: theme.spacing(1.4),
      textTransform: "uppercase",
      color: "rgb(93, 93, 97)",
      marginBottom: theme.spacing(1)
   },
   bannerContent: {
      fontSize: theme.spacing(2),
      textTransform: "capitalize",
      color: theme.palette.common.white
   },
   [theme.breakpoints.down("sm")]: {
      hideOnSmall: {
         display: "none"
      }
   }
}));

export default function BookingCheckout(props) {
   const classes = useStyles(props);
   const {
      user,
      showtime,
      selectedSeats,
      seatsAvailable,
      onBookSeats,
      setInversion,
      onCancelSeats
   } = props;

   const getPrice = ([indexRow, indexCol]) => {
      const { room: { structure } } = showtime;
      if (structure[indexRow][indexCol] === 1)
         return "normal";
      if (structure[indexRow][indexCol] === 2)
         return "vip";
      if (structure[indexRow][indexCol] === 6)
         return "couple";
   };

   const calculatePrice = () => {
      const initialReturn = { price: [], type: [], totalPrice: 0 };
      const { seatPrice = {} } = showtime;

      const totalPrice = selectedSeats
         .map(seat => seatPrice[getPrice(seat)])
         .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
         }, 0);

      const price = selectedSeats
         .map(seat => seatPrice[getPrice(seat)]);

      const type = selectedSeats.map(seat => getPrice(seat));

      return { ...initialReturn, price, type, totalPrice };
   };

   const { price, totalPrice, type } = calculatePrice();

   return (
      <Box marginTop={2} bgcolor="rgb(18, 20, 24)">
         <Grid container>
            <Grid item xs={8} md={10}>
               <Grid container spacing={3} style={{ padding: 20 }}>
                  {user && user.name && (
                     <Grid item className={classes.hideOnSmall}>
                        <Typography className={classes.bannerTitle}>Name</Typography>
                        <Typography className={classes.bannerContent}>
                           {user.name}
                        </Typography>
                     </Grid>
                  )}
                  <Grid item>
                     <Typography className={classes.bannerTitle}>Tickets</Typography>
                     {selectedSeats.length > 0 ? (
                        <Typography className={classes.bannerContent}>
                           {selectedSeats.length} tickets
                        </Typography>
                     ) : (
                        <Typography className={classes.bannerContent}>0</Typography>
                     )}
                  </Grid>
                  <Grid item>
                     <Typography className={classes.bannerTitle}>Price</Typography>
                     <Typography className={classes.bannerContent}>
                        {totalPrice} &euro;
                     </Typography>
                  </Grid>
               </Grid>
            </Grid>
            <Grid
               item
               xs={4}
               md={2}
               style={{
                  color: "rgb(120, 205, 4)",
                  background: "black",
                  display: "flex"
               }}>
               <Button
                  color="inherit"
                  fullWidth
                  disabled={seatsAvailable <= 0}
                  onClick={() => onCancelSeats()}>
                  Cancel
               </Button>
            </Grid>
         </Grid>
         <Grid container justify="center"
               alignItems="center">
            <PayPalButton
               amount={`${totalPrice}`}
               // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
               onSuccess={(details, data) => {
                  onBookSeats();
                  setInversion(true);
                  // OPTIONAL: Call your server to save the transaction
                  return fetch("/api/tickets", {
                     method: "POST",
                     headers: setAuthHeaders({
                        Accept: "application/json",
                        "Content-Type": "application/json"
                     }),
                     body: JSON.stringify({
                        showtime: showtime.id,
                        seats: selectedSeats,
                        type: type,
                        price: price
                     })
                  });
               }}
            />
         </Grid>
      </Box>
   );
}