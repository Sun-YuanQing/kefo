<template>
  <div class="supplierType">
    <div class="productType">
      <h3>已选产品</h3>
      <p class="tip">点击已选择的产品，可重新编辑此产品在网店展示的名称；长按可拖动前后顺序，此顺序也为网店商城导航的展示顺序。</p>
      <transition-group
        name="drog"
        tag="ul"
      >
        <li
          v-for="(type,index) in productTypeList"
          :key="index"
          @click="toEdite(type)"
          draggable="true"
          @dragstart="dragStart($event, index)"
          @dragover="allowDrop"
          @drop="drop($event, index)"
        >
          <div>
            <!-- 旅游 -->
            <img
              class="listImg"
              v-if="type.Type == 1"
              src="@/assets/icon-travel.svg"
            />
            <!-- 其他 -->
            <img
              class="listImg"
              v-if="type.Type == 2"
              src="@/assets/icon-other.svg"
            />
            <!-- 酒店 -->
            <img
              class="listImg"
              v-if="type.Type == 5"
              src="@/assets/icon-hotel.svg"
            />
            <div class="listName">{{type.ClassName}}</div>
            <div class="smallName">{{type.Name}}</div>
          </div>
          <img
            src="@/assets/delete-icon2.svg"
            alt=""
            @click.stop="deleteType(index)"
            class="delImg"
          >
        </li>
      </transition-group>
      <div class="line"></div>
    </div>
    <div
      class="productType"
      v-if="moreTypeList.length > 0"
    >
      <h3>更多产品</h3>
      <p class="tip">选择与商家行业相关的产品</p>
      <ul>
        <li
          v-for="(type,index) in moreTypeList"
          :key="index"
        >
          <div>
            <!-- 旅游 -->
            <img
              class="listImg"
              v-if="type.Type == 1"
              src="@/assets/icon-travel.svg"
            />
            <!-- 其他 -->
            <img
              class="listImg"
              v-if="type.Type == 2"
              src="@/assets/icon-other.svg"
            />
            <!-- 酒店 -->
            <img
              class="listImg"
              v-if="type.Type == 5"
              src="@/assets/icon-hotel.svg"
            />
            <!-- 卡项 -->
            <img
              class="listImg"
              v-if="type.Type == 111"
              src="@/assets/icon-card.svg"
            />
            <!-- 组合 -->
            <img
              class="listImg"
              v-if="type.Type == 111"
              src="@/assets/icon-group.svg"
            />
            <div class="listName">{{type.ClassName}}</div>
          </div>
          <div
            class="addImg"
            @click="toAdd(index,type.Id)"
          >+</div>
        </li>
      </ul>
    </div>
    <div class="bottom">
      <Button @click="$router.back()">取消</Button>
      <Button
        type="primary"
        @click="toSave"
      >保存</Button>
    </div>
    <Modal
      v-model="isEdit"
      width="503"
      :mask-closable="false"
      class="supplierTypeModal"
      @on-cancel="cancel"
    >
      <p
        slot="header"
        style="text-align:center;font-size: 20px;"
      >更改网店展示名称</p>
      <Form
        ref="editedForm"
        :model="editItem"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem prop="Name">
          <Input v-model="editItem.Name" />
        </FormItem>
        <div class="tips">*建议更改为与“{{editItem.ClassName}}”相关的名称</div>
      </Form>
      <div
        slot="footer"
        class="foot"
      >
        <Button @click="cancel">取消</Button>
        <Button
          type="primary"
          @click="editType"
        >确认</Button>
      </div>
      <Spin
        size="large"
        fix
        v-if="spinShow"
      ></Spin>
    </Modal>
  </div>
