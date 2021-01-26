export class Utils {
  static size(array) {
    if (!array) {
      return 0;
    }
    return array.length;
  }

  static isEmpty(array) {
    return array.length === 0;
  }

  static compare(x, y) {
    if (x === y) {
      return 0;
    }
    if (x > y) {
      return 1;
    }
    if (x < y) {
      return -1;
    }
  }

  static sqrt(x, y) {
    return Math.sqrt(x * x + y * y);
  }
}
