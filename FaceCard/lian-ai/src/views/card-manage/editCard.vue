<template>
    <div class="fullscreen editCard">
        <Header :title="classType=='1' ? '次卡' : classType=='2' ? '折扣卡' : '体验卡'"></Header>
        <div class="content">
            <div class="head">
                <Row :gutter="30" v-if="classType=='1' || classType=='2'">
                    <Col v-for="(item,index) in parentTypeList" :key="index" span="12" >
                        <div :class="parentType==item.type ? 'active' : ''" @click="selectparentType(item.type)" >
                            <h3>{{item.title}}</h3>
                            <p>{{item.content}}</p>
                            <img v-if="parentType==item.type" src="../../assets/corner-icon.svg" alt="">
                        </div>
                    </Col>
                </Row>
                <p v-if="classType=='3'" class="instruction">可对项目/服务、产品设定合适的体验价格，自定义每个项目/服务的体验次数</p>
            </div>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="95" class="form">
                <FormItem v-if="parentType=='1'" label="类别：" prop="ChildType">
                    <RadioGroup v-model="formValidate.ChildType" vertical @on-change="typeChange(parentType)">
                        <Radio label="单项有限次" :disabled="cardId != undefined">单项有限次</Radio>
                        <Radio label="多项有限次" :disabled="cardId != undefined">多项有限次</Radio>
                    </RadioGroup>
                </FormItem> 
                <FormItem  v-if="parentType=='2'" label="类别：" prop="ChildType">
                    <div style="display: flex;align-items: center;">
                        <Select v-model="formValidate.ChildType" :disabled="cardId != undefined" placeholder="请选择类别">
                            <Option v-for="(type,index) in childTypeList" :key="index" :value="type">{{type}}</Option>
                        </Select>
                        <img style="padding-left: 10px;cursor: pointer;" @click="isEdit=true;" src="../../assets/edit-icon.svg" alt="">
                    </div>
                </FormItem>
                <FormItem label="卡名：" prop="Name">
                    <Input v-model="formValidate.Name"/>
                </FormItem>
                <FormItem label="卡充值：" prop="PayMoney" v-if="parentType=='4'">
                    <InputNumber :max="9999999" :min="0"  class="littleInput" 
                                 v-model="formValidate.PayMoney" placeholder="自定义"></InputNumber>&nbsp;&nbsp;元，赠送&nbsp;
                    <InputNumber :max="9999999" :min="0" class="littleInput" 
                                  v-model="formValidate.GiveMoney" placeholder="可不填"></InputNumber>&nbsp;&nbsp;元
                </FormItem>
                <FormItem label="卡项权益：" prop="CardRightsItems" v-if="classType!=2">
                    <time-card  v-if="formValidate.CardRightsItems && formValidate.CardRightsItems.Project"
                                :dataList="formValidate.CardRightsItems.Project" 
                                :type='classType' classes='1' childClass='1' 
                                :isLimitNum="parentType=='2'"
                                :toTalNum="formValidate.ToTalNum"
                                :isSingle="formValidate.ChildType!='多项有限次'"
                                @arrayChange="changeData"></time-card>
                </FormItem>
                <FormItem label="卡项权益：" prop="IsUnionDisc" v-if="classType==2">
                    <FormItem label="" prop="IsUnionDisc">
                        <RadioGroup v-model="formValidate.IsUnionDisc" vertical @on-change="UnionDiscChange">
                            <Radio :label="1">设置全店统一折扣
                                <InputNumber :max="9.9" :min="0" :disabled="formValidate.IsUnionDisc==0" 
                                    placeholder="自定义" class="littleInput"
                                    v-model="formValidate.Discount"></InputNumber>&nbsp;&nbsp;折</Radio>
                            <Radio :label="0" style="margin: 20px 0 10px;">设置部分项目/服务、产品折扣</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem v-if="!formValidate.IsUnionDisc" prop="CardRightsItems">
                        <time-card  v-if="formValidate.CardRightsItems && formValidate.CardRightsItems.Project"
                                    :dataList="formValidate.CardRightsItems.Project" 
                                    :type='classType' classes='1' childClass='1' 
                                    @arrayChange="changeData"></time-card>
                        <time-card  v-if="formValidate.CardRightsItems && formValidate.CardRightsItems.Product"
                                    :dataList="formValidate.CardRightsItems.Product" 
                                    :type='classType' classes='2' childClass='2'
                                    @arrayChange="changeData"></time-card>
                    </FormItem>
                </FormItem>
                <FormItem label="购卡赠送：" prop="CardGivingItems">
                    <time-card  v-if="formValidate.CardGivingItems && formValidate.CardGivingItems.Project"
                                :dataList="formValidate.CardGivingItems.Project" 
                                :type='classType'  classes='1' childClass='3'
                                @arrayChange="changeData"></time-card>
                    <time-card  v-if="formValidate.CardGivingItems && formValidate.CardGivingItems.Product"
                                :dataList="formValidate.CardGivingItems.Product" 
                                :type='classType'  classes='2' childClass='4'
                                @arrayChange="changeData"></time-card>
                </FormItem>
                <!-- minTotal maxTotal discountTotal -->
                <FormItem label="总价值：" v-if="formValidate.IsUnionDisc != 1">
                    <p class="total" v-if="formValidate.ChildType=='多项有限次'">合计：￥{{minTotal}} ~ {{maxTotal}}</p>
                    <p class="total" v-else-if="classType=='2'">合计：￥{{minTotal}}
                        <span style="padding-left: 20px;">折后价：￥{{discountTotal}}</span></p>
                    <p class="total" v-else>￥{{minTotal}}</p>
                </FormItem>

                <FormItem label="售价：" prop="CardPrice">
                    <InputNumber :max="9999999" :min="0" class="numInput" 
                                 v-model="formValidate.CardPrice"></InputNumber>&nbsp;&nbsp;元
                </FormItem>
                <FormItem label="菲卡价：" prop="FeiKaPrice" v-if="classType=='3' || parentType=='1'">
                    <div style="display: flex;align-items: center;">
                        <InputNumber :max="9999999" :min="0" class="numInput"
                                 v-model="formValidate.FeiKaPrice"></InputNumber>&nbsp;&nbsp;元
                        <img src="../../assets/tip-icon.svg" @click="$router.push('/faceCardPrice')" 
                             style="margin-left: 5px; cursor: pointer;" alt="">
                    </div>
                    
                    <p style="font-size: 13px;color:#999;" v-if="faceCardPrice>0">菲卡指导价
                        <span style="font-weight: 700;font-size: 16px;color:#333;">{{faceCardPrice}}元</span>
                        （菲卡价不支持优惠方式）</p>
                </FormItem>
                <FormItem label="有效时间：" prop="IsForever">
                    <RadioGroup v-model="formValidate.IsForever" vertical 
                                @on-change="formValidate.ValueDay=0;formValidate.GiveDay=0;">
                        <Radio :label="1">永久有效</Radio>
                        <div style="display: flex; flex-wrap: wrap;align-items: center;">
                            <Radio :label="0">&nbsp;</Radio>
                            <div>
                                <InputNumber :max="9999999" :min="0" :disabled="formValidate.IsForever==1"
                                :precision="0" placeholder="自定义" class="littleInput"
                                 v-model="formValidate.ValueDay"></InputNumber>&nbsp;&nbsp;天，
                                 赠送&nbsp;&nbsp;<InputNumber :max="9999999" :min="0" 
                                 :disabled="formValidate.IsForever==1"
                                 :precision="0" placeholder="自定义" class="littleInput"
                                 v-model="formValidate.GiveDay"></InputNumber>&nbsp;&nbsp;天
                                <span style="font-size: 13px;color:#999;">（有效时间需为大于0的整数）</span>
                            </div>
                        </div>
                    </RadioGroup>
                </FormItem>
                <FormItem label="卡激活：" prop="IsLimitAct">
                    <RadioGroup v-model="formValidate.IsLimitAct" vertical @on-change="formValidate.ActNum=0;">
                        <Radio :label="0">不限时</Radio>
                        <div style="display: flex; flex-wrap: wrap;align-items: center;">
                            <Radio :label="1">&nbsp;</Radio>
                            <div>
                                <InputNumber :max="9999999" :min="0" :disabled="formValidate.IsLimitAct==0"
                                :precision="0" placeholder="自定义" class="littleInput"
                                 v-model="formValidate.ActNum"></InputNumber>
                                &nbsp;&nbsp;天内激活<span style="font-size: 13px;color:#999;">（第一次到店使用即激活或到期自动激活）</span>
                            </div>
                        </div>
                    </RadioGroup>
                </FormItem>
                <FormItem label="售卡数量：" prop="IsLimitNum">
                    <RadioGroup v-model="formValidate.IsLimitNum" vertical  @on-change="formValidate.Num=0;">
                        <Radio :label="0">无限数量</Radio>
                        <div style="display: flex; flex-wrap: wrap;align-items: center;">
                            <Radio :label="1">限制数量</Radio>
                            <div><InputNumber :max="9999999" :min="0" :disabled="formValidate.IsLimitNum==0"
                                 :precision="0" placeholder="自定义" class="littleInput"
                                 v-model="formValidate.Num"></InputNumber>&nbsp;&nbsp;张</div>
                        </div>
                        
                    </RadioGroup>
                </FormItem>
                <FormItem label="网店售卡：" prop="IsInterSale">
                    <RadioGroup v-model="formValidate.IsInterSale">
                        <Radio :label="1">支持</Radio>
                        <Radio :label="0">不支持</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            
            <div class="styles">
                <span class="label">卡样式：</span>
                <div class="cardWrap">
                    <ul>
                        <li class="random" @click="randomColor"
                            :class="{ selected: config.Random }">
                            <span>随机</span>
                        </li>
                        <li @click="config.CurrrntStyleId = item.StyleId; formValidate.CardStyle = item.StyleId;config.Random = false;" 
                            v-for="item in config.Styles" :key="item.StyleId"
                            :style="{ backgroundImage: 'url('+item.PhotoUrl+')'}"
                            :class="{ selected: item.StyleId === config.CurrrntStyleId && !config.Random}"></li>
                    </ul>
                    <div class="card" :style="{ backgroundImage: currentBg }">
                        <p>{{classType=='1' ? '次卡' : classType=='2' ? '折扣卡' : '体验卡'}}</p>
                    </div>
                </div>
            </div>

            <div class="bottom">
                <Button v-if="cardId != undefined" @click="changeState">{{formValidate.State=='0' ? '上架' : '下架'}}</Button>
                <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                <Button @click="$router.back(-1)">取消</Button>
            </div>
        </div>
        <Modal v-model="isEdit" width="580" :footer-hide="true" :mask-closable="false" class="typeModel">
            <p slot="header" style="text-align:center;font-size: 18px;">编辑类别</p>
            <ul>
                <li v-for="(type,index) in childTypeList" :key="index" >
                    <img class="icon" @click="deleteType(index)" src="@/assets/delete.svg" alt="">
                    <span>{{type}}</span>
                </li>
                <li class="addIcon" @click="isAdd=true;">+</li>
            </ul>
            <!-- <div slot="footer" style="text-align:center">
                <Button style="color: #333;border-color: #333;margin-right: 20px;" @click="isEdit=false;">取消</Button>
                <Button type="primary" @click="isEdit=false; isAdd=true;">保存</Button>
            </div> -->
        </Modal>
        <Modal v-model="isAdd" width="390" :mask-closable="false" class="addTypeModel" on-cancel="addTypeName=''">
            <p slot="header" style="text-align:center;font-size: 18px;">添加类别</p>
            <div class="content">
                <Input v-model="addTypeName" placeholder="请输入类别名称" :maxlength="20"/>
            </div>
            <div slot="footer" style="text-align:center">
                <Button type="primary" @click="addChildType">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Header from '@/components/route-header'
