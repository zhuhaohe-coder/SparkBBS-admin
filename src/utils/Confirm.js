import { ElMessageBox } from "element-plus";

const Confirm = (message, okFun) => {
  ElMessageBox.confirm(message, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(async () => {
      okFun();
    })
    .catch(() => {});
};

export default Confirm;
