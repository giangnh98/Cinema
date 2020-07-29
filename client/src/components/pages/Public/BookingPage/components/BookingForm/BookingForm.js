import React from "react";
import { Grid, MenuItem, TextField } from "@material-ui/core";
import moment from "moment";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

export default function BookingForm(props) {
   const [reversed, setReversed] = React.useState([]);
   const {
      cinemas,
      showtimes,
      screens,
      tickets,
      onChangeCinema,
      selectedCinema,
      selectedTime,
      selectedDate,
      selectedScreen,
      onChangeTime,
      onChangeDate,
      onChangeScreen,
      times
   } = props;

   React.useEffect(() => {
      const result = [];
      tickets
         .filter(ticket =>
            selectedDate ? selectedDate === ticket.showtime.released : true
         )
         .map(ticket => {
            const { showtime: { room: { name } }, seats } = ticket;
            return {
               roomName: name,
               reversed: seats.length / 2
            };
         })
         .reduce((res, value) => {
            if (!res[value.roomName]) {
               res[value.roomName] = { roomName: value.roomName, reversed: 0 };
               result.push(res[value.roomName]);
            }
            res[value.roomName].reversed += value.reversed;
            return res;
         }, {});
      setReversed(result);
   }, [selectedDate, tickets]);

   if (!cinemas.length) {
      return (
         <div style={{ marginTop: 20 }}>
            <Box
               display="flex"
               width={1}
               height={1}
               alignItems="center"
               justifyContent="center">
               <Typography align="center" variant="h2" color="inherit">
                  No Cinema Available.
               </Typography>
            </Box>
         </div>
      );
   }

   const getReversed = (roomName) => {
      for (let i = 0; i < reversed.length; ++i) {
         const item = reversed[i];
         if (item.roomName === roomName) {
            return item.reversed;
         }
      }
      return 0;
   };

   const dates = showtimes
      .filter(showtime => selectedCinema ? selectedCinema === showtime.room.cinema.id : true)
      .map(showtime => showtime.released)
      .filter((value, index, self) => self.indexOf(value) === index);

   return (
      <Grid container spacing={3}>
         <Grid item xs>
            <TextField
               fullWidth
               select
               value={selectedCinema}
               label="Select Cinema"
               variant="outlined"
               onChange={onChangeCinema}>
               {cinemas.map(cinema => (
                  <MenuItem key={cinema.id} value={cinema.id}>
                     {cinema.name}
                  </MenuItem>
               ))}
            </TextField>
         </Grid>
         {selectedCinema && dates && (
            <Grid item xs>
               <TextField
                  fullWidth
                  select
                  value={selectedDate}
                  label="Select Date"
                  variant="outlined"
                  onChange={onChangeDate}>
                  {dates.map((date, index) => (
                     <MenuItem key={date + "-" + index} value={date.toString()}>
                        {moment(date.toString()).format("dddd DD/MM/YYYY")}
                     </MenuItem>
                  ))}
               </TextField>
            </Grid>
         )}
         {selectedDate && (
            <Grid item xs>
               <TextField
                  fullWidth
                  select
                  value={selectedScreen}
                  label="Select Screen"
                  variant="outlined"
                  onChange={onChangeScreen}>
                  {screens.map(screen => (
                     <MenuItem key={screen.id} value={screen.name}>
                        {screen.name + " ( " + (screen.seats - getReversed(screen.name)) + " / " + screen.seats + " ) "}
                     </MenuItem>
                  ))}
               </TextField>
            </Grid>
         )}
         {selectedScreen && (
            <Grid item xs>
               <TextField
                  fullWidth
                  select
                  value={selectedTime}
                  label="Select Time"
                  variant="outlined"
                  onChange={onChangeTime}>
                  {times.map(time => (
                     <MenuItem key={time.id} value={time.room.id}>
                        {time.time}
                     </MenuItem>
                  ))}
               </TextField>
            </Grid>
         )}
      </Grid>
   );
};