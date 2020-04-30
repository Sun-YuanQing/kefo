<template>
  <div class="fullscreen">
    <Header :title="Object.keys(postData).includes('_index') ? '修改' : '添加'"></Header>
    <div class="content">
      <Card style="margin-bottom: 20px;">
        <div slot="title" class="align-center">
          <img src="@/assets/会员消费折扣.svg" alt="" style="margin-right: 6px;">
          <h4>会员消费折扣</h4>
        </div>
        <div class="card-body">
          会员消费折扣
          <InputNumber :min="0.01" :max="9.99" v-model="postData.Discount" class="text-align-center input"></InputNumber>
          折
          <span style="color: #999; font-size: 18px;">（输入数字，例如：输入数字9，则为9折）</span>
        </div>
      </Card>
      <Button @click="handleSave" :loading="loading" class="save" type="primary">保存</Button>
    </div>
  </div>
</template>

<script>
  import Header from 'src/components/route-header'
  import { formatDate } from 'src/utils'

  export default {
    name: 'member-discount-setting-add',
    components: { Header },
    data() {
      return {
        loading: false,
        postData: {
          "Discount": 9,
          "Flag": false
        }
      }
    },
    created() {
      this.postData = this.$route.query.data || {
        "Discount": 9,
        "Flag": false
      }
    },
    methods: {
      handleSave() {
        this.loading = true;
        const url = '/Discount/EditDiscount'
        this.$axios.post(url, this.postData).then(res => {
          this.loading = false;
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.$Message.success('操作成功')
            this.$router.back()
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          this.loading = false;
          throw new Error(e)
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .content {
    padding: 20px 28px;
    // display: flex;
    // flex-direction: column;
  }

  .card-body {
    padding: 30px 0;
    font-size: 18px;

    .input {
      width: 180px;
      height: 50px;
      font-size: 18px;
      line-height: 50px;
      margin: 0 6px;
    }
  }

  .save {
    display: block;
    width: 200px;
    height: 50px;
    margin: 40px auto 0;
    // align-self: center;
  }
</style>
