<template>
    <div class="editSeckill">
        <Header :title="id ? '修改秒杀' : '新增秒杀'" @change-router="$router.back()"></Header>
        <div class="contentWrap">
            <Form :label-width="110" :model="formData" :rules="ruleValidate" ref="seckillForm" >
                <div class="basicInfo">
                    <h3><img src="@/assets/basic-icon.svg" alt="">基本信息</h3>
                    <FormItem label="游客类型：" prop="VisitorTypeId" v-if="formData.ProductType == 1 || formData.ProductType == 2">
                        <Select v-model="formData.VisitorTypeId"  placeholder="请选择游客类型"
                                @on-change="vistorTypeChange" :disabled="id!=undefined">
                            <Option v-for="type in visitorTypeList" 
                                    :key="type.Id" :value="type.Id">{{type.Name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="酒店类型：" prop="VisitorTypeId" v-if="formData.ProductType == 5">
                        <Select v-model="formData.VisitorTypeId"  placeholder="请选择酒店类型"
                                @on-change="vistorTypeChange" :disabled="id!=undefined">
                            <Option v-for="type in hotelItemTypeList" 
                                    :key="type.Id" :value="type.Id">{{type.Name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="活动商品：" prop="ProductId">
                        <Input type="text" v-model="formData.ProductId" v-show="false"/>
                        <p class="addPoint" @click="addPoint" v-if="tableData.length==0">添加商品</p>
                        <Table v-else :columns="tableColumns" :data="tableData" disabled-hover>
                            <template slot-scope="{ index, row }" slot="Action">
                                <Button type="text" :style="{color: !id ? '#3275F5' : '#999'}"
                                        @click="deleteTableData(index,row.ProductName)">删除</Button>
                            </template>
                        </Table>
                    </FormItem>
                    
                    <FormItem label="开始时间：" prop="StartTime">
                        <DatePicker type="datetime" placeholder="" 
                                    :value="formData.StartTime" 
                                    :editable="false"
                                    @on-change="startTimeChange"></DatePicker>
                    </FormItem>
                    <FormItem label="结束时间：" prop="EndTime">
                        <DatePicker type="datetime" placeholder="" 
                                    :value="formData.EndTime" 
                                    :editable="false"
                                    @on-change="endTimeChange"></DatePicker>
                    </FormItem>
                    
                    <FormItem label="活动限购：" prop="IsLimtBuy">
                        <RadioGroup v-model="formData.IsLimtBuy" @on-change="limtChange">
                            <Radio :label="0" :disabled="id!=undefined">不限购</Radio>
                            <Radio :label="1" :disabled="id!=undefined">限购
                                <InputNumber :max="999999999" 
                                            :min="0"
                                            :precision="0"  
                                            placeholder="自定义" 
                                            :disabled="formData.IsLimtBuy==0 || id!=undefined"
                                            style="width: 120px;margin: 0 10px;"
                                            v-model="formData.LimtNum"></InputNumber>次/人
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                </div>

                <div class="priceInfo">
                    <h3><img src="@/assets/price-icon.svg" alt="">价格和库存信息</h3>
                    <FormItem label="售价：" prop="Price">
                        <InputNumber :max="999999999" :min="0" :disabled="true" v-model="formData.Price"></InputNumber>&nbsp;&nbsp;元
                    </FormItem>
                    <FormItem label="成本价：" prop="CostPrice">
                        <InputNumber :max="999999999" :min="0" :disabled="true" v-model="formData.CostPrice"></InputNumber>&nbsp;&nbsp;元
                    </FormItem>
                    <FormItem label="秒杀价：" prop="KillPrice">
                        <InputNumber :max="999999999" :min="0" :precision="2" v-model="formData.KillPrice"></InputNumber>&nbsp;&nbsp;元
                    </FormItem>
                    <FormItem label="活动库存：" prop="StockNum">
                        <InputNumber :max="999999999" :min="0" placeholder="输入大于2的整数" 
                                    v-model="formData.StockNum" :precision="0"></InputNumber>
                    </FormItem>
                </div>

                <div class="promoteInfo">
                    <h3><img src="@/assets/promote-icon.svg" alt="">推广信息</h3>
                    <FormItem label="分享文案：" prop="Extens">
                        <Input  v-model="formData.Extens" placeholder="我仅用100元抢到200元的小武当山周边游！"/>
                    </FormItem>
                </div>
            </Form>
            <div class="activityRules">
                <p>活动规则：</p>
                <ul>
                    <li>1、不定期更新，限量发送，活动有效期内售完即止</li>
                    <li>2、在秒杀商品活动页面中选择商品，点击购买进入支付页</li>
                    <li>3、限时秒杀仅支持在线预定，电话下单无效</li>
                    <li>4、限时秒杀产品资源特殊，付款成功后不可取消行程和退款</li>
                    <li>5、限时秒杀商品不与其他优惠福利同享</li>
                    <li>6、秒杀商品不可使用优惠券</li>
                    <li>7、同一登录账户、同一手机号、同一设备终端号、同一支付账户等合理显示为同一用户的情形，均视为同一用户</li>
                    <li>8、通过不正当手段参与秒杀活动，本平台有撤销相关订单的权利</li>
                </ul>
            </div>
            <div class="bottom">
                <Button @click="$router.back()">取消</Button>
                <Button type="primary" @click="handleSubmit">确定</Button>
            </div>
        </div>

        <!-- 选择产品名称 -->
        <name-modal ref="nameModal"
                    :isShow="isSelectName"
                    :postData="namePostData"
                    :selectedName="selectedName"
                    :classes="1"
                    @nameChange="nameChange"
                    @dataChange="namePostDataChange"
                    @cancelNameModal="cancelNameModal"></name-modal>

        <!-- 选择产品规格 -->
        <price-modal ref="priceModal"
                    :type="namePostData.Type"
                    :isShow="isSelectProduct"
                    :isPreStep="isSelectName"
                    @preStep="preStep"
                    @productChange="productChange"></price-modal>
    </div>
</template>
<script>
import Header from '@/components/route-header'
import { editSeckill, getSeckillDetail } from '@/api/marketing.js'
import { getVisitorTypes,getHotelItemTypes } from '@/api/setting.js'
import { transformProductType } from '@/utils/transform.js'
import NameModal from '@/components/name-modal'
import PriceModal from '@/components/price-modal'
export default {
    components: { Header, NameModal, PriceModal},
    data(){
        const validataVisitorTypeId = (rule, value, callback) => {
            if(!value){
                if(this.formData.ProductType==5 ){
                    callback(new Error('请选择酒店类型'));
                }else{
                    callback(new Error('请选择游客类型'));
                }
                
            }else{
                callback();
            }
        };
        const validateLimt  = (rule, value, callback) => {
            if(value == 1 && (this.formData.LimtNum<0 || !this.formData.LimtNum)){
                callback(new Error('请输入限购次数'));
            }else{
                callback();
            }
        };
        const validateKillPrice  = (rule, value, callback) => {
            if(value < 0 || !value){
                callback(new Error('请输入秒杀价'));
            }else{
                callback();
            }
        };
        const validateStockNum =  (rule, value, callback) => {
            if(value < 0 || !value){
                callback(new Error('请输入活动库存'));
            }else if(value <= 2){
                callback(new Error('请输入大于2的整数'));
            }else{
                callback();
            }
        };
        const validateEndTime = (rule, value, callback) => {
            let startDate=0,endDate=0;
            if(value && this.formData.StartTime){
                let endArr = value.split(/[- : \/]/);
                let startArr = this.formData.StartTime.split(/[- : \/]/);
                startDate = Date.parse(new Date(startArr[0], startArr[1]-1, startArr[2], startArr[3], startArr[4], startArr[5]));
                endDate = Date.parse(new Date(endArr[0], endArr[1]-1, endArr[2], endArr[3], endArr[4], endArr[5]));
                // console.log(startDate)
            } 
            if(!value){
                callback(new Error('请选择结束时间'));
            }else if(startDate > endDate){
                callback(new Error('结束时间不能小于开始时间'));
            }else{
                callback();
            }
        };
        const validateStartTime = (rule, value, callback) => {
            let startDate=0,endDate=0;
            if(value && this.formData.EndTime){
                let startArr = value.split(/[- : \/]/);
                let endArr = this.formData.EndTime.split(/[- : \/]/);
                startDate = Date.parse(new Date(startArr[0], startArr[1]-1, startArr[2], startArr[3], startArr[4], startArr[5]));
                endDate = Date.parse(new Date(endArr[0], endArr[1]-1, endArr[2], endArr[3], endArr[4], endArr[5]));
                // console.log(startDate)
            } 
            if(!value){
                callback(new Error('请选择结束时间'));
            }else if(startDate > endDate){
                callback(new Error('开始时间不能大于结束时间'));
            }else{
                callback();
            }
        };
        return{
            id: '',
            visitorTypeList: [],         //游客类型
            hotelItemTypeList: [],    //酒店类型
            formData: {
                VisitorTypeId: '',
                IsLimtBuy: 1,
                StartTime: '',
                EndTime: '',
                LimtNum: null,
                CostPrice: null,
                Price: null,
                KillPrice: null,
                StockNum: null,
                Extens:'',
                ProductType: '',
                ProductId: '',
                ProductName: '',
                TravelTypeId: '',
                DepartureDate: '',
                Desc: `1、不定期更新，限量发送，活动有效期内售完即止
                    2、在秒杀商品活动页面中选择商品，点击购买进入支付页
                    3、限时秒杀仅支持在线预定，电话下单无效
                    4、限时秒杀产品资源特殊，付款成功后不可取消行程和退款
                    5、限时秒杀商品不与其他优惠福利同享
                    6、秒杀商品不可使用优惠券
                    7、同一登录账户、同一手机号、同一设备终端号、同一支付账户等合理显示为同一用户的情形，均视为同一用户
                    8、通过不正当手段参与秒杀活动，本平台有撤销相关订单的权利`
            },
            ruleValidate: {
                VisitorTypeId: [{ required: true, validator: validataVisitorTypeId, trigger: 'change' }],
                IsLimtBuy: [{ validator: validateLimt, trigger: 'change' }],
                StartTime: [{ required: true, validator: validateStartTime, trigger: 'change' }],
                EndTime: [{ required: true, validator: validateEndTime, trigger: 'change' }],
                KillPrice: [{ required: true, validator: validateKillPrice, trigger: 'change' }],
                StockNum: [{ required: true, validator: validateStockNum, trigger: 'change' }],
                ProductId: [{ required: true, message: '请添加商品', trigger: 'change' }],
                Extens: [
                    { required: true, message: '请输入分享文案', trigger: 'blur' },
                    { type: 'string', max: 50, message: '最多输入50个字', trigger: 'blur' },
                ]
            },
            columns: [
                    {
                        title: '产品类型',
                        key: 'ProductType',
                        minWidth: 100,
                        align: 'left',
                        render: (h, params) => {
                                return h('div', transformProductType(params.row.ProductType));
                            }
                    },
                    {
                        title: '产品名称',
                        key: 'ProductName',
                        minWidth: 120,
                        className: 'nameColumn',
                        align: 'left'
                    },
                    {
                        title: '出发日期',
                        key: 'DepartureDate',
                        minWidth: 160,
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
                        title: '类型',
                        key: 'VisitorTypeName',
                        minWidth: 120,
                        align: 'left'
                    },
                    {
                        title: '操作',
                        slot: 'Action',
                        minWidth: 90,
                        align: 'center'
                    }
                ],
            tableData: [],
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
        }
        
    },
    created(){
        this.id = this.$route.query.id;
        this.namePostData.Type = this.$route.query.type;
        this.formData.ProductType = this.$route.query.type;
        if(this.id){
            this.getDetailData();
        }
        if(this.formData.ProductType==5){
            this.columns[2].title = "入住日期"
            this.columns[3].title = "类型"
        }else{
            this.columns[2].title = "出发日期"
            this.columns[3].title = "出游类型"
        }
        if(this.formData.ProductType==1 || this.formData.ProductType==2){
            this.getVisitorTypeList();
        }else if(this.formData.ProductType==5){
            this.getHotelItemTypeList()
        }
    },
    computed: {
        tableColumns(){
            if(this.formData.ProductType==3){
                return this.columns.slice(0,3).concat(this.columns.slice(4));
            }else{
                return this.columns.slice(0,4).concat(this.columns.slice(5));
            }
        }
    },
    methods: {
        getDetailData(){
            this.$Spin.show();
            getSeckillDetail(this.id).then(res => {
                this.$Spin.hide();
                this.formData = res.Data;
                
                let addData = {};
                if(this.namePostData.Type=='3'){
                    addData = {
                        ProductType: this.formData.ProductType, //线路产品：非直营产品，直营产品 ，其他产品：是总部自己添加的其他产品类型
                        ProductId: this.formData.ProductId,
                        ProductName: this.formData.ProductName, 
                        DepartureDate: this.formData.DepartureDate, //出发日期
                        VisitorTypeId: this.formData.VisitorTypeId,         //其他产品类型、规格
                        VisitorTypeName: this.formData.VisitorTypeName
                    }
                }else{
                    addData = {
                        ProductType: this.formData.ProductType , //线路产品：非直营产品，直营产品 ，其他产品：是总部自己添加的其他产品类型
                        ProductId: this.formData.ProductId,
                        ProductName: this.formData.ProductName, 
                        DepartureDate: this.formData.DepartureDate, //出发日期
                        TravelTypeId: this.formData.TravelTypeId, //出游类型
                        TravelTypeName: this.formData.TravelTypeName,
                    }
                }
                this.tableData.push(addData);
                
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        handleSubmit(){
            // console.log('formData',this.formData)
            this.$refs['seckillForm'].validate((valid) => {
                if (valid) {
                    this.$Spin.show();
                    editSeckill(this.formData).then(res => {
                        this.$Spin.hide();
                        this.$router.back();
                        this.$Message.success(this.id ?  '修改成功' : '新增成功');
                    }).catch(err => {
                        this.$Spin.hide();
                    })
                    
                } else {
                    this.$Message.error('有必填信息未填写');
                }
            })
        },

        addPoint(){
            if(this.id) return;
            let type = this.namePostData.Type;
            if(type=='3'){
                //其他产品
                this.isSelectName = true;
                this.$refs.nameModal.getTravelClass(this.namePostData);
            }else{
                //直营、非直营
                if(!this.formData.VisitorTypeId){
                    this.$Message.warning(type=='5' ? "请先选择酒店类型" : "请先选择游客类型");
                }else{
                    this.isSelectName = true;
                    this.$refs.nameModal.getTravelClass(this.namePostData);
                }
            }
            
        },
        
        deleteTableData(index,name){
            if(this.id) return;
            this.$Modal.confirm({
                title: '请确认是否删除'+name+'？',
                onOk: () => {
                    this.tableData = [];
                    this.$Message.success('成功删除')
                }
            })
        },

        nameChange(id){
            this.selectedName = id;
            this.isSelectName = false;
            this.isSelectProduct = true;
            this.$refs.priceModal.getPriceList({Id: this.selectedName,VistorType: this.formData.VisitorTypeId});
        },
        namePostDataChange(data){
            this.namePostData = data;
        },
        cancelNameModal(){
            this.isSelectName=false;
            this.selectedName='';
            this.namePostData.TravelType='';
            this.namePostData.TravelProductType='';
        },
        preStep(){
            this.isSelectProduct = false;
            this.isSelectName = true;
            this.$refs.nameModal.getTravelClass(this.namePostData);
        },
        productChange(data){
            // console.log('data',data)
            let addData = {};
            if(this.namePostData.Type=='3'){
                addData = {
                    ProductType: this.namePostData.Type, //线路产品：非直营产品，直营产品 ，其他产品：是总部自己添加的其他产品类型
                    ProductId: data.TravelProductId,
                    ProductName: data.Name, 
                    DepartureDate: data.DepartureDate, //出发日期
                    VisitorTypeId: data.Id,         //其他产品类型、规格
                    VisitorTypeName: data.TypeName
                }
            }else{
                addData = {
                    ProductType: this.namePostData.Type , //线路产品：非直营产品，直营产品 ，其他产品：是总部自己添加的其他产品类型
                    ProductId: data.TravelProductId,
                    ProductName: data.Name, 
                    DepartureDate: data.DepartureDate, //出发日期
                    TravelTypeId: data.TravelType, //出游类型
                    TravelTypeName: data.TravelTypeName,
                }
            }
            
            this.tableData.push(addData);
            if(this.namePostData.Type=='3'){
                this.formData.VisitorTypeId = data.Id; //其他产品类型、规格
                this.formData.VisitorTypeName = data.TypeName; //其他产品类型、规格
            }
            this.formData.ProductType = this.namePostData.Type;
            this.formData.Price = data.Price;
            this.formData.CostPrice = data.CostPrice;
            this.formData.ProductId = data.TravelProductId;
            this.formData.ProductName = data.Name;
            this.formData.TravelTypeId = data.TravelType;
            this.formData.TravelTypeName = data.TravelTypeName;
            this.formData.DepartureDate = data.DepartureDate;

            this.isSelectProduct = false;
            this.selectedName='';
            this.namePostData.TravelType='';
            this.namePostData.TravelProductType='';
            this.$refs.priceModal.selectedProduct='';
        },

        //游客类型
        getVisitorTypeList(){
            getVisitorTypes().then(res => {
                let array = res.Data.VisitorTypes;
                this.visitorTypeList = [...array];
            }).catch(err => {

            })
        },

        //酒店类型
        getHotelItemTypeList(){
            getHotelItemTypes().then(res => {
                let array = res.Data.HotelItemType;
                this.hotelItemTypeList = [...array];
            })
            
        },

        vistorTypeChange(){
            this.tableData = [];
            // this.formData.ProductType = '';
            this.formData.Price = null;
            this.formData.CostPrice = null;
            this.formData.ProductId = '';
            this.formData.ProductName = '';
            this.formData.TravelTypeId = '';
            this.formData.DepartureDate = '';
        },

        startTimeChange(e){
            this.formData.StartTime = e;
        },

        endTimeChange(e){
            this.formData.EndTime = e;
        },

        //是否限购改变
        limtChange(e){
            if(e==0){
                this.formData.LimtNum = null;
            }
        },

    }

}
</script>
<style lang="less">
    .editSeckill{
        .ivu-table-wrapper{
            margin-bottom: 15px;
            .ivu-btn{
                color: #3275F5;
            }
            .ivu-table td.nameColumn > div{
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
</style>
<style lang="less" scoped>
    .editSeckill{
        height: 100%;
        .contentWrap{
            min-height: calc(100% - 44px);
            max-height: calc(100% - 44px);
            padding: 0 20px 80px;
            box-sizing: border-box;
            background-color: #F7F8FA;
            overflow-y: auto;
            .basicInfo,.priceInfo,.promoteInfo{
                margin-top: 20px;
                padding: 30px 16px 16px;
                background-color: #fff;
                border-radius: 8px;
                >h3{
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #F7F8FA;
                    img{
                        margin-right: 5px;
                    }
                }
            }
            .ivu-form{
                margin-top: 24px;
                .addPoint{
                    color: #3275F5;
                    line-height: 32px;
                    cursor: pointer;
                }
            }
            .activityRules{
                margin: 30px 20px 80px 45px;
                color: #999;
                p{
                    line-height: 3;
                }
                ul li{
                    line-height: 1.8;
                }
               
            }
            .bottom{
                background: #fff;
                border-top: 1px solid #E4E4E4;
                display: flex;
                justify-content: center;
                padding: 15px 0;
                position: fixed;
                bottom: 0px;
                left: 0;
                right: 0;
                z-index: 99;
                > .ivu-btn{
                    height: 40px;
                    width: 120px;
                    &:first-of-type{
                        margin-right: 15px;
                    }
                }
            }
        }
    }
</style>