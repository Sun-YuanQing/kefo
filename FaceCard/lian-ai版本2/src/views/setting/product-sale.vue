<template>
  <div class="projectClass">
    <Header title="产品销售方式"></Header>
    <div class="whiteBack">
      <div class="neiBack">
        <div class="title">产品销售方式</div>
        <div class="subhead">点击+可新增产品销售方式，点击已添加的产品销售方式可再次编辑，点击右上角的“x”可删除产品销售方式。</div>
        <div class="line_all">
          <div
            v-for="(item,index) in SaleWays"
            class="line_item"
            @click="add_Edit(item)"
          >
            <div>{{item.Name}}</div>
            <img
              v-if="SaleWays.length>1"
              class="delImg"
              src="@/assets/delete.svg"
              @click.stop="toDel(item.Id)"
            />
          </div>
          <div
            class="line_item"
            @click="add_Edit"
          >+</div>
        </div>
      </div>
    </div>
    <Modal v-model="showModal">
      <div
        slot="header"
        class="modal_title"
      >{{showData.Id ? '编辑' : "添加"}}</div>
      <div class="line_modal">
        <div class="modal_lable">名称</div>
        <Input
          class="modal_input"
          v-model="value"
          :maxlength="15"
        />
      </div>
      <div
        slot="footer"
        style="text-align:center"
      >
        <Button
          type="primary"
          class="modal_foot"
          @click="isOk"
        >保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Header from 'src/components/route-header'
export default {
  components: { Header },
  data() {
    return {
      value: "",
      SaleWays: [],
      showModal: false,
      showData:{}
    }
  },
  created() {
    this.iniData();
  },
  methods: {
    iniData() {
      this.axios.post('/Lable/GetSaleWaysBySiteId')
        .then(res => {
          if (res.data.Code == 0) {
            this.SaleWays = res.data.Data.SaleWays
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    add_Edit(item) {
      this.showModal = true;
      this.showData = item;
      this.value = item.Name ? item.Name : '';
    },
    isOk() {
      var that = this;
      if (!that.value) {
        that.$Message.error('名称不能为空！');
        return false;
      }
      let allData = {};
      if (that.showData.Id) {
        allData = {
          id: that.showData.Id,
          name: that.value
        }
      } else {
        allData = { name: that.value }
      }
      that.axios.post('/Lable/EditSaleWay', allData)
        .then(res => {
          if (res.data.Code == 0) {
            if (that.showData.Id) {
              that.$Message.success('修改成功');
            } else {
              that.$Message.success('添加成功');
            }
            that.showModal = false;
            that.SaleWays = [];
            that.iniData();
          } else {
            that.$Message.error(res.data.Message);
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    toDel(e) {
      this.$Modal.confirm({
        title: '请确认是否删除',
        onOk: () => {
          this.$axios.post('/Lable/DelSaleWayById', { Id: e })
            .then(res => {
              if (res.data.Code === '0') {
                this.$Message.success('删除成功');
                this.SaleWays = [];
                this.iniData();
              } else {
                this.$Message.error(res.data.Message);
              }
            })
            .catch(err => {
              throw new Error(err)
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.projectClass {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background: #f7f8fa;
  .whiteBack {
    width: calc(100% - 24px);
    margin: 12px 12px 0;
    .neiBack {
      background: #ffffff;
      width: 100%;
      box-sizing: border-box;
      padding: 20px;
      .title {
        font-size: 16px;
        font-weight: 700;
        color: #333333;
        line-height: 22px;
      }
      .subhead {
        font-size: 13px;
        color: #999999;
        line-height: 21px;
        margin-top: 5px;
      }
      .line_all {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding-bottom: 40px;
        padding-top: 20px;
        .line_item {
          border: 1px solid #e4e4e4;
          width: 160px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-radius: 4px;
          font-size: 16px;
          color: #333333;
          font-weight: 500;
          margin-top: 20px;
          margin-right: 20px;
          cursor: pointer;
          position: relative;
          .delImg {
            position: absolute;
            top: -9px;
            right: -9px;
            width: 18px;
            height: 18px;
          }
        }
        @media screen and (max-width: 767px) {
          .line_item {
            width: calc(25% - 15px);
            &:nth-child(4n) {
              margin-right: 0;
            }
          }
        }
        @media screen and (max-width: 576px) {
          .line_item {
            width: calc(50% - 10px);
            &:nth-child(2n) {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
.modal_title {
  text-align: center;
  color: #333333;
  font-size: 18px;
}
.line_modal {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  .modal_lable {
    color: #333333;
    font-size: 18px;
    padding-right: 10px;
  }
  .modal_input {
    font-size: 16px;
  }
}
.modal_foot {
  width: 200px;
  height: 40px;
  margin-top: 20px;
}
</style>
