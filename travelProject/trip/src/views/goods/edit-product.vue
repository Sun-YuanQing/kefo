<template>
  <FullPage
    :title="title"
    class="editRetailProduct"
    @change-router="$router.back()"
  >
    <div
      class="guideWrap"
      v-if="formData.Type!=4"
    >
      <div
        class="bg"
        :class="{'nextStep': isNext}"
      ></div>
      <div class="line"></div>
    </div>
    <Form
      :model="formData"
      :rules="ruleValidate"
      ref="productForm"
      :label-width="145"
      class="form"
    >
      <div v-show="!isNext">
        <FormItem
          label="产品名称："
          prop="Name"
        >
          <Input
            v-model="formData.Name"
            :disabled="isDisabled"
          />
        </FormItem>
        <FormItem
          v-if="formData.Type!=4"
          label="产品分类："
          prop="TravelProductType"
        >
          <div style="display: flex;flex-wrap: wrap;">
            <Select
              v-model="formData.TravelProductType"
              :disabled="isDisabled"
              placeholder="请选择产品分类"
            >
              <Option
                v-for="type in productTypeList"
                :key="type.Id"
                :value="type.Id"
              >{{type.Name}}</Option>
            </Select>
            <router-link
              to="/setting/productType"
              v-if="!id && !classes"
              style="padding-left: 10px;line-height: 40px;"
            >去设置新增产品分类</router-link>
          </div>
        </FormItem>
        <FormItem
          v-if="formData.Type==4"
          label="游客类型："
          prop="VistorType"
        >
          <div style="display: flex;flex-wrap: wrap;">
            <Select
              v-model="formData.VistorType"
              placeholder="请选择游客类型"
              :disabled="id!=undefined"
              @on-change="vistorTypeChange"
            >
              <Option
                v-for="type in visitorTypeList"
                :key="type.Id"
                :value="type.Id"
              >{{type.Name}}</Option>
            </Select>
            <router-link
              to="/setting/productType"
              v-if="!id && !classes"
              style="padding-left: 10px;line-height: 40px;"
            >去设置新增游客类型</router-link>
          </div>
        </FormItem>

        <FormItem
          v-if="formData.Type==4"
          label="组合内容："
          prop="LineProduct"
        >
          <p
            class="addPoint"
            :style="{color: !id ? '#3275F5' : '#999'}"
            @click="addPoint('1','1')"
          >添加路线产品</p>
          <template v-if="formData.LineProduct.length>0">
            <Table
              :columns="lineProductColumns"
              :data="formData.LineProduct"
              disabled-hover
            >
              <template
                slot-scope="{ index, row }"
                slot="Action"
              >
                <Button
                  type="text"
                  :style="{color: !id ? '#3275F5' : '#999'}"
                  @click="deleteTableData('1',index,row.Name)"
                >删除</Button>
              </template>
            </Table>
            <div class="row total">合计：￥{{giveLineTotal}}</div>
          </template>
        </FormItem>
        <FormItem
          v-if="formData.Type==4"
          label="组合内容："
          prop="OtherProduct"
        >
          <p
            class="addPoint"
            :style="{color: !id ? '#3275F5' : '#999'}"
            @click="addPoint('3','2')"
          >添加其他产品</p>
          <template v-if="formData.OtherProduct.length>0">
            <Table
              :columns="otherProductColumns"
              :data="formData.OtherProduct"
              disabled-hover
            >
              <template
                slot-scope="{ index,row }"
                slot="Action"
              >
                <Button
                  type="text"
                  :style="{color: !id ? '#3275F5' : '#999'}"
                  @click="deleteTableData('2',index,row.Name)"
                >删除</Button>
              </template>
            </Table>
            <div class="row total">合计：￥{{otherProductTotal}}</div>
          </template>
        </FormItem>
        <FormItem
          v-if="formData.Type==4"
          label="赠送："
          prop=""
        >
          <div>
            <p
              class="addPoint"
              :style="{color: !id ? '#3275F5' : '#999'}"
              @click="addPoint('1','3')"
            >添加赠送路线产品</p>
            <template v-if="formData.GiveLineProduct.length>0">
              <Table
                :columns="lineProductColumns"
                :data="formData.GiveLineProduct"
                disabled-hover
              >
                <template
                  slot-scope="{ index,row }"
                  slot="Action"
                >
                  <Button
                    type="text"
                    :style="{color: !id ? '#3275F5' : '#999'}"
                    @click="deleteTableData('3',index,row.Name)"
                  >删除</Button>
                </template>
              </Table>
              <div class="row total">合计：￥{{otherProductTotal}}</div>
            </template>
          </div>
          <div style="margin-top: 15px;">
            <p
              class="addPoint"
              :style="{color: !id ? '#3275F5' : '#999'}"
              @click="addPoint('3','4')"
            >添加赠送其他产品</p>
            <template v-if="formData.GiveOtherProduct.length>0">
              <Table
                :columns="otherProductColumns"
                :data="formData.GiveOtherProduct"
                disabled-hover
              >
                <template
                  slot-scope="{ index,row }"
                  slot="Action"
                >
                  <Button
                    type="text"
                    :style="{color: !id ? '#3275F5' : '#999'}"
                    @click="deleteTableData('4',index,row.Name)"
                  >删除</Button>
                </template>
              </Table>
              <div
                class="row total"
                style=""
              >合计：￥{{giveOtherProductTotal}}</div>
            </template>
          </div>
        </FormItem>
        <FormItem
          v-if="formData.Type==4"
          label="总价值："
          required
          prop=""
        >
          <div class="row total">合计：￥{{allTotal}}</div>
        </FormItem>
        <FormItem
          v-if="formData.Type==4"
          label="售价："
          prop="ComposeSalePrice"
        >
          <InputNumber
            :max="999999999"
            :min="0"
            :disabled="id!=undefined"
            :precision="2"
            v-model="formData.ComposeSalePrice"
          ></InputNumber>&nbsp;&nbsp;元
        </FormItem>
        <FormItem
          v-if="formData.Type==4"
          label="成本价："
          prop="ComposeCostPrice"
        >
          <InputNumber
            :max="999999999"
            :min="0"
            :disabled="id!=undefined"
            :precision="2"
            v-model="formData.ComposeCostPrice"
          ></InputNumber>&nbsp;&nbsp;元
        </FormItem>
        <FormItem
          v-if="formData.Type==1 || formData.Type==2"
          label="产品性质："
          prop="ProductProperty"
        >
          <div style="display: flex;flex-wrap: wrap;">
            <Select
              v-model="formData.ProductProperty"
              :disabled="isDisabled"
              placeholder="请选择产品性质"
            >
              <Option
                v-for="type in productPropertyList"
                :key="type.value"
                :value="type.value"
              >{{type.label}}</Option>
            </Select>
          </div>
        </FormItem>
        <FormItem
          v-if="formData.Type!=4"
          :label="formData.Type!=3 ? '日期、价格：' : '价格：'"
          prop="TypePrice"
        >
          <div
            class="dateList"
            v-for="(item,index) in formData.TypePrice"
            :key="index"
            :style="{'border-bottom': index== formData.TypePrice.length-1 ? 'none' : '1px dashed #999'}"
          >
            <FormItem
              v-if="formData.Type!=3"
              :label="formData.Type==5 ? '价格日期' : '出发日期'"
              :label-width="75"
              style="margin-bottom: 15px;"
              class="unmarked"
            >
              <div
                v-if="item.DateType == 1"
                style="display: flex;align-items: center;"
              >
                <DatePicker
                  type="date"
                  multiple
                  :disabled="isDisabled"
                  :value="item.DepartureDate"
                  :editable="false"
                  @on-change="dateChange($event,index)"
                ></DatePicker>
                <img
                  v-if="id==undefined || (classes==2 && formData.Type==2)"
                  src="@/assets/delete-icon3.svg"
                  alt=""
                  @click="deleteDate(index)"
                  style="margin-left: 5px; cursor: pointer;"
                >
              </div>
              <div
                v-else
                style="display: flex;align-items: center;"
              >
                <DatePicker
                  type="daterange"
                  :disabled="isDisabled"
                  :value="dateRange[index]"
                  :editable="false"
                  @on-change="dateRangeChange($event,index)"
                ></DatePicker>
                <img
                  v-if="id==undefined || (classes==2 && formData.Type==2)"
                  src="@/assets/delete-icon3.svg"
                  alt=""
                  @click="deleteDate(index)"
                  style="margin-left: 5px; cursor: pointer;"
                >
              </div>
            </FormItem>
            <FormItem
              :label="formData.Type==5 ? '类型' : formData.Type!=3 ? '游客类型' : ''"
              :label-width="formData.Type!=3 ? 75 : 0"
              class="unmarked"
            >
              <RadioGroup
                v-model="item.UnifiedSale"
                vertical
                @on-change="saleTypeChange($event,index)"
              >
                <Radio
                  :label="1"
                  :disabled="isDisabled"
                  style="display: flex;align-items:center;"
                >设置产品统一售价
                  <div style="display: flex;">
                    <div style="margin: 5px 20px">
                      <span>售价</span>
                      <!-- || (isDisabled && storeType=='1') ((classes==2 && formData.Type==3) && formData.AuditStatus != 0)-->
                      <InputNumber
                        :max="999999999"
                        :min="0"
                        :disabled="item.UnifiedSale==0"
                        placeholder="自定义"
                        class="littleInput"
                        :precision="2"
                        v-model="item.SalePrice"
                      ></InputNumber>元
                    </div>
                    <div style="margin: 5px 0;">
                      <span>成本价</span>
                      <InputNumber
                        :max="999999999"
                        :min="0"
                        :disabled="item.UnifiedSale==0 || isDisabled"
                        placeholder="自定义"
                        class="littleInput"
                        :precision="2"
                        v-model="item.CostPrice"
                      ></InputNumber>元
                    </div>
                  </div>
                </Radio>
                <Radio
                  :label="0"
                  :disabled="isDisabled"
                  style="margin: 10px 0 10px;display: inline-block;"
                >设置类型价格</Radio>
              </RadioGroup>
              <!-- :style="{'margin-left': formData.Type == '3' ? '95px' : '95px'}" -->
              <div
                v-if="item.UnifiedSale==0"
                class="visitorList"
                :style="{'margin-left': formData.Type == '3' ? '20px' : '95px'}"
              >
                <div
                  v-for="(type,indx) in item.VisitorTypePrice"
                  :key="indx"
                >
                  <Input
                    type="text"
                    v-model="type.VisitorTypeName"
                    style="width: 116px;"
                    :disabled="formData.Type!=3 || id!=undefined"
                  />
                  <div style="margin: 0 20px">
                    <span>售价</span>
                    <!-- :disabled="isDisabled && storeType=='1'" -->
                    <InputNumber
                      :max="999999999"
                      :min="0"
                      :precision="2"
                      placeholder=""
                      class="littleInput"
                      v-model="type.SalePrice"
                    ></InputNumber>元
                  </div>
                  <div>
                    <span>成本价</span>
                    <InputNumber
                      :max="999999999"
                      :min="0"
                      :precision="2"
                      :disabled="isDisabled"
                      placeholder=""
                      class="littleInput"
                      v-model="type.CostPrice"
                    ></InputNumber>元
                  </div>
                  <img
                    src="@/assets/delete-icon3.svg"
                    alt=""
                    v-if="!id && formData.Type==3"
                    @click="deleteOtherType(index,indx,type.VisitorTypeName)"
                    style="margin-left: 5px;cursor: pointer"
                  >
                </div>
                <span
                  v-if="formData.Type==3 && !id"
                  class="addDate"
                  style="margin-top: 15px;"
                  @click="addOtherType"
                >添加类型以及价格</span>
                <router-link
                  v-if="!id && formData.Type!=3 && !classes"
                  to="/setting/productType"
                >去设置新增{{ formData.Type==5 ? '酒店类型' : '游客类型'}}</router-link>
              </div>
            </FormItem>
          </div>
          <div v-if="formData.Type!=3 && !id">
            <span
              class="addDate"
              @click="addDate(1)"
              style="margin-right: 15px;"
            >{{formData.Type==5?"添加多个价格日期":"添加多个出发日期"}}</span>
            <span
              class="addDate"
              @click="addDate(2)"
            >{{formData.Type==5?"添加价格日期范围":"添加出发日期范围"}}</span>
          </div>
        </FormItem>
        <!-- <FormItem v-if="formData.Type==3" label="库存：" prop="Stock">
                    <InputNumber :max="999999999" :min="0" 
                                 :disabled="id!=undefined"
                                 :precision=0 placeholder="" 
                                 v-model="formData.Stock"></InputNumber>
                </FormItem> -->
        <FormItem
          v-if="formData.Type==3 && !classes"
          label="有效上架时间："
          prop="Permanent"
        >
          <RadioGroup
            v-model="formData.Permanent"
            vertical
            @on-change="permanentChange"
          >
            <Radio
              :label="1"
              :disabled="id!=undefined"
              style="margin: 0 0 10px;display: inline-block;"
            >永久有效</Radio>
            <Radio
              :label="0"
              :disabled="id!=undefined"
              style="display: flex;align-items:center;"
            >选择有效上架时间
              <DatePicker
                :value="expiryDateRange"
                type="datetimerange"
                @on-change="expiryDateChange"
                :disabled="formData.Permanent==1"
                class="expiryDate"
                placeholder="开始时间-结束时间"
              ></DatePicker>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          v-if="formData.Type==3 && !classes"
          label="授权门店："
          prop="Authorize"
        >
          <div
            style="display: flex;"
            class="authorize"
          >
            <RadioGroup
              v-model="formData.Authorize"
              vertical
              @on-change="authorizeChange"
            >
              <Radio
                :label="1"
                :disabled="id!=undefined"
              >授权</Radio>
              <!-- <Radio :label="0" :disabled="id!=undefined"
                                    style="margin: 10px 0 0;display: inline-block;">不授权</Radio> -->
            </RadioGroup>
            <div style="display: flex;align-items: center;height: 40px;padding-left: 10px;">
              <Select
                v-model="formData.ArrivalWay"
                class="littleSelect"
                :disabled="formData.Authorize==0 && !id"
              >
                <Option value="1">直达</Option>
                <Option
                  value="2"
                  v-if="storeType != '3'"
                >选择性直达</Option>
              </Select>
              <img
                style="margin-left: 5px;"
                src="@/assets/tip-icon.svg"
                alt=""
                @click="showTip = !showTip"
              >
            </div>
            <div
              class="tipModel"
              v-if="showTip"
            >
              <p>直达：门店经理必须选择该产品</p>
              <p v-if="storeType != '3'">选择性直达：门店经理可选择或者不选择该产品</p>
            </div>
          </div>
        </FormItem>
        <!-- 取消订单还未开发 -->
        <FormItem
          v-if="formData.Type==3"
          label="支持取消订单："
          prop="CanCancle"
        >
          <i-switch
            v-model="formData.CanCancle"
            true-color="#3275F5"
            :true-value="1"
            :false-value="0"
            :disabled="true"
          ></i-switch>
        </FormItem>
        <FormItem
          v-if="formData.Type==1 || formData.Type==2"
          label="出游类别："
          prop="TravelType"
        >
          <div style="display: flex;flex-wrap: wrap;">
            <Select
              v-model="formData.TravelType"
              :disabled="isDisabled"
              placeholder="请选择出游类别"
            >
              <Option
                v-for="type in travelTypeList"
                :key="type.Id"
                :value="type.Id"
              >{{type.Name}}</Option>
            </Select>
            <router-link
              to="/setting/productType"
              v-if="!id && !classes"
              style="padding-left: 10px;line-height: 40px;"
            >去设置新增出游类别</router-link>
          </div>
        </FormItem>
        <FormItem
          v-if="formData.Type==1 || formData.Type==2"
          label="出发地："
          prop="DeparturePlace"
        >
          <Input
            v-model="formData.DeparturePlace"
            :disabled="isDisabled"
          />
        </FormItem>
        <!-- <FormItem v-if="formData.Type==1 || formData.Type==2" label="单房差：" prop="HousePrice">
                    <InputNumber v-model="formData.HousePrice" :disabled="id!=undefined"
                                 :max="999999" :min="0"></InputNumber>&nbsp;&nbsp;元
                </FormItem> -->
        <!-- <FormItem v-if="formData.Type==1 || formData.Type==2" label="最低成团人数：" prop="MinTourGroupNum">
                    <InputNumber v-model="formData.MinTourGroupNum" 
                                :disabled="id!=undefined"
                                :max="999999" :min="1"></InputNumber>&nbsp;&nbsp;人
                </FormItem> -->
        <!-- 直营才有供应商 -->
        <FormItem
          v-if="formData.Type==2"
          label="供应商："
          prop="Supplier"
        >
          <div style="display: flex;flex-wrap: wrap;">
            <Select
              v-model="formData.Supplier"
              :disabled="isDisabled"
            >
              <Option
                v-for="type in supplierList"
                :key="type.Id"
                :value="type.Id"
              >{{type.Name}}</Option>
            </Select>
            <router-link
              to="/setting/supplier/list"
              v-if="!id && !classes"
              style="padding-left: 10px;line-height: 40px;"
            >去设置新增供应商</router-link>
          </div>
        </FormItem>
        <FormItem
          v-if="classes"
          label="商品共享："
          prop="Share"
        >
          <div style="display: flex;align-items: flex-start;">
            <RadioGroup
              v-model="formData.Share"
              vertical
            >
              <!-- :disabled="id!=undefined && formData.AuditStatus==-1" -->
              <Radio
                :label="1"
                disabled
              >可共享</Radio>
              <Radio
                :label="0"
                disabled
              >不可共享</Radio>
            </RadioGroup>
            <template v-if="formData.Type==3">
              <div style="display: flex;align-items: center;height: 40px;padding-left: 10px;">
                <Select
                  v-model="formData.ArrivalWay"
                  class="littleSelect"
                  :disabled="formData.ArrivalWay==2 && !id"
                >
                  <Option value="1">直达</Option>
                  <Option
                    value="2"
                    v-if="storeType != '3'"
                  >选择性直达</Option>
                </Select>
                <img
                  style="margin-left: 5px;"
                  src="@/assets/tip-icon.svg"
                  alt=""
                  @click="showTip = !showTip"
                >
              </div>
              <div
                class="tipModel"
                v-if="showTip"
              >
                <p>直达：门店经理必须选择该产品</p>
                <p v-if="storeType != '3'">选择性直达：门店经理可选择或者不选择该产品</p>
              </div>
            </template>
            <img
              v-if="formData.Type!=3"
              style="margin-left: 5px;margin-top: 5px;width: 18px;"
              src="@/assets/tip-icon.svg"
              alt=""
              @click="showTip = !showTip"
            >
          </div>
          <div
            v-if="formData.Type!=3 && showTip"
            class="tipModel"
            style="left: 120px;"
          >
            <p>可共享：是指所有门店经理可销售此商品；</p>
            <p>不可共享：是指只有自己的门店可销售此商品</p>
          </div>
        </FormItem>
        <div
          v-if="!classes"
          style="display: flex;flex-wrap: wrap;"
        >
          <FormItem
            label="产品状态："
            prop="Status"
          >
            <Select v-model="formData.Status">
              <Option value="0">{{storeType=='1' ? '下架' : '下线'}}</Option>
              <Option value="1">{{storeType=='1' ? '上架' : '上线'}}</Option>
              <!-- <Option value="2" v-if="formData.Type!=3">{{storeType=='1' ? '待上架' : '待上线'}}</Option> -->
              <!-- <Option value="2" v-if="formData.Type!=3 && storeType=='1'">待上架</Option> -->
            </Select>
          </FormItem>
          <FormItem
            v-if="formData.Status=='2'"
            label="预定时间："
            prop="ShelfTime"
          >
            <DatePicker
              type="datetime"
              placeholder=""
              class="shelfTime"
              @on-change="shelfTimeChange"
              :value="formData.ShelfTime"
            ></DatePicker>
          </FormItem>
          <FormItem
            v-if="formData.Status=='0'"
            :label="storeType=='1' ? '下架原因：' : '下线原因：'"
            prop="OffReason"
          >
            <Input
              v-model="formData.OffReason"
              style="width: 180px;"
            />
          </FormItem>
        </div>
        <!-- 直营才有到达方式 -->
        <FormItem
          v-if="formData.Type==1 || formData.Type==4"
          label="到达方式："
          prop="ArrivalWay"
        >
          <div style="display: flex;align-items: center;">
            <Select
              v-model="formData.ArrivalWay"
              :disabled="id!=undefined"
            >
              <Option value="1">直达</Option>
              <Option
                value="2"
                v-if="storeType != '3'"
              >选择性直达</Option>
            </Select>
            <img
              style="margin-left: 5px;"
              src="@/assets/tip-icon.svg"
              alt=""
              @click="showTip = !showTip"
            >
          </div>
          <div
            class="tipModel"
            v-if="showTip"
          >
            <p>直达：门店经理必须选择该产品</p>
            <p v-if="storeType != '3'">选择性直达：门店经理可选择或者不选择该产品</p>
          </div>
        </FormItem>
        <FormItem
          label="封面图片："
          prop="CoverPhoto"
          :class="{'hideTip': formData.CoverPhoto && formData.CoverPhoto.url}"
        >
          <div
            class="imgWrap"
            v-if="formData.CoverPhoto && formData.CoverPhoto.url"
          >
            <div
              class="maskWrap"
              v-if="!(classes==2 && formData.Type==3)"
            >
              <p>重新上传</p>
              <input
                type="file"
                name="coverPhoto"
                ref="coverPhoto"
                value=""
                accept="image/jpg, image/jpeg, image/png"
                @change="uploadCoverPhoto"
              />
            </div>
            <img
              :src="formData.CoverPhoto.url"
              alt=""
              class="img"
            >
          </div>
          <div
            v-else
            class="upload coverPhoto"
          >
            <input
              type="file"
              name="coverPhoto"
              ref="coverPhoto"
              value=""
              accept="image/jpg, image/jpeg, image/png"
              @change="uploadCoverPhoto"
            />
            <img
              src="@/assets/upload-icon.svg"
              alt=""
              srcset=""
            >
          </div>
          <p style="color: #999; margin-top: 8px;">最多支持1张图片，仅支持jpeg、jpg、png格式，大小不超过5.0MB</p>
        </FormItem>
        <FormItem
          label="展示图片："
          prop="DisplayPhoto"
          :class="{'hideTip': formData.DisplayPhoto && formData.DisplayPhoto.length>0}"
        >
          <ul class="imgList">
            <li
              v-for="(file,index) in formData.DisplayPhoto"
              :key="index"
            >
              <img
                class="item"
                :src="file.url"
              >
              <img
                class="delete"
                v-if="!(classes==2 && formData.Type==3)"
                src="@/assets/delete-icon.svg"
                alt=""
                @click="deleteImg(index,1)"
              >
            </li>
            <li
              class="upload"
              v-if="!(classes==2 && formData.Type==3)"
            >
              <input
                type="file"
                name="displayPhoto"
                ref="displayPhoto"
                value=""
                accept="image/jpg, image/jpeg, image/png"
                multiple="multiple"
                @change="uploadImg($event,1)"
              />
              <img
                src="@/assets/upload-icon.svg"
                alt=""
                srcset=""
              >
            </li>
          </ul>
          <p style="color: #999;">最多支持10张图片，仅支持jpeg、jpg、png格式，大小不超过5.0MB</p>
        </FormItem>
        <FormItem
          v-if="formData.Type==3"
          label="物流设置："
        >
          <i-switch
            v-model="formData.Logistics.SetShip"
            true-color="#3275F5"
            :true-value="1"
            :false-value="0"
            :disabled="isDisabled"
            :before-change="handleBeforeChange"
          ></i-switch>
          <div>
            <RadioGroup v-model="formData.Logistics.StorePickUp">
              <Radio
                :label="1"
                :disabled="isDisabled || formData.Logistics.SetShip==0"
              >支持门店自取</Radio>
              <Radio
                :label="0"
                :disabled="isDisabled || formData.Logistics.SetShip==0"
              >不支持门店自取</Radio>
            </RadioGroup>
          </div>
          <div>
            <RadioGroup
              v-model="formData.Logistics.FreeShipping"
              @on-change="freeshippingChange"
            >
              <Radio
                :label="1"
                :disabled="isDisabled || formData.Logistics.SetShip==0"
              >全国包邮</Radio>
              <Radio
                :label="0"
                :disabled="isDisabled || formData.Logistics.SetShip==0"
              >
                全国统一运费
                <InputNumber
                  :max="999999999"
                  :min="0"
                  v-model="formData.Logistics.ShipPrice"
                  @on-change="expressChange"
                  :disabled="formData.Logistics.FreeShipping==1 || isDisabled || formData.Logistics.SetShip==0"
                  placeholder="自定义"
                  class="littleInput"
                  :precision="2"
                ></InputNumber>元
              </Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <FormItem
          v-if="formData.Type==4"
          label="组合说明："
          prop="TravelProfile"
        >
          <div class="textareaWrap">
            <Input
              v-model="formData.TravelProfile"
              type="textarea"
              class="textarea"
              :autosize="{minRows: 4,maxRows: 120}"
              placeholder=""
            />
          </div>
        </FormItem>
      </div>
      <div v-show="isNext">
        <FormItem
          :label="formData.Type==3 ? '简介：' : formData.Type==5 ? '产品说明：': ''"
          prop="TravelProfile"
        >
          <!-- <div class="textareaWrap">
                        <Input  v-model="formData.TravelProfile" type="textarea" class="textarea"
                                :autosize="{minRows: 4,maxRows: 120}" placeholder="" />
                    </div> -->
          <!-- @change="onEditorChange($event)" -->
          <div style="margin-bottom: 60px;">
            <quill-editor
              ref="myTextEditor"
              v-model="formData.TravelProfile"
              @focus="onEditorFocus($event)"
              :options="editorOption"
              style="height: 300px;"
            ></quill-editor>
          </div>
        </FormItem>
        <FormItem
          label="详情图："
          prop="TravelPhoto"
        >
          <ul class="imgList">
            <li
              v-for="(file,index) in formData.TravelPhoto"
              :key="index"
            >
              <img
                class="item"
                :src="file.url"
              >
              <img
                class="delete"
                v-if="!(classes==2 && formData.Type==3)"
                src="@/assets/delete-icon.svg"
                alt=""
                @click="deleteImg(index,2)"
              >
            </li>
            <li
              class="upload"
              v-if="!(classes==2 && formData.Type==3)"
            >
              <input
                type="file"
                name="travelPhoto"
                ref="travelPhoto"
                value=""
                accept="image/jpg, image/jpeg, image/png"
                multiple="multiple"
                @change="uploadImg($event,2)"
              />
              <img
                src="@/assets/upload-icon.svg"
                alt=""
                srcset=""
              >
            </li>
          </ul>
          <p style="color: #999;">最多支持10张图片，仅支持jpeg、jpg、png格式，大小不超过5.0MB</p>
        </FormItem>
        <FormItem
          label=""
          prop="TravelPdf"
        >
          <ul class="imgList pdfList">
            <li
              v-for="(file,index) in formData.TravelPdfDetail"
              :key="index"
            >
              <a
                :href="file.Url"
                target="_blank"
              >
                <img
                  src="@/assets/pdf-big.svg"
                  alt=""
                  class="item"
                >
                <p>{{file.Name}}</p>
              </a>
              <img
                v-if="!id || !(classes==2 && formData.Type==3)"
                class="delete"
                src="@/assets/delete-icon.svg"
                alt=""
                @click="deletePdf(index,file.Name,file.Id)"
              >
            </li>
            <li
              v-if="!id || (classes==2 && formData.Type==2)"
              class="upload"
            >
              <input
                type="file"
                name="travelPdf"
                ref="travelPdf"
                value=""
                accept="application/pdf"
                @change="uploadPdf"
              />
              <img
                src="@/assets/pdf-icon.svg"
                alt=""
                srcset=""
              >
            </li>
          </ul>
          <p style="color: #999;">仅支持 pdf 格式, 文件大小不超过50MB</p>
        </FormItem>
      </div>
    </Form>
    <div class="bottom">
      <template v-if="formData.Type==4">
        <Button @click="$router.back()">取消</Button>
        <Button
          type="primary"
          @click="handleSubmit"
        >确定</Button>
      </template>
      <template v-else>
        <template v-if="isNext">
          <Button @click="isNext = false;">上一步</Button>
          <template v-if="classes==2">
            <Button @click="isNoPass = true;">审核不通过</Button>
            <Button
              type="primary"
              @click="auditPass"
            >审核通过</Button>
          </template>
          <Button
            v-else-if="classes==1"
            type="primary"
            @click="handleAudit"
          >完成，提交审核</Button>
          <Button
            v-else
            type="primary"
            @click="handleSubmit"
          >提交产品</Button>
        </template>
        <Button
          v-else
          type="primary"
          @click="toNext"
        >下一步</Button>
      </template>
    </div>

    <!-- 审核不通过 -->
    <Modal
      v-model="isNoPass"
      width="460"
      :mask-closable="false"
      class="noPassModal"
      @on-cancel="isNoPass=false;formData.AuditReason=''"
    >
      <Form
        :label-width="80"
        style="margin-top: 20px;"
      >
        <h3 style="text-align: center;line-height: 4;font-size: 18px;color: #333;">确定不通过审核?</h3>
        <FormItem label="理由">
          <Input
            v-model="formData.AuditReason"
            type="text"
            maxlength="20"
            placeholder="最多20个字（可不填）"
          />
        </FormItem>
      </Form>
      <div
        slot="footer"
        class="foot"
      >
        <Button
          type="primary"
          @click="auditFails"
        >确定</Button>
      </div>
      <Spin
        size="large"
        fix
        v-if="spinShow"
      ></Spin>
    </Modal>

    <!-- 选择出游类型 -->
    <Modal
      v-model="isSelectTravelType"
      width="532"
      :mask-closable="false"
      class="travelTypeModal"
      @on-cancel="isSelectTravelType=false;namePostData.TravelType=''"
    >
      <p
        slot="header"
        style="text-align:center;font-size: 18px;"
      >选择出游类型</p>
      <ul class="typeList">
        <li
          v-for="(type,index) in travelTypeList"
          :key="index"
          :class="{'selected': type.Id==namePostData.TravelType}"
          @click="selectTravelType(type)"
        >
          {{type.Name}}
        </li>
      </ul>
      <div
        slot="footer"
        class="foot"
      >
        <Button @click="isSelectTravelType=false;namePostData.TravelType=''">取消</Button>
        <Button
          type="primary"
          @click="toSelectName"
        >确定</Button>
      </div>
    </Modal>

    <!-- 选择产品名称 -->
    <name-modal
      ref="nameModal"
      :isShow="isSelectName"
      :postData="namePostData"
      :selectedName="selectedName"
      @nameChange="nameChange"
      @dataChange="namePostDataChange"
      @cancelNameModal="cancelNameModal"
    ></name-modal>

    <!-- 选择产品规格 -->
    <price-modal
      ref="priceModal"
      :type="namePostData.Type"
      :isShow="isSelectProduct"
      :isPreStep="isSelectName"
      @preStep="preStep"
      @productChange="productChange"
    ></price-modal>
  </FullPage>
