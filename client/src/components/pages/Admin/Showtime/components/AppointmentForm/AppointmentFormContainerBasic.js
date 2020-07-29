import * as React from "react";
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import MovieIcon from "@material-ui/icons/Movie";
import TextField from "@material-ui/core/TextField";
import CalendarToday from "@material-ui/icons/CalendarToday";
import AlarmIcon from "@material-ui/icons/Alarm";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { containerStyles } from "./styles";
import { MenuItem } from "@material-ui/core";

class AppointmentFormContainerBasic extends React.PureComponent {
   constructor(props) {
      super(props);

      this.state = {
         appointmentChanges: {}
      };

      this.getAppointmentData = () => {
         const { appointmentData } = this.props;
         return appointmentData;
      };
      this.getAppointmentChanges = () => {
         const { appointmentChanges } = this.state;
         return appointmentChanges;
      };

      this.changeAppointment = this.changeAppointment.bind(this);
      this.commitAppointment = this.commitAppointment.bind(this);
   }

   changeAppointment(field, change) {
      const nextChanges = {
         ...this.getAppointmentChanges(),
         [field]: change
      };
      this.setState({
         appointmentChanges: nextChanges
      });
   }

   commitAppointment(type) {
      const appointment = {
         ...this.getAppointmentData(),
         ...this.getAppointmentChanges()
      };
      const showtime = { ...this.getAppointmentChanges() };
      showtime.seatPrice = {
         vip: parseInt(showtime.vip),
         normal: parseInt(showtime.normal),
         couple: parseInt(showtime.couple)
      };
      if (type === "changed") {
         this.props.updateShowtime(
            appointment.id,
            {
               movie: showtime.movie || appointment.movie,
               released: showtime.released || appointment.released,
               room: showtime.room || appointment.room,
               seatPrice: {
                  vip: parseInt(showtime.vip || appointment.vip),
                  normal: parseInt(showtime.normal || appointment.normal),
                  couple: parseInt(showtime.couple || appointment.couple)
               },
               time: appointment.time
            }
         );
      } else {
         this.props.addShowtime({
            movie: showtime.movie,
            released: showtime.released,
            room: showtime.room,
            seatPrice: showtime.seatPrice,
            time: showtime.time
         });
      }
      this.setState({
         appointmentChanges: {}
      });
   }

