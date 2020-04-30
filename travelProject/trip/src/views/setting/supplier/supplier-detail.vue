<template>
    <FullPage title="供应商详情" class="supplierDetail" 
               @change-router="$router.push('/setting/supplier/list')">
         <Form  :label-width="110" class="form">
            <FormItem label="供应商名称：">
                <div>{{detailData.Name}}</div>
            </FormItem>
            <FormItem label="供应商类型：">
                <div>{{detailData.TypeName}}</div>
            </FormItem>
            <FormItem label="负责人：">
                <div>{{detailData.Leader}}</div>
            </FormItem>
            <FormItem label="联系电话：">
                <div>{{detailData.Telephone}}</div>
            </FormItem>
            <FormItem label="所在地址：">
                <div>{{detailData.Address}}</div>
            </FormItem>
            <FormItem label="营业执照：">
                <ul>
                    <li v-for="(img,index) in detailData.BusinessLicense" :key="index">
                        <img :src="img" alt="" >
                    </li>
                </ul>
            </FormItem>
            <FormItem label="合同有效期：">
                <div>{{detailData.ContractStartTimeStr}}-{{detailData.ContractEndTimeStr}}</div>
            </FormItem>
            <FormItem label="合同文件：">
                <ul>
                    <li v-for="(file,index) in detailData.ContractFile" :key="index">
                        <img :src="file" alt="">
                    </li>
                </ul>
            </FormItem>
            <FormItem label="备注：">
                <div>{{detailData.Remark}}</div>
            </FormItem>
        </Form>
        <div class="bottom">
            <Button type="primary" @click="$router.push({path: '/editSupplier',query: {id: id}})">编辑</Button>
        </div>
    </FullPage>
</template>
<script>
import FullPage from '@/components/fullscreen-page'
import { getSupplierById } from '@/api/setting.js'
export default {
    name: "supplierDetail",
    components: { FullPage },
    data(){
        return{
            id: "",
            detailData: {}
        }
    },
    created(){
        this.id = this.$route.query.id;
        this.getDetail();
    },
    methods: {
        getDetail(){
            this.$Spin.show();
            getSupplierById(this.id).then(res => {
                this.$Spin.hide();
                this.detailData = res.Data.Supplier;
            }).catch(err => {
                this.$Spin.hide();
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .supplierDetail{
        box-sizing: border-box;
        padding-bottom: 80px;
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                width: 200px;
                margin-right: 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                img{
                    width: 200px;
                    border-radius: 4px;
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
                width: 200px;
            }
        }
    }
</style>