</template>
<script>
const COLUMNS = [
  {
    title: '日期',
    key: 'DepartureDate',
    minWidth: 160,
    className: 'nameColumn',
    align: 'left'
  },
  {
    title: '产品类型',
    key: 'ItemType',
    minWidth: 100,
    align: 'left',
  },
  {
    title: '产品名称',
    key: 'Name',
    minWidth: 120,
    className: 'nameColumn',
    align: 'left'
  },

  {
    title: '出游类型',
    key: 'TravelTypeName',
    minWidth: 120,
    align: 'left'
  },
  {
    title: '价格',
    key: 'SalePrice',
    minWidth: 100,
    align: 'left',
    render: (h, params) => {
      return h('div', '￥' + params.row.SalePrice);
    }
  },
  {
    title: '操作',
    slot: 'Action',
    minWidth: 90,
    align: 'center'
  }
]

import FullPage from '@/components/fullscreen-page'
import { getObjectURL, getImgToBase64, dataURLtoFile } from '@/utils/format.js'
import { eitTravelProduct, getProductById, uploadGoodsPdf, deleteGoodsPdf } from '@/api/goods.js'
import { getTravelTypes, getProductTypes, getVisitorTypes, getSuppliers } from '@/api/setting.js'
import { formatProjectType } from '@/utils/format.js'
import { getStoreType } from '@/utils/auth.js'
import NameModal from '@/components/name-modal'
import PriceModal from '@/components/price-modal'

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import Quill from 'quill'  //引入编辑器
var fonts = ['Microsoft-YaHei', 'SimSun', 'SimHei', 'Arial', 'Times-New-Roman'];
var Font = Quill.import('formats/font');
Font.whitelist = fonts; //将字体加入到白名单

