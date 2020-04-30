<template>
  <div class="supplierType">
    <div
      class="addProduct"
      @click="toAdd"
    >
      <img src="@/assets/add.svg" />
      <div>添加产品</div>
    </div>
    <div class="gray"></div>
    <div v-if="productTypeList.length > 0">
      <div
        v-for="(type,index) in productTypeList"
        :key="index"
      >
        <div class="productList">
          <div class="list-name">
            <img
              v-if="type.Type == 1"
              src="@/assets/icon-travel.svg"
            />
            <img
              v-if="type.Type == 2"
              src="@/assets/icon-other.svg"
            />
            <img
              v-if="type.Type == 5"
              src="@/assets/icon-hotel.svg"
            />
            <div>{{type.ClassName}}</div>
          </div>
          <div class="listItem-box">
            <h4>分类设置</h4>
            <ul>
              <li
                v-for="(classify,classIndex) in type.ClassSets"
                :key="classIndex"
                @click="toEdite(1,2,type.Type,classify)"
              >
                <p>{{classify.Name}}</p>
                <img
                  src="@/assets/delete-icon2.svg"
                  alt=""
                  @click.stop="deleteType(1,index,classIndex)"
                >
              </li>
              <li
                class="add"
                @click="toEdite(1,1,type.Type)"
              >+</li>
            </ul>

            <!-- 旅游产品 -->
            <h4 v-if="type.Type == 1">出游类别设置</h4>
            <ul v-if="type.Type == 1">
              <li
                v-for="(outing,outIndex) in type.OutingSets"
                :key="outIndex"
                @click="toEdite(2,2,type.Type,outing)"
              >
                <p>{{outing.Name}}</p>
                <img
                  src="@/assets/delete-icon2.svg"
                  alt=""
                  @click.stop="deleteType(2,index,outIndex)"
                >
              </li>
              <li
                class="add"
                @click="toEdite(2,1,type.Type)"
              >+</li>
            </ul>
            <h4 v-if="type.Type == 1">游客类型设置</h4>
            <ul v-if="type.Type == 1">
              <li
                v-for="(toure,toureIndex) in type.TouristSets"
                :key="toureIndex"
                @click="editTourist(2,toure)"
              >
                <p>{{toure.Name}}</p>
                <img
                  src="@/assets/delete-icon2.svg"
                  alt=""
                  @click.stop="deleteType(3,index,toureIndex)"
                >
              </li>
              <li
                class="add"
                @click="editTourist(1)"
              >+</li>
            </ul>

            <!-- 酒店产品 -->
            <h4 v-if="type.Type == 5">类型设置</h4>
            <ul v-if="type.Type == 5">
              <li
                v-for="(classify,classIndex) in type.HotelTypeSets"
                :key="classIndex"
                @click="toEdite(3,2,51,classify)"
              >
                <p>{{classify.Name}}</p>
                <img
                  src="@/assets/delete-icon2.svg"
                  alt=""
                  @click.stop="deleteType(4,index,classIndex)"
                >
              </li>
              <li
                class="add"
                @click="toEdite(3,1,51)"
              >+</li>
            </ul>
            <!-- 酒店产品 -->

          </div>
        </div>
        <div class="gray"></div>
      </div>
    </div>

    <Modal
      v-model="isEdit"
      width="450"
      :mask-closable="false"
      class="supplierTypeModal"
      @on-cancel="cancel"
    >
      <p
        slot="header"
        style="text-align:center;font-size: 18px;"
      >{{type==1 ? '新增' : '修改'}}</p>
      <Form
        ref="editedForm"
        :model="editItem"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem
          prop="Name"
          label="名称"
        >
          <Input v-model="editItem.Name" />
        </FormItem>
      </Form>
      <div
        slot="footer"
        class="foot"
      >
        <Button @click="cancel">取消</Button>
        <Button
          type="primary"
          @click="editType"
        >保存</Button>
      </div>
      <Spin
        size="large"
        fix
        v-if="spinShow"
      ></Spin>
    </Modal>
    <Modal
      v-model="isTourist"
      width="460"
      :mask-closable="false"
      class="visitorTypeModal"
      @on-cancel="isTourist = false;$refs['touristForm'].resetFields()"
    >
      <p
        slot="header"
        style="text-align:center;font-size: 18px;"
      >{{type==1 ? '新增' : '修改'}}</p>
      <Form
        ref="touristForm"
        :model="editTour"
        :rules="tourRuleVal"
        :label-width="80"
      >
        <FormItem
          prop="Name"
          label="名称"
        >
          <Input
            v-model="editTour.Name"
            placeholder="名称限5个字"
          />
        </FormItem>
        <FormItem
          label="年龄"
          required
        >
          <div style="display: flex;align-items: center;">
            <Row class="row">
              <Col
                span="11"
                class="auto"
              >
              <FormItem prop="MinAge">
                <InputNumber
                  v-model="editTour.MinAge"
                  :max="200"
                  :min="0"
                  :precision="0"
                ></InputNumber>
              </FormItem>
              </Col>
              <Col
                span="2"
                style="text-align: center"
              >-</Col>
              <Col
                span="11"
                class="auto"
              >
              <FormItem prop="MaxAge">
                <InputNumber
                  v-model="editTour.MaxAge"
                  :max="200"
                  :min="0"
                  :precision="0"
                ></InputNumber>
              </FormItem>
              </Col>
            </Row>
            <span style="padding-left: 5px;">岁</span>
          </div>

        </FormItem>
      </Form>
      <div
        slot="footer"
        class="foot"
      >
        <Button @click="isTourist = false;$refs['touristForm'].resetFields()">取消</Button>
        <Button
          type="primary"
          @click="saveTour"
        >保存</Button>
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
  Name: ""
}
import {
  getProductclases,
  editProductType,
  deleteProductType,
  editTravelType,
  deleteTravelType,
  deleteVisitorType,
  editVisitorType
} from '@/api/setting.js'
export default {
  data() {
    const validateMinAge = (rule, value, callback) => {
      if (!value || value < 0) {
        return callback(new Error('请输入最小年龄'));
      } else if (this.editItem.MaxAge && value > this.editItem.MaxAge) {
        return callback(new Error('最小年龄不能大于最大年龄'));
      } else {
        callback();
      }
    };
    const validateMaxAge = (rule, value, callback) => {
      if (!value || value < 0) {
        return callback(new Error('请输入最大年龄'));
      } else if (this.editItem.MinAge && value < this.editItem.MinAge) {
        return callback(new Error('最大年龄不能小于最小年龄'));
      } else {
        callback();
      }
    };
    return {
      productTypeList: [],
      isEdit: false,
      isTourist: false,
      type: 1,
      setting: 1,
      editItem: {},
      editTour: {},
      ruleValidate: {
        Name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        },
        {
          type: 'string',
          max: 20,
          message: '最多输入20个字',
          trigger: 'blur'
        }
        ]
      },
      tourRuleVal: {
        Name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { type: 'string', max: 5, message: '名称限制5个字', trigger: 'blur' }
        ],
        MinAge: [
          { required: true, validator: validateMinAge, trigger: 'blur' }
        ],
        MaxAge: [
          { required: true, validator: validateMaxAge, trigger: 'blur' }
        ]
      },
      spinShow: false
    }
  },
  mounted() {
    this.getTypes();
  },
  methods: {
    //产品类别列表
    getTypes() {
      this.$Spin.show();
      getProductclases().then(res => {
        this.$Spin.hide();
        this.productTypeList = res.Data;
      }).catch(err => {
        this.$Spin.hide();
      })
    },

    toEdite(setting, type, classes, item) {
      // setting  1 分类设置  2 出游类别设置 3 类型设置
      // type 1修改 2新增
      // classes  产品类型  1 旅游产品  2 其他产品 3 酒店产品
      this.isEdit = true;
      this.type = type;
      this.setting = setting;
      // console.log(setting, type, classes, item)
      if (type == 1) {
        this.editItem = EDItITEM;
      } else {
        this.editItem = JSON.parse(JSON.stringify(item));
      }
      if (setting == 1 || setting == 3) {
        this.editItem.Type = classes;
      }
    },

    //游客类型设置
    editTourist(type, item) {
      this.isTourist = true;
      this.type = type;
      if (type == 1) {
        this.editTour = {
          Id: "",
          Name: "",
          MaxAge: null,
          MinAge: null
        };
      } else {
        this.editTour = JSON.parse(JSON.stringify(item));
      }
    },

    cancel() {
      this.isEdit = false;
      this.$refs['editedForm'].resetFields();
    },

    editType() {
      this.$refs['editedForm'].validate((valid) => {
        if (valid) {
          this.spinShow = true;
          let func = '';
          if (this.setting == 1 || this.setting == 3) {
            func = editProductType
          } else if (this.setting == 2) {
            func = editTravelType
          }
          func(this.editItem).then(res => {
            this.spinShow = false;
            this.isEdit = false;
            this.$Message.success(this.type == 1 ? '新增成功' : '修改成功');
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

    saveTour() {
      this.$refs['touristForm'].validate((valid) => {
        if (valid) {
          this.spinShow = true;
          editVisitorType(this.editTour).then(res => {
            this.spinShow = false;
            this.isTourist = false;
            this.$Message.success(this.type == 1 ? '新增成功' : '修改成功');
            this.getTypes();
            this.editTour = {
              Id: "",
              Name: "",
              MaxAge: null,
              MinAge: null
            };
            this.$refs['touristForm'].resetFields();
          }).catch(err => {
            this.spinShow = false;
          })
        } else {
          this.$Message.error('有必填信息未填写');
        }
      })
    },

    deleteType(classes, index, itemIndex) {
      // classes  ：一级分类
      let item = {};
      let fun = '';
      if (classes == 1) {
        item = this.productTypeList[index].ClassSets[itemIndex];
        fun = deleteProductType;
      } else if (classes == 2) {
        item = this.productTypeList[index].OutingSets[itemIndex];
        fun = deleteTravelType;
      } else if (classes == 3) {
        item = this.productTypeList[index].TouristSets[itemIndex];
        fun = deleteVisitorType;
      } else if (classes == 4) {
        item = this.productTypeList[index].HotelTypeSets[itemIndex];
        fun = deleteProductType;
      }
      this.$Modal.confirm({
        title: '请确认是否删除' + item.Name,
        onOk: () => {
          this.$Spin.show();
          fun(item.Id).then(res => {
            this.$Spin.hide();
            if (classes == 1) {
              this.productTypeList[index].ClassSets.splice(itemIndex, 1);
            } else if (classes == 2) {
              this.productTypeList[index].OutingSets.splice(itemIndex, 1);
            } else if (classes == 3) {
              this.productTypeList[index].TouristSets.splice(itemIndex, 1);
            } else if (classes == 4) {
              this.productTypeList[index].HotelTypeSets.splice(itemIndex, 1);
            }
            this.$Message.success('成功删除' + item.Name)
          }).catch(err => {
            this.$Spin.hide();
          })
        }
      })

    },

    toAdd() {
      this.$router.push('/setting/addProduct')
    }
  }
}
</script>
<style lang="less" scoped>
.supplierType {
  .addProduct {
    border: 1px dashed #0899ac;
    padding: 23px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    img {
      width: 20px;
      height: 20px;
    }

    div {
      font-size: 18px;
      color: #0899ac;
      margin-left: 10px;
    }
  }

  .gray {
    height: 10px;
    width: 100%;
    background: #f7f8fa;
  }

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
    position: relative;
    padding-bottom: 30px;

    .line {
      position: absolute;
      left: -40px;
      right: -40px;
      bottom: 0;
      height: 10px;
      background-color: #f7f8fa;
    }
  }

  .otherType {
    padding: 20px 0;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      border: 1px solid #e4e4e4;
      width: 160px;
      height: 50px;
      padding: 0 10px;
      box-sizing: border-box;
      line-height: 50px;
      text-align: center;
      border-radius: 4px;
      font-size: 16px;
      color: #333;
      font-weight: 700;
      margin-top: 20px;
      margin-right: 20px;
      cursor: pointer;
      position: relative;

      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      img {
        position: absolute;
        right: -9px;
        top: -9px;
        z-index: 9;
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
.visitorTypeModal {
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
</style>
<style lang="less">
.visitorTypeModal {
  .ivu-form-item {
    .row {
      width: 320px;
    }
    @media screen and (max-width: 768px) {
      .row {
        width: 230px;
      }
    }
  }
  .ivu-form {
    .auto .ivu-input-wrapper,
    .auto .ivu-input-number {
      width: 100%;
    }
  }
}
</style>