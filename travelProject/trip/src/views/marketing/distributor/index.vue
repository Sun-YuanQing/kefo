<template>
    <div  class="distributor">
        <Header title="分销员" @change-router="$router.push('/marketing')"></Header>
        <div class="contentWrap">
            <div class="radioWrap">
                <RadioGroup v-model="postData.Status" type="button" @on-change="radioChange">
                    <Radio  :label="type.value" v-for="type in typeList" 
                            :key="type.value">{{type.label}}</Radio>
                </RadioGroup>
            </div>
            <div class="infoWrap">
                <div class="head" v-if="postData.Status==1">
                    <div class="tip">拓宽推广渠道，提升商家店铺的传播量和销量，邀请用户、员工、合作方等成为分销员，推广成功后发拥金</div>
                    <div class="buttonWrap">
                        <Button type="default" @click="$router.push('/storeSetting/distributor/royalty')">分销员设置</Button>
                        <Button type="default" @click="isAdd=true;">+新增分销员</Button>
                    </div>
                </div>
                <div class="tableWrap">
                    <Table  :columns="columns" :data="tableData" :loading="loading" :row-class-name="rowClassName"
                            :max-height="postData.Status==1 ? $bus.clientHeight-320 : $bus.clientHeight-235" stripe  disabled-hover>
                        <template slot-scope="{ row }" slot="Rank" >
                            <img v-if="row.Rank==1" src="@/assets/first-icon.svg" alt="" class="rank">
                            <img v-else-if="row.Rank==2" src="@/assets/second-icon.svg" alt="" class="rank">
                            <img v-else-if="row.Rank==3" src="@/assets/third-icon.svg" alt="" class="rank">
                            <span v-else>{{row.Rank}}</span>
                        </template>
                        <template slot-scope="{ row }" slot="Action">
                            <template v-if="postData.Status==1">
                                <Button type="text" @click="$router.push({path: '/distributorDetail',query: {id: row.Id}})">详情</Button>
                                <template>
                                    <Button  v-if="row.Status==2" type="text" @click="passVerification(row.Id,1)">重启身份</Button>
                                    <Button  v-else type="text" @click="cancleIdentity(row.Id)">取消身份</Button>
                                </template>
                                <Button  type="text" @click="changeRemark(row.Id,row.Remark)">备注</Button>
                            </template>
                            <template v-if="postData.Status==-1">
                                <Button type="text" @click="passVerification(row.Id,2)">通过</Button>
                                <Button type="text" @click="isNoPass=true;noPassId=row.Id">不通过</Button>
                            </template>
                            
                        </template>
                    </Table>
                    <Page
                        :total="total"
                        :current="postData.PageIndex"
                        :page-size="postData.PageSize"
                        placement="top"
                        show-total
                        show-sizer
                        @on-change="handleChange"
                        @on-page-size-change="pageSizeChanged"/>
                </div>
            </div>
        </div>

        <!-- 新增分销员 -->
        <Modal v-model="isAdd" width="460" :mask-closable="false" 
               class="addDistributorModal" @on-cancel="cancel('addForm')">
            <p slot="header" style="text-align:center;font-size: 18px;">新增分销员</p>
            <Form ref="addForm" :model="addForm" :rules="ruleValidate" :label-width="80">
                <FormItem prop="Phone" label="手机号">
                    <Input v-model="addForm.Phone"  placeholder="输入分销员手机号" maxlength="11"/>
                </FormItem>
            </Form>
            <div slot="footer" class="foot">
                <Button type="primary" @click="addDistributor">确定</Button>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Modal>

        <!-- 备注 -->
        <Modal v-model="isEditRemark" width="460" :mask-closable="false"  @on-cancel="isEditRemark=false;$refs['editRemark'].resetFields()">
            <Form  :label-width="80" style="margin-top: 50px;" ref="editRemark">
                <FormItem label="备注">
                    <Input v-model="editedRemark.Remark" type="text" maxlength="5"  placeholder="最多5个字"/>
                </FormItem>
            </Form>
            <div slot="footer" class="foot">
                <Button type="primary" @click="submitRemark">确定</Button>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Modal>

        <!-- 不通过审核 -->
        <Modal v-model="isNoPass" width="460" :mask-closable="false"  @on-cancel="isNoPass=false;reason=''">
            <Form  :label-width="80" style="margin-top: 20px;">
                <h3 style="text-align: center;line-height: 4;font-size: 18px;color: #333;">确定不通过审核?</h3>
                <FormItem label="理由">
                    <Input v-model="reason" type="text" maxlength="20"  placeholder="最多20个字（可不填）"/>
                </FormItem>
            </Form>
            <div slot="footer" class="foot">
                <Button type="primary" @click="noPass">确定</Button>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Modal>
       
    </div>
