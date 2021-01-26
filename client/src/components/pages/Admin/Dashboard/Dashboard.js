import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles, Grid } from "@material-ui/core";
import TotalUsers from "./components/TotalUsers/TotalUsers";
import TotalCinemas from "./components/TotalCinemas/TotalCinemas";
import TotalMovies from "./components/TotalMovies/TotalMovies";
import TotalReservations from "./components/TotalReservations/TotalReservations";
import BestMovies from "./components/BestMovies/BestMovies";
import UsersByDevice from "./components/UsersByDevice/UsersByDevice";
import { getUsers } from "../../../../store/user/user.thunk";
import { getCinemas } from "../../../../store/cinema/cinema.thunk";
import { getMovies } from "../../../../store/movie/movie.thunk";
import { getTickets } from "../../../../store/showtime/showtime.thunk";
import { getRooms } from "../../../../store/room/room.thunk";
import TotalRooms from "./components/TotalRooms/TotalRooms";
import { getUser } from "../../../../ultils/auth";
import NotPermission from "../../Public/NotFound/NotPermission";

const styles = theme => ({
   root: {
      textAlign: "center",
      padding: theme.spacing(4)
   }
});

class Dashboard extends Component {
   componentDidMount() {
      this.props.getUsers();
      this.props.getCinemas();
      this.props.getMovies();
      this.props.getTickets();
      this.props.getRooms();
   }

   getBestMovies = (tickets, movies, total = 5) => {
      const reservationCounter = tickets.map(ticket => ({
         movieId: ticket.showtime.movie,
         count: tickets.filter(r => r.showtime.movie === ticket.showtime.movie).length
      }));

      const result = [];
      const map = new Map();
      for (const item of reservationCounter) {
         if (!map.has(item.movieId)) {
            map.set(item.movieId, true); // set any value to Map
            result.push({
               movieId: item.movieId,
               count: item.count
            });
         }
      }
      return result
         .sort((a, b) => b.count - a.count)
         .slice(0, total)
         .map(res => ({
            movie: movies.find(movie => movie.id === res.movieId),
            count: res.count
         }));
   };

   render() {
      const { classes, users, cinemas, movies, tickets, rooms } = this.props;
      const ticketsPrice = tickets.map(ticket => ticket.price).reduce((total, price) => {
         return total + price;
      }, 0);

      const user = getUser();

      if (user.role === "superadmin") {
         return (
            <div className={classes.root}>
               <Grid container spacing={4}>
                  <Grid item lg={2} sm={6} xl={3} xs={12}>
                     <TotalUsers users={users.length}/>
                  </Grid>
                  <Grid item lg={2} sm={6} xl={3} xs={12}>
                     <TotalCinemas cinemas={cinemas.length}/>
                  </Grid>
                  <Grid item lg={2} sm={6} xl={3} xs={12}>
                     <TotalMovies movies={movies.length}/>
                  </Grid>
                  <Grid item lg={2} sm={6} xl={3} xs={12}>
                     <TotalRooms rooms={rooms.length}/>
                  </Grid>
                  <Grid item lg={4} sm={6} xl={3} xs={12}>
                     <TotalReservations reservations={tickets.length} price={ticketsPrice}/>
                  </Grid>
                  <Grid item lg={8} md={12} xl={9} xs={12}>
                     <BestMovies
                        bestMovies={this.getBestMovies(tickets, movies, 5)}
                     />
                  </Grid>
                  <Grid item lg={4} md={6} xl={3} xs={12}>
                     <UsersByDevice bestMovies={this.getBestMovies(tickets, movies, 3)} />
                  </Grid>
               </Grid>
            </div>
         );
      }
      return (
         <NotPermission/>
      );
   }
}

const mapStateToProps = (
   {
      userState,
      cinemaState,
      movieState,
      showtimeState,
      roomState
   }
) => ({
   users: userState.users,
   cinemas: cinemaState.cinemas,
   movies: movieState.movies,
   tickets: showtimeState.tickets,
   rooms: roomState.rooms
});
const mapDispatchToProps = {
   getUsers,
   getCinemas,
   getMovies,
   getTickets,
   getRooms
};
export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withStyles(styles)(Dashboard));
