const regs = {
  email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  //包含字母和数字, 最少8位
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,18}$/,
  number: /^([0]|[1-9][0-9]*)$/,
};

const verity = (rule, value, reg, callback) => {
  if (value) {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error(rule.message));
    }
  } else {
    callback();
  }
};

export default {
  email: (rule, value, callback) => {
    return verity(rule, value, regs.email, callback);
  },
  password: (rule, value, callback) => {
    return verity(rule, value, regs.password, callback);
  },
  number: (rule, value, callback) => {
    return verity(rule, value, regs.number, callback);
  },
};
