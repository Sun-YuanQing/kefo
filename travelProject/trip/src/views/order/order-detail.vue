<template>
    <div class="orderDetail">
        <Header :title="title" @change-router="$router.back()"></Header>
        <div class="content" :style="{'padding-bottom': (formData.State==11 || (formData.State==21 && formData.ProductType==5) || formData.State==23) ? '80px' : '0'}">
            <div class="process">
                <ul class="steps">
                    <li v-for="(step,index) in stepList" :key="index"
                        :class="{'actived': formData.State >= step.state}">
                        <span>{{step.title}}</span>
                        <img :src="formData.State >= step.state ? step.activedImg : step.img" alt="">
                        <span>{{step.time}}</span>
                        <span v-if="formData.IsAssem && index==2 && formData.PayAmount > 0" class="groupBook">{{formData.AssemState | assemState}}</span>
                    </li>
                </ul>
                <div class="detail">
                    <ul>
                        <li>订单状态：
                            <span v-if="formData.ProductType==5 && formData.State==11" class="red">待确认</span>
                            <span v-else-if="formData.ProductType==3 && formData.State==11" class="red">待发货</span>
                            <span v-else-if="formData.ProductType==3 && formData.State==21" class="red">已发货</span>
                            <span v-else-if="formData.ProductType==5 && formData.State==21" class="red">待入住</span>
                            <span v-else class="red">{{formData.State | orderState}}</span>
                        </li>
                        <li>实付款：
                            <Amount :value="formData.PayAmount"></Amount>
                            <span style="color: #3275F5;font-size: 14px;padding: 0 15px;cursor: pointer;"
                                  @click="isShowDetail = true;">明细</span>
                            <span v-if="formData.State==10" @click="isChange=true;"
                                  style="color: #3275F5;font-size: 12px;border: 1px solid #3275F5;padding: 2px 6px;cursor: pointer;"
                            >改价</span>
                        </li>
                    </ul>
                    <ul>
                        <li>订单类型：{{formData.IsSeck ? '秒杀订单' : formData.IsAssem ? '拼团订单' : "普通订单"}}</li>
                        <li>订单编号：{{formData.OrderNo}}</li>
                        <li>付款方式：{{formData.PayType}}</li>
                    </ul>
                </div>
            </div>

            <div class="productInfo">
                <p class="title">商品信息</p>
                <Table  :columns="columms" :data="productData"  disabled-hover>
                    <template slot-scope="{ row }" slot="Action">
                        <Button v-if="row.State==11"  @click="isAddLogisticsInfo = true;" style="color: #3275F5;border-color: #3275F5;">立即发货</Button>
                        <span v-else>已发货</span>
                    </template>
                </Table>
            </div>

            <div class="linkmanInfo" v-if="formData.ProductType != 5">
                <p class="title">联系人信息</p>
                <template v-if="(formData.State==11 && formData.ProductType != 3) || isEdited">
                    <Form v-if="formData.State==11 && formData.ProductType != 3" ref="linkForm" :label-width="110"
                        :model="linkData" :rules="ruleValidate">
                        <FormItem  label="姓名：" prop="ContactName">
                            <Input v-model="linkData.ContactName"/>
                        </FormItem>
                        <FormItem  label="联系方式：" prop="ContactPhone">
                            <Input v-model="linkData.ContactPhone" maxlength="11"/>
                        </FormItem>
                    </Form>
                    <Form v-if="isEdited" ref="linkForm" :label-width="110"
                            :model="receivingInfo" :rules="ruleValidate">
                        <FormItem  label="姓名：" prop="Name">
                            <Input v-model="receivingInfo.Name"/>
                        </FormItem>
                        <FormItem  label="联系方式：" prop="Phone">
                            <Input v-model="receivingInfo.Phone" maxlength="11"/>
                        </FormItem>
                        <FormItem label="备注：" prop="UserRemark">
                            <Input v-model="receivingInfo.UserRemark" maxlength="50"/>
                        </FormItem>
                    </Form>
                </template>
                <div v-else class="listWrap">
                    <div class="head"></div>
                    <div class="list">
                        <Row :gutter="10">
                            <Col :xs="24" :sm="12" :md="8"><span>姓名</span>{{formData.ContactName || '-'}}</Col>
                            <Col :xs="24" :sm="12" :md="8"><span>联系方式</span>{{formData.ContactPhone || '-'}}</Col>
                        </Row>
                        <Row v-if="formData.ProductType == 3" :gutter="10">
                            <Col :xs="24"><span>备注</span>{{formData.UserRemark  || '-'}}</Col>
                        </Row>
                    </div>
                </div>
            </div>
            
            <!-- 收货信息 -->
            <div class="linkmanInfo" v-if="formData.ProductType == 3 && (formData.State != 10 && formData.State != 0)">
                <p class="title">收货信息</p>
                <Form  v-if="isEdited" ref="receivingFrom" :label-width="110"
                      :model="receivingInfo" :rules="ruleValidate">
                    <FormItem  label="提货方式：">
                        <Input disabled :value="formData.TakeWay==1 ? '快递邮寄' : '门店自提'"/>
                    </FormItem>
                    <FormItem  :label="formData.TakeWay==1 ? '收货人：' : '联系人：'" prop="ReceName">
                        <Input v-model="receivingInfo.ReceName"/>
                    </FormItem>
                    <FormItem  label="联系方式：" prop="RecePhone">
                        <Input v-model="receivingInfo.RecePhone" maxlength="11"/>
                    </FormItem>
                    <FormItem label="收货地址：" required v-if="formData.TakeWay==1">
                        <FormItem prop="Province" style="margin-bottom: 20px;" class="row">
                            <v-distpicker
                            :province="receivingInfo.Province"
                            :city="receivingInfo.City"
                            :area="receivingInfo.District"
                            @province="onChangeProvince"
                            @city="onChangeCity"
                            @area="onChangeArea"></v-distpicker>
                        </FormItem>
                        <FormItem prop="Address">
                            <Input v-model="receivingInfo.Address" placeholder="详细地址，例：沙河街道16号楼5层501"/>
                        </FormItem>
                    </FormItem>
                </Form>
                <div v-else class="listWrap">
                    <div class="head"></div>
                    <div class="list">
                        <Row :gutter="10">
                            <Col :xs="24" :sm="12" :md="8">
                                <span>提货方式</span>
                                {{formData.TakeWay==1 ? "快递邮寄" : "门店自提"}}
                            </Col>
                            <Col :xs="24" :sm="12" :md="8">
                                <span>{{formData.TakeWay==1 ? "收货人" : "联系人"}}</span>
                                {{receivingInfo.ReceName || '-'}}
                            </Col>
                            <Col :xs="24" :sm="12" :md="8">
                                <span>联系方式</span>
                                {{receivingInfo.RecePhone || '-'}}
                            </Col>
                            <Col :xs="24" :sm="12" :md="8" v-if="formData.TakeWay==1">
                                <span>收货地址</span>
                                {{receivingInfo.Province + " " + receivingInfo.City + " " + receivingInfo.District + " " + receivingInfo.Address  || '-'}}
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            <!-- 物流动态 -->
            <div class="logisticsInfo logisticsInfo2" v-if="formData.ProductType == 3 && formData.State == 21 && formData.ExpressResultList.length>0">
                <p class="title">物流动态</p>
                <RadioGroup v-if="formData.ExpressResultList.length > 1" style="margin-bottom: 20px;"
                            v-model="logisticsIndex" type="button">
                    <Radio  :label="index" v-for="(item,index) in formData.ExpressResultList" 
                            :key="index">物流{{index+1}}</Radio>
                </RadioGroup>
                <div v-if="formData.ExpressResultList[logisticsIndex] && formData.ExpressResultList[logisticsIndex].result">
                    <Row :gutter="10">
                        <Col :xs="24" :sm="12" :md="6" v-if="formData.ExpressResultList.length > 1">
                                产品名称：<span>{{formData.ProductName || '-'}}</span></Col>
                        <Col :xs="24" :sm="12" :md="6">物流状态：
                            <span style="color: #E94E27;font-weight: 700;">{{formData.ExpressResultList[logisticsIndex].result.deliverystatus | deliveryStatus}}</span></Col>
                        <Col :xs="24" :sm="12" :md="6">物流公司：
                            <span>{{formData.ExpressResultList[logisticsIndex].result.expName || '-'}}</span></Col>
                        <Col :xs="24" :sm="12" :md="6">订单编号：
                            <span>{{formData.ExpressResultList[logisticsIndex].result.number || '-'}}</span></Col>
                    </Row>
                    <light-timeline :items='formData.ExpressResultList[logisticsIndex].result.list' 
                                    v-if="formData.ExpressResultList[logisticsIndex].result.list && formData.ExpressResultList[logisticsIndex].result.list.length>0">
                        <template slot='tag' slot-scope='{ item }'>
                            {{item.time}}
                        </template>
                        <template slot='content' slot-scope='{ item }'>
                            {{item.status}}
                        </template>
                        <template slot='symbol' slot-scope='{ item }'>
                            <img v-if="item.index==0" src="@/assets/arrive-icon.svg" alt="">
                            <div v-else class="myIcon"></div>
                        </template>
                    </light-timeline>
                </div>
            </div>

             <!-- 验证信息 -->
            <div class="linkmanInfo" v-if="formData.ProductType == 3 && formData.State >= 23">
                <p class="title">验证信息</p>
                <Form  v-if="formData.State == 23" :label-width="110">
                    <FormItem  label="提货码：" required>
                        <!-- <div style="display: flex;align-items: center;"> -->
                            <Input v-model="takeCode"/>
                            <!-- <span style="padding: 0 10px; cursor: pointer;color: #3275F5" @click="verifyTakeCode">立即验证</span> -->
                        <!-- </div> -->
                        <div style="color: #E94E27;font-size: 13px;">{{takeCodeTip}}</div>
                    </FormItem>
                </Form>
                <div v-else>
                    <div class="list">
                        <Row :gutter="10">
                            <Col :xs="24"><span>提货码</span>{{ formData.TakeCode }}</Col>
                        </Row>
                    </div>
                </div>
            </div>

            <template v-if="formData.ProductType == 5 && formData.State != 10">
                <!-- 入住信息 -->
                <div class="linkmanInfo">
                    <p class="title">入住信息</p>
                    <Form v-if="formData.State==11" ref="checkInForm" :label-width="110"
                        :model="checkInInfo" :rules="ruleValidate">
                        <FormItem  label="姓名：" prop="Name">
                            <Input v-model="checkInInfo.Name"/>
                        </FormItem>
                        <FormItem  label="联系方式：" prop="Phone">
                            <Input v-model="checkInInfo.Phone" maxlength="11"/>
                        </FormItem>
                        <FormItem  label="证件类型：" >
                            <Input v-model="checkInInfo.ItemType" disabled/>
                        </FormItem>
                        <FormItem  label="证件号：" prop="IdCard">
                            <Input v-model="checkInInfo.IdCard" maxlength="18"/>
                        </FormItem>
                        <FormItem  label="特殊要求：" prop="Remark">
                            <Input v-model="checkInInfo.Remark" disabled/>
                        </FormItem>
                    </Form>
                    <div v-else class="listWrap">
                        <div class="head"></div>
                        <div class="list">
                            <Row :gutter="10">
                                <Col :xs="24" :sm="12" :md="8"><span>姓名</span>{{checkInInfo.Name || '-'}}</Col>
                                <Col :xs="24" :sm="12" :md="8"><span>联系方式</span>{{checkInInfo.Phone || '-'}}</Col>
                                <Col :xs="24" :sm="12" :md="8"><span>证件类型</span>居民身份证</Col>
                                <Col :xs="24" :sm="12" :md="8"><span>证件号</span>{{checkInInfo.IdCard || '-'}}</Col>
                                <Col :xs="24" :sm="12" :md="8"><span>特殊要求</span>{{checkInInfo.Remark || '无'}}</Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <!-- 备注 -->
                <div class="linkmanInfo">
                    <p class="title">备注</p>
                    <Form v-if="formData.State==11" :label-width="110" >
                        <FormItem  label="备注：">
                            <Input v-model="formData.Remark"  maxlength="50" placeholder="请输入对客户的备注"/>
                        </FormItem>
                    </Form>
                    <div v-else class="listWrap">
                        <div class="head"></div>
                        <div class="list">
                            <Row :gutter="10">
                                <Col :xs="24"><span>备注</span>{{formData.Remark || '无'}}</Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </template>
            

            <!-- <div class="travelerInfo">
                <p class="title">出行人信息</p>
                <div v-if="!formData.OrderTouristList || formData.OrderTouristList.length==0">
                    <div class="head"><img src="@/assets/traveler-icon.svg" alt="">出行人</div>
                    <div class="dataNone">暂无出行人信息</div>
                </div>
                <template v-else>
                    <div v-for="(traveler,index) in formData.OrderTouristList" :key="index">
                        <div class="head"><img src="@/assets/traveler-icon.svg" alt="">出行人{{index+1}}</div>
                        <ul>
                            <li>
                                <p><span>姓名</span>{{traveler.TouristName || '-'}}</p>
                                <p><span>联系方式</span>{{traveler.TouristPhone || '-'}}</p>
                                <p><span>邮箱号</span>{{traveler.TouristEmail || '-'}}</p>
                                <p><span>证件号</span>{{traveler.IdCard || '-'}}</p>
                                <p><span>证件类型</span>{{traveler.ItemType || '-'}}</p>
                                <p><span>游客类型</span>{{traveler.TouristType || '-'}}</p>
                            </li>
                        </ul>
                    </div>
                </template>
            </div> -->

        </div>
        <div class="bottom" v-if="formData.State==11 || formData.State==21 || formData.State==23">
            <template v-if="formData.State==11">
                <template v-if="formData.ProductType == 5">
                    <Button style="margin-right: 20px;" @click="isNoPass=true;">不通过</Button>
                    <Button type="primary" @click="passAudit('checkInForm',1)">通过并保存信息</Button>
                </template>
                <template v-else-if="formData.ProductType == 3">
                    <template v-if="isEdited">
                        <Button style="margin-right: 20px;width: 120px;" @click="isEdited = false">取消</Button>
                        <Button style="width: 120px;" type="primary" @click="comfirmOther">确定</Button>
                    </template>
                    <Button v-else type="primary" @click="isEdited = true;">编辑</Button>
                </template>
                <Button v-else type="primary" @click="passAudit('linkForm',2)">确认订单</Button>
            </template>
            <Button v-if="formData.ProductType == 5 && formData.State==21" type="primary" @click="comfirmCheckIn(1)">确认入住</Button>
            <Button v-if="formData.ProductType == 3 && formData.State==23" type="primary" @click="verifyTakeCode">立即提货</Button>
        </div>

        <!-- 审核不通过 -->
        <Modal v-model="isNoPass" width="520" :mask-closable="false"  class="noPassModal"
                @on-cancel="isNoPass=false;">
            <Form  :label-width="100" style="margin-top: 40px;">
                <FormItem label="不通过原因">
                    <Input v-model="unAuditReason" type="text" maxlength="20"  
                    style="width: 350px;" placeholder="最多20个字（可不填）"/>
                </FormItem>
            </Form>
            <div slot="footer" class="foot">
                <Button  @click="isNoPass=false;">取消</Button>
                <Button type="primary" @click="failAudit">确定</Button>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Modal>

        <!-- 价格详情 -->
        <Modal v-model="isShowDetail" width="400" @on-cancel="isShowDetail = false;"
                :footer-hide="true" :mask-closable="false" class="orderPriceModal">
            <div class="content">
                <div class="detailWrap">
                    <div class="title">
                        <p>产品</p>
                        <p>
                            <span>{{formData.ProductName}}</span>
                            <span>￥{{formData.TotalAmount}}</span>
                        </p>
                    </div>
                    <ul class="priceList">
                        <li v-for="(item,index) in formData.OrderPriceList" :key="index">
                            <span>{{item.ItemName}}x{{item.ItemNum}}</span>
                            <span>￥{{item.ItemPrice * item.ItemNum}}</span>
                        </li>
                        <li v-if="formData.IsSparerpart==0">
                            <span>单房差</span>
                            <span>￥{{formData.SparerpartPrice || 0}}</span>
                        </li>
                    </ul>
                </div>
                <ul class="otherFees" v-if="formData.ProductType == 3">
                    <li>
                        <span>运费（快递）</span>
                        <span>￥{{formData.ExpressAmount || 0}}</span>
                    </li>
                </ul>
                <div class="total">应付款：<span>￥{{formData.ActualAmount}}</span></div>
            </div>
        </Modal>

        <!-- 修改价格 -->
        <Modal v-model="isChange" width="450" :mask-closable="false" 
               class="changeOrderModal" @on-cancel="changePrice=null;logisticsPrice=null">
            <p slot="header" style="text-align:center;font-size: 18px;">修改价格</p>
            <Form ref="editedForm" :label-width="90">
                <template v-if="formData.ProductType==3">
                    <FormItem  label="商品售价">
                        <InputNumber :max="999999999" :min="0" :precision="2" v-model="changePrice" style="width: 260px;"></InputNumber>&nbsp;元
                    </FormItem> 
                    <FormItem  label="商品运费">
                        <InputNumber :max="999999999" :min="0" :precision="2" v-model="logisticsPrice" style="width: 260px;"></InputNumber>&nbsp;元
                    </FormItem>   
                </template>
                <FormItem v-else label="实付款">
                    <InputNumber :max="999999999" :min="0" :precision="2" v-model="changePrice" style="width: 260px;"></InputNumber>&nbsp;元
                </FormItem>
            </Form>
            <div slot="footer" class="foot">
                <Button type="primary" @click="editPrice">保存</Button>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Modal>

        <!-- 添加物流信息 -->
        <Modal v-model="isAddLogisticsInfo" width="450" :mask-closable="false" 
               class="logisticsModal" @on-cancel="cancelLogisticsModal">
            <p slot="header" style="text-align:center;font-size: 18px;">添加物流信息</p>
            <Form ref="logisticsForm" :label-width="90">
                <div v-for="(info,index) in LogisticsInfo" :key="index" style="margin-bottom: 25px">
                    <FormItem  label="物流公司">
                        <Input type="text" v-model="info.ExpressName" style="width: 260px;"/>
                    </FormItem> 
                    <FormItem  label="运单编号">
                        <div class="action">
                            <Input type="text" v-model="info.ExpressNo" style="width: 260px;" placeholder="请输入运单号"/>
                            <span class="add" v-if="index == LogisticsInfo.length-1" @click="addLogistics">新增</span>
                            <img  class="delete" v-else src="@/assets/delete-icon3.svg" @click="deleteLogistics(index)" alt="删除">
                        </div>
                    </FormItem> 
                </div>
            </Form>
            <div slot="footer" class="foot">
                <Button type="primary" @click="setLogistics">保存</Button>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Modal>
    </div>
