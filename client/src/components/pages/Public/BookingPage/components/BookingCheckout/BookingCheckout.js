import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button, Grid, Typography } from '@material-ui/core';
import { PayPalButton } from 'react-paypal-button-v2';
import { ToTitleCase } from '../../../../../../ultils/utils';
import setAuthHeaders from '../../../../../../ultils/setAuthToken';
import moment from 'moment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CountDownTimer from '../../../CountDown/CountDownTimer';
import {
  TYPE_LOVER_LEFT,
  TYPE_LOVER_RIGHT,
  TYPE_NORMAL,
  TYPE_VIP,
} from '../SeatView/SeatSelectRegular';

const useStyles = makeStyles((theme) => ({
  tableRet: {
    width: '100%',
  },
  thumImg: {
    display: 'inline-block',
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  img: {
    width: 100,
    height: 'auto',
  },
  order_tList: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  mount: {
    '&:after': {
      content: '',
      display: 'block',
      clear: 'both',
    },
  },
  order_Lbox2: {
    display: 'inline-block',
    marginLeft: '20px',
    verticalAlign: 'middle',
  },
  order_title: {
    display: 'block',
    marginBottom: '15px',
    marginTop: 10,
    fontSize: '20px',
    color: 'white',
  },
  title: {
    fontSize: 12,
    color: 'white',
    marginLeft: 10,
  },
  bg_none: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 0,
    background: 'none',
  },
  sum: {
    paddingRight: '50px',
  },
}));