import {  validateCoverPhoto, validateDisplayPhoto, validateLineProduct, validateOtherProduct,
  validateComposeSalePrice, validateComposeCostPrice, validateShare} from '@/utils/validate-edit-product.js'
export default {
  name: "editRetailProduct",
  components: { FullPage, NameModal, PriceModal, quillEditor },
  data() {
    const validateTypePrice = (rule, value, callback) => {
      let arr = [];
      if (value.length == 0) {
        callback(new Error('至少上传一个日期、价格'));
      } else {
        this.formData.TypePrice.forEach((item, index) => {
          if (item.DepartureDate == "") {
            callback(new Error('出发日期未填写'));
          } else if (item.UnifiedSale == 1 && !item.SalePrice) {
            callback(new Error('价格未填写'));
          } else if (item.UnifiedSale == 1 && !item.CostPrice) {
            callback(new Error('价格未填写'));
          } else if (item.UnifiedSale == 0) {
            item.VisitorTypePrice.forEach(itm => {
              if (!itm.SalePrice || itm.SalePrice < 0) {
                callback(new Error(itm.VisitorTypeName + '的售价未填写'));
              } else if (!itm.CostPrice || itm.CostPrice < 0) {
                callback(new Error(itm.VisitorTypeName + '的成本价未填写'));
              } else {
                // callback();
                arr[index] = 1;
              }
            })
          } else {
            // callback();
            arr[index] = 1;
          }
        })

      }
      let flag = arr.every(item => item == 1);
      if (flag) {
        callback();
      }

    };
    const validatePermanent = (rule, value, callback) => {
      if (value == 0) {
        if (!this.formData.StartTime) {
          callback(new Error('请选择有效时间'));
        } else if (!this.formData.EndTime) {
          callback(new Error('请选择有效时间'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      //编辑器配置
      editorOption: {
        placeholder: '简介',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            // ['blockquote', 'code-block'],
            // [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            // [{ 'indent': '-1' }, { 'indent': '+1' }],
            // [{ 'direction': 'rtl' }],
            [{ 'size': ['12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px'] }], //'small', false, 'large', 'huge',
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': fonts }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean'],
            // ['image']
            // ['link', 'image', 'video']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
        }

      },
      storeType: "",
      classes: "",  //1分店上传商品管理 2总部审核
      title: "",
      id: "",
      FORMDATA: {
        Name: "",
        TravelProductType: "", //产品分类
        ProductProperty: "",   //产品性质
        TravelType: "",        //出游类型
        DeparturePlace: "",    //出发地
        TypePrice: [],
        HousePrice: null,  //单方差
        // MinTourGroupNum: null,  //最低成团人数
        Status: '1',           // 0. 下架 1.上架 2.待上架 
        OffReason: '',         //下架原因
        ShelfTime: '',         //待上架时间
        CoverPhoto: "",      //背景图
        DisplayPhoto: [],     //展示图 DisplayPhoto1 DisplayPhoto2
        TravelProfile: "",    //行程简介
        TravelPhoto: [],      //详情图
        TravelPdf: [],         //详情pdf
        TravelPdfDetail: [],
        // Share: 1 , //是否共享 1.共享  0.不共享
        // AuditStatus: 1, //审核状态 1.通过  0.不通过 （总部才有这个字段）
        // AuditReason: 1 //审核不通过原因 （总部才有这个字段）
      },
      VISITORTYPE: [],
      TYPEPRICE: {
        DepartureDate: "",
        UnifiedSale: 1,     //1. 统一价格 0.类型价格
        SalePrice: null,   // 类型价格为null
        CostPrice: null,   // 类型价格为null
        VisitorTypePrice: []
      },
      formData: {},
      ruleValidate: {
        Name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { type: 'string', max: 50, message: '最多输入50个字', trigger: 'blur' }
        ],
        TravelProductType: [{ required: true, message: '请选择产品类型', trigger: 'change' },],
        ProductProperty: [{ required: true, message: '请选择产品性质', trigger: 'change' },],
        TypePrice: [{ required: true, validator: validateTypePrice, trigger: 'change' }],
        DeparturePlace: [
          { required: true, message: '请输入出发地', trigger: 'blur' },
          { type: 'string', max: 50, message: '最多输入50个字', trigger: 'blur' }
        ],
        // HousePrice: [{ required: true, type: 'number',message: '请输入单房差', trigger: 'blur' },],
        // MinTourGroupNum: [{ required: true, type: 'number',message: '请输入最低成团人数', trigger: 'blur' },],
        Status: [{ required: true, message: '请选择产品状态', trigger: 'change' },],
        CoverPhoto: [{ required: true, validator: validateCoverPhoto, trigger: 'change' },],
        DisplayPhoto: [{ required: true, validator: validateDisplayPhoto, trigger: 'change' },],
        Supplier: [{ required: true, message: '请选择供应商', trigger: 'change' },],
        Permanent: [{ validator: validatePermanent, trigger: 'change' },],
        VistorType: [{ required: true, message: '请选择游客类型', trigger: 'change' },],
        ComposeSalePrice: [{ required: true, validator: validateComposeSalePrice, trigger: 'blur' },],
        ComposeCostPrice: [{ required: true, validator: validateComposeCostPrice, trigger: 'blur' },],
        LineProduct: [{ required: true, validator: validateLineProduct, trigger: 'change' },],
        OtherProduct: [{ required: true, validator: validateOtherProduct, trigger: 'change' },],
        Share: [{ required: true, validator: validateShare, trigger: 'change' },]
      },
      travelTypeList: [],          //出游类别
      productTypeList: [],         //产品分类
      visitorTypeList: [],         //游客类型
      supplierList: [],            //供应商列表
      //产品性质
      productPropertyList: [
        {
          value: '1',
          label: "境内游"
        },
        {
          value: '2',
          label: "境外游"
        },
        {
          value: '3',
          label: "港澳游"
        },
        {
          value: '4',
          label: "台湾游"
        },
        {
          value: '5',
          label: "其他"
        }
      ],
      isDisabled: false,  //是否可修改字段
      isNoPass: false,    //审核不通过弹窗
      spinShow: false,
      isNext: false,
      showTip: false,
      dateRange: [],
      expiryDateRange: [],
      isSelectTravelType: false, //选择出游类型
      selectedTravelType: {},
      pointType: '',  //1、线路产品，2、其他产品 3、赠送线路产品 4、赠送其他产品
      namePostData: {
        Type: '1',  //1.直营  2.非直营  3.其他  -1全部
        TravelType: '',  //出游类型
        TravelProductType: '', //产品类型
        Name: '', //搜索
        PageIndex: 1,
        PageSize: 10
      },
      isSelectName: false,
      selectedName: '',
      isSelectProduct: false,
      lineProductColumns: COLUMNS,
      otherProductColumns: COLUMNS.slice(0, 3).concat(COLUMNS.slice(4)),
    }
  },
  computed: {
    //allTotal,otherProductTotal,giveLineTotal,giveLineProductTotal,giveOtherProductTotal
    allTotal() {
      if (this.formData.Type == '4') {
        return this.giveLineTotal + this.otherProductTotal + this.giveLineProductTotal + this.giveOtherProductTotal;
      }
    },
    giveLineTotal() {
      if (this.formData.Type == '4') {
        let total = 0;
        this.formData.LineProduct.forEach(item => {
          total += item.SalePrice;
        })
        return total;
      }
    },
    otherProductTotal() {
      if (this.formData.Type == '4') {
        let total = 0;
        this.formData.OtherProduct.forEach(item => {
          total += item.SalePrice;
        })
        return total;
      }
    },
    giveLineProductTotal() {
      if (this.formData.Type == '4') {
        let total = 0;
        this.formData.GiveLineProduct.forEach(item => {
          total += item.SalePrice;
        })
        return total;
      }
    },
    giveOtherProductTotal() {
      if (this.formData.Type == '4') {
        let total = 0;
        this.formData.GiveOtherProduct.forEach(item => {
          total += item.SalePrice;
        })
        return total;
      }
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.classes = this.$route.query.classes;
    let type = this.$route.query.type;
    //修改产品时，可以修改的情况： 总部审核非直营产品，分店未审核通过的非直营产品和其他产品
    this.isDisabled = this.id != undefined && !(this.classes == 2 && type == 2) && this.formData.AuditStatus != 0;
    this.storeType = getStoreType();
    this.getTravelTypeList();
    this.getProductTypeList();
    //自定义其他产品二级分类
    if (type == '3') {
      this.VISITORTYPE.push({
        VisitorTypeName: "",
        SalePrice: null,
        CostPrice: null
      })
    }
    // 游客类型
    if (type == '1' || type == '2' || type == '4') {
      this.getVisitorTypeList();
    }
    if (type == 2) {
      this.getSupplierList()
    }
    if (this.id) {
      this.getDetail();
    } else {
      switch (type.toString()) {
        case '1':
          this.formData = {
            ...this.FORMDATA,
            Type: 1,  //1.直营  2.非直营  3.其他 4. 组合
            ArrivalWay: "1",        //到达方式 
          };
          break;
        case '2':
          this.formData = {
            ...this.FORMDATA,
            Type: 2,  //1.直营  2.非直营  3.其他 4. 组合
            Supplier: "",          //供应商id
            Share: 0, //是否共享 1.共享  0.不共享
          };
          break;
        case '3':
          this.formData = {
            TypePrice: [
              {
                UnifiedSale: 1,     //1. 统一价格 0.类型价格
                SalePrice: null,   // 类型价格为null
                CostPrice: null,   // 类型价格为null
                VisitorTypePrice: []
              }
            ],
            Type: 3,  //1.直营  2.非直营  3.其他 4. 组合
            Name: "",
            TravelProductType: "", //产品分类
            Status: "1",           // 0. 下架 1.上架 2.待上架 
            OffReason: '',         //下架原因
            ShelfTime: "",         //待上架时间
            Permanent: 1,   //永久有效  0.不是 1.是 
            StartTime: "",//不是永久有效时传值
            EndTime: "",  //不是永久有效时传值
            // Stock: 0, //库存
            Authorize: 1, //是否授权 0.不授权 1.授权
            ArrivalWay: "1", //到达方式1. 直达 2.选择性直达
            CoverPhoto: "",      //背景图
            DisplayPhoto: [],     //展示图 DisplayPhoto1 DisplayPhoto2
            TravelProfile: "",    //行程简介
            TravelPhoto: [],      //详情图
            TravelPdf: [],         //详情pdf
            TravelPdfDetail: [],
            Share: 0,
            CanCancle: 0,//1.可取消 0.不可取消                ---------------改
            Logistics: {
              SetShip: 1, // 设置物流 0.未设置 1.设置        ---------------改
              StorePickUp: 1, //到店自提 1.可以自提 0.不可以---------------改
              FreeShipping: 1, //全国包邮 1.包邮 0.不包邮    ---------------改
              ShipPrice: 0,//不是包邮，显示价格              ---------------改
            }
          };
          break;
        case '4':
          this.formData = {
            Type: 4,  //1.直营  2.非直营  3.其他 4. 组合
            Name: "",
            Status: "1",           // 0. 下架 1.上架 2.待上架 
            OffReason: '',         //下架原因
            ShelfTime: '',         //待上架时间
            VistorType: "",      //游客类型
            ComposeSalePrice: null,  //组合产品销售价
            ComposeCostPrice: null,  //组合产品产本价
            LineProduct: [],
            OtherProduct: [],
            GiveLineProduct: [],
            GiveOtherProduct: [],
            ArrivalWay: "1", //到达方式1. 直达 2.选择性直达
            CoverPhoto: "",      //背景图
            DisplayPhoto: [],     //展示图 DisplayPhoto1 DisplayPhoto2
            TravelProfile: "",    //组合说明
          };
          break;
        case '5':
          this.formData = {
            Type: 5,  //1.直营  2.非直营  3.其他 4. 组合 5酒店
            TypePrice: [],
            Name: "",
            TravelProductType: "", //产品分类
            Status: "1",           // 0. 下架 1.上架 2.待上架 
            OffReason: '',         //下架原因
            ShelfTime: "",         //待上架时间
            CoverPhoto: "",      //背景图
            DisplayPhoto: [],     //展示图 DisplayPhoto1 DisplayPhoto2
            TravelProfile: "",    //产品说明
            TravelPhoto: [],      //详情图
            TravelPdf: [],         //详情pdf
            TravelPdfDetail: [],
            Share: 0
          };
          break;
        default:
          this.formData = this.FORMDATA;
      }
    }
    this.title = (this.classes == 2 ? '审核' : this.id ? '修改' : '新增') + formatProjectType(type)
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      // console.log('editor change!', html)
    },
    onEditorFocus(event) {
      if (this.classes == 2 && this.formData.Type == 3) {
        event.enable(false);
      }

    },
    //获取出游类别travelTypeList
    getTravelTypeList() {
      getTravelTypes().then(res => {
        this.travelTypeList = res.Data.TravelTypes;
      }).catch(err => {

      })
    },

    //获取产品分类productTypeList
    getProductTypeList() {
      getProductTypes().then(res => {
        const type = this.$route.query.type;
        let { OtherProductTypes, LineProductTypes, HotelClass, HotelType } = res.Data;
        if (type == '3') {
          this.productTypeList = OtherProductTypes;
        } else if (type == '5') {
          this.productTypeList = HotelClass;
          HotelType.forEach(item => {
            this.VISITORTYPE.push({
              VisitorType: item.Id,
              VisitorTypeName: item.Name,
              SalePrice: null,
              CostPrice: null
            })
          })
        } else {
          this.productTypeList = LineProductTypes;
        }
      }).catch(err => {

      })
    },

    //出游类别
    getVisitorTypeList() {
      getVisitorTypes().then(res => {
        let array = res.Data.VisitorTypes;
        this.visitorTypeList = [...array];
        // if(this.formData.Type != '3'){
        array.forEach(item => {
          this.VISITORTYPE.push({
            VisitorType: item.Id,
            VisitorTypeName: item.Name,
            SalePrice: null,
            CostPrice: null
          })
        })
        // }else{
        //     this.VISITORTYPE.push({
        //         VisitorTypeName: "",
        //         SalePrice: null,
        //         CostPrice: null
        //     })
        // }

      }).catch(err => {

      })
    },
    //新增其他产品类型
    addOtherType() {
      this.formData.TypePrice[0].VisitorTypePrice.push({
        VisitorTypeName: "",
        SalePrice: null,
        CostPrice: null
      })
    },
    //删除其他产品类型
    deleteOtherType(index, indx, name) {
      this.$Modal.confirm({
        title: '请确认是否删除' + name + '？',
        onOk: () => {
          this.formData.TypePrice[index].VisitorTypePrice.splice(indx, 1);
          this.$Message.success('成功删除')
        }
      })
    },
    //组合产品游客类型变化，组合内容和赠送需要清空
    vistorTypeChange() {
      this.formData.LineProduct = [];
      this.formData.OtherProduct = [];
      this.formData.GiveLineProduct = [];
      this.formData.GiveOtherProduct = [];
    },
    addPoint(type, pointType) {
      if (this.id) return;
      this.pointType = pointType;
      if (type == '3' || type == '5') {
        //其他产品
        this.isSelectName = true;
        this.namePostData.Type = type;
        this.$refs.nameModal.getTravelClass(this.namePostData);
      } else {
        //直营、非直营
        if (!this.formData.VistorType) {
          this.$Message.warning("请先选择游客类型");
        } else {
          this.isSelectTravelType = true;
          this.namePostData.Type = type;
        }
      }

    },

    //选择出游类型
    selectTravelType(type) {
      this.selectedTravelType = type;
      this.namePostData.TravelType = type.Id;
    },
    //选择产品名称
    toSelectName() {
      this.isSelectTravelType = false;
      this.isSelectName = true;
      this.$refs.nameModal.getTravelClass(this.namePostData);
    },
    cancelNameModal() {
      this.isSelectName = false;
      this.selectedName = '';
      this.namePostData.TravelType = '';
      this.namePostData.TravelProductType = '';
    },
    namePostDataChange(data) {
      this.namePostData = data;
    },
    nameChange(id) {
      this.selectedName = id;
      this.isSelectName = false;
      this.isSelectProduct = true;
      this.$refs.priceModal.getPriceList({ Id: this.selectedName, VistorType: this.formData.VistorType });
    },
    preStep() {
      this.isSelectProduct = false;
      this.isSelectName = true;
      this.$refs.nameModal.getTravelClass(this.namePostData);
    },
    //新增组合产品 1、线路产品，2、其他产品 3、赠送线路产品 4、赠送其他产品 
    productChange(data) {
      // console.log('data',data)
      let addData = {};
      if (this.namePostData.Type == '3' || this.namePostData.Type == '5') {
        addData = {
          ItemType: data.TypeName, //线路产品：非直营产品，直营产品 ，其他产品：是总部自己添加的其他产品类型
          Name: data.Name,
          TravelProduct: this.selectedName, //主的产品ID
          DepartureDate: data.DepartureDate, //出发日期
          SalePrice: data.Price,//价格
        }
      } else {
        addData = {
          ItemType: this.namePostData.Type == '1' ? '直营产品' : '非直营产品', //线路产品：非直营产品，直营产品 ，其他产品：是总部自己添加的其他产品类型
          Name: data.Name,
          TravelProduct: this.selectedName, //主的产品ID
          DepartureDate: data.DepartureDate, //出发日期
          SalePrice: data.Price,//价格
          TravelType: this.selectedTravelType.Id, //出游类型
          TravelTypeName: this.selectedTravelType.Name,
        }
      }
      if (this.pointType == '1') {
        this.formData.LineProduct.push(addData);
      } else if (this.pointType == '2') {
        this.formData.OtherProduct.push(addData);
      } else if (this.pointType == '3') {
        this.formData.GiveLineProduct.push(addData);
      } else if (this.pointType == '4') {
        this.formData.GiveOtherProduct.push(addData);
      }
      this.isSelectProduct = false;
      this.selectedName = '';
      this.namePostData.TravelType = '';
      this.namePostData.TravelProductType = '';
      this.$refs.priceModal.selectedProduct = '';
    },
    //删除组合产品 1、线路产品，2、其他产品 3、赠送线路产品 4、赠送其他产品 
    deleteTableData(type, index, name) {
      if (this.id) return;
      this.$Modal.confirm({
        title: '请确认是否删除' + name + '？',
        onOk: () => {
          if (type == '1') {
            this.formData.LineProduct.splice(index, 1);
          } else if (type == '2') {
            this.formData.OtherProduct.splice(index, 1);
          } else if (type == '3') {
            this.formData.GiveLineProduct.splice(index, 1);
          } else if (type == '4') {
            this.formData.GiveOtherProduct.splice(index, 1);
          }
          this.$Message.success('成功删除')
        }
      })
    },

    //供应商列表
    getSupplierList() {
      let postData = {
        Name: '',
        Status: -1,
        PageIndex: 1,
        PageSize: 999999
      };
      getSuppliers(postData).then(res => {
        let data = res.Data.Suppliers;
        this.supplierList = data.filter(item => {
          return item.Status == 1;
        })
      }).catch(err => {

      })
    },

    //添加出发日期和价格类型
    addDate(type) {
      this.formData.TypePrice.push({
        ...JSON.parse(JSON.stringify(this.TYPEPRICE)),
        DateType: type
      });
    },
    //删除
    deleteDate(index) {
      this.$Modal.confirm({
        title: '请确认是否删除此出发日期？',
        onOk: () => {
          this.formData.TypePrice.splice(index, 1);
          this.$Message.success('成功删除')
        }
      })
    },

    dateChange(e, index) {
      this.formData.TypePrice[index].DepartureDate = e;
    },
    dateRangeChange(e, index) {
      this.dateRange[index] = e;
      this.formData.TypePrice[index].DepartureDate = e.join('—');
    },
    shelfTimeChange(e) {
      // console.log(e)
      this.formData.ShelfTime = e;
    },
    expiryDateChange(e) {
      // console.log(e)
      this.expiryDateRange = e;
      this.formData.StartTime = e[0];
      this.formData.EndTime = e[1];
    },
    saleTypeChange(e, index) {
      if (e == 1) {
        //统一价格TYPEPRICE
        this.formData.TypePrice[index].VisitorTypePrice = [];
      } else {
        this.formData.TypePrice[index].SalePrice = null;
        this.formData.TypePrice[index].CostPrice = null;
        this.formData.TypePrice[index].VisitorTypePrice = [...JSON.parse(JSON.stringify(this.VISITORTYPE))];
      }
    },
    //有效时间
    permanentChange(e) {
      if (e == 1) {
        this.formData.StartTime = '';
        this.formData.EndTime = '';
      }
    },
    //授权
    authorizeChange(e) {
      if (e == 0) {
        this.formData.ArrivalWay = "";
      }
    },
    handleBeforeChange() {
      return new Promise((resolve) => {
        if (this.formData.Type != 3) {
          resolve();
        }
      });
    },
    freeshippingChange(e) {
      if (e == 1) {
        this.formData.Logistics.ShipPrice = 0;
      }
    },
    expressChange(e) {
      this.formData.Logistics.ShipPrice = e || 0;
    },
    getDetail() {
      this.$Spin.show();
      getProductById(this.id).then(res => {
        this.$Spin.hide();
        this.formData = res.Data.TravelProduct;
        this.isDisabled = this.id != undefined && !(this.classes == 2 && this.formData.Type == 2) && this.formData.AuditStatus != 0;
        if (this.formData.TravelPdfDetail == null) {
          this.formData.TravelPdfDetail = [];
        }
        this.expiryDateRange = [this.formData.StartTime, this.formData.EndTime];
        //时间范围转换成数组
        this.formData.TypePrice.forEach((item, index) => {
          if (item.DepartureDate) {
            if (item.DepartureDate.indexOf('—') != -1) {
              this.dateRange[index] = item.DepartureDate.split('—');
              this.formData.TypePrice[index].DateType = '2';
            } else {
              this.formData.TypePrice[index].DateType = '1';
            }
          }
        })

        //网络地址图片转换成file文件
        if (this.formData.CoverPhoto) {
          this.formData.CoverPhoto = { url: this.formData.CoverPhoto, file: null };
          let self = this;
          getImgToBase64(this.formData.CoverPhoto.url, function (data) {
            self.formData.CoverPhoto.file = dataURLtoFile(data, "CoverPhoto");
          });

        }

        if (this.formData.DisplayPhoto && this.formData.DisplayPhoto.length > 0) {
          this.formData.DisplayPhoto = this.formData.DisplayPhoto.map(item => {
            return { url: item, file: null }
          })
          // console.log(55,this.formData.DisplayPhoto)
          let self = this;
          for (let i = 0; i < this.formData.DisplayPhoto.length; i++) {
            let file;
            getImgToBase64(this.formData.DisplayPhoto[i].url, function (data) {
              file = dataURLtoFile(data, "DisplayPhoto" + (i + 1));
              // console.log('file',file)
              self.formData.DisplayPhoto[i].file = file;
              // console.log('file2',self.formData.DisplayPhoto[i].file)
            });
          }
        }

        if (this.formData.TravelPhoto && this.formData.TravelPhoto.length > 0) {
          this.formData.TravelPhoto = this.formData.TravelPhoto.map(item => {
            return { url: item, file: null }
          })
          let self = this;
          for (let i = 0; i < this.formData.TravelPhoto.length; i++) {
            let file;
            getImgToBase64(this.formData.TravelPhoto[i].url, function (data) {
              file = dataURLtoFile(data, "TravelPhoto" + (i + 1));
              self.formData.TravelPhoto[i].file = file;
            });
          }
        }


      }).catch(err => {
        this.$Spin.hide();
      })
    },
    //上传封面图片
    uploadCoverPhoto(e) {
      let file = e.target.files[0];
      let types = ['image/jpg', 'image/jpeg', 'image/png'];
      if (file) {
        let size = file.size / 1024 / 1024;
        if (!types.includes(file.type)) {
          this.$Message.warning("上传的图片格式不正确！");
          return;
        } else if (size > 5) {
          this.$Message.warning("封面图大小超过5MB");
          return;
        } else {
          this.formData.CoverPhoto = {
            file: file,
            url: getObjectURL(file)
          };
          this.$refs.coverPhoto.value = null;
        }
      }
    },

    //上传 1展示图 2详情图
    uploadImg(e, type) {
      let files = e.target.files;
      // console.log('files',files)
      let types = ['image/jpg', 'image/jpeg', 'image/png'];
      let imgLength = 0;
      if (type == 1) {
        imgLength = this.formData.DisplayPhoto.length + files.length;
      } else {
        imgLength = this.formData.TravelPhoto.length + files.length;
      }
      if (imgLength > 10) {
        this.$Message.warning("最多上传10张照片");
      } else {
        for (let i in files) {
          if (files[i].size) {
            let size = files[i].size / 1024 / 1024;
            if (!types.includes(files[i].type)) {
              this.$Message.warning("上传的图片格式不正确！");
              return;
            } else if (size > 5) {
              this.$Message.warning(files[i].name + " 这张图大小超过5MB");
              return;
            } else {
              let item = {
                file: files[i],
                url: getObjectURL(files[i])
              }
              if (type == 1) {
                this.formData.DisplayPhoto.push(item);
                this.$refs.displayPhoto.value = null;
              } else {
                this.formData.TravelPhoto.push(item);
                this.$refs.travelPhoto.value = null;
              }
            }

          }

        }
      }
    },

    //删除 1展示图 2详情图
    deleteImg(index, type) {
      this.$Modal.confirm({
        title: '请确认是否删除此照片',
        onOk: () => {
          if (type == 1) {
            this.formData.DisplayPhoto.splice(index, 1);
          } else {
            this.formData.TravelPhoto.splice(index, 1);
          }
          this.$Message.success('成功删除图片')
        }
      })
    },

    //上传pdf
    uploadPdf(e) {
      let file = e.target.files[0];
      let types = ['application/pdf'];
      if (file) {
        let size = file.size / 1024 / 1024;
        if (!types.includes(file.type)) {
          this.$Message.warning("请上传pdf文件！");
          return;
        } else if (size > 50) {
          this.$Message.warning("封面图大小超过5MB");
          return;
        } else {
          this.$Spin.show();
          let formInfo = new FormData();
          formInfo.append("pdf", file, file.name);
          uploadGoodsPdf(formInfo).then(res => {
            this.$Spin.hide();
            this.formData.TravelPdf.push(res.Data.Url);
            this.formData.TravelPdfDetail.push(res.Data)
            this.$refs.travelPdf.value = null;
          }).catch(err => {
            this.$Spin.hide();

          })
        }
      }
    },

    //删除pdf
    deletePdf(index, name, id) {
      this.$Modal.confirm({
        title: '请确认是否删除' + name,
        onOk: () => {
          deleteGoodsPdf(id).then(res => {
            this.formData.TravelPdf.splice(index, 1);
            this.formData.TravelPdfDetail.splice(index, 1);
            this.$Message.success('成功删除pdf')
          })
        }
      })
    },

    //下一步
    toNext() {
      console.log('this.formData', this.formData)
      this.$refs['productForm'].validate((valid) => {
        if (valid) {
          this.isNext = true;
        } else {
          this.$Message.error('有必填信息未填写');
        }
      })

    },

    //提交审核
    handleAudit() {
      this.$Modal.confirm({
        title: '温馨提示：是否提交此产品至总部审核',
        onOk: () => {
          this.handleSubmit()
        }
      })
    },

    //审核通过
    auditPass() {
      this.formData.AuditStatus = 1;
      this.handleSubmit();
    },

    //审核不通过
    auditFails() {
      this.formData.AuditStatus = 0;
      this.handleSubmit();
    },

    handleSubmit() {
      if (this.formData.Type == '4') {
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            this.postProductData();
          } else {
            this.$Message.error('信息未填写完整');
          }
        })
      } else {
        this.postProductData();
      }
    },
    postProductData() {
      this.$Spin.show();
      // console.log(0,this.formData)
      if (this.formData.Type == '3') {
        this.formData.Logistics = JSON.stringify(this.formData.Logistics);
      }
      if (this.formData.Type != '4') {
        this.formData.TypePrice.map(item => {
          Reflect.deleteProperty(item, 'DateType')
          return item;
        })
      }

      let formInfo = new FormData();
      formInfo.append("CoverPhoto", this.formData.CoverPhoto.file, "CoverPhoto");
      for (let i = 0; i < this.formData.DisplayPhoto.length; i++) {
        formInfo.append("DisplayPhoto" + (i + 1), this.formData.DisplayPhoto[i].file, "DisplayPhoto" + (i + 1));
      }

      if (this.formData.Type != '4') {
        for (let i = 0; i < this.formData.TravelPhoto.length; i++) {
          formInfo.append("TravelPhoto" + (i + 1), this.formData.TravelPhoto[i].file, "TravelPhoto" + (i + 1));
        }
      }

      for (let x in this.formData) {
        if (x != "CoverPhoto" && x != "DisplayPhoto" && x != "TravelPhoto" && x != "CreateTime" && x != "ProductPropertyStr"
          && x != "TravelProductTypeName" && x != "TravelTypeName" && x != "VistorTypeName" && x != "TravelPdfDetail") {
          if (x == 'TypePrice' || x == 'TravelPdf' || x == 'LineProduct' || x == 'OtherProduct' || x == 'GiveLineProduct' || x == 'GiveOtherProduct') {
            // if(this.formData[x]==null){
            //     formInfo.append(x,this.formData[x]);
            // }else{
            formInfo.append(x, JSON.stringify(this.formData[x]));
            // }
          } else {
            formInfo.append(x, this.formData[x]);
          }
        }
      }
      eitTravelProduct(formInfo).then(res => {
        this.$Spin.hide();
        if (this.classes == 1) {
          this.$Message.success('已经提交审核');
        } else if (this.classes == 2) {
          this.$Message.success(this.formData.AuditStatus == 0 ? '确定审核不通过' : '确定审核通过');
        } else {
          this.$Message.success('成功' + this.title);
        }

        this.formData = {}
        this.$router.back();

      }).catch(err => {
        if (this.formData.Type == '3') {
          this.formData.Logistics = JSON.parse(this.formData.Logistics);
        }
        this.$Spin.hide();
      })
    }
  }
}
</script>
<style lang="less">
.editRetailProduct {
  .littleInput {
    width: 120px;
    margin: 0 10px;
  }
  .littleSelect {
    width: 120px;
    .ivu-select-selection {
      width: 120px;
    }
  }
  .ivu-date-picker-rel .ivu-input-wrapper {
    width: 528px;
  }
  .unmarked .ivu-form-item-label:before {
    content: "";
  }
  .expiryDate {
    width: 320px;
    margin-left: 10px;
    .ivu-date-picker-rel .ivu-input-wrapper {
      width: 320px;
    }
  }
  .shelfTime {
    width: 200px;
    .ivu-date-picker-rel .ivu-input-wrapper {
      width: 200px;
    }
  }
  .hideTip .ivu-form-item-error-tip {
    display: none;
  }
  .ivu-table-wrapper {
    margin-bottom: 15px;
    .ivu-btn {
      color: #3275f5;
    }
    .ivu-table td.nameColumn > div {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
<style lang="less" scoped>
.editRetailProduct {
  box-sizing: border-box;
  padding-bottom: 80px;
  .guideWrap {
    position: relative;
    padding-bottom: 35px;
    .bg {
      width: 100%;
      max-width: 945px;
      height: 60px;
      background-image: url("../../assets/product-bg1.svg");
      background-size: contain;
      background-repeat: no-repeat;
    }
    .nextStep {
      background-image: url("../../assets/product-bg2.svg");
    }
    .line {
      position: absolute;
      left: -30px;
      right: -28px;
      bottom: 0;
      height: 10px;
      background-color: #f7f8fa;
    }
  }
  .form {
    margin-top: 30px;
    .ivu-form-item {
      p {
        line-height: 1.4;
      }
      .addPoint {
        color: #3275f5;
        line-height: 32px;
        cursor: pointer;
      }
      .row {
        width: 320px;
      }
      .total {
        background-color: #f9f9f9;
        line-height: 40px;
        padding: 0 15px;
      }
      @media screen and (max-width: 768px) {
        .row {
          width: 230px;
        }
      }
      .addDate {
        display: inline-block;
        // color: #0899AC;
        color: #999;
        border: 1px dashed #999;
        line-height: 36px;
        padding: 0 10px;
        cursor: pointer;
      }
      .tipModel {
        padding: 10px 20px;
        line-height: 1.5;
        background-color: #999;
        border-radius: 4px;
        position: absolute;
        top: 0;
        left: 350px;
        color: #fff;
      }
      .authorize .tipModel {
        left: 230px;
      }
      @media screen and (max-width: 768px) {
        .tipModel {
          top: -90px;
          left: -60px;
        }
      }
    }
    .imgList {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 200px;
        margin-right: 20px;
        margin-bottom: 10px;
        position: relative;
        border-radius: 4px;
        img.item {
          width: 200px;
          border-radius: 4px;
        }
        .delete {
          cursor: pointer;
          position: absolute;
          right: -5px;
          top: -5px;
        }
      }
    }
    .upload {
      width: 200px;
      height: 112px;
      border: 1px dashed #999;
      line-height: 112px;
      text-align: center;
      input {
        position: absolute;
        width: 200px;
        height: 112px;
        right: 0;
        top: 0;
        cursor: pointer;
        opacity: 0;
        z-index: 5;
      }
    }
    .imgWrap {
      position: relative;
      width: 200px;
      &:hover .maskWrap {
        display: flex;
      }
      .maskWrap {
        background: rgba(0, 0, 0, 0.3);
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: none;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        p {
          color: #fff;
        }
        input {
          position: absolute;
          width: 200px;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          cursor: pointer;
          opacity: 0;
          z-index: 5;
        }
      }
      .img {
        border-radius: 4px;
        width: 200px;
      }
    }
    .coverPhoto {
      position: relative;
    }
    .pdfList {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 85px;
        // height: 90px;
        margin-right: 20px;
        margin-bottom: 10px;
        position: relative;
        border-radius: 4px;
        a {
          display: block;
        }
        p {
          width: 85px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 12px;
          color: #ccc;
        }
        img.item {
          width: 85px;
        }
        .delete {
          cursor: pointer;
          position: absolute;
          right: -5px;
          top: -5px;
        }
      }
      .upload {
        width: 85px;
        height: 90px;
        border: 1px dashed #999;
        line-height: 90px;
        text-align: center;
        input {
          position: absolute;
          width: 85px;
          height: 90px;
          right: 0;
          top: 0;
          cursor: pointer;
          opacity: 0;
          z-index: 5;
        }
      }
    }
    .dateList {
      margin-bottom: 15px;
    }
    .visitorList {
      margin-left: 95px;
      > div {
        display: flex;
        margin-bottom: 25px;
        &:last-of-type {
          margin-bottom: 5px;
        }
      }
    }
  }
  .bottom {
    background: #fff;
    border-top: 1px solid #e4e4e4;
    display: flex;
    justify-content: center;
    padding: 15px 0;
    position: fixed;
    bottom: 10px;
    left: 10px;
    right: 10px;
    z-index: 99;
    > .ivu-btn {
      height: 40px;
      width: 160px;
      margin-left: 30px;
      &:first-of-type {
        margin-left: 0;
      }
    }
  }
}

.travelTypeModal {
  .typeList {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 110px;
      height: 40px;
      line-height: 40px;
      background-color: #f7f8fa;
      border: 1px solid #e4e4e4;
      border-radius: 4px;
      margin-bottom: 10px;
      margin-right: 15px;
      text-align: center;
      padding: 0 10px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
}
.noPassModal {
  .foot {
    text-align: center;
    .ivu-btn {
      width: 120px;
      height: 38px;
      line-height: 38px;
      font-size: 16px;
    }
  }
}
.travelTypeModal {
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
  ul li.selected {
    border: 1px solid #3275f5;
    position: relative;
    overflow: hidden;
    &::after {
      content: "";
      width: 35px;
      height: 35px;
      border: 1px solid #3275f5;
      background-color: #3275f5;
      position: absolute;
      right: 0;
      bottom: -1px;
      transform: rotate(45deg) translate(72%);
      z-index: 7;
    }

    &::before {
      content: "✔";
      position: absolute;
      right: 1px;
      bottom: -11px;
      color: #fff;
      z-index: 9;
      font-size: 13px;
    }
  }
}
</style>