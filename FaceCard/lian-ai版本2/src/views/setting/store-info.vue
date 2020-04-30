<template>
  <FullPage
    title="基本信息"
    class="base-info"
  >
    <div class="body">
      <Form
        ref="formValidate"
        :label-width="100"
        class="form"
      >
        <FormItem
          label="账号"
          prop="phone"
        >
          <div>{{phone}}</div>
        </FormItem>
        <FormItem
          label="店铺名称"
          prop="name"
        >
          <div>{{adminUserInfo.SiteName}}</div>
        </FormItem>
        <FormItem
          label="主营类目"
          prop="sex"
        >
          <div>{{adminUserInfo.ItemName}}</div>
        </FormItem>
        <FormItem>
          <Button
            @click="$router.push({path: '/createStore',query:{'SiteName': adminUserInfo.SiteName,'ItemName': adminUserInfo.ItemName}})"
            style="margin-top: 70px;height: 40px;width: 90px"
            size="large"
            long
          >
            <span>编辑资料</span>
          </Button>
        </FormItem>
      </Form>
    </div>
  </FullPage>
</template>

<script>
import FullPage from 'src/components/fullscreen-page'

export default {
  name: 'rechargeSetting',
  components: { FullPage },
  data() {
    return {
      phone: '',
      adminUserInfo: {},
    }

  },
  created() {
    this.phone = localStorage.getItem("currentUserNname");
    this.getAdminUser();
  },

  methods: {

    getAdminUser() {
      let url = "/User/GetAdminUser";
      this.axios.post(url)
        .then(res => {
          let { Data, Code, Message } = res.data;
          if (Code == 0) {
            this.adminUserInfo = Data.LoginUser;
          } else {
            this.$Message.error(Message)
          }
        }).catch(err => {
          console.log(err)
        })
    },

  },

}
</script>
<style lang="less">
.base-info {
  .ivu-form {
    .ivu-form-item {
      .ivu-form-item-label,
      .ivu-form-item-content {
        font-size: 16px !important;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.body {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .ivu-form {
    min-width: 300px;
    .ivu-form-item {
      margin-bottom: 0;
      .ivu-form-item-label {
        font-size: 20px !important;
      }
      .ivu-form-item-content {
        font-size: 20px;
      }
    }
  }
}
</style>
