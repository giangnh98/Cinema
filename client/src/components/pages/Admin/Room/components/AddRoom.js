import React, { useState } from 'react';
import {
  withStyles,
  Button,
  Typography,
  TextField,
  MenuItem,
} from '@material-ui/core';
import styles from './styles';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { getCinemas } from '../../../../../store/cinema/cinema.thunk';
import { createRoom, updateRoom } from '../../../../../store/room/room.thunk';
import SeatView from './SeatView';
import SeatDrawableLoverLeftNormal from '../../../../../assets/images/ic_seat_lover_normal_l.png';
import SeatDrawableLoverLeftSelected from '../../../../../assets/images/ic_seat_lover_selected_l.png';
import SeatDrawableLoverLeftSold from '../../../../../assets/images/ic_seat_lover_sold_l.png';
import SeatDrawableLoverRightNormal from '../../../../../assets/images/ic_seat_lover_normal_r.png';
import SeatDrawableLoverRightSelected from '../../../../../assets/images/ic_seat_lover_selected_r.png';
import SeatDrawableLoverRightSold from '../../../../../assets/images/ic_seat_lover_sold_r.png';
import SeatDrawableNormal from '../../../../../assets/images/ic_seat_normal.png';
import SeatDrawableSelected from '../../../../../assets/images/ic_seat_selected.png';
import SeatDrawableVip from '../../../../../assets/images/ic_seat_sold.png';
import SeatDrawableSold from '../../../../../assets/images/ic_seat_vip.png';
import SeatDrawableBroken from '../../../../../assets/images/ic_seat_disabled.png';

const AddRoom = (props) => {
  const {
    classes,
    className,
    loading,
    selectedRoom,
    getCinemas,
    cinemas,
    loadingRoom,
  } = props;
  const rootClassName = classNames(classes.root, className);
  const [room, setRoom] = useState({
    name: '',
    cinema: '',
    seats: '',
  });
  const [message, setMessage] = useState({
    name: '',
    cinema: '',
    seats: '',
  });
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  React.useEffect(() => {
    if (selectedRoom) {
      setRoom({
        ...room,
        name: selectedRoom.name,
        seats: selectedRoom.seats,
        cinema: selectedRoom.cinema,
      });
      (async () => {
        const response = await fetch(
          `/api/seats/relations?roomId=${selectedRoom.id}`
        );
        const data = await response.json();
        if (data.error) {
          console.log(data.message);
        } else {
          setSeats(data);
        }
      })();
    }
    getCinemas();
    //eslint-disable-next-line
  }, []);

  const isValid =
    message.cinema !== '' || message.name !== '' || message.seats !== '';

  const showErrors = (e, error) =>
    setMessage({ ...message, [e.target.name]: error });

  const onChange = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
    if (
      e.target.name === 'name' &&
      e.target.value.length > 0 &&
      (e.target.value.length < 5 || e.target.value.length > 200)
    ) {
      showErrors(
        e,
        'Room Name must be greater than 5 characters and less than 200 characters.'
      );
    } else {
      showErrors(e, '');
    }
  };

  const onSeatsChange = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
    if (isNaN(e.target.value)) {
      showErrors(e, 'Seats must be Numeric.');
    } else {
      showErrors(e, '');
    }
  };

  const onAddRoom = (e) => {
    e.preventDefault();
  };

  const onUpdateRoom = (e, id) => {
    e.preventDefault();
    console.log(selectedSeats);
    const { seats, cinema, name } = room;
  };

  const onUpdateSeatMap = (selectedSeats) => {
    setSelectedSeats(selectedSeats);
  };

  const title = selectedRoom ? 'Edit Room' : 'Add Room';
  const submitButton = selectedRoom ? 'Update Room' : 'Add Room';
  const submitAction = selectedRoom
    ? (e) => onUpdateRoom(e, selectedRoom.id)
    : (e) => onAddRoom(e);

  return (
    <div className={rootClassName}>
      {(loading || loadingRoom) && (
        <Grid container justify={'center'} alignItems={'center'}>
          <CircularProgress color="secondary" />
        </Grid>
      )}
      <Typography variant="h4" className={classes.title}>
        {title}
      </Typography>
      <form onSubmit={submitAction}>
        <div className={classes.field}>
          <TextField
            fullWidth
            className={classes.textField}
            label="Room Name"
            margin="dense"
            name="name"
            required
            value={room.name}
            onChange={onChange}
            error={message.name !== ''}
            helperText={message.name || 'Please specify the Room Name'}
            variant="outlined"
            rowsMax={1}
            inputProps={{
              minLength: 5,
              maxLength: 200,
            }}
          />
        </div>
        <div className={classes.field}>
          <TextField
            fullWidth
            className={classes.textField}
            label="Seats"
            margin="dense"
            name="seats"
            value={room.seats}
            variant="outlined"
            onChange={onSeatsChange}
            error={message.seats !== ''}
            helperText={message.seats}
            rowsMax={1}
            inputProps={{
              type: 'number',
            }}
            required
          />
        </div>
        <div className={classes.field}>
          <TextField
            fullWidth
            select
            className={classes.textField}
            value={room.cinema}
            onChange={(e) => setRoom({ ...room, cinema: e.target.value })}
            label="Cinema"
            required
            variant="outlined"
          >
            {cinemas.map((cinema, index) => (
              <MenuItem key={cinema.id + '-' + index} value={cinema.id}>
                {cinema.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        {!selectedRoom && (
          <div className={classes.field}>
            <Button variant="contained" component="label">
              Upload Seat Map
              <input type="file" hidden />
            </Button>
          </div>
        )}
        {selectedRoom && (
          <SeatView
            seats={seats}
            seatDrawableLoverLeftNormal={SeatDrawableLoverLeftNormal}
            seatDrawableLoverLeftSelected={SeatDrawableLoverLeftSelected}
            seatDrawableLoverLeftSold={SeatDrawableLoverLeftSold}
            seatDrawableLoverRightNormal={SeatDrawableLoverRightNormal}
            seatDrawableLoverRightSelected={SeatDrawableLoverRightSelected}
            seatDrawableLoverRightSold={SeatDrawableLoverRightSold}
            seatDrawableNormal={SeatDrawableNormal}
            seatDrawableSelected={SeatDrawableSelected}
            seatDrawableSold={SeatDrawableSold}
            seatDrawbleVip={SeatDrawableVip}
            seatDrawableBroken={SeatDrawableBroken}
            onUpdateSeatMap={onUpdateSeatMap}
          />
        )}
        <Button
          className={classes.buttonFooter}
          color="primary"
          type="submit"
          variant="contained"
          disabled={isValid || loading || loadingRoom}
        >
          {submitButton}
        </Button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.cinemaState.loading,
  cinemas: state.cinemaState.cinemas,
  loadingRoom: state.roomState.loading,
});

const mapDispatchToProps = {
  getCinemas,
  createRoom,
  updateRoom,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddRoom));
