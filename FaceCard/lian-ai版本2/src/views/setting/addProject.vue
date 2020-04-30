<template>
  <div class="addProject">
    <Header :title="types == 0 ?'添加项目/服务':'编辑项目/服务'"></Header>
    <div class="contain">
      <div class="neiContain">
        <div class="line_input">
          <div class="title"><span>*</span>编号</div>
          <Input
            v-model="listData.Number"
            class="inputStyle"
            :maxlength="15"
          />
        </div>
        <div class="line_input">
          <div class="title"><span>*</span>类别</div>
          <Select v-model="listData.ServiceType">
            <Option
              v-for="item in ServiceTypes"
              :value="item.Id"
              :key="item.Id"
            >{{ item.Name }}</Option>
          </Select>
          <div
            v-if="ServiceTypes.length == 0"
            class="addunits"
          >还没有类别，点击这里去<router-link to="projectClass">添加类别</router-link>吧!</div>
        </div>
        <div class="line_input">
          <div class="title"><span>*</span>名称</div>
          <Input
            v-model="listData.Name"
            class="inputStyle"
            :maxlength="15"
          />
        </div>
        <div class="line_input">
          <div class="title"><span>*</span>价格</div>
          <InputNumber
            :min="0"
            :max="100000000"
            v-model="listData.Price"
            class="inputStyle"
          ></InputNumber>
          <div class="units">元</div>
        </div>
        <div class="line_input">
          <div class="title"><span>*</span>状态</div>
          <RadioGroup v-model="listData.Status">
            <Radio
              style="margin-left:25px;"
              :label="0"
            >上架</Radio>
            <Radio
              style="margin-left:45px;"
              :label="1"
            >下架</Radio>
          </RadioGroup>
        </div>
        <div class="anniu">
          <div
            class="save"
            @click="addTrue"
          >{{types==0?'添加':'确定'}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from 'src/components/route-header'
export default {
  components: { Header },
  data() {
    return {
      types: 0,
      ServiceTypes: [],
      listData: {
        Name: "",
        ServiceType: "",
        Number: "",
        Status: 0,
        Price: 0
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getId = this.$route.query.id;
      this.types = 1;
      this.getData();
    } else {
      this.types = 0;
    }
    this.iniData();
  },
  methods: {
    iniData() {
      this.axios.post('/Lable/GetServiceTypesBySiteId')
        .then(res => {
          if (res.data.Code === '0') {
            this.ServiceTypes = res.data.Data.ServiceTypes;
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(e => {
          throw new Error(e)
        })
    },
    getData() {
      this.axios.post('/Lable/GetServiceById', { Id: this.getId })
        .then(res => {
          if (res.data.Code == 0) {
            this.listData = res.data.Data.Service;
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(e => {
          throw new Error(e)
        })
    },
    addTrue() {
      let that = this;
      if (!that.listData.Number) {
        that.$Message.error('编号不为空');
        return false;
      }
      if (!that.listData.ServiceType) {
        that.$Message.error('类别不为空');
        return false;
      }
      if (!that.listData.Name) {
        that.$Message.error('名称不为空');
        return false;
      }
      if (!that.listData.Price) {
        that.$Message.error('价格不为空');
        return false;
      }

      that.axios.post('/Lable/EditService', { ...that.listData })
        .then(res => {
          if (res.data.Code == 0) {
            that.$Message.success(this.getId ? '修改成功' : "添加成功");
            that.$router.back();
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(e => {
          throw new Error(e)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.addProject {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background: #ffffff;
  .contain {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 80px;
    .neiContain {
      .line_input {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 20px;
        .title {
          font-size: 14px;
          color: #333333;
          width: 60px;
          white-space: nowrap;
          span {
            display: inline-block;
            margin-right: 4px;
            line-height: 1;
            font-family: SimSun;
            font-size: 14px;
            color: #ed4014;
          }
        }
        .inputStyle {
          width: 320px;
          margin-right: 15px;
        }
        @media screen and (max-width: 768px) {
          .inputStyle {
            width: 220px;
          }
        }
        .units {
          font-size: 14px;
          color: #333333;
        }
        .addunits {
          white-space: nowrap;
          font-size: 14px;
          color: #333333;
          a {
            color: #e94e27;
            border-bottom: 1px solid #e94e27;
          }
        }
      }
      @media screen and (max-width: 576px) {
        .line_input {
          width: 310px;
          .addunits {
            margin-top: 10px;
            margin-left: 60px;
            a {
              color: #e94e27;
              border-bottom: 1px solid #e94e27;
            }
          }
        }
      }
      .anniu {
        margin-left: 60px;
        text-align: center;
        padding-top: 60px;
        .save {
          width: 320px;
          background: #333333;
          color: #ffffff;
          border-radius: 4px;
          height: 48px;
          line-height: 48px;
          margin-right: 20px;
          font-size: 14px;
          cursor: pointer;
        }
        @media screen and (max-width: 768px) {
          .save {
            width: 220px;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.ivu-select {
  width: auto;
  margin-right: 15px;
}
.ivu-select-single .ivu-select-selection {
  width: 320px;
}
@media screen and (max-width: 768px) {
  .ivu-select-single .ivu-select-selection {
    width: 220px;
  }
}
</style>


