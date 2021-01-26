export const STATE_NORMAL = 0;
export const STATE_SELECTED = 2;
export const STATE_VIP = 3;
export const STATE_SOLD = 1;
export const STATE_BROKEN = -1;
export const TYPE_NORMAL = 0;
export const TYPE_VIP = 3;
export const TYPE_LOVER_LEFT = 1;
export const TYPE_LOVER_RIGHT = 2;
export const TYPE_BROKEN = -1;
export const seatMaxSelectedCount = 5;

export class SeatSelectRegular {
  static isSelectedSeatLegal(selectedSeat, seats, maxCol) {
    if (!seats || seats.length === 0) {
      return true;
    }
    if (selectedSeat.length === 0) {
      return true;
    }
    if (maxCol <= 0) {
      return true;
    }
  
    let rowMap = [];
    selectedSeat.forEach((seat) => {
      const row = seat.point.x;
      if (!rowMap[row]) {
        const rows = new Array(maxCol);
        for (let i = 0; i < maxCol; i++) {
          rows[i] = this.getSeatStateByKey(row, i, seats);
        }
        rowMap[row] = rows;
      }
    });
    const keys = Object.keys(rowMap);
    for (let i = 0; i < rowMap.length; i++) {
      const row = keys[i];
      if (!this.checkSeatRowAvailable(row, maxCol, seats)) {
        return false;
      }
    }
    return true;
  }
  
  static checkSeatRowAvailable(row, maxCol, seats) {
    let l1, l2, r1, r2;
    for (let s = 0; s < maxCol; s++) {
      if (this.getSeatStateByKey(row, s, seats) !== STATE_SELECTED) {
        continue;
      }
  
      let i;
      for (i = s + 1; i < maxCol; i++) {
        if (this.getSeatStateByKey(row, i, seats) !== STATE_SELECTED) {
          break;
        }
      }
      l1 = this.getSeatStateByKey(row, s - 1, seats);
      l2 = this.getSeatStateByKey(row, s - 2, seats);
      r1 = this.getSeatStateByKey(row, i, seats);
      r2 = this.getSeatStateByKey(row, i + 1, seats);
  
      if (l1 === STATE_SOLD || r1 === STATE_SOLD) {
        if (l2 === STATE_SELECTED && l1 === STATE_SOLD) {
          return false;
        }
        if (r2 === STATE_SELECTED && r1 !== STATE_SOLD) {
          return false;
        }
      } else {
        if (l2 !== STATE_NORMAL || r2 !== STATE_NORMAL) {
          return false;
        }
      }
      s = i;
    }
    return true;
  }
  
  static getSeatStateByKey(row, col, seats) {
    const seat = seats.get(`${row}-${col}`);
    return !seat ? STATE_SOLD : seat.state;
  }
}
