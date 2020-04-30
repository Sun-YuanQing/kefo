<template>
    <div class="left">
        <RadioGroup @on-change="onRadioChange" v-model="radio" type="button">
            <Radio :label="1">项目/服务</Radio>
            <Radio :label="2">产品</Radio>
        </RadioGroup>
        <Tabs v-model="tabValue">
            <TabPane label="全部" name="0"></TabPane>
            <TabPane v-for="(tab,index) in tabList" :key="index" :label="tab.Name" :name="tab.Id"></TabPane>
        </Tabs>
        <div class="empty" v-if="isLoaded1 && tabContent.length==0 && radio == 1">还没有项目/服务，点击<router-link to="/addProject">添加项目/服务</router-link>吧！</div>
        <div class="empty" v-if="isLoaded2 && tabContent.length==0 && radio == 2">还没有产品，点击<router-link to="/addProduct">添加产品</router-link>吧！</div>
        <transition-group name="list-transition" tag="ul" class="itemList" v-else>
            <li v-for="item in tabContent" :key="item.Id" @click="addProject(item)" class="list-transition-item">
                <p>{{item.Name}}</p>
                <p>￥{{item.Price.toFixed(2)}}</p>
            </li>
        </transition-group>

        <!-- 选择项目 -->
        <Modal v-model="isAddProject" :title="projectTitle" class="addModal"
               :mask-closable="false" :footer-hide="true" width="630" @on-cancel="cancelModal">
            <div class="addModalConten">
                <ul class="workList" >
                    <li class="empty" style="text-align: left;color: #999;"  
                        v-if="radio == '1' && workList.length==0">点击
                        <router-link to="/staffPosition">添加工种</router-link></li>
                    <li class="empty" style="text-align: left;color: #999;"  
                        v-if="radio == '2' && saleWays.length==0">点击
                    <router-link to="/productSale">添加销售方式</router-link></li>
                    <li v-for="(work,index) in workList" :key="index" 
                        :class="selectedWork.Id==work.Id ? 'active': ''"
                        @click="selectWork(work)">{{work.Name}}<span>（选填）</span></li>
                </ul>
                <Tabs v-model="selectedJob" class="job" @on-click="jobChange">
                    <div class="empty" v-if="jobList.length==0">还没有员工，点击<router-link to="/staffManage">添加员工</router-link>吧！</div>
                    <TabPane v-for="(job,index) in jobList" :key="index" :label="job.Name" :name="job.Id">
                        <div class="empty" v-if="currenEmployeeList.length==0">还没有员工，点击<router-link to="/staffManage">添加员工</router-link>吧！</div>
                        <ul class="jobList">
                            <li v-for="(item,indx) in currenEmployeeList" :key="indx" 
                                :class="{ selected: selectedEmployee && selectedEmployee[selectedWork.Id] && item.Id === selectedEmployee[selectedWork.Id].EmployeeId }"
                                @click.self="selectEmployee(item,indx)">
                                <div @click="selectEmployee(item,indx)">
                                    <p>{{item.Name}}</p>
                                    <p class="number">员工编号：{{item.Number}}</p>
                                </div>
                                <div class="switchWrap" v-if="radio == 1">
                                    <i-switch  v-model="item.ServiceType"  @on-change="switchChange($event,item,indx)" ></i-switch>
                                    <p>{{item.ServiceType ? "指定" : "非指定"}}</p>
                                </div>
                            </li>
                        </ul>
                    </TabPane>
                </Tabs>
            </div>
            <div class="addModalFooter">
                <Button type="primary" @click="addOrder">确定</Button>
            </div>
        </Modal>
        
    </div>
