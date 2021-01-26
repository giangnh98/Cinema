import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Typography, Box } from '@material-ui/core';
import {
  STATE_VIP,
  STATE_SOLD,
  STATE_SELECTED,
  STATE_NORMAL,
  TYPE_LOVER_LEFT,
  TYPE_LOVER_RIGHT,
  SeatSelectRegular,
  TYPE_NORMAL,
  TYPE_VIP,
} from './SeatSelectRegular';
import { Utils } from './Utils';

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

const SeatView = ({
  seats,
  seatsSold,
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
  seatMaxSelectedCount,
  onSelectSeatNotMatchRegular,
  onSelectedSeatOverMaxCount,
  onPickLoverSeatOverMaxCount,
  onSelectedSeatChanged,
  onSelectedSeatSold,
  lang,
}) => {
  const classes = useStyles();
  const [bestSeatFinder, setbestSeatFinder] = React.useState({
    mMaxRow: 0,
    mMaxCol: 0,
    mSeatArray: [],
    mSeats: [],
    mSoldSeats: [],
    mPoints: [],
    mIgnoreSeats: [],
  });
  const [controls, setControls] = React.useState({
    selectedSeats: [],
    soldSeats: [],
    seatData: new Map(),
    seatNo: [],
    isCheckRegularWhilePickSeat: false,
    isCheckRegularWhileRecommend: false,
    maxRow: 0,
    maxCol: 0,
  });

  const {
    selectedSeats,
    soldSeats,
    seatData,
    seatNo,
    isCheckRegularWhilePickSeat,
    isCheckRegularWhileRecommend,
    maxRow,
    maxCol,
  } = controls;

  React.useEffect(() => {
    convertSeatData(seats);
  }, [seats]);

  React.useEffect(() => {
    if (seatData) {
      convertSeatsSoldData(seatsSold);
    }
  }, [seatData, seatsSold]);

  const setSeats = (seats) => {
    let mSeats = [],
      mSeatArray = [],
      mPoints = [];
    let mMaxRow = 0,
      mMaxCol = 0;
    if (seats && seats.length > 0) {
      mSeats.push(...seats);
    }
    const size = Utils.size(mSeats);
    let maxCol = 0;
    let maxRow = 0;
    for (let i = 0; i < size; i++) {
      const seat = mSeats[i];
      if (seat.point.y > maxCol) {
        maxCol = seat.point.y;
      }
      if (seat.point.x > maxRow) {
        maxRow = seat.point.x;
      }
    }
    mMaxRow = maxRow;
    mMaxCol = maxCol;

    if (maxRow > 0 && maxCol > 0) {
      mSeatArray = new Array(maxRow + 1)
        .fill(-1)
        .map(() => new Array(maxCol + 1).fill(-1));
      mPoints = [];
      mSeats.forEach((seat) => {
        const row = seat.point.x;
        const col = seat.point.y;
        mSeatArray[row][col] = seat;
      });
      for (let row = 0; row < mSeatArray.length; row++) {
        for (let col = 0; col < mSeatArray[row].length; col++) {
          mPoints.push({ x: col, y: row });
        }
      }
      const centerX = maxCol / 2 + (maxCol % 2);
      const centerY = maxRow / 2 + (maxRow % 2);
      const point = { x: centerX, y: centerY };
      mPoints.sort(function (lhs, rhs) {
        const lx = Math.abs(point.x - lhs.x);
        const ly = Math.abs(point.y - lhs.y);
        const rx = Math.abs(point.x - rhs.x);
        const ry = Math.abs(point.y - rhs.y);

        let result = Utils.compare(Utils.sqrt(lx, ly), Utils.sqrt(rx, ry));
        if (result === 0) {
          const dX = lx - rx;
          const dY = ly - ry;

          if (dX < dY) {
            return -1;
          } else {
            if (dX === 0) {
              result = -Utils.compare(lhs.y, rhs.y);
              if (result !== 0) {
                return result;
              }
            }
            if (dY === 0) {
              result = -Utils.compare(lhs.x, rhs.x);
            }
          }
        }

        return result;
      });

      updateSeatArray();
    } else {
      mSeatArray = null;
    }
    setbestSeatFinder({
      ...bestSeatFinder,
      mMaxRow,
      mMaxCol,
      mPoints,
      mSeats,
      mSeatArray,
    });
  };

  const setSoldSeats = (seats) => {
    let mSoldSeats = [];
    if (!Utils.isEmpty(seats)) {
      mSoldSeats = [];
      mSoldSeats.push(...seats);
      if (!Utils.isEmpty(bestSeatFinder.mSeats)) {
        updateSeatArray();
      }
    }
    setbestSeatFinder({ ...bestSeatFinder, mSoldSeats });
  };

  const selectedRecommendSeat = (recommendCount) => {
    let bestSeat = [];
    if (bestSeatFinder.mSeatArray) {
      for (let i = 0; i < bestSeatFinder.mPoints.length; i++) {
        const point = bestSeatFinder.mPoints[i];
        const seat = bestSeatFinder.mSeatArray[point.y][point.x];
        if (!seat || seat.state === STATE_SOLD) {
          continue;
        }

        let col = point.x;
        if (recommendCount > 1) {
          col -= parseInt(recommendCount / 2);
          if (bestSeatFinder.mMaxCol % 2 === 0) {
            col += 1;
          }
          if (col < 0) {
            col = 0;
          }
        }
        for (let j = 0; j < recommendCount; j++) {
          const isGood = bestSeatFinder.mSeatArray[point.y][col + j];
          if (isGood) {
            bestSeat.push(isGood);
          }
        }
        const checkAvailable = checkSeatChooseAvailable(
          recommendCount,
          bestSeat
        );
        if (checkAvailable) {
          break;
        } else {
          bestSeat = [];
        }
      }
    }

    return bestSeat;
  };

  const addIgnoreSeats = (recommendCount, ignoreSeats) => {
    let mIgnoreSeats = bestSeatFinder.mIgnoreSeats;
    if (Utils.isEmpty(ignoreSeats)) {
      return;
    }

    let seats = mIgnoreSeats[recommendCount];
    if (!seats) {
      seats = [];
    }
    seats.push([].push(...ignoreSeats));
    mIgnoreSeats[recommendCount].push(...seats);
    setbestSeatFinder({ ...bestSeatFinder, mIgnoreSeats: mIgnoreSeats });
  };

  const checkSeatChooseAvailable = (recommendCount, selectedSeat) => {
    if (Utils.size(selectedSeat) === recommendCount) {
      let available = true;
      let hasLover = false;
      selectedSeat.every(function (seat, index) {
        if (seat.type === TYPE_LOVER_LEFT || seat.type === TYPE_LOVER_RIGHT) {
          hasLover = true;
        }
        if (seat.state === STATE_SOLD) {
          available = false;
          return false;
        } else {
          return true;
        }
      });

      if (hasLover) {
        if (recommendCount % 2 !== 0) {
          available = false;
        } else {
          if (!(selectedSeat[0].type === TYPE_LOVER_LEFT)) {
            available = false;
          }
        }
      }

      if (
        bestSeatFinder.mIgnoreSeats.length > 0 &&
        !Utils.isEmpty(bestSeatFinder.mIgnoreSeats[recommendCount])
      ) {
        const ignoreSeats = bestSeatFinder.mIgnoreSeats[recommendCount];
        ignoreSeats.every(function (seats, index) {
          if (selectedSeat === seats) {
            available = false;
            return false;
          } else {
            return true;
          }
        });
      }

      return available;
    }

    return false;
  };

  const updateSeatArray = () => {
    if (
      bestSeatFinder.mSeatArray &&
      !Utils.isEmpty(bestSeatFinder.mSoldSeats)
    ) {
      let mSeatArray = bestSeatFinder.mSeatArray;
      bestSeatFinder.mSoldSeats.forEach((soldSeat) => {
        const row = soldSeat.point.x;
        const col = soldSeat.point.y;
        if (row <= bestSeatFinder.mMaxRow && col <= bestSeatFinder.mMaxCol) {
          mSeatArray[row][col] = soldSeat;
        }
      });
      setbestSeatFinder({ ...bestSeatFinder, mSeatArray });
    }
  };

  const isSeatEmpty = () => {
    return !seatData || seatData.size <= 0;
  };

  const selectRecommendSeats = (recommendCount) => {
    const seats = selectedRecommendSeat(recommendCount);
    if (!Utils.isEmpty(seats)) {
      if (!Utils.isEmpty(selectedSeats)) {
        selectedSeats.forEach((seat) => {
          if (seat.state === STATE_SOLD) {
            seat.state = seat.oldState;
          }
        });
        seats.forEach((seat) => {
          if (seat.state === STATE_NORMAL || seat.state === STATE_VIP) {
            seat.state = STATE_SELECTED;
            seat.seatNo = seatNo[seat.point.x - 1];
          }
        });

        clearSelectedSeats();
        selectedSeats.push(...seats);

        if (
          isCheckRegularWhileRecommend &&
          checkRecommendSeatRegular(recommendCount)
        ) {
          setControls({ ...controls, selectedSeats });
          onSelectedSeatChanged(selectedSeats);
        }
      }
    }
    return seats;
  };

  const checkRecommendSeatRegular = (recommendCount) => {
    if (!isSelectedSeatLegal()) {
      addIgnoreSeats(recommendCount, selectedSeats);
      selectRecommendSeats(recommendCount);
      return false;
    }
    return true;
  };

  const setSoldData = (seats) => {
    const mSoldSeats = [];
    if (Utils.isEmpty(seats) || isSeatEmpty()) {
      return;
    }

    mSoldSeats.push(...seats);
    setSoldSeats(seats);

    if (!Utils.isEmpty(selectedSeats)) {
      let needUpdateSelected = false;
      selectedSeats.forEach((seat) => {
        const seatKey = `${seat.point.x}-${seat.point.y}`;
        const data = seatData.get(seatKey);
        if (data && data.state === STATE_SOLD) {
          needUpdateSelected = true;
        }
      });

      if (needUpdateSelected) {
        selectedSeats.forEach((seat) => {
          const seatKey = `${seat.point.x}-${seat.point.y}`;
          const data = seatData.get(seatKey);
          if (data) {
            if (data.state === STATE_SELECTED) {
              data.state = data.oldState;
            }
          }
        });

        clearSelectedSeats();
        onSelectedSeatChanged(selectedSeats);
        onSelectedSeatSold();
      }
    }

    updateSoldSeat(mSoldSeats);
    setControls({ ...controls, soldSeats: mSoldSeats });
  };

  const updateSoldSeat = (seats) => {
    if (isSeatEmpty() || Utils.isEmpty(seats)) {
      return;
    }

    seats.forEach((soldSeat) => {
      seatData.set(`${soldSeat.point.x}-${soldSeat.point.y}`, soldSeat);
    });

    setControls({ ...controls, seatData });
  };

  const clearSelectedSeats = () => {
    setControls({ ...controls, selectedSeats: [] });
  };

  const convertSeatData = (seats) => {
    let seatList = [];
    seats.forEach((it) => {
      let seatData = {};
      seatData.id = it.id;
      seatData.state =
        it.seatState === 0
          ? STATE_NORMAL
          : it.seatState === 1
          ? STATE_SOLD
          : STATE_VIP;
      seatData.oldState = seatData.state;
      seatData.point = { x: it.graphRow, y: it.graphCol };
      if (it.seatType === 1) {
        seatData.type = it.isLoverL ? TYPE_LOVER_LEFT : TYPE_LOVER_RIGHT;
      } else if (it.seatType === 2) {
        seatData.type = TYPE_VIP;
      } else {
        seatData.type = TYPE_NORMAL;
      }
      seatList.push(seatData);
    });
    setSeatData(seatList);
  };

  const convertSeatsSoldData = (seats) => {
    if (!seats && Utils.isEmpty(seats)) {
      return;
    }

    let seatList = [];
    seats.forEach((it) => {
      let seatData = {};
      seatData.id = it._id;
      seatData.state =
        it.seatState === 0
          ? STATE_NORMAL
          : it.seatState === 1
          ? STATE_SOLD
          : STATE_VIP;
      seatData.oldState = seatData.state;
      seatData.point = { x: it.graphRow, y: it.graphCol };
      if (it.seatType === 1) {
        seatData.type = it.isLoverL ? TYPE_LOVER_LEFT : TYPE_LOVER_RIGHT;
      } else if (it.seatType === 2) {
        seatData.type = TYPE_VIP;
      } else {
        seatData.type = TYPE_NORMAL;
      }
      seatList.push(seatData);
    });
    setSoldData(seatList);
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

    let isMatchRegular = true;
    if (seat.state === STATE_SELECTED) {
      seat.state = seat.oldState;
      remove(selectedSeats, seat);

      if (isLoverSeat(seat)) {
        unSelectLoverSeat(seat);
      }
      isMatchRegular = checkSeatRegular(seat, false);
    } else if (seat.state === STATE_NORMAL || seat.state === STATE_VIP) {
      const selectedCount = Utils.size(selectedSeats);
      if (selectedCount >= seatMaxSelectedCount) {
        onSelectedSeatOverMaxCount(seatMaxSelectedCount);
        return;
      }

      if (seat.state === STATE_NORMAL || seat.state === STATE_VIP) {
        seat.state = STATE_SELECTED;
        seat.seatNo = seatNo[seat.point.x - 1];
      }
      selectedSeats.push(seat);

      if (isLoverSeat(seat)) {
        isMatchRegular = selectLoverSeat(seat);
      } else {
        isMatchRegular = checkSeatRegular(seat, true);
      }
    }

    if (isMatchRegular) {
      onSelectedSeatChanged(selectedSeats);
    }
    setControls({ ...controls, selectedSeats: selectedSeats });
  };

  const isLoverSeat = (seat) => {
    return seat.type === TYPE_LOVER_LEFT || seat.type === TYPE_LOVER_RIGHT;
  };

  const isSelectedSeatLegal = () => {
    return SeatSelectRegular.isSelectedSeatLegal(
      selectedSeats,
      seatData,
      maxCol
    );
  };

  const checkSeatRegular = (seat, selectSeat) => {
    if (isCheckRegularWhilePickSeat) {
      if (!isSelectedSeatLegal()) {
        if (selectSeat) {
          if (seat.state === STATE_SELECTED) {
            seat.state = seat.oldState;
          }
          remove(selectedSeats, seat);
        } else {
          if (seat.state === STATE_NORMAL || seat.state === STATE_VIP) {
            seat.state = STATE_SELECTED;
            seat.seatNo = seatNo[seat.point.x - 1];
          }
          selectedSeats.push(seat);
        }
        onSelectSeatNotMatchRegular();
        return false;
      }
    }
    setControls({ ...controls, selectedSeats });
    return true;
  };

  const remove = (selectedSeats, seat) => {
    const index = selectedSeats.indexOf(seat);
    if (index > -1) {
      selectedSeats.splice(index, 1);
    }
    setControls({ ...controls, selectedSeats });
  };

  const selectLoverSeat = (seat) => {
    const seatRow = seat.point.x;
    const seatCol = seat.point.y + (seat.type === TYPE_LOVER_LEFT ? 1 : -1);
    const other = seatData.get(`${seatRow}-${seatCol}`);

    if (Utils.size(selectedSeats) >= seatMaxSelectedCount) {
      if (seat.state === STATE_SELECTED) {
        seat.state = seat.oldState;
      }
      remove(selectedSeats, seat);
      onPickLoverSeatOverMaxCount(seatMaxSelectedCount);
      return false;
    } else if (other && (other.state === STATE_NORMAL || other.state === STATE_VIP)) {
      other.state = STATE_SELECTED;
      other.seatNo = seatNo[other.point.x - 1];
      selectedSeats.push(other);

      if (checkSeatRegular(seat, true)) {
        return true;
      } else {
        if (other.state === STATE_SELECTED) {
          other.state = other.oldState;
        }
        remove(selectedSeats, other);
      }
    }
    setControls({ ...controls, selectedSeats });
    return false;
  };

  const unSelectLoverSeat = (seat) => {
    const graphRow = seat.point.x;
    const graphCol = seat.point.y + (seat.type === TYPE_LOVER_LEFT ? 1 : -1);

    const loverOther = seatData.get(`${graphRow}-${graphCol}`);
    if (loverOther && loverOther.state === STATE_SELECTED) {
      loverOther.state = loverOther.oldState;
      remove(selectedSeats, loverOther);
    }

    setControls({ ...controls, selectedSeats });
  };

  const setSelectedData = (seats) => {
    let seatData = [...selectedSeats];
    seatData.forEach((it) => {
      if (it.state === STATE_SELECTED) {
        it.state = it.oldState;
      }
    });
    seatData = [];
    seatData = [...seats];
    seatData.forEach((it) => {
      if (it.state === STATE_NORMAL || it.state === STATE_VIP) {
        it.state = STATE_SELECTED;
        it.seatNo = seatNo[it.point.x - 1];
      }
    });
    onSelectedSeatChanged(seatData);
    setControls({ ...controls, selectedSeats: seatData });
  };

  const setSeatData = (seats) => {
    const map = [];
    let mSeatNo;
    setSeats(seats);
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
    } else {
      if (seat.type === TYPE_LOVER_LEFT) {
        drawable = seatDrawableLoverLeftSold;
      } else if (seat.type === TYPE_LOVER_RIGHT) {
        drawable = seatDrawableLoverRightSold;
      } else {
        drawable = seatDrawableSold;
      }
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
                  src={seatDrawableSelected}
                />
                Selected Seat
              </div>
              <div className={classes.seatInfo}>
                <Avatar
                  variant="square"
                  className={classes.seatInfoLabelLover}
                  src={seatDrawableLoverLeftSelected}
                />
                <Avatar
                  variant="square"
                  className={classes.seatInfoLabel}
                  src={seatDrawableLoverRightSelected}
                />
                COUPLE Selected Seat
              </div>
              <div className={classes.seatInfo}>
                <Avatar
                  variant="square"
                  className={classes.seatInfoLabel}
                  src={seatDrawableSold}
                />
                Sold Seat
              </div>
            </div>
          </Grid>
          {/* <Typography
            variant="h5"
            component="h5"
            style={{
              marginTop: 20,
              width: '100%',
              textAlign: 'center',
            }}
          >
            Recommendation Seats
          </Typography> */}
          {/* <Grid
            item
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ width: '100%', marginTop: 20 }}
          >
            <Button
              variant="outlined"
              onClick={() => setSelectedData(selectRecommendSeats(1))}
            >
              1 Seats
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSelectedData(selectRecommendSeats(2))}
            >
              2 Seats
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSelectedData(selectRecommendSeats(3))}
            >
              3 Seats
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSelectedData(selectRecommendSeats(4))}
            >
              4 Seats
            </Button>
          </Grid> */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SeatView;
