<template>
  <div class="staffposition">
    <Header title="员工职位设置"></Header>
    <div class="whiteBack">
      <div class="neiBack">
        <div class="title">职称设置</div>
        <div class="subhead">点击“+”可新增职称，点击已添加的职称可再次编辑，点击右上角的“x”可删除职称。</div>
        <div class="line_all">
          <div
            v-for="(item,index) in Position"
            class="line_item"
            @click="addExit(0,item)"
          >
            <div class="noExceed">{{item.Name}}</div>
            <img
              v-if="Position.length>1"
              class="delImg"
              src="@/assets/delete.svg"
              @click.stop="toDel(0,item.Id)"
            />
          </div>
          <div
            class="line_item"
            @click="addExit(0)"
          >+</div>
        </div>
      </div>
    </div>
    <div class="whiteBack">
      <div class="neiBack">
        <div class="title">工种设置</div>
        <div class="subhead">点击“+”可新增职位，点击已添加的职位可再次编辑，点击右上角的“x”可删除职位。</div>
        <div class="line_all">
          <div
            v-for="(item,index) in Profession"
            class="line_item"
            @click="addExit(1,item)"
          >
            <div class="noExceed">{{item.Name}}</div>
            <img
              v-if="Profession.length>1"
              class="delImg"
              src="@/assets/delete.svg"
              @click.stop="toDel(1,item.Id)"
            />
          </div>
          <div
            class="line_item"
            @click="addExit(1)"
          >+</div>
        </div>
      </div>
    </div>
    <Modal v-model="showSave">
      <div
        slot="header"
        class="modal_title"
      >{{editId ? '编辑' : '添加'}}</div>
      <div class="line_modal">
        <div class="modal_lable">名称</div>
        <Input
          class="modal_input"
          v-model="allName"
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
          @click="addtrue"
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
      Position: [],
      Profession: [],
      showSave: false,
      dispose: 0,
      allName: "",
      editId: "" //有id为编辑 无为添加
    }
  },
  created() {
    this.getPosition();
    this.getProfession();
  },
  methods: {
    getPosition() {
      let that = this;
      that.axios.post('/Lable/GetPositionsBySiteId')
        .then(res => {
          if (res.data.Code == 0) {
            that.Position = res.data.Data.Position;
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    getProfession() {
      let that = this;
      that.axios.post('/Lable/GetProfessionsBySiteId')
        .then(res => {
          if (res.data.Code == 0) {
            that.Profession = res.data.Data.Position;
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    addExit(type, item) {
      let that = this;
      if (item) {
        that.allName = item.Name;
        that.editId = item.Id;
      } else {
        that.allName = "";
        that.editId = "";
      }
      that.dispose = type; // 0 -职称   1  -工种
      that.showSave = true;
    },
    addtrue() {
      if (!this.allName) {
        this.$Message.error('名称不能为空！');
        return false;
      } else {
        this.positionTitle();
      }

    },
    positionTitle() {
      let that = this;
      let url = that.dispose == 0 ? '/Lable/EditPosition' : '/Lable/EditProfession';
      let disposeData = {};
      if (that.editId) {
        disposeData = {
          name: that.allName,
          id: that.editId
        }
      } else {
        disposeData = {
          name: that.allName
        }
      }
      that.axios.post(url, disposeData)
        .then(res => {
          if (res.data.Code == 0) {
            if (that.editId) {
              that.$Message.success('修改成功');
            } else {
              that.$Message.success('添加成功');
            }
            if (that.dispose == 0) {
              that.Position = [];
              that.getPosition();
            } else {
              that.Profession = [];
              that.getProfession();
            }
            that.showSave = false;
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    toDel(type, id) {
      let that = this;
      let url = type == 0 ? '/Lable/DelPositionsById' : '/Lable/DelProfessionById';
      that.$Modal.confirm({
        title: '请确认是否删除',
        onOk: () => {
          that.$axios.post(url, { Id: id })
            .then(res => {
              if (res.data.Code == 0) {
                if (type == 0) {
                  that.Position = [];
                  that.getPosition();
                } else {
                  that.Profession = [];
                  that.getProfession();
                }
                that.$Message.success('删除成功');
              } else {
                this.$Message.error(res.data.Message);
              }
            })
            .catch(e => {
              throw new Error(e)
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.staffposition {
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
          .noExceed {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
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
