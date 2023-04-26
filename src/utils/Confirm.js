import { ElMessageBox } from "element-plus";

const Confirm = (message, okFun) => {
  ElMessageBox.confirm(message, "提示", {
    "confirm-button-text": "确定",
    "cancel-button-class": "取消",
    type: "info",
  })
    .then(async () => {
      okFun();
    })
    .catch(() => {});
};

export default Confirm;
