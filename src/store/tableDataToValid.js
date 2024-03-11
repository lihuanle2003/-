let idCardNumValid = (rule, value, callback) => {
    if (!value) {
      return callback(new Error("身份证号码不能为空"));
    }
    setTimeout(() => {
        // 判断数据是否为数字类型
      if (!Number.isInteger(Number(value.replace(/\s*/g,"")))) {
        console.log(typeof Number(value));
        callback(new Error("请输入数字值"));
      } else {
        if (value.replace(/\s*/g,"").length !== 18) {
          callback(new Error("身份证号码格式错误"));
        } else {
          callback();
        }
      }
    }, 500);
  };

export default {
    namespaced: "true",
    state: {
        // 审核管理页面 dialog弹框需要验证的数据
        applicationManageWithValid: {},
        // 个人数据表单验证配置对象
        userFormRules: {
            idCardNum: [
                {
                    validator: idCardNumValid, trigger: "blur", required: true
                },
            ],
            name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
            birth: [
                {
                    required: true,
                    message: "请选择日期",
                    trigger: "change",
                },
            ],
            sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
            phoneNum: [
                { required: true, message: "请输入电话号码", trigger: "blur" },
            ],
            addr: [{ required: true, message: "请输入地址", trigger: "blur" }],
            edu: [{ required: false }],
            household: [{ required: false }],
            residentialTelephone: [{ required: false }],
            maritalStatus: [{ required: false }],
        },
        // 工作职业表单验证对象
        userWorkRules: {
            corporation: [{ required: true, message: "请填写信息", trigger: "blur" }],
            job: [{ required: true, message: "请填写信息", trigger: "blur" }],
            corporationPhone: [
                { required: true, message: "请填写信息", trigger: "blur" },
            ],
            position: [{ required: false }],
            corporationEmail: [{ required: false }],
            corporationType: [{ required: false }],
            corporationAddr: [{ required: false }],
        },
    },
    mutations: {
        // 添加appmanange 组件 dialog需要验证的数据
        addValid(state, object = { userFormRules: state.userFormRules, userWorkRules: state.userWorkRules }) {
            for (let key in object) {
                for (let i in object[key]) {
                    object[key][i].map(item => {
                        // 需要验证的字段 即存在 require：true的字段
                        if (item.required) {
                            if (!state.applicationManageWithValid.i) {
                                if (i === "idCardNum") {
                                    state.applicationManageWithValid[i] = [
                                        { validator: idCardNumValid, trigger: "blur", required: true }
                                    ]
                                } else {
                                    state.applicationManageWithValid[i] = [
                                        { required: true, message: "请填写信息", trigger: "blur" },
                                    ]
                                }
                            } else {
                                return
                            }
                        }
                    })
                }
            }
        },
    }
}