</template>
<script>
export default {
    name: 'order',
    props: {
        orderList: {
            type: Array,
            default: []
        },
    },
    data(){
        return{
            radio: 1,
            serviceList: [] , //项目
            productList: [], //产品
            tabValue: 0,
            serviceTypes: [],
            productTypes: [],

            isAddProject: false,
            projectTitle: "",
            jobList:[{Id: '0',Name: '全部'}],
            workList: [],
            saleWays: [],
            professions: [],
            employeeList: [],
            currenEmployeeList: [],
            selectedJob: '',
            selectedWork: "",
            selectedEmployee: "",
            orderDetail: {},
            isLoaded1: false,
            isLoaded2: false,
        }
    },
    computed:{
        tabList: function(){
            if(this.radio == 1) return this.serviceTypes;
            if(this.radio == 2) return this.productTypes;
        },

        tabContent: function(){
            if(this.radio == 1){
                if(this.tabValue==0){
                    return this.serviceList;
                }else{
                    return this.serviceList.filter(item => item.ServiceType == this.tabValue);
                }
            }else{
                if(this.tabValue==0){
                    return this.productList;
                }else{
                    return this.productList.filter(item => item.ProductType == this.tabValue);
                }
            }
            
        },

    },
    watch: {
        selectedWork:{
            handler(){
                if(!this.selectedWork)[
                    this.selectedWork = {
                        Id: 0,
                        Name: '0'
                    }
                ]
                this.watchData();
            },
            deep: true,
            immediate: true
        },
        selectedJob(){
            this.watchData();
        },

    },
    created(){
        this.getServiceTypes(); //项目类别
        this.getProductTypes(); //产品类别
        this.getServices();    //项目列表
        this.getProducts();    //产品列表
        this.getSaleWay();     //销售类别
        this.getJobList();
        this.getWorkList();
        this.getEmployees();
        
    },
    methods: {
        onRadioChange(e){
            this.tabValue = 0;
            if(this.radio == 1) this.workList =  this.professions;
            if(this.radio == 2) this.workList = this.saleWays;
            this.selectedWork = this.workList[0];
        },
        selectWork(item){
            this.selectedWork = item;
        },
        jobChange(){
            let arr = JSON.parse(JSON.stringify(this.employeeList));
            this.currenEmployeeList = arr.filter(item => item.PositionId == this.selectedJob);
            
            
        },
        watchData(){
            this.jobChange();
            let key = this.selectedWork.Id;
            if(this.radio == 1 && this.selectedEmployee[key] ){
                for(let i=0;i< this.currenEmployeeList.length;i++){
                    if(this.selectedEmployee[key].ServiceType=='2' && this.selectedEmployee[key].EmployeeId == this.currenEmployeeList[i].Id){
                        this.$set(this.currenEmployeeList[i],'ServiceType',true)
                    }
                }
            }
        },
        selectEmployee(item,index){
            let key = this.selectedWork.Id;
            let data;
            if(this.radio == 1){
                data = {
                    EmployeeId: item.Id,
                    EmployeeName: item.Name,
                    ServiceType: item.ServiceType ? '2' : '1', //1 点 ，2 轮
                    ProfessionName: this.selectedWork.Id == 0 ? '' : this.selectedWork.Name,
                    ProfessionId: this.selectedWork.Id == 0 ? '' : this.selectedWork.Id
                };
            }else{
                data = {
                    EmployeeId: item.Id,
                    EmployeeName: item.Name,
                    SaleWayName: this.selectedWork.Id == 0 ? '' : this.selectedWork.Name,
                    SaleWayId: this.selectedWork.Id == 0 ? '' : this.selectedWork.Id
                };
            }
            if(this.selectedEmployee.hasOwnProperty(key) ){
                if(this.selectedEmployee[key].EmployeeId == item.Id){
                    this.selectedEmployee[key] = '';
                    Reflect.deleteProperty(this.selectedEmployee,key);
                    this.$set(this.currenEmployeeList[index],'ServiceType',false)
                } else{
                    this.selectedEmployee[key] = data;
                }
            }else{
                this.selectedEmployee = { ...this.selectedEmployee, [key]: data };
                
            }
            this.currenEmployeeList.forEach((item,indx) => {
                if(indx != index){
                    this.$set(this.currenEmployeeList[indx],'ServiceType',false)
                }
            })
        },
        switchChange(status,item,index){
            // console.log(44,status,item)
            let key = this.selectedWork.Id;
            let data = {
                    EmployeeId: item.Id,
                    EmployeeName: item.Name,
                    ServiceType: item.ServiceType ? '2' : '1', //1 点 ，2 轮
                    ProfessionName: this.selectedWork.Id == 0 ? '' : this.selectedWork.Name,
                    ProfessionId: this.selectedWork.Id == 0 ? '' : this.selectedWork.Id
                };
            if(status ){
                if(this.selectedEmployee.hasOwnProperty(key) ){
                    this.selectedEmployee[key] = data;
                }else{
                    this.selectedEmployee = { ...this.selectedEmployee, [key]: data };
                }
                this.currenEmployeeList.forEach((item,indx) => {
                    if(indx != index){
                        this.$set(this.currenEmployeeList[indx],'ServiceType',false)
                    }
                })
            }else{
                if(this.selectedEmployee[key] && this.selectedEmployee[key].EmployeeId == item.Id){
                    this.$set(this.selectedEmployee[key],'ServiceType',status ? '2' : '1')
                }
            }
            
        
        },
        cancelModal(){
            if(this.jobList.length>0) this.selectedJob =  this.jobList[0].Id;
            if(this.workList.length>0) this.selectedWork = this.workList[0];
            this.selectedEmployee = "";
            this.orderDetail = {};
            this.jobChange();
        },

        addOrder(){
            // console.log('this.selectedEmployee',this.selectedEmployee)
            if(Object.keys(this.selectedEmployee).length > 0){
                this.orderDetail = {
                    ...this.orderDetail,
                    ServiceStaff: Object.values(this.selectedEmployee)
                }
                this.orderList.push(this.orderDetail)

                this.$emit('getOrder',this.orderList)
                
                //   console.log(99,this.orderList)
            }
            this.isAddProject = false;
            this.cancelModal();

        },

        

        //添加产品或项目
        addProject(item){
            this.projectTitle = item.Name;
            this.orderDetail =   {
                        ItemName: item.Name,
                        ItemId: item.Id,
                        ItemType: this.radio == '1' ? '1' : '2',
                        Price: item.Price
                }
            this.isAddProject = true;
        },

        //职位
        getJobList(){
            const url = '/Lable/GetPositionsBySiteId'
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    const data = res.data.Data;
                    this.jobList = data.Position;
                    if(data.Position.length>0){
                        this.selectedJob =  data.Position[0].Id;
                    }
                    
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },

        //工种
        getWorkList(){
            const url = '/Lable/GetProfessionsBySiteId'
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    const data = res.data.Data;
                    this.professions = data.Position;
                    this.workList = data.Position;
                    if(data.Position.length>0){
                        this.selectedWork = data.Position[0];
                    }
                    
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },

        //销售类别
        getSaleWay(){
            const url = '/Lable/GetSaleWaysBySiteId'
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    const data = res.data.Data;
                    this.saleWays = data.SaleWays;
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },

        //员工列表
        getEmployees() {
            const url = '/Employee/GetEmployees'
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    this.employeeList = res.data.Data.Employees.filter(item => item.Status == 0);
                    this.jobChange();
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },

        //项目类别
        getServiceTypes() {
            const url = '/Lable/GetServiceTypesBySiteId'
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    this.serviceTypes = res.data.Data.ServiceTypes;
                    // [{Name: "全部",id: 0},...res.data.Data.ServiceTypes];
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },

        //产品类别
        getProductTypes() {
            const url = '/Lable/GetProductTypesBySiteId'
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    this.productTypes = res.data.Data.ProductTypes;
                    // [{Name: "全部",id: 0},...res.data.Data.ProductTypes];
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },

        //项目列表
        getServices() {
            const url = '/Lable/GetServicesBySiteId';
            const postData = {
                "PageIndex" :"1",
                "PageSize":"1000000"
            }
            this.$axios.post(url,postData).then(res => {
                this.isLoaded1 = true;
                if (res.data.Code === '0') {
                    let data =  res.data.Data;
                    this.serviceList = data.Services.filter(item => item.Status == 0);;
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },

        //产品列表
        getProducts() {
            const url = '/Lable/GetProductsBySiteId';
            const postData = {
                "PageIndex" :"1",
                "PageSize":"1000000"
            }
            this.$axios.post(url,postData).then(res => {
                this.isLoaded2 = true;
                if (res.data.Code === '0') {
                    let data =  res.data.Data;
                    this.productList = data.Products.filter(item => item.Status == 0);;
                    
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },



    }
}
</script>
<style lang="less">
.addModal{
    
    .ivu-modal-body{
        padding-top: 0;
        .ivu-switch-checked{
            background-color: #3275F5;
            border-color: #3275F5;
        }
        .addModalConten{
            .job{
                .ivu-tabs-nav .ivu-tabs-tab{
                    padding: 18px 16px;
                }
                .ivu-tabs-nav-container{
                    background-color: #F7F8FA;
                }
                .ivu-tabs-nav .ivu-tabs-tab-active{
                    font-weight: 900;
                }
                .ivu-tabs-ink-bar{
                    height: 0;
                }
                .ivu-tabs-nav-prev,.ivu-tabs-nav-next{
                    line-height: 58px;
                }
            }
        }
    }
}
</style>

<style lang="less" scoped>
    @import "../../../styles/order.less";
    .list-transition-item {
        transition: all .6s;
    }

    .list-transition-enter, .list-transition-leave-to {
        opacity: 0;
        transform: scale(.6);
    }

    .list-transition-leave-active {
        position: absolute;
        left: 200px;
    }
</style>

