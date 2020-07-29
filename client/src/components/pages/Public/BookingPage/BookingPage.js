import React, { useEffect, useState } from "react";
import { withStyles, Backdrop, Typography } from "@material-ui/core";
import styles from "./styles";
import BookingSeats from "./components/BookingSeats/BookingSeats";
import MovieInfo from "./components/MovieInfo/MovieInfo";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
//import utils
import CountDownTimer from "../CountDown/CountDownTimer";
import BookingForm from "./components/BookingForm/BookingForm";
import { clearMovie, getMovieById } from "../../../../store/movie/movie.thunk";
import { showErrors } from "../../../../store/alert/alert.thunk";
import { connect } from "react-redux";
import { clearCinemas, getCinemas } from "../../../../store/cinema/cinema.thunk";
import {
   clearShowtimes,
   createPrebooking,
   getShowtimes, getTickets,
   removeTempSeats
} from "../../../../store/showtime/showtime.thunk";
import BookingCheckout from "./components/BookingCheckout/BookingCheckout";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Link from "@material-ui/core/Link";

let timer = null;
const timeForCheckout = 10 * 60 * 1000;

const BookingPage = (props) => {

   const [selected, setSelected] = useState([]);
   const [check, setCheck] = useState(false);
   const [inversion, setInversion] = useState(false);
   const [selectedCinema, setSelectedCinema] = useState("");
   const [selectedTime, setSelectedTime] = useState("");
   const [selectedDate, setSelectedDate] = useState("");
   const [selectedScreen, setSelectedScreen] = useState("");

   //des
   const {
      user,
      tickets,
      movie,
      loading,
      getMovieById,
      classes,
      history,
      match,
      showErrors: setAlert,
      showtimes,
      cinemas,
      getShowtimes,
      getTickets,
      clearShowtimes,
      getCinemas,
      clearCinemas,
      clearMovie,
      createPrebooking,
      removeTempSeats
   } = props;

   useEffect(() => {
      if (!localStorage.user) {
         history.push("/login");
      }
      getMovieById(match.params.id);
      getShowtimes(match.params.id);
      getCinemas();
      getTickets();
      return () => {
         clearMovie();
         clearShowtimes();
         clearCinemas();
      };
      //eslint-disable-next-line
   }, [match.params.id]);

   const handleSelectedSeats = (seat) => {
      setSelected([...selected, seat]);
   };

   const clearSelected = (seat) => {
      const index = selected.findIndex(item => (item[0] === seat[0] && item[1] === seat[1]));
      selected.splice(index, 1);
      setSelected(selected);
      if (selected.length === 0) {
         setCheck(false);
      }
   };

   const handleNext = (showtime) => {
      if (selected.length === 0) {
         setAlert("You must be selecting minimum one seat.", "warning");
      } else if (selected.length > 5) {
         setAlert("You must be selecting maximum 5 seats.", "warning");
      } else if (selected.length > 0 && selected.length <= 5) {
         createPrebooking(selected, showtime)
            .then(res => {
               setCheck(res);
            });

         if (timer) {
            clearTimeout(timer);
            timer = null;
         }
         timer = setTimeout(handleBack, timeForCheckout);
      }
   };

   const checkout = () => {
      clearTimeout(timer);
      timer = null;
      setSelected([]);
      setCheck(false);
   };

   const handleBack = () => {
      removeTempSeats(true);
      clearTimeout(timer);
      setCheck(false);
   };

   const onFilterCinema = () => {
      const initialReturn = { uniqueCinemas: [], uniqueTimes: [], uniqueScreens: [], showtimeId: {} };
      if (!showtimes || !cinemas) return initialReturn;

      const uniqueCinemasId = showtimes
         .filter(showtime =>
            selectedTime ? showtime.room.id === selectedTime : true
         )
         .map(showtime => showtime.room.cinema.id)
         .filter((value, index, self) => self.indexOf(value) === index);

      const uniqueCinemas = cinemas.filter(cinema =>
         uniqueCinemasId.includes(cinema.id)
      );

      const uniqueScreens = showtimes
         .filter(showtime =>
            selectedDate ? selectedDate === showtime.released : true
         )
         .map(showtime => showtime.room)
         .filter((value, index, self) => self.indexOf(value) === index);

      const uniqueTimes = showtimes
         .filter(showtime =>
            selectedScreen ? selectedScreen === showtime.room.name : true
         )
         .map(showtime => showtime)
         .sort(
            (a, b) => new Date("1970/01/01 " + a.time) - new Date("1970/01/01 " + b.time)
         );

      const showtimeId = showtimes
         .find(showtime =>
            selectedTime ? selectedTime === showtime.room.id : true
         );

      return { ...initialReturn, uniqueCinemas, uniqueTimes, uniqueScreens, showtimeId };
   };

   const onChangeCinema = event => setSelectedCinema(event.target.value);
   const onChangeTime = event => setSelectedTime(event.target.value);
   const onChangeDate = event => setSelectedDate(event.target.value);
   const onChangeScreen = event => setSelectedScreen(event.target.value);

   const { uniqueCinemas, uniqueTimes, uniqueScreens, showtimeId } = onFilterCinema();

   return (
      <Container maxWidth="xl" className={classes.container}>
         <Grid container spacing={2}>
            <MovieInfo movie={movie}/>
            <Grid item lg={9} xs={12} md={12} style={{ height: "100%" }}>
               {inversion ? (
                  <>
                     <Grid container direction={"column"}>
                        <Alert variant="filled" severity="success">
                           You have successfully paid, please go to the dashboard to check the transaction history
                        </Alert>
                        <Link
                           style={{marginTop: 30}}
                           component="button"
                           variant="body2"
                           onClick={() => {
                              setInversion(false)
                           }}
                        >
                           Back to buy more tickets
                        </Link>
                     </Grid>
                  </>
               ) : (
                  <>
                     <BookingForm
                        cinemas={uniqueCinemas}
                        times={uniqueTimes}
                        tickets={tickets}
                        showtimes={showtimes}
                        screens={uniqueScreens}
                        selectedCinema={selectedCinema}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        selectedScreen={selectedScreen}
                        onChangeCinema={onChangeCinema}
                        onChangeDate={onChangeDate}
                        onChangeTime={onChangeTime}
                        onChangeScreen={onChangeScreen}
                     />

                     {selectedCinema && selectedDate && selectedScreen && selectedTime && (
                        <>
                           <BookingSeats
                              removeTempSeats={removeTempSeats}
                              selectedTime={selectedTime}
                              showtime={showtimeId}
                              handleSelectedSeats={handleSelectedSeats}
                              clearSelected={clearSelected}
                              handleNext={handleNext}
                              check={check}
                           />
                           {check ?
                              <>
                                 <CountDownTimer timer={timeForCheckout}/>
                                 <BookingCheckout
                                    setInversion={setInversion}
                                    user={user}
                                    showtime={
                                       showtimes
                                          .find(showtime =>
                                             selectedTime ? selectedTime === showtime.room.id : true
                                          )
                                    }
                                    seatsAvailable={
                                       cinemas
                                          .filter(cinema => cinema.id === selectedCinema)
                                          .map(cinema => cinema.seatsAvailable)
                                    }
                                    selectedSeats={selected}
                                    onBookSeats={checkout}
                                    onCancelSeats={() => handleBack()}
                                 />
                              </>
                              : (
                                 <Backdrop className={classes.backdrop} open={loading}>
                                    <CircularProgress color="inherit"/>
                                    <Typography className={classes.process}>Processing...</Typography>
                                 </Backdrop>
                              )}
                        </>
                     )}
                  </>
               )}
            </Grid>
         </Grid>
      </Container>
   );
};

const mapStateToProps = state => ({
   movie: state.movieState.movie,
   showtimes: state.showtimeState.showtimes,
   cinemas: state.cinemaState.cinemas,
   user: state.userState.user,
   loading: state.showtimeState.loading,
   tickets: state.showtimeState.tickets
});

const mapDispatchToProps = {
   getMovieById,
   showErrors,
   getCinemas,
   getShowtimes,
   clearCinemas,
   clearShowtimes,
   clearMovie,
   createPrebooking,
   removeTempSeats,
   getTickets
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BookingPage));