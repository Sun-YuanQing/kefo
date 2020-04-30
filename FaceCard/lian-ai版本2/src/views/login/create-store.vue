<template>
  <div class="create-store">
    <Header :title="flag == '1' ? '创建店铺' : '修改店铺'"></Header>
    <div class="container">
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="80"
        class="form"
      >
        <FormItem label="店铺名称">
          <Input
            v-model="formValidate.SiteName"
            :maxlength="16"
            @keydown.enter.native.prevent="searchHandle"
          ></Input>
        </FormItem>
        <FormItem
          label="主营类目"
          prop="ItemName"
        >
          <Select v-model="formValidate.ItemName">
            <Option value="餐饮">餐饮</Option>
            <Option value="生活服务">生活服务</Option>
            <Option value="美容美发">美容美发</Option>
            <Option value="健身房">健身房</Option>
            <Option value="学习机构">学习机构</Option>
            <Option value="超市">超市</Option>
            <Option value="其他">其他</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button
            @click="handleSubmit('formValidate')"
            style="margin-top: 10px;"
            type="primary"
            size="large"
            long
            :loading="submitting"
          >
            <span class="login-word">{{flag=='1' ? '创建' : '修改'}}</span>
          </Button>
        </FormItem>
      </Form>

    </div>
  </div>
</template>
<script>
import Header from '@/components/route-header'
export default {
  components: { Header },
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入店铺名称'));
      } else {
        callback();
      }
    };
    const validateTpye = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择主营类目'));
      } else {
        callback();
      }
    };
    return {
      submitting: false,
      flag: "1", //1创建 2修改
      formValidate: {
        ItemName: '',
        SiteName: '',
      },
      ruleValidate: {
        SiteName: [
          { validator: validateName, trigger: 'blur' }
        ],
        ItemName: [
          { validator: validateTpye, trigger: 'change' }
        ],
      }
    }
  },
  created() {
    let data = this.$route.query.SiteName;
    if (data) {
      this.formValidate = this.$route.query;
      this.flag = "2";
    } else {
      this.flag = "1";
    }

  },
  methods: {
    searchHandle(e) {
      if (e.keyCode == 13) {
        return false;
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.flag == '1') {
            this.addStore();
          } else {
            this.updateStore();
          }

        } else {
          // this.$Message.error('Fail!');
        }
      })
    },

    //创建
    addStore() {
      this.submitting = true;
      let url = "/Site/AddSite";
      this.axios.post(url, this.formValidate)
        .then(res => {
          let { Data, Code, Message } = res.data;
          this.submitting = false;
          if (Code == 0) {
            this.$Message.success("创建成功")
            this.$router.push('/selectStore')
            // this.sites = Data.sites;
          } else {
            this.$Message.error(Message)
          }
        }).catch(err => {
          this.submitting = fasle;
          console.log(err)
        })
    },

    //修改
    updateStore() {
      this.submitting = true;
      let url = "/User/UpdateSiteBase";
      this.axios.post(url, this.formValidate, {
        headers: {
          'access-token': window.localStorage.getItem('token')
        }
      }).then(res => {
        let { Data, Code, Message } = res.data;
        this.submitting = false;
        if (Code == 0) {
          this.$Message.success("修改成功")
          this.$router.back()
          console.log(this.formValidate)
          localStorage.setItem('siteName', this.formValidate.SiteName)
        } else {
          this.$Message.error(Message)
        }
      }).catch(err => {
        this.submitting = fasle;
        console.log(err)
      })
    },



  },


}
</script>
<style lang="less">
.ivu-select-single .ivu-select-selection {
  width: 230px;
}
</style>
<style lang="less" scoped>
.create-store {
  width: 100%;
  height: 100%;
  position: relative;
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100% - 44px);
    overflow: auto;
    box-sizing: border-box;
    .form {
      display: flex;
      flex-direction: column;
      .ivu-input-wrapper {
        width: 230px;
      }
    }
    .ivu-btn {
      width: 230px;
      height: 40px;
    }
  }
}
</style>