   render() {
      const {
         classes,
         visible,
         visibleChange,
         appointmentData,
         cancelAppointment,
         target,
         onHide
      } = this.props;
      const { appointmentChanges } = this.state;

      const displayAppointmentData = {
         ...appointmentData,
         ...appointmentChanges
      };

      const isNewAppointment = appointmentData.id === undefined;
      const applyChanges = isNewAppointment
         ? () => this.commitAppointment("added")
         : () => this.commitAppointment("changed");

      const onSubmitForm = e => {
         e.preventDefault();
         visibleChange();
         applyChanges();
      };

      const cancelChanges = () => {
         this.setState({
            appointmentChanges: {}
         });
         visibleChange();
         cancelAppointment();
      };

      return (
         <AppointmentForm.Overlay
            visible={visible}
            target={target}
            fullSize
            onHide={onHide}
         >
            <div>
               <div className={classes.header}>
                  <IconButton
                     className={classes.closeButton}
                     onClick={cancelChanges}
                  >
                     <Close color="action"/>
                  </IconButton>
               </div>
               <form onSubmit={onSubmitForm}>
                  <div className={classes.content}>
                     <div className={classes.wrapper}>
                        <MovieIcon className={classes.icon} color="action"/>
                        <TextField
                           fullWidth
                           select
                           value={displayAppointmentData["movie"]}
                           label="Movie"
                           variant="outlined"
                           required
                           onChange={
                              ({ target: change }) => {
                                 this.changeAppointment("movie", change.value);
                              }
                           }
                        >
                           {this.props.movies.map((movie, index) => (
                              <MenuItem key={movie.id + "-" + index} value={movie.id}>
                                 {movie.title}
                              </MenuItem>
                           ))}
                        </TextField>
                     </div>
                     <div className={classes.wrapper}>
                        <MeetingRoomIcon className={classes.icon} color="action"/>
                        <TextField
                           fullWidth
                           select
                           value={displayAppointmentData["room"]}
                           label="Room"
                           variant="outlined"
                           required
                           onChange={
                              ({ target: change }) => {
                                 this.changeAppointment("room", change.value);
                              }
                           }
                        >
                           {this.props.rooms.map((room, index) => (
                              <MenuItem key={room.id + "-" + index} value={room.id}>
                                 {`${room.name} - ${room.cinema.name}`}
                              </MenuItem>
                           ))}
                        </TextField>
                     </div>
                     <div className={classes.wrapper}>
                        <CalendarToday className={classes.icon} color="action"/>
                        <TextField
                           id="date"
                           label="Start Date"
                           type="date"
                           value={displayAppointmentData["released"]}
                           className={classes.textField}
                           required
                           onChange={
                              ({ target: change }) => {
                                 this.changeAppointment("released", change.value);
                              }
                           }
                           variant="outlined"
                           InputLabelProps={{
                              shrink: true
                           }}
                        />
                     </div>
                     <div className={classes.wrapper}>
                        <AlarmIcon className={classes.icon} color="action"/>
                        <TextField
                           id="time"
                           label="Time Start"
                           type="time"
                           value={displayAppointmentData["time"]}
                           variant="outlined"
                           className={classes.textField}
                           required
                           onChange={
                              ({ target: change }) => {
                                 this.changeAppointment("time", change.value);
                              }
                           }
                           InputLabelProps={{
                              shrink: true
                           }}
                           inputProps={{
                              step: 300
                           }}
                        />
                     </div>
                     <div className={classes.wrapper}>
                        <AttachMoneyIcon className={classes.icon} color="action"/>
                        <TextField
                           className={classes.textField}
                           label="Price Seat Vip"
                           type="text"
                           variant="outlined"
                           value={displayAppointmentData["vip"]}
                           required
                           onChange={
                              ({ target: change }) => {
                                 this.changeAppointment("vip", change.value);
                              }
                           }
                           inputProps={{
                              type: "number"
                           }}
                           rowsMax={1}
                        />
                     </div>
                     <div className={classes.wrapper}>
                        <AttachMoneyIcon className={classes.icon} color="action"/>
                        <TextField
                           className={classes.textField}
                           label="Price Seat Normal"
                           type="text"
                           variant="outlined"
                           required
                           value={displayAppointmentData["normal"]}
                           onChange={
                              ({ target: change }) => {
                                 this.changeAppointment("normal", change.value);
                              }
                           }
                           inputProps={{
                              type: "number"
                           }}
                           rowsMax={1}
                        />
                     </div>
                     <div className={classes.wrapper}>
                        <AttachMoneyIcon className={classes.icon} color="action"/>
                        <TextField
                           className={classes.textField}
                           label="Price Seat Couple"
                           type="text"
                           variant="outlined"
                           required
                           value={displayAppointmentData["couple"]}
                           onChange={
                              ({ target: change }) => {
                                 this.changeAppointment("couple", change.value);
                              }
                           }
                           inputProps={{
                              type: "number"
                           }}
                           rowsMax={1}
                        />
                     </div>
                  </div>
                  < div
                     className={classes.buttonGroup}>
                     <Button
                        variant="outlined"
                        color="primary"
                        className={classes.button}
                        type="submit"
                     >
                        {isNewAppointment ? "Create" : "Save"}
                     </Button>
                  </div>
               </form>
            </div>
         </AppointmentForm.Overlay>
      );
   }
}

const AppointmentFormContainer = withStyles(containerStyles, { name: "AppointmentFormContainer" })(AppointmentFormContainerBasic);

export default AppointmentFormContainer;