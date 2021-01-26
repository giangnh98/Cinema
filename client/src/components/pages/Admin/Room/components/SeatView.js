import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Typography, Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  STATE_VIP,
  STATE_SOLD,
  STATE_SELECTED,
  STATE_NORMAL,
  TYPE_LOVER_LEFT,
  TYPE_LOVER_RIGHT,
  TYPE_NORMAL,
  TYPE_VIP,
  STATE_BROKEN,
  TYPE_BROKEN,
} from '../../../Public/BookingPage/components/SeatView/SeatSelectRegular';
import { Utils } from '../../../Public/BookingPage/components/SeatView/Utils';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    width: 25,
    height: 25,
    fontSize: 16,
    textAlign: 'center',
    margin: `0px 40px 0px 0px`,
  },
  seatInfoContainer: {
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 40,
    textAlign: 'center',
    color: '#eee',
  },
  square: {
    cursor: 'pointer',
    width: 25,
    height: 25,
  },
  container: {
    margin: '30px 0px 0px 0px',
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(2),
  },
  showScreen: {
    width: '50%',
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    fontSize: 18,
    backgroundColor: '#0c1533',
    fontWeight: 600,
    textAlign: 'center',
    color: '#eee',
  },

  seatInfo: {
    marginRight: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  seatInfoLabel: {
    marginRight: theme.spacing(1),
    display: 'inline-block',
    width: 15,
    height: 15,
  },
  seatInfoLabelLover: {
    display: 'inline-block',
    width: 15,
    height: 15,
  },
}));

const options = ['NORMAL', 'V.I.P', 'LOVER', 'BROKEN'];

