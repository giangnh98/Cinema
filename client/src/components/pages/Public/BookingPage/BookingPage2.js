import React from 'react';
import SeatView from './components/SeatView/SeatView';
import SeatDrawableLoverLeftNormal from '../../../../assets/images/ic_seat_lover_normal_l.png';
import SeatDrawableLoverLeftSelected from '../../../../assets/images/ic_seat_lover_selected_l.png';
import SeatDrawableLoverLeftSold from '../../../../assets/images/ic_seat_lover_sold_l.png';
import SeatDrawableLoverRightNormal from '../../../../assets/images/ic_seat_lover_normal_r.png';
import SeatDrawableLoverRightSelected from '../../../../assets/images/ic_seat_lover_selected_r.png';
import SeatDrawableLoverRightSold from '../../../../assets/images/ic_seat_lover_sold_r.png';
import SeatDrawableNormal from '../../../../assets/images/ic_seat_normal.png';
import SeatDrawableSelected from '../../../../assets/images/ic_seat_selected.png';
import SeatDrawableVip from '../../../../assets/images/ic_seat_sold.png';
import SeatDrawableSold from '../../../../assets/images/ic_seat_vip.png';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import { withStyles, Backdrop, Typography } from '@material-ui/core';
import styles from './styles';
import AlertDialog from './components/SeatView/AlertDialog';
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import setAuthHeaders from '../../../../ultils/setAuthToken';
import StepWizard from 'react-step-wizard';
import BookingCheckout from './components/BookingCheckout/BookingCheckout';
import { useHistory } from 'react-router-dom';

let timer = null;
const timeForCheckout = 10 * 60 * 1000;

