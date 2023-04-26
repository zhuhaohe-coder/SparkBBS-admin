export default {
  sizeToStr: (size) => {
    let data = "";
    if (size < 0.1 * 1024) {
      data = size.toFixed(2) + "B";
    } else if (size < 0.1 * 1024 * 1024) {
      data = (size / 1024).toFixed(2) + "KB";
    } else if (size < 0.1 * 1024 * 1024 * 1024) {
      data = (size / (1024 * 1024)).toFixed(2) + "MB";
    } else {
      data = (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
    const len = data.indexOf(".");
    if (data.slice(len, len + 2) === "00") {
      data = data.replace("00", "");
    }
    return data;
  },
};
