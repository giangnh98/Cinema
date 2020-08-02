export const textTruncate = (text, length, ending) => {
   if (length == null) {
      length = 100;
   }
   if (ending == null) {
      ending = "...";
   }
   if (text.length > length) {
      return text.substring(0, length - ending.length) + ending;
   } else {
      return text;
   }
};

export const ToTitleCase = (str) => {
   return str
      .toLowerCase()
      .split(" ")
      .map(word => word.replace(word[0], word[0].toUpperCase()))
      .join(" ");
};

export const cloneArray2d = (val) => {
   let backup = new Array(val.length);
   for (let i = 0; i < val.length; i++) {
      backup[i] = new Array(val.length);
   }
   for (let i = 0; i < val.length; ++i) {
      for (let j = 0; j < val[0].length; ++j) {
         backup[i][j] = val[i][j];
      }
   }
   return backup;
};

export const cloneMatrix = (val) => {
   const width = val.length || 0;
   const height = val[0] instanceof Array ? val[0].length : 0;
   if (height === 0 || width === 0) {
      return [];
   }
   let i, j, temp = [];
   for (i = 0; i < width; ++i) {
      let item = [];
      for (j = 0; j < height; ++j) {
         item.push(val[i][j]);
      }
      temp.push(item);
   }
   return temp;
};

export const transpose = (array) => {
   const width = array.length || 0;
   const height = array[0] instanceof Array ? array[0].length : 0;
   if (height === 0 || width === 0) {
      return [];
   }
   let i, j, temp = [];
   for (i = 0; i < height; i++) {
      temp[i] = [];
      for (j = 0; j < width; j++) {
         temp[i][j] = parseInt(array[j][i].toString().trim());
      }
   }
   return temp;
};

export const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const regexPhone = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
export const regexUrl = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-.][a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;