export default function BookingCheckout(props) {
  const classes = useStyles(props);
  const {
    movie,
    selectedSeats,
    showtime,
    screen,
    onBack,
    onNext,
    cinema,
    timeForCheckout,
  } = props;

  const convertTime = () => {
    const totalMinutes = movie.duration;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const times = showtime.time.split(':');
    let rhs = hours + parseInt(times[0]);
    let rms = minutes + parseInt(times[1]);
    if (rms > 60) {
      rms -= 60;
      rhs += 1;
    }
    if (rhs > 24) {
      rhs -= 24;
    }
    rhs = rhs > 9 ? `${rhs}` : `0${rhs}`;
    rms = rms > 0 ? `${rms}` : `0${rms}`;
    return `${rhs}:${rms}`;
  };

  const getSeatsNo = () => {
    return selectedSeats.map((it) => {
      return `${String.fromCharCode(97 + it.seatNo - 1).toUpperCase()}${
        it.point.y
      }`;
    });
  };

  const price = () => {
    return selectedSeats.reduce((accumulator, currentValue) => {
      return accumulator + getPriceSeat(currentValue.type);
    }, 0);
  };

  const getPriceSeat = (seatType) => {
    return seatType === TYPE_NORMAL
      ? showtime.seatPrice['normal']
      : seatType === TYPE_LOVER_LEFT || seatType === TYPE_LOVER_RIGHT
      ? showtime.seatPrice['couple']
      : seatType === TYPE_VIP
      ? showtime.seatPrice['vip']
      : 0;
  };

  const getTypeSeat = (seatType) => {
    return seatType === TYPE_NORMAL
      ? 'normal'
      : seatType === TYPE_LOVER_LEFT || seatType === TYPE_LOVER_RIGHT
      ? 'couple'
      : seatType === TYPE_VIP
      ? 'vip'
      : 'normal';
  };

  const tickets = () => {
    return selectedSeats.map((it) => {
      return {
        showtime: showtime.id,
        seat: it.id,
        price: getPriceSeat(it.type),
        type: getTypeSeat(it.type),
        seatNo: `${String.fromCharCode(97 + it.seatNo - 1).toUpperCase()}${
          it.point.y
        }`,
      };
    });
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Typography variant="h4" component="h4">
        Order / Payment
      </Typography>
      <CountDownTimer timer={timeForCheckout} />
      <Grid
        item
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{
          backgroundColor: 'rgb(18, 20, 24)',
          margin: '20px 0px',
          padding: 20,
        }}
      >
        <table
          border="2"
          className={classes.tableRet}
          style={{
            borderCollapse: 'collapse',
            borderSpacing: 0,
          }}
        >
          <colgroup>
            <col style={{ width: 784 }} />
            <col style={{ width: 196 }} />
          </colgroup>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <dl
                  style={{
                    display: 'block',
                    marginBlockStart: '1em',
                    marginBlockEnd: '1em',
                    marginInlineStart: 0,
                    marginInlineEnd: 0,
                  }}
                  className={classes.mount}
                >
                  <dt
                    style={{
                      float: 'left',
                      fontSize: 18,
                      padding: '10px 0px 20px 10px',
                    }}
                  >
                    Total amount ordered :
                  </dt>
                  <dd
                    style={{
                      float: 'right',
                    }}
                    className={classes.sum}
                  >
                    <em>
                      <strong>
                        <Typography variant="h4" component="h4">
                          {price()} {'USD'}
                        </Typography>
                      </strong>
                    </em>
                  </dd>
                </dl>
              </td>
            </tr>
          </tfoot>
          <tbody>
            <tr>
              <td
                style={{
                  display: 'flex',
                  padding: 10,
                }}
              >
                <span className={classes.thumImg}>
                  <img
                    className={classes.img}
                    src={movie.image}
                    alt={movie.title}
                  />
                </span>
                <div className={classes.order_Lbox2}>
                  <strong className={classes.order_title}>
                    {ToTitleCase(movie.title)} (2D Vietsub)
                  </strong>
                  <ul
                    style={{
                      listStyle: 'none',
                      marginBlockStart: '1em',
                      marginBlockEnd: '1em',
                      marginInlineStart: 0,
                      marginInlineEnd: 0,
                      paddingInlineStart: 0,
                    }}
                    className={classes.order_tList}
                  >
                    <li className={classes.bg_none}>
                      <em>Show date : </em>
                      <Typography
                        variant="h4"
                        component="h4"
                        className={classes.title}
                      >
                        {moment(showtime.released).format('DD/MM/YYYY (ddd)')}
                      </Typography>
                    </li>
                    <li className={classes.bg_none}>
                      <em>Showtimes : </em>
                      <Typography
                        variant="h4"
                        component="h4"
                        className={classes.title}
                      >
                        {`${showtime.time} ~ ${convertTime()}`}
                      </Typography>
                    </li>
                    <li className={classes.bg_none}>
                      <em>Cinema : </em>
                      <Typography
                        variant="h4"
                        component="h4"
                        className={classes.title}
                      >
                        {cinema ? cinema : 'Cantavil'}
                      </Typography>
                    </li>
                    <li className={classes.bg_none}>
                      <em>Cinema room : </em>
                      <Typography
                        variant="h4"
                        component="h4"
                        className={classes.title}
                      >
                        {screen}
                      </Typography>
                    </li>
                    <li className={classes.bg_none}>
                      <em>Seats : </em>
                      <Typography
                        variant="h4"
                        component="h4"
                        className={classes.title}
                      >
                        {getSeatsNo().join(', ')}
                      </Typography>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <em>
                  <strong>
                    <Typography
                      variant="h4"
                      component="h4"
                      style={{ textAlign: 'center' }}
                    >
                      {price()} {'USD'}
                    </Typography>
                  </strong>
                </em>
              </td>
            </tr>
          </tbody>
        </table>
      </Grid>
      <Grid item container direction="row" alignItems="center">
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
          >
            back
          </Button>
        </Grid>
        <Grid item xs={6}>
          <PayPalButton
            amount={`${price()}`}
            // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
            onSuccess={(details, data) => {
              onNext();
              // OPTIONAL: Call your server to save the transaction
              return fetch('/api/tickets', {
                method: 'POST',
                headers: setAuthHeaders({
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                }),
                body: JSON.stringify({ seats: tickets() }),
              });
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
