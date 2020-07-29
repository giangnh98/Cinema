import React, { useState } from "react";
import { Box, Button, Typography, withStyles } from "@material-ui/core";
import styles from "./styles";
import { cloneArray2d } from "../../../../../../ultils/utils";
import CustomCircularProgress from "../../../../../Loading/CircularProgress";

const BookingSeats = (props) => {

   const {
      classes,
      showtime,
      selectedTime,
      handleSelectedSeats,
      removeTempSeats,
      clearSelected,
      handleNext,
      check
   } = props;

   const [newSeats, setNewSeats] = useState([]);
   const [backup, setBackup] = useState([]);
   const [loading, setLoading] = useState(false);

   React.useEffect(() => {
      setLoading(true);
      removeTempSeats(false);
      Promise.all([
         fetch(`/api/rooms/${selectedTime}`),
         fetch(`/api/prebooking/${showtime.id}`),
         fetch(`/api/tickets/${showtime.id}`)
      ]).then(async ([resRooms, resPrebooking, resTickets]) => {
         const dataRooms = await resRooms.json();
         const dataPrebooking = await resPrebooking.json();
         const dataTickets = await resTickets.json();
         return [dataRooms, dataPrebooking, dataTickets];
      }).then(([dataRooms, dataPrebooking, dataTickets]) => {
         setLoading(false);
         if (dataPrebooking.length > 0) {
            const prebooking = dataPrebooking.map(item => item.seats);
            prebooking.forEach(item => {
               dataRooms.structure[item[0]][item[1]] = 5;
            });
         }
         if (dataTickets.length > 0) {
            const prebooking = dataTickets.map(item => item.seats);
            prebooking.forEach(item => {
               dataRooms.structure[item[0]][item[1]] = 5;
            });
         }
         setNewSeats(dataRooms.structure);
         setBackup(cloneArray2d(dataRooms.structure));
      }).catch(error => {
         setLoading(false);
         console.log(error.message);
      });
      return () => {
         setNewSeats([]);
         setBackup([]);
      };
      //eslint-disable-next-line
   }, [selectedTime]);

   const handleClicked = (indexRow, index) => {
      let clone = [...newSeats];
      if (clone[indexRow][index] !== 5) {
         if (clone[indexRow][index] !== 4) {
            clone[indexRow][index] = 4;
            handleSelectedSeats([indexRow, index]);
         } else {
            clone[indexRow][index] = backup[indexRow][index];
            clearSelected([indexRow, index]);
         }
      }
      setNewSeats(clone);
   };

   if (loading || !newSeats.length) {
      return (
         <div style={{ marginTop: 20 }}>
            <CustomCircularProgress height={320}/>
         </div>
      );
   }

   const setupSeats = (items) => {
      return items.map((seatRows, indexRow) => (
         <div key={`row-${indexRow}`} className={classes.row}>
            <Typography
               className={classes.text}>{String.fromCharCode(97 + indexRow).toUpperCase()}</Typography>
            {seatRows.map((seat, index) => (
               <div key={`seat-${index}`}>
                  {seat === 3 ? <Box p={1}/>
                     : seat === 0 ? <Box className={classes.seatEmpty}/> : (
                        <Box
                           className={classes.seat}
                           onClick={() => !check && handleClicked(indexRow, index)}
                           bgcolor={
                              seat === 1 ?
                                 "#848484" :
                                 seat === 2 ? "#E96106" :
                                    seat === 4 ? "rgb(120, 205, 4)" :
                                       seat === 5 ? "rgb(65, 66, 70)" :
                                          "#1A1A1A"
                           }>
                           {index > seatRows.indexOf(3) ? index : index + 1}
                        </Box>
                     )}
               </div>
            ))}
         </div>
      ));
   };

   return (
      <div style={{ marginTop: 30 }}>
         <Box width={1}>
            <div className={classes.showScreen}>
               Screen
            </div>
         </Box>
         <Box width={1} pt={2}>
            {newSeats.length && setupSeats(newSeats)}
         </Box>
         <Box width={1} mt={2}>
            <div className={classes.seatInfoContainer}>
               <div className={classes.seatInfo}>
                  <div
                     className={classes.seatInfoLabel}
                     style={{ background: "#848484" }}>

                  </div>
                  Seat Available
               </div>
               <div className={classes.seatInfo}>
                  <div
                     className={classes.seatInfoLabel}
                     style={{ background: "rgb(65, 66, 70)" }}>

                  </div>
                  Reserved Seat
               </div>
               <div className={classes.seatInfo}>
                  <div
                     className={classes.seatInfoLabel}
                     style={{ background: "rgb(120, 205, 4)" }}>

                  </div>
                  Selected Seat
               </div>
               <div className={classes.seatInfo}>
                  <div
                     className={classes.seatInfoLabel}
                     style={{ background: "#E96106" }}>
                  </div>
                  V.I.P Seat
               </div>
            </div>
         </Box>
         <Box width={1} style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
         }}>
            <Button
               className={classes.loginButton}
               style={{
                  margin: "30px 0"
               }}
               color="primary"
               size="large"
               disabled={check}
               onClick={() => handleNext(showtime.id)}
               variant="contained">
               Next
            </Button>
         </Box>
      </div>
   );
};

export default withStyles(styles)(BookingSeats);