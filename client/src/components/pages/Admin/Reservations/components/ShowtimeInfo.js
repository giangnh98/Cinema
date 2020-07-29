import React from "react";
import { Card, CardHeader, CardMedia, CardContent, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { connect } from "react-redux";
import { getShowtime } from "../../../../../store/showtime/showtime.thunk";
import moment from "moment";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ToTitleCase } from "../../../../../ultils/utils";

const useStyles = makeStyles(theme => ({
   root: {
      maxWidth: 345
   },
   media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
   }
}));

const ShowtimeInfo = ({ id, showtime, getShowtime, loading }) => {
   const classes = useStyles();

   React.useEffect(() => {
      getShowtime(id);
      //eslint-disable-next-line
   }, [id]);

   if (!loading && showtime) {
      return (
         <Card className={classes.root} elevation={0}>
            <CardHeader
               title={showtime.movie && ToTitleCase(showtime.movie.title)}
               subheader={`${showtime.time} - ${moment(showtime.released).format("dddd DD/MM/YYYY")}`}
            />
            <CardMedia
               className={classes.media}
               image={showtime.movie && showtime.movie.image}
               title="Paella dish"
            />
            <CardContent>
               <Typography variant="body2" color="textSecondary" component="p">
                  Cinema : {showtime.room.cinema.name}
               </Typography>
               <Typography variant="body2" color="textSecondary" component="p">
                  Room : {showtime.room.name}
               </Typography>
               <Typography variant="body2" color="textSecondary" component="p">
                  Price Vip Seat : {showtime.seatPrice.vip}$
               </Typography>
               <Typography variant="body2" color="textSecondary" component="p">
                  Price Normal Seat : {showtime.seatPrice.normal}$
               </Typography>
               <Typography variant="body2" color="textSecondary" component="p">
                  Price Couple Seat : {showtime.seatPrice.couple}$
               </Typography>
            </CardContent>
         </Card>
      );
   }
   return (
      <div style={{ width: 370 }}>
         <LinearProgress style={{ maxWidth: 345 }}/>
      </div>
   );
};

const mapStateToProps = state => ({
   showtime: state.showtimeState.showtime,
   loading: state.showtimeState.loading
});

export default connect(mapStateToProps, { getShowtime })(ShowtimeInfo);