const SeatView = ({
  seats,
  seatDrawableLoverLeftNormal,
  seatDrawableLoverLeftSelected,
  seatDrawableLoverLeftSold,
  seatDrawableLoverRightNormal,
  seatDrawableLoverRightSelected,
  seatDrawableLoverRightSold,
  seatDrawableNormal,
  seatDrawableSelected,
  seatDrawableSold,
  seatDrawbleVip,
  seatDrawableBroken,
  onUpdateSeatMap,
}) => {
  const classes = useStyles();
  const [controls, setControls] = React.useState({
    selectedSeats: [],
    soldSeats: [],
    seatData: new Map(),
    seatNo: [],
    maxRow: 0,
    maxCol: 0,
  });

  const { selectedSeats, seatData, seatNo, maxRow, maxCol } = controls;
  const [open, setOpen] = React.useState(false);

  const handleClickListItem = (value) => {
    setSeat(value);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const [seat, setSeat] = React.useState({
    value: 'NORMAL',
    selectedSeat: null,
  });
  const radioGroupRef = React.useRef(null);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    const { selectedSeat, value } = seat;
    const items = controls.selectedSeats;
    const seatMap = controls.seatData;
    let flag = TYPE_NORMAL;
    let item = null;
    const r1 = seatMap.get(
      `${selectedSeat.point.x}-${selectedSeat.point.y + 1}`
    );
    const l1 = seatMap.get(
      `${selectedSeat.point.x}-${selectedSeat.point.y - 1}`
    );
    const it = seatMap.get(`${selectedSeat.point.x}-${selectedSeat.point.y}`);
    if (value === 'NORMAL') {
      if (it.type === TYPE_NORMAL) {
        return;
      }
      flag = TYPE_NORMAL;
    } else if (value === 'V.I.P') {
      if (it.type === TYPE_VIP) {
        return;
      }
      flag = TYPE_VIP;
    } else if (value === 'LOVER') {
      if (!r1 && !l1) {
        return;
      }
      if (it.type === TYPE_LOVER_RIGHT || it.type === TYPE_LOVER_LEFT) {
        return;
      }
      flag = TYPE_LOVER_LEFT;
      if (!r1) {
        item = l1;
      }
    } else if (value === 'BROKEN') {
      flag = TYPE_BROKEN;
    }
    if (item) {
      let e = null;
      if (items.length > 0) e = items.find((i) => i.id === item.id);
      if (!e) {
        items.push({ id: item.id, type: flag });
      } else {
        e.type = flag;
      }
      l1.type = TYPE_LOVER_LEFT;
      l1.state = STATE_NORMAL;
      it.type = TYPE_LOVER_RIGHT;
      it.state = STATE_NORMAL;
    } else {
      let e = null, state = STATE_NORMAL;
      if (items.length > 0) e = items.find((i) => i.id === selectedSeat.id);
      if (!e) {
        items.push({ id: selectedSeat.id, type: flag });
      } else {
        e.type = flag;
      }
      it.type = flag;
      if (flag === TYPE_NORMAL || flag === TYPE_LOVER_LEFT || flag === TYPE_LOVER_RIGHT) {
        state = STATE_NORMAL;
      } else if (flag === TYPE_VIP) {
        state = STATE_VIP;
      } else if (flag === TYPE_BROKEN) {
        state = STATE_BROKEN;
      }
      it.state = state;
      if (flag === TYPE_LOVER_LEFT) {
        r1.type = TYPE_LOVER_RIGHT;
        r1.state = STATE_NORMAL;
      } else {
        if (l1 && l1.type === TYPE_LOVER_LEFT) {
          l1.type = TYPE_NORMAL;
          l1.state = STATE_NORMAL;
        } else if (r1 && r1.type === TYPE_LOVER_RIGHT) {
          r1.type = TYPE_NORMAL;
          r1.state = STATE_NORMAL;
        }
      }
    }
    setControls({
      ...controls,
      seatData: seatMap,
    });
    onUpdateSeatMap(items);
    onClose();
  };

  const handleChange = (event) => {
    setSeat({ ...seat, value: event.target.value });
  };

  React.useEffect(() => {
    convertSeatData(seats);
  }, [seats]);

  const convertSeatData = (seats) => {
    let seatList = [];
    seats.forEach((it) => {
      let seatData = {};
      let state = STATE_NORMAL;
      seatData.id = it.id;
      if (it.seatState === 0) {
        state = STATE_NORMAL;
      } else if (it.seatState === 1) {
        state = STATE_SOLD;
      } else if (it.seatState === 2) {
        state = STATE_VIP;
      } else if (it.seatState === -1) {
        state = STATE_BROKEN;
      }
      seatData.state = state;
      seatData.oldState = seatData.state;
      seatData.point = { x: it.graphRow, y: it.graphCol };
      if (it.seatType === 1) {
        seatData.type = it.isLoverL ? TYPE_LOVER_LEFT : TYPE_LOVER_RIGHT;
      } else if (it.seatType === 2) {
        seatData.type = TYPE_VIP;
      } else if (it.seatType === -1) {
        seatData.type = TYPE_BROKEN;
      } else {
        seatData.type = TYPE_NORMAL;
      }
      seatList.push(seatData);
    });
    setSeatData(seatList);
  };

  const performClickSeat = (seat) => {
    const row = seat.point.x;
    const col = seat.point.y;

    if (col > maxCol || col <= 0 || row > maxRow || row <= 0) {
      return;
    }

    const seatKey = `${row}-${col}`;
    const st = seatData.get(seatKey);
    if (!st) {
      return;
    }

    let type = 'NORMAL';
    if (st.type === TYPE_NORMAL) {
      type = 'NORMAL';
    } else if (st.type === TYPE_VIP) {
      type = 'V.I.P';
    } else if (st.type === TYPE_LOVER_LEFT || st.type === TYPE_LOVER_RIGHT) {
      type = 'LOVER';
    } else if (st.type === TYPE_BROKEN) {
      type = 'BROKEN';
    }

    handleClickListItem({
      value: type,
      selectedSeat: st,
    });
  };

  const setSeatData = (seats) => {
    const map = [];
    let mSeatNo;
    let rowMap = new Map(),
      mRow = maxRow,
      mCol = maxCol;
    const size = Utils.size(seats);
    for (let i = 0; i < size; i++) {
      const seat = seats[i];
      const seatKey = `${seat.point.x}-${seat.point.y}`;
      rowMap.set(seatKey, seat);
      mRow = Math.max(seat.point.x, mRow);
      mCol = Math.max(seat.point.y, mCol);

      const rowCount = map[seat.point.x] ? map[seat.point.x] : 0;
      map[seat.point.x] = rowCount + 1;
    }

    if (mRow > 0 && map.length > 0) {
      mSeatNo = new Array(mRow);
      let seatNo = 1;
      for (let i = 1; i <= mRow; i++) {
        const count = map[i] ? map[i] : 0;
        mSeatNo[i - 1] = count > 0 ? seatNo : '';
        if (count > 0) {
          seatNo++;
        }
      }
    }

    setControls({
      ...controls,
      seatData: rowMap,
      maxCol: mCol,
      maxRow: mRow,
      seatNo: mSeatNo,
    });
  };

  const drawSeat = (seat) => {
    let drawable = null;

    if (seat.state === STATE_NORMAL) {
      if (seat.type === TYPE_LOVER_LEFT) {
        drawable = seatDrawableLoverLeftNormal;
      } else if (seat.type === TYPE_LOVER_RIGHT) {
        drawable = seatDrawableLoverRightNormal;
      } else {
        drawable = seatDrawableNormal;
      }
    } else if (seat.state === STATE_VIP) {
      if (seat.type === TYPE_VIP) {
        drawable = seatDrawbleVip;
      } else {
        drawable = seatDrawableNormal;
      }
    } else if (seat.state === STATE_SELECTED) {
      if (seat.type === TYPE_LOVER_LEFT) {
        drawable = seatDrawableLoverLeftSelected;
      } else if (seat.type === TYPE_LOVER_RIGHT) {
        drawable = seatDrawableLoverRightSelected;
      } else {
        drawable = seatDrawableSelected;
      }
    } else if (seat.state === STATE_BROKEN) {
      drawable = seatDrawableBroken;
    }

    return drawable;
  };

  const canvasSeat = () => {
    if (seatData.size === 0) {
      return <></>;
    }

    let seatMap = [];

    for (let i = 1; i <= maxRow; i++) {
      let seatMapItem = [];
      for (let j = 1; j <= maxCol; j++) {
        const seatKey = `${i}-${j}`;
        const seat = seatData.get(seatKey);
        if (seat) {
          seatMapItem.push(
            <Avatar
              key={`${seat.id}-${seatKey}`}
              variant="square"
              className={classes.square}
              src={drawSeat(seat)}
              onClick={() => performClickSeat(seat)}
            />
          );
        } else {
          seatMapItem.push(
            <div
              key={`${seatKey}`}
              style={{
                backgroundColor: 'transparent',
                width: 25,
                height: 25,
              }}
            />
          );
        }
      }
      seatMap.push(
        <div key={`seat-map-${i}`} className={classes.root}>
          <Typography className={classes.text}>
            {seatNo[i - 1] &&
              String.fromCharCode(97 + seatNo[i - 1] - 1).toUpperCase()}
          </Typography>
          {seatMapItem}
        </div>
      );
    }
    return seatMap;
  };

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid container spacing={2}>
        <Grid item lg={12} xs={12} md={12} style={{ height: '100%' }}>
          <Box width={1}>
            <div className={classes.showScreen}>Screen</div>
          </Box>
          {seatData.size > 0 && canvasSeat()}
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <div className={classes.seatInfoContainer}>
              <div className={classes.seatInfo}>
                <Avatar
                  variant="square"
                  className={classes.seatInfoLabel}
                  src={seatDrawableNormal}
                />
                NORMAL Seat
              </div>
              <div className={classes.seatInfo}>
                <Avatar
                  variant="square"
                  className={classes.seatInfoLabel}
                  src={seatDrawbleVip}
                />
                V.I.P Seat
              </div>
              <div className={classes.seatInfo}>
                <Avatar
                  variant="square"
                  className={classes.seatInfoLabelLover}
                  src={seatDrawableLoverLeftNormal}
                />
                <Avatar
                  variant="square"
                  className={classes.seatInfoLabel}
                  src={seatDrawableLoverRightNormal}
                />
                COUPLE Seat
              </div>
              <div className={classes.seatInfo}>
                <Avatar
                  variant="square"
                  className={classes.seatInfoLabel}
                  src={seatDrawableBroken}
                />
                BROKEN Seat
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        onEntering={handleEntering}
        aria-labelledby="confirmation-dialog-title"
        open={open}
      >
        <DialogTitle id="confirmation-dialog-title">Seat Type</DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            ref={radioGroupRef}
            aria-label="ringtone"
            name="ringtone"
            value={seat.value}
            onChange={handleChange}
          >
            {options.map((option) => (
              <FormControlLabel
                value={option}
                key={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SeatView;
