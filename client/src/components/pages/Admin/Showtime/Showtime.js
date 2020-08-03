import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
   Scheduler,
   Toolbar,
   MonthView,
   WeekView,
   ViewSwitcher,
   Appointments,
   AppointmentTooltip,
   AppointmentForm,
   EditRecurrenceMenu,
   AllDayPanel
} from "@devexpress/dx-react-scheduler-material-ui";
import { connectProps } from "@devexpress/dx-react-core";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import SyncIcon from "@material-ui/icons/Sync";
import AppointmentFormContainer from "./components/AppointmentForm/AppointmentFormContainerBasic";
import { connect } from "react-redux";
import { ToTitleCase } from "../../../../ultils/utils";
import { showErrors } from "../../../../store/alert/alert.thunk";
import { getRooms } from "../../../../store/room/room.thunk";
import { getMovies } from "../../../../store/movie/movie.thunk";
import { createShowtime, deleteShowtime, updateShowtime } from "../../../../store/showtime/showtime.thunk";
import { Backdrop, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
   addButton: {
      margin: "10px 0"
   },
   backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff"
   },
   process: {
      fontSize: theme.spacing(2),
      textTransform: "capitalize",
      color: theme.palette.common.white,
      marginLeft: 10
   }
});

/* eslint-disable-next-line react/no-multi-comp */
class Showtime extends React.PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         data: [],
         currentDate: Date.now(),
         confirmationVisible: false,
         editingFormVisible: false,
         deletedAppointmentId: undefined,
         editingAppointment: undefined,
         previousAppointment: undefined,
         addedAppointment: {},
         startDayHour: 9,
         endDayHour: 24,
         isNewAppointment: false
      };

      this.toggleConfirmationVisible = this.toggleConfirmationVisible.bind(this);
      this.commitDeletedAppointment = this.commitDeletedAppointment.bind(this);
      this.toggleEditingFormVisibility = this.toggleEditingFormVisibility.bind(this);

      this.commitChanges = this.commitChanges.bind(this);
      this.onEditingAppointmentChange = this.onEditingAppointmentChange.bind(this);
      this.onAddedAppointmentChange = this.onAddedAppointmentChange.bind(this);
      this.appointmentForm = connectProps(AppointmentFormContainer, () => {
         const {
            editingFormVisible,
            editingAppointment,
            data,
            addedAppointment,
            isNewAppointment,
            previousAppointment
         } = this.state;

         const currentAppointment = data
               .filter(appointment => editingAppointment && appointment.id === editingAppointment.id)[0]
            || addedAppointment;
         const cancelAppointment = () => {
            if (isNewAppointment) {
               this.setState({
                  editingAppointment: previousAppointment,
                  isNewAppointment: false
               });
            }
         };

         return {
            loading: this.props.loading,
            movies: this.props.movies,
            rooms: this.props.rooms,
            visible: editingFormVisible,
            appointmentData: currentAppointment,
            addShowtime: this.props.createShowtime,
            updateShowtime: this.props.updateShowtime,
            deleteShowtime: this.props.deleteShowtime,
            commitChanges: this.commitChanges,
            visibleChange: this.toggleEditingFormVisibility,
            onEditingAppointmentChange: this.onEditingAppointmentChange,
            cancelAppointment
         };
      });
   }

   componentDidMount() {
      this.fetchShowtime();
      this.props.getMovies();
      this.props.getRooms();
   }

   fetchShowtime = () => {
      fetch("/api/showtimes")
         .then(response => response.json())
         .then(data => {
            if (!data.error) {
               const scheduler = data.map(showtime => {
                  const released = new Date(showtime.released);
                  const timeStart = showtime.time.split(":");
                  const minute = showtime.movie.duration % 60;
                  const hour = Math.floor(showtime.movie.duration / 60);
                  const startDate = new Date(released.getFullYear(), released.getMonth(), released.getDate());
                  const endDate = new Date(released.getFullYear(), released.getMonth(), released.getDate());
                  startDate.setHours(parseInt(timeStart[0]));
                  startDate.setMinutes(parseInt(timeStart[1]));
                  endDate.setHours(startDate.getHours() + hour);
                  endDate.setMinutes(startDate.getMinutes() + minute);

                  //setup released
                  const releasedMonth = released.getMonth() + 1 < 10 ? `0${released.getMonth() + 1}` : released.getMonth() + 1;
                  const releasedDate = released.getDate() < 10 ? `0${released.getDate()}` : released.getDate();
                  return {
                     title: ToTitleCase(showtime.movie.title),
                     startDate,
                     endDate,
                     id: showtime.id,
                     location: showtime.room.name,
                     movie: showtime.movie.id,
                     room: showtime.room.id,
                     released: `${released.getFullYear()}-${releasedMonth}-${releasedDate}`,
                     time: showtime.time,
                     vip: showtime.seatPrice.vip,
                     normal: showtime.seatPrice.normal,
                     couple: showtime.seatPrice.couple
                  };
               });
               this.setState({ data: scheduler });
            }
            if (data.error) {
               this.props.showErrors(data.message, "error");
            }
         })
         .catch(error => {
            this.props.showErrors(error.message, "error");
         });
   };

   componentDidUpdate() {
      this.appointmentForm.update();
   }

   onEditingAppointmentChange(editingAppointment) {
      this.setState({ editingAppointment });
   }

   onAddedAppointmentChange(addedAppointment) {
      this.setState({ addedAppointment });
      const { editingAppointment } = this.state;
      if (editingAppointment !== undefined) {
         this.setState({
            previousAppointment: editingAppointment
         });
      }
      this.setState({ editingAppointment: undefined, isNewAppointment: true });
   }

   setDeletedAppointmentId(id) {
      this.setState({ deletedAppointmentId: id });
   }

   toggleEditingFormVisibility() {
      const { editingFormVisible } = this.state;
      this.setState({
         editingFormVisible: !editingFormVisible
      });
   }

   toggleConfirmationVisible() {
      const { confirmationVisible } = this.state;
      this.setState({ confirmationVisible: !confirmationVisible });
   }

   commitDeletedAppointment() {
      const { deletedAppointmentId } = this.state;
      const { showErrors } = this.props;
      this.props.deleteShowtime(deletedAppointmentId)
         .then(res => {
            if (!res) {
               showErrors("Delete showtime success!", "success");
               window.location.reload();
            } else {
               showErrors("Delete showtime failure!", "error");
            }
         });
      this.toggleConfirmationVisible();
   }

   commitChanges({ added, changed, deleted }) {
      this.setState((state) => {
         let { data } = state;
         if (added) {
            const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
            data = [...data, { id: startingAddedId, ...added }];
         }
         if (changed) {
            data = data.map(appointment => (
               changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
         }
         if (deleted !== undefined) {
            this.setDeletedAppointmentId(deleted);
            this.toggleConfirmationVisible();
         }
         return { data, addedAppointment: {} };
      });
   }

   render() {
      const {
         currentDate,
         data,
         confirmationVisible,
         editingFormVisible,
         startDayHour,
         endDayHour
      } = this.state;
      const { classes, loading } = this.props;

      return (
         <div>
            {loading && (
               <Backdrop className={classes.backdrop} open={loading}>
                  <CircularProgress color="inherit"/>
                  <Typography className={classes.process}>Processing...</Typography>
               </Backdrop>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
               <Button
                  color="secondary"
                  variant={"contained"}
                  className={classes.addButton}
                  onClick={() => {
                     this.setState({ editingFormVisible: true });
                     this.onEditingAppointmentChange(undefined);
                  }}
                  startIcon={<AddIcon/>}
               >
                  Add Showtime
               </Button>
               <Button
                  style={{ backgroundColor: "green", color: "white", marginLeft: 10 }}
                  variant={"contained"}
                  className={classes.addButton}
                  onClick={() => this.fetchShowtime()}
                  startIcon={<SyncIcon/>}
               >
                  Refresh
               </Button>
            </div>
            <Paper>
               <Scheduler
                  data={data}
                  height={"100%"}
               >
                  <ViewState
                     currentDate={currentDate}
                  />
                  <EditingState
                     onCommitChanges={this.commitChanges}
                     onEditingAppointmentChange={this.onEditingAppointmentChange}
                     onAddedAppointmentChange={this.onAddedAppointmentChange}
                  />
                  <WeekView
                     startDayHour={startDayHour}
                     endDayHour={endDayHour}
                  />
                  <MonthView/>
                  <AllDayPanel/>
                  <EditRecurrenceMenu/>
                  <Appointments/>
                  <AppointmentTooltip
                     showOpenButton
                     showCloseButton
                     showDeleteButton
                  />
                  <Toolbar/>
                  <ViewSwitcher/>
                  <AppointmentForm
                     overlayComponent={this.appointmentForm}
                     visible={editingFormVisible}
                     onVisibilityChange={this.toggleEditingFormVisibility}
                  />
               </Scheduler>

               <Dialog
                  open={confirmationVisible}
                  onClose={() => this.setState({ confirmationVisible: false })}
               >
                  <DialogTitle>
                     Delete Appointment
                  </DialogTitle>
                  <DialogContent>
                     <DialogContentText>
                        Are you sure you want to delete this appointment?
                     </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                     <Button onClick={this.toggleConfirmationVisible} color="primary" variant="outlined">
                        Cancel
                     </Button>
                     <Button onClick={this.commitDeletedAppointment} color="secondary" variant="outlined">
                        Delete
                     </Button>
                  </DialogActions>
               </Dialog>
            </Paper>
         </div>
      );
   }
}

const mapStateToProps = state => ({
   rooms: state.roomState.rooms,
   movies: state.movieState.movies,
   loading: state.showtimeState.loading
});

export default connect(mapStateToProps, {
   showErrors,
   getRooms,
   getMovies,
   createShowtime,
   updateShowtime,
   deleteShowtime
})(withStyles(styles)(Showtime));