import TimeCard from './components/time-card'
//classType: 1次卡，2折扣卡 3体验卡
//childType 1、单项有限次卡，2多项有限次卡，2无限次卡，3消费折扣，4充值折扣，5体验卡
var ParentTypeList1 = [{
                type: '1',
                title: "有限次",
                content: "可创建多个项目/服务集合有限次数的次卡"
            },{
                type: '2',
                title: "无限次",
                content: "可创建多个项目/服务集合不限次数的次卡"
            }];
var ParentTypeList2 = [{
                type: '3',
                title: "消费折扣",
                content: "可对单个或者全店的项目/服务、产品设定消费折扣"
            },{
                type: '4',
                title: "充值折扣",
                content: "可按充值阶梯设置对应折扣与赠送金额"
            }];
var TimeForm = {
                Name: "",
                ClassType: "", //卡项大类型 次卡
                ChildType: "单项有限次", //卡项子类型 单项有限次，多项有限次，无限次-半月卡
                //卡项权益 
                CardRightsItems: {
                    'Project':[],
                },
                //赠送项目
                CardGivingItems: {
                    'Project':[],
                    'Product': [],
                },
                ToTalNum: 0, //多项有限次 总次数
                CardPrice: 0, //卡售价
                FeiKaPrice: 0, //菲卡价
                IsLimitNum: 0, //是否限制数量
                Num: 0,  //限制数量
                IsForever: 1, //是否永久,有效时间
                ValueDay: 0, //有效天数
                GiveDay: 0, //赠送天数
                IsLimitAct: 0, //是否限制激活
                ActNum: 0,  //激活天数
                IsInterSale: 0, //是否网店销售
                CardStyle: "", //卡的样式
                State: 0, //是否上架
            }
    var DiscountedFrom = {
                Name: "",
                ClassType: "折扣卡", //卡项大类型 次卡
                ChildType: "单项有限次", //卡项子类型 单项有限次，多项有限次，无限次-半月卡
                PayMoney: 0,  //冲多少
                GiveMoney: 0, //送多少
                IsUnionDisc: 1 , //是否统一折扣
                Discount: 0, //折扣
                CardPrice: 0, //充值折扣 为0 消费折扣 为卡的售价
                //卡项权益 
                CardRightsItems: {
                    'Project':[],
                    'Product': [],
                },
                //赠送项目
                CardGivingItems: {
                    'Project':[],
                    'Product': [],
                },
                FeiKaPrice: 0, //菲卡价
                IsLimitNum: 0, //是否限制数量
                Num: 0,  //限制数量
                IsForever: 1, //是否永久,有效时间
                ValueDay: 0, //有效天数
                GiveDay: 0, //赠送天数
                IsLimitAct: 0, //是否限制激活
                ActNum: 0,  //激活天数
                IsInterSale: 0, //是否网店销售
                CardStyle: "", //卡的样式
                State: 0, //是否上架
    }