const BookingPage2 = (props) => {
  const [seats, setSeats] = React.useState({
    selectedSeats: [],
    holdSeats: [],
  });
  const [alert, setAlert] = React.useState({
    open: false,
    message: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [isLoadSeats, setIsLoadSeats] = React.useState(false);
  const [data, setData] = React.useState({
    seats: [],
    seatsSold: [],
    showtime: null,
  });
  const [state, updateState] = React.useState({});
  const history = useHistory();

  const {
    match: {
      params: { showId, roomId },
    },
    classes,
  } = props;

  React.useEffect(() => {
    setIsLoadSeats(true);
    Promise.all([
      fetch(`/api/seats/relations?roomId=${roomId}`),
      fetch(`/api/prebooking/${showId}`),
      fetch(`/api/showtimes/${showId}`),
    ])
      .then(async ([aa, bb, cc]) => {
        const a = await aa.json();
        const b = await bb.json();
        const c = await cc.json();
        return [a, b, c];
      })
      .then((response) => {
        setData({
          seats: response[0],
          seatsSold:
            response[1].length > 0
              ? response[1].map((it) => {
                  it.seatState = 1;
                  return it;
                })
              : [],
          showtime: response[2],
        });
        setIsLoadSeats(false);
      })
      .catch((err) => {
        setAlert({ open: true, message: err.message });
        setIsLoadSeats(false);
      });
  }, [roomId, showId]);

  React.useEffect(() => {
    clearHoldSeatsSelected(false);
    if (window.performance) {
      if (
        window.performance.navigation.type ===
        window.performance.navigation.TYPE_RELOAD
      ) {
        (async () => {
          try {
            const response = await fetch(`/api/prebooking/showtime/${showId}`, {
              method: 'DELETE',
              headers: setAuthHeaders({
                Accept: 'application/json',
                'Content-Type': 'application/json',
              }),
            });
            const data = await response.json();
            if (!data.error) {
              history.push(`/movie/booking/${showId}/${roomId}`);
            }
            if (data.error) {
              console.log(data.message);
            }
          } catch (e) {
            console.log(e);
          }
        })();
      }
    }
  }, [showId, roomId]);

  const onSelectSeatNotMatchRegular = () => {
    setAlert({ open: true, message: "Can't leave a seat" });
  };

  const onSelectedSeatOverMaxCount = (maxSelectCount) => {
    setAlert({ open: true, message: `Most choice ${maxSelectCount} Seats` });
  };

  const onPickLoverSeatOverMaxCount = (maxSelectCount) => {
    setAlert({
      open: true,
      message: 'Couple seat exceeds the number of seats',
    });
  };

  const onSelectedSeatChanged = (selectedSeats) => {
    setSeats({
      holdSeats: selectedSeats.map((it) => {
        return {
          seat: it.id,
          showtime: showId,
        };
      }),
      selectedSeats,
    });
  };

  const onSelectedSeatSold = () => {
    setAlert({ open: true, message: 'Selected Seats have been sold' });
  };

  const clearHoldSeatsSelected = async (isBack) => {
    try {
      if (isBack) setLoading(true);
      const response = await fetch(`/api/prebooking/showtime/${showId}`, {
        method: 'DELETE',
        headers: setAuthHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      });
      const data = await response.json();
      if (!data.error) {
        if (isBack) setLoading(false);
        if (isBack) handleBack();
      }
      if (data.error) {
        if (isBack) setLoading(false);
        setAlert({ open: true, message: data.message });
      }
    } catch (e) {
      if (isBack) setLoading(false);
      setAlert({ open: true, message: e.message });
    }
  };

  const holdSeatsSelected = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prebooking', {
        method: 'POST',
        headers: setAuthHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          seats: seats.holdSeats,
        }),
      });
      const data = await response.json();
      if (!data.error) {
        setLoading(false);
        handleNext();
      }
      if (data.error) {
        setLoading(false);
        setAlert({ open: true, message: data.message });
      }
    } catch (e) {
      setLoading(false);
      setAlert({ open: true, message: e.message });
    }
  };

  const onStepChange = (stats) => {};

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const handleNext = () => {
    clearTimer();
    timer = setTimeout(async () => {
      return await clearHoldSeatsSelected(true);
    }, timeForCheckout);
    SW.nextStep();
  };

  const onNext = () => {
    clearTimer();
    SW.nextStep();
  };

  const handleBack = () => {
    clearTimer();
    SW.previousStep();
  };

  const setInstance = (SW) =>
    updateState({
      ...state,
      SW,
    });

  const { SW } = state;

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
        <Typography className={classes.process}>Loading...</Typography>
      </Backdrop>
      <AlertDialog
        alert={alert}
        handleClose={() => setAlert({ ...alert, open: false })}
      />
      {isLoadSeats ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </div>
      ) : data.seats.length > 0 ? (
        <StepWizard
          onStepChange={onStepChange}
          isHashEnabled
          instance={setInstance}
        >
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{
              height: '80vh',
            }}
          >
            <SeatView
              seats={data.seats}
              seatsSold={data.seatsSold}
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
              onSelectSeatNotMatchRegular={onSelectSeatNotMatchRegular}
              onSelectedSeatOverMaxCount={onSelectedSeatOverMaxCount}
              onPickLoverSeatOverMaxCount={onPickLoverSeatOverMaxCount}
              onSelectedSeatChanged={onSelectedSeatChanged}
              onSelectedSeatSold={onSelectedSeatSold}
              seatMaxSelectedCount={5}
            />
            <Grid item container justify="flex-end">
              <Button
                variant="contained"
                size={'small'}
                color={'primary'}
                disabled={seats.holdSeats.length === 0}
                onClick={async () => await holdSeatsSelected()}
              >
                Confirm to checkout
              </Button>
            </Grid>
          </Grid>
          <Grid
            style={{
              width: '100%',
              height: '100vh',
            }}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            {data.showtime && data.showtime.movie && data.showtime.room && (
              <BookingCheckout
                movie={data.showtime.movie}
                showtime={data.showtime}
                screen={data.showtime.room.name}
                cinema={
                  data.showtime.room.cinema && data.showtime.room.cinema.name
                }
                selectedSeats={seats.selectedSeats}
                onBack={async () => await clearHoldSeatsSelected(true)}
                onNext={onNext}
                timeForCheckout={timeForCheckout}
              />
            )}
          </Grid>
          <div
            className={classes.container}
            style={{ width: '100%', height: '100vh' }}
          >
            <Grid
              style={{
                width: '100%',
                height: '100%',
              }}
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Alert variant="filled" severity="success">
                You have successfully paid, please go to the dashboard to check
                the transaction history
              </Alert>
              <Link
                style={{ marginTop: 30 }}
                variant="body2"
                href={`/movie/booking/${showId}/${roomId}`}
              >
                Back to buy more tickets
              </Link>
            </Grid>
          </div>
        </StepWizard>
      ) : (
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{
            height: '100vh',
          }}
        >
          <Typography variant="h1">Empty Seat Map</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default withStyles(styles)(BookingPage2);