</template>
<script>
import VDistpicker from 'v-distpicker'
import Header from '@/components/route-header'
import Amount from '@/components/amount'
import { getOrderDetail, changePrice, setTraveOrderAudit,setTraveOrderDone, SetTraveOrderBindExpress, setTraveOrderSure } from '@/api/order.js'
import { transformProductType } from '@/utils/transform.js'
import { validatePhone,validateCardId } from '@/utils/validate'
export default {
    components: { Header, Amount, VDistpicker },
    data(){
        const validateProvince = (rule, value, callback) => {
            if(this.receivingInfo.Province=='' && this.receivingInfo.City=='' && this.receivingInfo.District==''){
                callback(new Error('请选择省市区'));
            }else if(this.receivingInfo.City=='' && this.receivingInfo.District==''){
                callback(new Error('请选择市和区'));
            }else if(this.receivingInfo.Province==''){
                callback(new Error('请选择省'));
            }else if(this.receivingInfo.City==''){
                callback(new Error('请选择城市'));
            }else if(this.receivingInfo.District==''){
                callback(new Error('请选择区域'));
            }else{
                callback();
            }
        }
        return{
            id: "",
            formData: {},
            isShowDetail: false,
            isChange: false,
            spinShow: false,
            isNoPass: false,
            isEdited: false, //物流编辑
            isAddLogisticsInfo: false, //添加物流信息
            LogisticsInfo:[{
                ExpressNo: "",
                ExpressName: ""
            }],
            logisticsIndex: 0,
            verificationCode: null,
            changePrice: null,
            logisticsPrice: null,
            title: "产品订单详情",
            takeCode: "",
            takeCodeTip: "",
            productData:[],
            productColumns: [
                {
                    title: '产品封面图',
                    key: 'CoverPhoto ',
                    minWidth: 120,
                    align: 'center',
                    render: (h, params) => {
                                return h('img', {
                                    attrs: {
                                        src: params.row.CoverPhoto
                                    },
                                    style: {
                                        width: '120px',
                                        maxHeight: '80px',
                                        marginTop: '5px'
                                    }
                                });
                            }
                },
                {
                    title: '产品名称',
                    key: 'ProductName',
                    minWidth: 200,
                    className: 'nameColumn',
                    align: 'center'
                },
                {
                    title: '产品性质',
                    key: 'ProductProperty',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '出游类型',
                    key: 'TraveType',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '出发日期',
                    key: 'DepartuDate',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '游客类型',
                    key: 'Type',
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '出发地',
                    key: 'DepartuPlace',
                    minWidth: 120,
                    className: 'nameColumn',
                    align: 'center'
                },
                {
                    title: '产品分类',
                    key: 'TraveType',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '产品类型',
                    key: 'Type',
                    minWidth: 180,
                    align: 'center'
                },
                //酒店
                {
                    title: '产品分类',
                    key: 'HotelClassName',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '产品类型',
                    key: 'HotelTypeName',
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '入住日期',
                    key: 'DepartuDate',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '离店日期',
                    key: 'LeaveDate',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '发货状态',
                    slot: 'Action',
                    minWidth: 120,
                    align: 'center'
                },
            ],
            //确定其他订单
            receivingInfo:{
                TraveOrderId: "",
                TakeWay: "",
                Name: "",
                Phone: "",
                UserRemark: "",
                ReceName: "",
                RecePhone:"",
                Province:"",
                City:"",
                District:"",
                Address:""
            },
            linkData:{
                TraveOrderId: "",
                ContactName:"",
                ContactPhone: "",
                Remark: ""
            },
            checkInInfo: {
                Id: "",
                ItemType: "居民身份证",
                Name: "",
                IdCard: "",
                Phone: "",
                Remark: ""
            },
            unAuditReason: "", //审核不通过原因
            ruleValidate: {
                ContactName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                        { type: 'string', max: 16, message: '最多输入16个字', trigger: 'blur' }
                     ],
                ContactPhone: [{ required: true, validator: validatePhone, trigger: 'blur' },],
                Name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                        { type: 'string', max: 16, message: '最多输入16个字', trigger: 'blur' }
                     ],
                Phone: [{ required: true, validator: validatePhone, trigger: 'blur' },],
                IdCard: [{ required: true, validator: validateCardId, trigger: 'blur' },],
                ReceName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                        { type: 'string', max: 16, message: '最多输入16个字', trigger: 'blur' }
                     ],
                RecePhone: [{ required: true, validator: validatePhone, trigger: 'blur' },],
                Province: [{ required: true, validator: validateProvince, trigger: 'change' }], 
                Address: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                    { type: 'string', max: 50, message: '最多输入50个字', trigger: 'blur' }
                ],
            }
        }
    },
    created(){
        this.id = this.$route.query.id;
        this.getData();
    },
    computed: {
        stepList(){
            let arr = [
                    {
                        title: "提交订单",
                        img: require('../../assets/submited-order.svg'),
                        activedImg: require('../../assets/submited-order.svg'),
                        time: this.formData.CreateTime || '',
                        state: "10"
                    },
                    {
                        title: this.formData.ProductType=='3' ? "付款时间" : "支付订单",
                        img: require('../../assets/pay-order.svg'),
                        activedImg: require('../../assets/paid-order.svg'),
                        time: this.formData.PayTime || '',
                        state: "11"
                    },
                    {
                        title: "确认订单",
                        img: require('../../assets/confirm-order.svg'),
                        activedImg: require('../../assets/confirmed-order.svg'),
                        time: this.formData.AuditTime || '',
                        state: "21"
                    },
                    {
                        title: "发货时间",
                        img: require('../../assets/deliver-order.svg'),
                        activedImg: require('../../assets/delivered-order.svg'),
                        time: this.formData.AuditTime || '',
                        state: "21"
                    },
                    {
                        title: "提货时间",
                        img: require('../../assets/pickup-goods.svg'),
                        activedImg: require('../../assets/pickuped-goods.svg'),
                        time: this.formData.OrderDoneTime || '',
                        state: "30"
                    },
                    {
                        title: "交易完成",
                        img: require('../../assets/finish-order.svg'),
                        activedImg: require('../../assets/finished-order.svg'),
                        time: this.formData.DepartuDate || '', //DepartuDate
                        state: "30"
                    }
                ];
            if(this.formData.ProductType=='3'){
                if(this.formData.State >= 23 || this.formData.State == 0){
                     return arr.slice(0,2).concat(arr.slice(4))
                }else{
                    return arr.slice(0,2).concat(arr.slice(3,4)).concat(arr.slice(5))
                }
            }else{
                return arr.slice(0,3).concat(arr.slice(5));
            }
            
        },
        columms(){
            if(this.formData.ProductType=='5'){
                return this.productColumns.slice(0,2).concat(this.productColumns.slice(9,13))
            }else if(this.formData.ProductType=='3'){
                if(this.formData.State==10 || this.formData.State==22){
                    return this.productColumns.slice(0,2).concat(this.productColumns.slice(7,9))
                }else{
                    return this.productColumns.slice(0,2).concat(this.productColumns.slice(7,9)).concat(this.productColumns.slice(13))
                }
                
            }else{
                return this.productColumns.slice(0,7);
            }
        }
    },
    methods: {
        getData(){
            this.$Spin.show();
            getOrderDetail(this.id).then(res => {
                this.$Spin.hide();
                this.formData = res.Data;
                if(!this.formData.TakeWay){
                    this.formData.TakeWay = 1;
                }
                this.title = transformProductType(res.Data.ProductType) + '订单详情';
                let type = "";
                this.formData.OrderPriceList.forEach(item => {
                    type+=item.ItemName + 'x' + item.ItemNum +' ';
                })
                this.productData = [{
                    ProductName: this.formData.ProductName,
                    TraveType: this.formData.TraveType,
                    DepartuDate: this.formData.DepartuDate,
                    DepartuPlace: this.formData.DepartuPlace,
                    ProductProperty: this.formData.ProductProperty,
                    CoverPhoto : this.formData.CoverPhoto,
                    Type: type,
                    LeaveDate: this.formData.LeaveDate,
                    HotelClassName: this.formData.HotelClassName,
                    HotelTypeName  : this.formData.HotelTypeName,
                    State: this.formData.State
                }];

                if(this.formData.ExpressResultList && this.formData.ExpressResultList.length>0){
                    this.formData.ExpressResultList.forEach((item,index) => {
                        if(this.formData.ExpressResultList[index].result && this.formData.ExpressResultList[index].result.list && this.formData.ExpressResultList[index].result.list.length>0){
                            this.formData.ExpressResultList[index].result.list[0].index=0
                        }
                    })
                }
                if(this.formData.ProductType=='5'){
                    //入住信息
                    if(this.formData.OrderUserBookList && this.formData.OrderUserBookList.length>0){
                        this.checkInInfo = {...this.checkInInfo,...this.formData.OrderUserBookList[0]}
                    }else{
                        this.checkInInfo.Name = this.formData.ContactName;
                        this.checkInInfo.Phone = this.formData.ContactPhone;
                    }
                }else if(this.formData.ProductType=='3'){
                    // 收货信息
                    if(this.formData.TraveAddressResult){
                        this.receivingInfo = {
                            TraveOrderId: this.formData.Id,
                            TakeWay: this.formData.TakeWay, 
                            Name: this.formData.ContactName,
                            Phone: this.formData.ContactPhone,
                            UserRemark: this.formData.UserRemark,
                            ReceName: this.formData.TraveAddressResult.Name,
                            RecePhone:this.formData.TraveAddressResult.Phone,
                            Province: this.formData.TraveAddressResult.Province,
                            City: this.formData.TraveAddressResult.City,
                            District: this.formData.TraveAddressResult.District,
                            Address: this.formData.TraveAddressResult.Address,
                        }
                    }else{
                        this.receivingInfo = {
                            TraveOrderId: this.formData.Id,
                            TakeWay: this.formData.TakeWay, 
                            Name: this.formData.ContactName,
                            Phone: this.formData.ContactPhone,
                            UserRemark: this.formData.UserRemark,
                            ReceName: this.formData.TakeWay==1 ? this.formData.ContactName : "",
                            RecePhone: this.formData.TakeWay==1 ? this.formData.ContactPhone : "",
                            Province:"",
                            City:"",
                            District:"",
                            Address:""
                        }
                    }
                    
                }else{
                    //联系人信息
                    if(this.formData.State == '11'){
                        this.linkData = {
                            TraveOrderId: this.formData.Id,
                            ContactName:  this.formData.ContactName,
                            ContactPhone: this.formData.ContactPhone
                        }
                    }
                }
                // console.log(res)
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        //新增物流信息
        addLogistics(){
            this.LogisticsInfo.push({
                ExpressNo: "",
                ExpressName: ""
            })
        },
        setLogistics(){
            let flag1 = this.LogisticsInfo.some(item => !item.ExpressName)
            let flag2 = this.LogisticsInfo.some(item => !item.ExpressNo)
            if(flag1){
                this.$Message.warning('请填写快递公司');
                return;
            }
            if(flag2){
                this.$Message.warning('请填写运单编号');
                return;
            }
            
            this.spinShow = true;
            let postData = {
                TraveOrderId: this.formData.Id,
                TraveOrderExpressList: this.LogisticsInfo
            }
            SetTraveOrderBindExpress(postData).then(res => {
                    this.spinShow = false;
                    this.cancelLogisticsModal()
                    this.$Message.success('新增物流成功！');
                    this.getData();
                }).catch(err => {
                    this.spinShow = false;
                })
        },
        deleteLogistics(index){
            this.$Modal.confirm({
                title: '请确认是否删除此物流信息',
                onOk: () => {
                    this.LogisticsInfo.splice(index,1)
                }
            })
        },
        cancelLogisticsModal(){
            this.isAddLogisticsInfo = false;
            this.LogisticsInfo = [{
                ExpressNo: "",
                ExpressName: ""
            }]
        },
        //改价logisticsPrice
        editPrice(){
            if(this.changePrice==null){
                this.$Message.warning(this.formData.ProductType == 3 ? '请填写商品售价！' : '请填写价格！')
            }else if(this.changeType == 3 && this.logisticsPrice==null){
                this.$Message.warning('请填写商品运费！')
            }else{
                this.spinShow = true;
                changePrice(this.formData.Id,this.changePrice,this.logisticsPrice).then(res => {
                    this.spinShow = false;
                    this.isChange = false;
                    this.getData();
                    // this.formData.PayAmount = this.changePrice;
                    this.changePrice = null;
                    this.logisticsPrice=null
                    this.$Message.success('修改价格成功！')
                }).catch(err => {
                    this.spinShow = false;
                })
            }
        },

        // 审核通过
        passAudit(name,type){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(type==1){
                        let postData = {
                            TraveOrderId: this.formData.Id,
                            ContactName: this.checkInInfo.Name,
                            ContactPhone: this.checkInInfo.Phone,
                            IsAudit: 1,
                            Remark: this.formData.Remark,
                            OrderTouristList: [this.checkInInfo]
                        }
                        this.comfirmOrder(postData,1)
                    }else{
                        this.comfirmOrder({...this.linkData,IsAudit: 1},1)
                    }
                }
            })
        },

        //审核不通过
        failAudit(){
            let postData = {
                TraveOrderId: this.formData.Id,
                ContactName: this.checkInInfo.Name,
                ContactPhone: this.checkInInfo.Phone,
                IsAudit: 0,
                UnAuditReason: this.unAuditReason,
                Remark: this.formData.Remark || this.unAuditReason,
                // OrderTouristList: [this.checkInInfo]
            }
            this.comfirmOrder(postData,2)
        },

        //确认订单
        comfirmOrder(data,type){
            this.$Spin.show();
            setTraveOrderAudit(data).then(res => {
                this.$Spin.hide();
                this.$Message.success(type==1 ? '确认订单' : '确定不通过订单')
                if(type==2){
                    this.isNoPass=false;
                }
                this.getData()
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        //确定其他产品订单
        comfirmOther(){
            this.$refs['linkForm'].validate((valid) => {
                if (valid) {
                    this.$refs['receivingFrom'].validate((valid) => {
                        if (valid) {
                            this.$Spin.show();
                            
                            setTraveOrderSure(this.receivingInfo).then(res => {
                                this.$Spin.hide();
                                this.$Message.success('修改信息成功！')
                                this.isEdited = false;
                                this.getData()
                            }).catch(err => {
                                this.$Spin.hide();
                            })
                        }else{
                            this.$Message.error('有必填信息未填写!');
                        }
                    })
                }else{
                    this.$Message.error('有必填信息未填写!');
                }
            })
            
        },

        //确定入住
        comfirmCheckIn(type){
            this.$Spin.show();
            setTraveOrderDone(this.formData.Id).then(res => {
                this.$Spin.hide();
                this.$Message.success(type==1 ? '确认入住成功' : "确定提货" )
                this.getData()
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        //验证提货码
        verifyTakeCode(){
            if(!this.takeCode){
                this.takeCodeTip = "请输入提货码";
            }else if(this.takeCode != this.formData.TakeCode){
                this.takeCodeTip = "提货码输入有无，请重新输入";
            }else{
                this.takeCodeTip =  "";
                this.comfirmCheckIn(2)
            }
        },

        onChangeProvince(data) {
            this.receivingInfo.Province = data.value;
        },
        onChangeCity(data) {
            this.receivingInfo.City = data.value;
        },
        onChangeArea(data) {
            this.receivingInfo.District = data.value;
        },
    }
}
</script>
<style lang="less">
    .orderDetail{
        .ivu-table-wrapper{
            .ivu-table td.nameColumn  div{
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .line-container{
            padding-left: 10rem;
            .myIcon{
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background-color: #ccc;
            }
            .myIcon{
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background-color: #ccc;
            }
            .myIconActive{
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background-color: #F1A56F;
            }
        }
        .line-container .item-symbol{
            left: -0.16rem;
            top: 23px;
            img{
                position: absolute;
                left: -7px;
                top: -7px
            }
        }
        .line-container .item-tag{
            font-size: 14px;
            width: 160px;
            left: -10.2rem;
        }
        .line-container::after{
            left: 10rem;
        }
    }
    .logisticsModal {
        .ivu-modal-body{
            padding-bottom: 0;
            max-height: 420px;
            overflow-y: auto;
        }
        .ivu-form-item{
            margin-bottom: 15px;
            .action{
                display: flex;
                align-items: center;
            }
            .add{
                color: #3275F5;
                padding: 0 10px;
                cursor: pointer;
            }
            .delete{
                padding: 0 10px;
                cursor: pointer;
            }
        }
    }
</style>
<style lang="less" scoped>
    .orderDetail{
        height: 100%;
        .content{
            background-color: #F7F8FA;
            max-height: calc(100% - 44px);
            box-sizing: border-box;
            padding: 10px 10px 0;
            overflow-y: auto;
            >div{
                background-color: #fff;
                margin-bottom: 10px;
                border-radius: 8px;
            }
            .process{
                .steps{
                    padding: 45px 60px;
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-gap: 20px;
                    justify-items: center;
                    li{
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        position: relative;
                        img{
                            margin: 8px 0;
                        }
                        &:before{
                            content: "";
                            position: absolute;
                            width: calc(100% - 60px);
                            height: 1px;
                            border-top: 2px solid #e5e5e5;
                            top: 50%;
                            left: -50%;
                            transform: translate(20px,0)
                        }
                        .groupBook{
                            color: #0899AC;
                            font-weight: 700;
                            position: absolute;
                            top: 25%;
                            left: 0;
                            transform: translate(-55%,0)
                        }
                    }
                    li.actived{
                        color: #0899AC;
                        &:before{
                            border-top: 2px solid #0899AC;
                        }
                    }
                    li:nth-of-type(1){
                        &:before{
                            border: none;
                        }
                    }
                    
                }
                .detail{
                    padding: 0 160px 45px;
                    .red{
                        font-size: 16px;
                        color: #E94E27;
                        font-weight: 700;
                    }
                    ul{
                        display: flex;
                        flex-wrap: wrap;
                        li{
                            width: 33.33%;
                            padding-bottom: 10px;
                            box-sizing: border-box;
                        }
                        @media screen and (max-width: 992px){
                            li{
                                width: 50%;
                            }
                        }
                        @media screen and (max-width: 576px){
                            li{
                                width: 100%;
                            }
                        }
                    }
                }
                @media screen and (max-width: 1200px){
                    .detail {
                        padding: 0 100px 45px;
                    }
                }
                @media screen and (max-width: 992px){
                    .detail {
                        padding: 0 160px 45px;
                    }
                }
                @media screen and (max-width: 768px){
                    .detail {
                        padding: 0 60px 45px;
                    }
                }
                
            }
            .productInfo,.linkmanInfo,.travelerInfo,.logisticsInfo{
                padding: 20px 40px 30px;
                .title{
                    padding-left: 18px;
                    font-size: 18px;
                    font-weight: 700;
                    position: relative;
                    margin-bottom: 20px;
                    &::before{
                        content: "";
                        position: absolute;
                        left: 0;
                        width: 6px;
                        height: 25px;
                        background-color: #0899AC;
                    }
                }
                
            }
            // .productInfo{
            //     padding-bottom: 30px;
            // }
            .logisticsInfo2{
                .ivu-row{
                    .ivu-col{
                        line-height: 30px;
                    }
                }
            }
            .linkmanInfo,.travelerInfo{
                .listWrap{
                    border: 1px solid #e4e4e4;
                    border-radius: 4px;
                }
                .head{
                    width: 100%;
                    box-sizing: border-box;
                    padding-left: 30px;
                    height: 40px;
                    line-height: 40px;
                    background-color: #f9f9f9;
                    color: #0899AC;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #e4e4e4;
                    img{
                        padding-right: 5px;
                    }
                }
                .dataNone{
                    width: 100%;
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #e4e4e4;
                    text-align: center;
                    color: #999;
                }
                .list{
                    width: 100%;
                    line-height: 30px;
                    padding: 15px 0;
                    .ivu-col{
                        span{
                                display: inline-block;
                                width: 110px;
                                text-align: right;
                                color: #999;
                                padding-right: 10px;
                            }
                    }
                }
            }
            
        }
        .bottom{
            background: #fff;
            border-top: 1px solid #E4E4E4;
            display: flex;
            justify-content: center;
            padding: 15px 0;
            position: fixed;
            bottom: 10px;
            left: 10px;
            right: 10px;
            z-index: 99;
            > .ivu-btn{
                height: 40px;
                width: 180px;
            }
        }
    }
    .changeOrderModal{
        .foot{
            text-align: center;
            .ivu-btn{
                width: 120px;
                height: 40px;
                line-height: 40px;
                font-size: 16px;
                &:first-of-type{
                    margin-right: 20px;
                }
            }
        }
    }
    .orderPriceModal{
        .content{
            margin-top: 30px;
            position: relative;
            &::before {
                content: '';
                height: 10px;
                background-image: url("../../assets/wave.png");
                background-size: 100% 10px;
                background-repeat: repeat-x;
                position: absolute;
                bottom: -21px;
                left: -16px;
                right: -16px;
            }
            .detailWrap{
                background-color: #F7F8FA;
                padding: 0 15px 15px;
                color: #666;
                .title{
                    p:nth-of-type(1){
                        padding-top: 10px;
                        color: #333;
                    }
                    p:nth-of-type(2){
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        font-size: 16px;
                        font-weight: 700;
                        line-height: 32px;
                        span:nth-of-type(1){
                            width: 70%;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                }
                .priceList{
                    background-color: #fff;
                    border-radius: 4px;
                    padding: 10px 15px;
                    li{
                        display: flex;
                        justify-content: space-between;
                        line-height: 28px;
                    }
                }
            }
            .otherFees{
                font-size: 12px;
                margin: 5px 30px 0;
                li{
                    display: flex;
                    justify-content: space-between;
                    line-height: 28px;
                }
            }
            .total{
                text-align: right;
                line-height: 32px;
                margin-top: 10px;
                span{
                    font-size: 16px;
                    font-weight: 700;
                }
            }
        }
        
    }
    .noPassModal,.logisticsModal{
        .foot{
            text-align: center;
            .ivu-btn{
                width: 100px;
                height: 38px;
                line-height: 38px;
                font-size: 14px;
                &:first-of-type{
                    margin-right: 20px;
                }
            }
        }
    }
</style>