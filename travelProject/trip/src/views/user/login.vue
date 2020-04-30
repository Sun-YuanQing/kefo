<template>
  <div
    class="login"
    ref="login"
  >
    <div class="form-container">
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="0"
        class="form"
      >
        <FormItem
          label=""
          prop="LoginName"
        >
          <Input
            v-model="formValidate.LoginName"
            ref="LoginName"
            :maxlength="11"
            @on-keydown.enter="handleSubmit('formValidate')"
            placeholder="手机号"
          >
          <img
            src="@/assets/phone-icon.svg"
            alt=""
            slot="prefix"
          >
          </Input>
        </FormItem>
        <FormItem
          label=""
          prop="PassWord"
        >
          <Input
            v-model="formValidate.PassWord"
            type="password"
            @on-keydown.enter="handleSubmit('formValidate')"
            placeholder="密码"
          >
          <img
            src="@/assets/secret-icon.svg"
            alt=""
            slot="prefix"
          >
          </Input>
        </FormItem>
        <Checkbox
          class="check"
          v-model="single"
        >记住登录信息</Checkbox>
        <FormItem class="btn">
          <Button
            @click="handleSubmit('formValidate')"
            style="margin-top: 10px;"
            type="primary"
            size="large"
            long
            :loading="submitting"
          >
            <span class="login-word">登录</span>
          </Button>
        </FormItem>
      </Form>

      <div class="link">
        <router-link
          to="/forget"
          style="color: #ccc;"
        >忘记密码?</router-link>
        <router-link
          to="/register"
          style="color: #333;"
        >免费注册</router-link>
      </div>
      <div class="info_text">
        <img src="@/assets/info.svg" />
        <span>温馨提示：如已注册过，请直接登录查看注册</span>
      </div>
    </div>

  </div>
</template>

<script>
import { validatePhone, validatePwd } from '@/utils/validate'
import { setToken, setStoreType, removeToken, getLoginName, setLoginName, removeLoginName, setPhysical } from '@/utils/auth'
import { login } from '@/api/user.js'
export default {
  name: 'login',
  data() {
    return {
      submitting: false,
      getCodeFlag: true,  //获取验证码，true需要获取，false已经获取
      time: 60,
      formValidate: {
        "LoginName": '',
        "PassWord": '',
      },
      ruleValidate: {
        LoginName: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        PassWord: [
          { validator: validatePwd, trigger: 'blur' },
          { type: 'string', min: 4, message: '密码至少4位', trigger: 'blur' }
        ]
      },
      single: true
    };
  },
  beforeCreate() {
    removeToken();
  },
  created() {
    this.formValidate.LoginName = getLoginName();
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.doLogin();
        } else {
          // this.$Message.error('Fail!');
        }
      })
    },
    doLogin() {
      this.submitting = true;
      login(this.formValidate).then(res => {
        this.submitting = false;
        if (this.single) {
          setLoginName(this.formValidate.LoginName);
        } else {
          removeLoginName();
        }
        this.$Message.success('登录成功')
        setToken(res.Data.Token);
        setPhysical(res.Data.IsHealthySite)
        setStoreType(res.Data.SiteType)
        if (res.Data.SiteType == 2 && res.Data.SiteState != 1) {
          this.$router.push({ path: '/process', query: { step: 3, SiteState: res.Data.SiteState } })
        }
        else {
          this.$router.push('/goods')
        }
      }).catch(err => {
        this.submitting = false;
      })
    },

  }
};
</script>
<style lang="less">
.login {
  .ivu-input {
    padding-left: 34px;
  }
  .ivu-input-prefix {
    position: absolute;
    top: 7px;
    left: 3px;
  }
  .btn.ivu-form-item {
    margin-bottom: 0;
  }
  .check {
    font-size: 14px;
    color: #333;
    .ivu-checkbox {
      margin-right: 15px;
    }
  }
}
</style>

<style scoped lang="less">
.login {
  display: flex;
  overflow: auto;
  color: #1b1b1b;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
}

.agreement {
  align-self: center;
  color: #999;
  margin-top: 10px;
  font-size: 13px;
  a {
    color: #333;
  }
}
.info_text {
  color: #0899ac;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
  span {
    margin-left: 6px;
  }
}

.form-container {
  display: flex;
  flex-direction: column;
  > img {
    padding-bottom: 50px;
  }
  form {
    width: 100%;
    .ivu-input-wrapper {
      width: 320px;
    }
  }
  .link {
    width: 100%;
    margin: 12px 0 0;
    a {
      display: inline-block;
      width: 50%;
      text-align: center;
      font-size: 14px;
      position: relative;
      &:nth-of-type(1)::before {
        content: "";
        width: 1px;
        height: 16px;
        background: #ccc;
        position: absolute;
        right: 0;
        top: 3px;
      }
    }
  }

  .ivu-btn {
    height: 40px;
  }
}
</style>