export default {
    components: { Header ,TimeCard},
    data(){
        const   validateCardPrice = (rule, value, callback) => {
                    if (!value) {
                        return callback(new Error('售价不能为空'));
                    }else{
                        callback();
                    } 
                };
        const   validateCardRightsItems = (rule, value, callback) => {
                    if (value.Project.length === 0 && this.classType !='2') {
                        callback(new Error('至少添加一个项目/服务'));
                    }else if(this.classType == '2' && !this.formValidate.IsUnionDisc && (value.Project.length === 0 && value.Product.length === 0)){
                            callback(new Error('至少添加一个项目/服务或产品'));
                    }else{
                        callback();
                    }
                };
        const   validateLimitNum = (rule, value, callback) => { //永久有效
                    if (value && !this.formValidate.Num) {
                        callback(new Error('请填写售卡数量'));
                    } else {
                        callback();
                    }
                };

        const   validateActNum = (rule, value, callback) => {
                    if (!value && !this.formValidate.ValueDay) {
                        callback(new Error('请填写有效天数'));
                    } else {
                        callback();
                    }
                };

        const   validatePayMoney = (rule, value, callback) => {
                    if (!value && this.formValidate.parentType =='4') {
                        callback(new Error('请填写卡充值数额'));
                    } else {
                        callback();
                    }
                };
        const validateIsUnionDisc = (rule, value, callback) => {
            if(value==1 && this.formValidate.Discount==0){
                callback(new Error('请填写卡折扣'));
            }else {
                callback();
            }
        };

        const validateIsLimitAct = (rule, value, callback) => {
            if(value==1 && this.formValidate.ActNum==0){
                callback(new Error('请填写激活限制天数'));
            }else {
                callback();
            }
        }
        return{
            cardId: '',
            classType: '1', //1次卡，2折扣卡 3体验卡
            parentType: '', //大类
            parentTypeList: [],
            childTypeList:["月卡","季卡","半年卡","年卡"],
            config: {
                "CardName": "",
                "Random": true,
                "CurrrntStyleId": "",
                "Styles": []
            },
            total: {
                minRightsProject: 0,
                maxRightsProject: 0,
                projectDiscount: 0,
                productDiscount: 0,
                rightsProduct: 0,
                givingProject: 0,
                givingProduct: 0,
            },
            isEdit: false,
            isAdd: false,
            addTypeName: "",
            formValidate: {},
            ruleValidate: { 
                ChildType:[
                    { required: true, message: '类别不能为空', trigger: 'change' },
                ],
                Name: [
                    { required: true, message: '卡名不能为空', trigger: 'blur' },
                    { type: 'string', max: 40, message: '卡名不能超过40字', trigger: 'blur' }
                ],
                CardRightsItems: [
                    { required: true,validator:validateCardRightsItems, trigger: 'change' },
                ],
                CardPrice: [ 
                    { required: true, validator: validateCardPrice, trigger: 'blur' },
                ],
                IsLimitNum: [
                    { validator: validateLimitNum, trigger: 'change' },
                ],
                IsForever: [
                    { validator: validateActNum, trigger: 'change' },
                ],
                PayMoney: [
                    { required: true, validator: validatePayMoney, trigger: 'blur' },
                ],
                IsUnionDisc: [
                    {required: true, validator: validateIsUnionDisc, trigger: 'change'}
                ],
                IsLimitAct: [
                    {validator: validateIsLimitAct, trigger: 'change'}
                ]
            }
            
        }
    },
    created(){
        this.classType = this.$route.query.classType;
        this.cardId = this.$route.query.cardId;
        this.getConfig(); //卡颜色配置
        if(!this.cardId){
            if(this.classType == "1"){
                this.parentTypeList = ParentTypeList1;
                this.parentType = '1';
                this.formValidate = JSON.parse(JSON.stringify(TimeForm)); 
                this.formValidate.ClassType = "次卡";
            }else if(this.classType == "2"){
                this.parentTypeList = ParentTypeList2;
                this.parentType = '3';
                this.formValidate = JSON.parse(JSON.stringify(DiscountedFrom));
                this.formValidate.ClassType = "折扣卡";
                this.formValidate.ChildType = "消费折扣";
            }else if(this.classType == "3"){
                this.formValidate = JSON.parse(JSON.stringify(TimeForm));
                this.formValidate.ClassType = "体验卡";
                this.formValidate.ChildType = "体验卡";
            }
        }
        
        
    },
    computed: {
         currentBg() {
            const   item = this.config.Styles.find(item => item.StyleId === this.config.CurrrntStyleId);
            return item && `url(${item.PhotoUrl})`
        },
        minTotal(){ 
            return (this.total.minRightsProject + this.total.rightsProduct + this.total.givingProject + this.total.givingProduct).toFixed(2);
        },
        maxTotal(){
            if(this.formValidate.ChildType=='多项有限次'){
                return (this.total.maxRightsProject + this.total.rightsProduct + this.total.givingProject + this.total.givingProduct).toFixed(2);
            }else{
                return 0;
            }
        },
        discountTotal(){
            if(this.classType=='2'){
                return (this.total.projectDiscount + this.total.productDiscount + this.total.givingProject + this.total.givingProduct).toFixed(2);
            }else{
                return 0;
            }
        },
        //菲卡价
        faceCardPrice(){
            if(this.formValidate.CardRightsItems && this.formValidate.CardRightsItems.Project 
            && this.formValidate.CardRightsItems.Project.length>0 
            && (this.classType=='3' || this.parentType=='1')){
                let  arr = this.formValidate.CardRightsItems.Project;
                let maxPrice = Math.max.apply(Math, arr.map(item => item.ItemPrice));
                return Math.round(maxPrice*1.2);
                
            }else{
                return 0;
            }
             
        }

    },
    
    methods:{
        getData(){
            let url = '/CardProject/GetCardPeojectByCardId?cardId=' + this.cardId;
            this.$Spin.show();
            this.$axios.post(url).then(res => {
                this.$Spin.hide();
                const { Code, Message, Data } = res.data;
                if (Code === '0') {
                    this.formValidate = Data;
                    this.classType = this.formValidate.ClassType=='次卡' ? '1' : this.formValidate.ClassType=="折扣卡" ? '2' : '3';
                    this.formValidate.IsForever = this.formValidate.IsForever ?  1 :  0;
                    this.formValidate.IsInterSale = this.formValidate.IsInterSale ? 1 :  0;
                    this.formValidate.IsLimitNum = this.formValidate.IsLimitNum ? 1 : 0;
                    this.formValidate.IsLimitAct = this.formValidate.IsLimitAct ? 1 : 0;
                    this.formValidate.IsUnionDisc = this.formValidate.IsUnionDisc ? 1 :  0;
                    this.config.CurrrntStyleId = this.formValidate.CardStyle;

                    if(this.classType=='1'){
                        this.parentTypeList = ParentTypeList1;
                        if(this.formValidate.ChildType.includes('有限次')){
                            this.parentType = "1"
                        }else{
                            this.parentType = "2"
                        }
                    }else if(this.classType=='2'){
                        this.parentTypeList = ParentTypeList2;
                        if(this.formValidate.ChildType=="消费折扣"){
                            this.parentType = "3"
                        }else{
                            this.parentType = "4"
                        }
                    }
                    
                } else {
                    this.$Message.error(Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },

        selectparentType(val){
            if(this.cardId) return;
            this.parentType = val;
            this.typeChange(this.parentType);
            if(val == '3'){
                this.formValidate.ChildType = "消费折扣";
            }else if(val == '4'){
                this.formValidate.ChildType = "充值折扣";
            }else if(val == '2'){
                this.formValidate.ChildType = "";
            }else{
                this.formValidate.ChildType = "单项有限次";
            }
            
        },
        typeChange(val){
            this.total = {
                minRightsProject: 0,
                maxRightsProject: 0,
                projectDiscount: 0,
                productDiscount: 0,
                rightsProduct: 0,
                givingProject: 0,
                givingProduct: 0,
            };
            if(val == '1' || val == '2'){
                this.formValidate = {
                    ...JSON.parse(JSON.stringify(TimeForm)),
                    ChildType: this.formValidate.ChildType,
                    ClassType: "次卡"
                }; 
            }else{
                this.formValidate = {
                    ...JSON.parse(JSON.stringify(DiscountedFrom)),
                    ChildType: this.formValidate.ChildType,
                    ClassType: "折扣卡"
                }; 
            }
            this.randomColor()
        },
        UnionDiscChange(val){
            if(val){
                this.formValidate.CardRightsItems.Project=[];
                this.formValidate.CardRightsItems.Product=[];
            }else{
                this.formValidate.Discount = 0;
            }
        },
        randomColor(){
            this.config.Random = true; 
            let item = this.config.Styles[Math.floor(Math.random()*this.config.Styles.length)]
            this.config.CurrrntStyleId = item.StyleId;
            this.formValidate.CardStyle = item.StyleId;
        },

        handleSubmit (name) {
            // console.log(this.formValidate)
            if(this.formValidate.FeiKaPrice==null){
                this.formValidate.FeiKaPrice=0;
            }
            if(this.formValidate.Num==null){ //限制数量
                this.formValidate.Num=0;
            }
            if(this.formValidate.ValueDay==null){ //有效天数
                this.formValidate.ValueDay=0;
            }
            if(this.formValidate.GiveDay==null){ //赠送天数
                this.formValidate.GiveDay=0;
            }
            if(this.formValidate.ActNum==null){ //激活天数
                this.formValidate.ActNum=0;
            }

            this.$refs[name].validate((valid) => {
                if (valid) {
                    let url = "";
                    if(this.classType=="1"){
                        url = '/CardProject/AddCardSub';
                    }else if(this.classType=="2"){
                        url = '/CardProject/AddCardDisc';
                    }else if(this.classType=="3"){
                        url = '/CardProject/AddCardFree';
                    }
                    this.$Spin.show();
                    this.$axios.post(url,this.formValidate).then(res => {
                        this.$Spin.hide();
                        const { Code, Message, Data } = res.data;
                        if (Code === '0') {
                            this.$Message.success(this.formValidate.Id ? '修改成功' : '保存成功');
                            this.$router.push('/cardManage');
                        } else {
                            this.$Message.error(Message);
                        }
                    }).catch(e => {
                        throw new Error(e)
                    })
                } else {
                    this.$Message.error('有必填项未填写');
                }
            })
        },

        changeData(val,type,minTotal,maxTotal,discount,totalNum){
             //1权益服务  2权益产品 3赠送服务  4赠送产品
            // console.log(val,type,total)
            if(type == "1"){
                this.formValidate.CardRightsItems.Project = val;
                if(totalNum && this.classType == '1' && this.formValidate.ChildType.includes('多项有限次')){
                    this.formValidate.ToTalNum = totalNum;
                }
                this.total.minRightsProject = minTotal;
                this.total.maxRightsProject = maxTotal;
                if(discount>0){
                     this.total.projectDiscount = discount;
                }
            }else if(type == "2"){
                this.formValidate.CardRightsItems.Product = val;
                this.total.rightsProduct = minTotal;
                if(discount>0){
                     this.total.productDiscount = discount;
                }
            }else if(type == '3'){
                this.formValidate.CardGivingItems.Project = val;
                this.total.givingProject = minTotal;
            }else if(type == '4'){
                this.formValidate.CardGivingItems.Product = val;
                this.total.givingProduct = minTotal;
            }
            
            
        },
        //上架与下架
        changeState(){
            this.$Spin.show();
            this.$axios.post('/CardProject/SetCardProjectUpDown',{
                CardIds: [this.formValidate.Id],
                State: this.formValidate.State == "1" ? "0" : "1"
            }).then(res => {
                this.$Spin.hide();
                const { Code, Message, Data } = res.data;
                if (Code === '0') {
                    this.formValidate.State == "1" ? this.formValidate.State = "0" : this.formValidate.State = "1"
                    this.$Message.success(this.formValidate.State == "1" ? "下架成功" : "上架成功");
                } else {
                    this.$Message.error(Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },
        deleteType(index){
            this.$Modal.confirm({
                title: '请确认是否删除'+this.childTypeList[index],
                onOk: () => {
                    this.childTypeList.splice(index,1);
                }
            })
            
        },
        addChildType(){
            this.childTypeList.push(this.addTypeName);
            this.isAdd = false;
            this.addTypeName = '';
        },
        getConfig() {
            const url = '/Card/GetCardStyle?type=2'
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    this.config = res.data.Data;
                    //|| this.config.Random
                    if(!this.cardId){
                        this.randomColor();
                    }else{
                        this.getData();
                    }
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        }

    }
}
</script>
<style lang="less">
    .editCard{
        .ivu-radio-inner:after{
            background-color: #F1A56F;
        }
        .ivu-radio-wrapper-checked{
            font-weight: 700;
        }
        .ivu-radio-checked .ivu-radio-inner{
            border-color: #F1A56F;
        }
        .ivu-input-wrapper{
            width: 320px;
        }
        .ivu-input-number{
            font-size: 14px;
            height: 40px;
            line-height: 40px;
        }
        .numInput{
            width: 320px;
        }
        .littleInput{
            width: 100px;
        }
        .ivu-select-single .ivu-select-selection,.ivu-select{
            width: 320px;
        }
        @media screen and (max-width:576px) {
            .ivu-input-wrapper{
                width: 200px;
            }
            .ivu-select-single .ivu-select-selection,.ivu-select,.numInput{
                width: 200px;
            }
            .littleInput{
                width: 60px;
            }
        }
    }
</style>
<style lang="less" scoped>
    .editCard{
        background-color: #F7F8FA;
        .content{
            padding-bottom: 80px;
            .head{
                margin: 10px;
                background-color: #fff;
                padding: 16px 30px;
                .instruction{
                    display: flex;
                    align-items: center;
                    line-height: 2;
                    height: 100px;
                    font-weight: 700;
                }
                .ivu-row .ivu-col{
                    > div{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 30px 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        cursor: pointer;
                        h3{
                            line-height: 2;
                            font-size: 18px;
                        }
                        p{
                            color: #999;
                            font-size: 14px;
                        }
                    }
                    .active{
                        border: 1px solid #3275F5;
                        position: relative;
                        img{
                            position: absolute;
                            right: -1px;
                            bottom: -1px;
                        }
                    }
                }
                
            }
            
            .form{
                margin: 10px;
                background-color: #fff;
                padding: 16px 30px;
                .total{
                    width: 320px;
                    line-height: 48px;
                    background: #f9f9f9;
                    padding: 0 15px;
                }
                @media screen and (max-width:576px){
                    .total{
                        width: 200px;
                    }
                    
                }
            }
            .styles{
                margin: 10px;
                background-color: #fff;
                padding: 30px;
                display: flex;
                .label {
                    margin-right: 10px;
                    width: 80px;
                    line-height: 32px;
                }
                .cardWrap{
                    display: flex;
                    flex-direction: column;
                    width: calc(100% - 80px);
                    ul {
                        display: flex;
                        flex-wrap: wrap;
                        li {
                            height: 32px;
                            width: 32px;
                            border-radius: 50%;
                            margin-right: 15px;
                            // box-sizing: content-box;
                            cursor: pointer;
                            background-size: 100% 100%;
                            position: relative;
                        }

                        .random {
                            border: 2px solid #E94E27;
                            font-size: 12px;
                            span {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 100%;
                                height: 100%;
                                background-color: #fff;
                                border-radius: 50%;
                            }
                        }

                        .selected::before {
                            // border-color: #E94E27;
                            position: absolute;
                            content: "✔";
                            width: 12px;
                            height: 9px;
                            right: -6px;
                            top: -13px;
                        }
                    }
                    .card{
                        margin-top: 20px;
                        width: 300px;
                        height: 160px;
                        background-size: 100% 100%;
                        border-radius: 12px;
                        p{
                            font-size: 20px;
                            padding: 15px 20px;
                            color: #fff;
                        }
                    }
                    @media screen and (max-width: 576px){
                        .card{
                            width: 220px;
                            height: 117px;
                        }
                    }
                }
                    
                

            }
            @media screen and (max-width:700px){
                .head,.form,.styles{
                    padding: 16px 10px;
                } 
            }

            .bottom{
                background: #fff;
                border-top: 1px solid #E4E4E4;
                display: flex;
                justify-content: center;
                position: fixed;
                bottom: 0px;
                left: 10px;
                right: 10px;
                padding: 15px 0;
                .ivu-btn{
                    border-color: #333;
                    width: 140px;
                    line-height: 40px;
                    margin-right: 20px;
                    &:last-of-type{
                        margin-right: 0;
                    }
                }
                @media screen and (max-width:700px){
                   .ivu-btn{
                       width: auto;
                   } 
                }

            }
        }
    }

    .typeModel{
        ul{
            display: flex;
            flex-wrap: wrap;
            max-height: 600px;
            overflow-y: auto;
            li{
                width: 160px;
                height: 50px;
                line-height: 50px;
                border: 1px solid #e4e4e4;
                text-align: center;
                font-size: 17px;
                font-weight: 700;
                color: #333;
                margin: 10px;
                border-radius: 8px;
                position: relative;
                cursor: pointer;
                .icon{
                    position: absolute;
                    top: -8px;
                    right: -8px;
                }
            }
            .addIcon{
               color: #E94E27;
               font-size: 20px;
            }
        }
        @media screen and (max-width:700px){
            ul{
                justify-content: center;
                li{
                    width: 220px;
                }
            }
        }
        .ivu-btn{
            width: 120px;
            line-height: 36px;
        }
    }
    .addTypeModel{
        .content{
            display: flex;
            justify-content: center;
            .ivu-input-wrapper{
                width: 320px;
                font-size: 15px;
            }
        }
        .ivu-btn{
            width: 120px;
            line-height: 36px;
        }
    }
</style>