</template>
<script>
import Header from '@/components/route-header'
import { getDistributions, addDistribution, editDistributionRemark, editDistributionStatus } from '@/api/marketing.js'
import { validatePhone } from '@/utils/validate'
export default {
    name: "distributor",
    components: { Header },
    data(){
        return{
            isAdd: false,
            addType: "1",
            spinShow: false,
            addForm:{
                Phone: ""
            },
            isEditRemark: false,
            editedRemark: {
                Id: '',
                Remark: ''
            },
            isNoPass: false,
            noPassId: "",
            reason: "",
            postData: {
                Status: '1',  // 1. 分销员  -1 待审核  0. 未通过 2需重启身份
                PageIndex: 1,
                PageSize: 10
            },
            loading: false,
            total: 0,
            tableData:[],
            columns: [],
            typeList: [
                {
                    value: '1',
                    label: '分销员'
                },
                {
                    value: '-1',
                    label: '待审核'
                },
                {
                    value: '0',
                    label: '未通过'
                }
            ],
            distributorColumn: [
                {
                    title: '序号',
                    type: 'index',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '排名',
                    slot: 'Rank',
                    width: 120,
                    align: 'center',
                },
                {
                    title: '分销员',
                    key: 'Name',
                    minWidth: 120,
                    className: 'nameColumn',
                    align: 'left'
                },
                {
                    title: '联系电话',
                    key: 'Phone',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '总销售额(元)',
                    key: 'Sales',
                    minWidth: 130,
                    align: 'left',
                },
                {
                    title: '累计收益(元)',
                    key: 'Income',
                    minWidth: 130,
                    align: 'left',
                },
                {
                    title: '备注',
                    key: 'Remark',
                    minWidth: 160,
                    className: 'nameColumn',
                    align: 'left',
                    render: (h, params) => {
                                return h('div', params.row.Remark ? params.row.Remark :  '—');
                            }
                },
                {
                    title: '状态',
                    key: 'Status',
                    minWidth: 120,
                    align: 'left',
                    render: (h, params) => {
                        let status = params.row.Status,text;
                        if(status==-1){
                            text = "未审核"
                        }else if(status==0){
                            text = "已审核"
                        }else{
                            text = ""
                        }
                        return h('div', text);
                    }
                },
                {
                    title: '原因',
                    key: 'Reason',
                    minWidth: 160,
                    className: 'nameColumn',
                    align: 'left',
                    render: (h, params) => {
                                return h('div', params.row.Reason ? params.row.Reason :  '—');
                            }
                },
                {
                    title: '操作',
                    slot: 'Action',
                    minWidth: 260,
                    align: 'center'
                }
            ],
            ruleValidate: {
                Phone: [ { validator: validatePhone, trigger: 'blur' } ],
            }
            
        }
    },
    created(){
        this.update('1')
        this.getData();
    },
    methods:{
        radioChange(e){
            this.update(e);
            this.getData();
        },
        update(e) {
            switch(e){
                case '1':
                    this.columns = this.distributorColumn.slice(1,7).concat(this.distributorColumn.slice(9));
                    break;
                case '-1':
                    this.columns = this.distributorColumn.slice(0,1).concat(this.distributorColumn.slice(2,4)).concat(this.distributorColumn.slice(7,8)).concat(this.distributorColumn.slice(9));
                    break;
                case '0':
                    this.columns = this.distributorColumn.slice(0,1).concat(this.distributorColumn.slice(2,4)).concat(this.distributorColumn.slice(7,9));
                    break;
                default:
                    this.columns = this.distributorColumn.slice(1,6).concat(this.distributorColumn.slice(9));
            }
        },

        getData(){
            this.loading = true;
            getDistributions(this.postData).then(res => {
                this.loading = false;
                this.tableData = res.Data.Distribution;
                this.total = res.Data.Total;
            }).catch(err => {
                this.loading = false;
            })
        },
        //页码切换
        handleChange(e){
            this.postData.PageIndex = e;
            this.getData();
        },

        //每页条数切换
        pageSizeChanged(pageSize){
            this.postData = { ...this.postData,PageIndex: 1,PageSize: pageSize};
            this.getData();
        },
        // handleSearch(){
        //     this.postData = { ...this.postData,PageIndex: 1,PageSize: 10};
        //     this.getData();
        // },

        cancel(name){
            this.isAdd=false;
            this.$refs[name].resetFields();
        },

        //新增分销员
        addDistributor(){
            this.$refs['addForm'].validate((valid) => {
                if (valid) {
                    this.spinShow = true;
                    addDistribution(this.addForm.Phone).then(res => {
                        this.spinShow = false;
                        this.isAdd = false;
                        this.$Message.success( '新增成功');
                        this.getData();
                        this.$refs['addForm'].resetFields();
                    }).catch(err => {
                        this.spinShow = false;
                    })
                } else {
                    // this.$Message.error('');
                }
            })
        },

        //备注
        changeRemark(id,data){
            this.editedRemark = {
                Id: id,
                Remark: data
            };
            this.isEditRemark=true;
        },
        submitRemark(){
            this.spinShow = true;
            editDistributionRemark(this.editedRemark).then(res => {
                this.spinShow = false;
                this.isEditRemark = false;
                this.$Message.success( '修改备注成功');
                this.getData();
                this.$refs['editRemark'].resetFields();
            }).catch(err => {
                this.spinShow = false;
            })
        },

        //审核分销员
        changeStatus(postData,type){
            this.spinShow = true;
            editDistributionStatus(postData).then(res => {
                this.spinShow = false;
                if(postData.Status==0){
                    this.reason = '';
                    this.isNoPass = false;
                }
                //type 1重启身份 2通过审核  3不通过审核 4取消分销身份
                let text="";
                if(type==1){
                    text = "重启身份成功"
                }else if(type == 2){
                    text = "确认通过审核"
                }else if(type == 3){
                    text = "确认不通过审核"
                }else if(type == 4){
                    text = "取消分销身份成功"
                }
                this.$Message.success(text);
                // postData.Status==2 ? '取消身份成功' : postData.Status==1 ? '确认通过审核' : '确认不通过审核'
                this.getData();

            }).catch(err => {
                this.spinShow = false;
            })
        },

        //取消分销身份
        cancleIdentity(id){
            this.$Modal.confirm({
                title: '确认取消此分销员的身份?',
                onOk: () => {

                    let  postData = {
                        Status: "2" ,// 2.取消身份 1.通过 0.不通过 
                        Id: id,
                        Reason:""//审核不通过填写原因
                    }
                    this.changeStatus(postData,4);

                }
            })
        },

        //不通过审核
        noPass(){
            let  postData = {
                    Status: "0" ,// 2.取消身份 1.通过 0.不通过 
                    Id: this.noPassId,
                    Reason: this.reason//审核不通过填写原因
                }
            this.changeStatus(postData,3);
        },

        //通过审核 重启身份
        passVerification(id,type){
            this.$Modal.confirm({
                title: type==1 ? '确定重启此分销员的分销身份？' : '确认通过审核?',
                onOk: () => {
                    let  postData = {
                            Status: "1" ,// 2.取消身份 1.通过 0.不通过 
                            Id: id,
                            Reason: ""//审核不通过填写原因
                        }
                    this.changeStatus(postData,type);
                }
            })
        },

        rowClassName(row, index){
            if(row.Status==2){
                return 'gray';
            }else{
                return '';
            }
        },

    }
}
</script>
<style lang="less">
    .distributor{
        .ivu-table .gray td{
            color: #999;
        }
        .ivu-table-wrapper{
            .ivu-table td.nameColumn > div{
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    .ivu-form .ivu-form-item-label{
        color: #333;
        font-weight: 700;
    }
</style>
<style lang="less" scoped>
    .distributor{
        height: 100%;
        .contentWrap{
            min-height: calc(100% - 44px);
            max-height: calc(100% - 44px);
            padding: 10px;
            box-sizing: border-box;
            background-color: #F7F8FA;
            overflow-y: auto;
        }
        .radioWrap{
            background-color: #fff;
            padding: 20px 30px ;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .infoWrap{
            background-color: #fff;
            box-sizing: border-box;
            padding: 20px 30px 10px;
            border-radius: 4px;
            .head{
                .tip{
                    color: #999;
                    line-height: 1.5;
                }
                .buttonWrap{
                    margin: 20px 0;
                    .ivu-btn{
                        width: 120px;
                        &:nth-of-type(2){
                            margin-left: 20px;
                        }
                    }
                }
            }
            .ivu-table-wrapper{
                .ivu-btn{
                    color: #3275F5;
                }
            }
        }
        
    }
    .rank{
        display: inline-flex;
        align-items: center;
    }

    .foot{
        text-align: center;
        .ivu-btn{
            width: 120px;
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            // &:first-of-type{
            //     margin-right: 20px;
            // }
        }
    }
    
    
</style>