</template>
<script>
const EDItITEM = {
  Id: "",
  Name: "",
  Type: 1,
}
import {
  getAddProductList,
  saveUpdataName,
  deleteProductName,
  addProductName,
  saveProductNum
} from '@/api/setting.js'
export default {
  data() {
    return {
      productTypeList: [],
      moreTypeList: [],
      isEdit: false,
      type: 1,
      editItem: {},
      ruleValidate: {
        Name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        },
        {
          type: 'string',
          max: 4,
          min: 2,
          message: '请输入2~4个中文字',
          trigger: 'blur'
        }]
      },
      spinShow: false,
    }
  },
  created() {
    this.getTypes();
  },
  methods: {
    //产品类别列表
    getTypes() {
      this.$Spin.show();
      getAddProductList().then(res => {
        this.$Spin.hide();
        this.productTypeList = res.Data.SiteFirsrClassHave;
        this.moreTypeList = res.Data.SiteFirsrClassUn;
      }).catch(err => {
        this.$Spin.hide();
      })
    },

    toAdd(index, Id) {
      addProductName(Id).then(res => {
        this.productTypeList.push(this.moreTypeList[index]);
        this.moreTypeList.splice(index, 1);
      }).catch(err => {
        this.$Message.error('添加失败');
      })
    },

    toEdite(item) {
      this.isEdit = true;
      this.editItem = JSON.parse(JSON.stringify(item));
    },

    cancel() {
      this.isEdit = false;
      this.$refs['editedForm'].resetFields();
    },

    editType() {
      this.$refs['editedForm'].validate((valid) => {
        if (valid) {
          this.spinShow = true;
          saveUpdataName(this.editItem).then(res => {
            this.spinShow = false;
            this.isEdit = false;
            this.$Message.success('修改成功');
            this.getTypes();
            this.$refs['editedForm'].resetFields();
          }).catch(err => {
            this.spinShow = false;
          })
        } else {
          this.$Message.error('有必填信息未填写');
        }
      })

    },

    deleteType(index) {
      let item = this.productTypeList[index];
      this.$Modal.confirm({
        title: '请确认是否删除' + item.ClassName,
        onOk: () => {
          this.$Spin.show();
          deleteProductName(item.Id).then(res => {
            this.$Spin.hide();
            this.moreTypeList.push(item);
            this.productTypeList.splice(index, 1);
            this.$Message.success('成功删除' + item.ClassName)
          }).catch(err => {
            this.$Spin.hide();
          })
        }
      })

    },
    toSave() {
      saveProductNum(this.productTypeList).then(res => {
        this.$router.back()
      }).catch(err => {
        this.$Message.error('保存失败，请重试！！！');
      })

    },
    //取消默认行为
    allowDrop(e) {
      e.preventDefault();
    },
    //开始拖动
    dragStart(e, index) {
      console.log(e, index)
      let tar = e.target;
      // e.dataTransfer.setData('Text', index);
      this.dragIndex = index;
      if (tar.tagName.toLowerCase() == 'li') {
        // console.log('drag start')
        // console.log('drag Index: ' + index)
      }
    },
    //放置
    drop(e, index) {
      this.allowDrop(e);
      //使用一个新数组重新排序后赋给原变量
      let temp = this.productTypeList.splice(this.dragIndex, 1);
      this.productTypeList.splice(index, 0, temp[0]);

    }
  }
}
</script>
<style lang="less" scoped>
.supplierType {
  height: 100%;
  background: #f7f8fa;

  .productList {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    background: #fff;
    .list-name {
      display: flex;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
      }
      div {
        font-size: 18px;
        font-weight: 800;
        margin-left: 10px;
      }
    }
    .listItem-box {
      width: 100%;
      box-sizing: border-box;
      padding: 0 40px 10px;
      h4 {
        margin-top: 30px;
      }
    }
  }

  .tip {
    color: #999;
    line-height: 2;
  }

  .productType {
    width: 100%;
    box-sizing: border-box;
    padding: 28px 40px 40px;
    background: #fff;
    margin-bottom: 10px;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      padding: 0 10px;
      box-sizing: border-box;
      text-align: center;
      margin-top: 30px;
      margin-right: 80px;
      cursor: pointer;
      position: relative;
      .listImg {
        width: 50px;
        height: 50px;
      }

      .listName {
        color: #333;
        font-size: 16px;
      }
      .smallName {
        border: 1px solid #e4e4e4;
        color: #666666;
        font-size: 12px;
        border-radius: 12px;
        margin-top: 10px;
      }

      .delImg {
        position: absolute;
        width: 18px;
        height: 18px;
        right: -9px;
        top: -9px;
        z-index: 9;
      }
      .addImg {
        position: absolute;
        right: -9px;
        top: -9px;
        z-index: 9;
        color: #0899ac;
        font-size: 18px;
      }
    }

    .add {
      border: 1px dotted #e4e4e4;
      color: #0899ac;
      font-weight: normal;
      font-size: 26px;
    }
  }
}

.supplierTypeModal {
  .tips {
    margin-left: 80px;
    color: #ff4b35;
    font-size: 14px;
  }
  .foot {
    text-align: center;

    .ivu-btn {
      width: 120px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;

      &:first-of-type {
        margin-right: 20px;
      }
    }
  }
}
.bottom {
  display: flex;
  justify-content: center;
  padding: 32px 0;
  > .ivu-btn {
    height: 40px;
    width: 200px;
    &:first-of-type {
      margin-right: 30px;
    }
  }
}
</style>