<template>
    <div class="user">
        <Header title="会员列表"></Header>
        <div ref="tableWrap" class="table-wrap">
            <div class="title">
                <p>会员列表</p>
                <div class="filter">
                    <Search v-model="postData.key" placeholder="姓名/手机号" @on-search="handleSearch"></Search>
                    <Button :disabled="!total" class="all-user"  @click="getAllUser">所有会员({{total}})</Button>
                </div>
            </div>
            
            <div style="flex: 1; overflow: scroll">
                <Table  :columns="columns" :data="tableData" 
                        @on-row-click="onRowClick" 
                        :loading="loading"
                        :max-height="maxHeight"
                        stripe  disabled-hover></Table>
            </div>
            <footer>
                <Pager :total="total" @on-change="onPageChange"></Pager>
            </footer>
        </div>
    </div>
</template>

<script>
import Header from 'src/components/route-header'
import Pager from 'src/components/pager'
import Search from 'src/components/search'
import { formatPhone } from 'src/utils/index'
export default {
    components: { Header,Pager,Search },
    data() {
        return {
            loading: false,
            maxHeight: 300,
            columns: [
            {
                title: '头像',
                key: 'Photo',
                fixed: 'left',
                minWidth: 100,
                render: (h, param) => {
                const item = param.row;
                return <Avatar src={item.Photo || require('../../assets/avatar.svg')} size="large"/>
                }
            },
            {
                title: '姓名',
                key: 'UserName',
                minWidth: 100,
            },
            {
                title: '手机',
                key: 'Phone',
                minWidth: 140,

            },
            {
                title: '性别',
                key: 'Sex',
                minWidth: 100,
            },
            {
                title: '最近到店时间',
                key: 'LastDatetime',
                minWidth: 170,
            },
            {
                title: '到店次数',
                key: 'VisitNumbers',
                minWidth: 100,
            },
        ],
        tableData: [],
        total: 0,
        postData: {
          key: '',
          PageIndex: 1,
          PageSize: 10,
          Type: '-1'  // -1 取所有会员  1.今天会员 2. 当月会员
        },
        }
    },
    created(){
        var height = document.documentElement.clientHeight || document.body.clientHeight;
        this.maxHeight = height-205;
        let key = this.$route.query.key;
        if(key){
            this.postData.key = key;
        }
        this.onPageChange({PageIndex:1,PageSize: 10})
    },
    methods:{
        onRowClick(row) {
            this.$router.push({ path: '/userDetail', query: { faceId: row.FaceId ,userId: row.UserId} })
        },
        onPageChange({ PageIndex, PageSize }) {
            this.postData = { ...this.postData, PageIndex, PageSize }
            this.getList()
        },
        getList() {
            this.loading = true;
            const url = '/User/GetUsersByKey'
            this.$axios.post(url, this.postData).then(res => {
                this.loading = false;
            if (res.data.Code === '0') {
                const data = res.data.Data;
                this.total = data.Total;
                this.tableData = data.Users.map(item => {
                return {
                    ...item,
                    Sex: item.Sex === 1 ? '男' : '女',
                    Phone: formatPhone(item.Phone)
                }
                })
            } else {
                this.$Message.error(res.data.Message);
            }
            }).catch(e => {
                throw new Error(e)
            })
        },
        getAllUser(){
            this.postData.key="";
            this.onPageChange({PageIndex:1,PageSize: 10});
        },
        handleSearch(){
            this.onPageChange({PageIndex:1,PageSize: 10});
        }
    }
}
</script>
<style lang="less">
    .ivu-table .ivu-table-row {
      td {
        height: 60px;
      }
    }
    .ivu-table th {
        background-color: #eee;
    }
</style>


<style lang="less" scoped>
    .user{
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: #F7F8FA; 
        .all-user {
            margin-left: 20px;
            height: 40px;
        }
    }
    .table-wrap{
        padding: 10px 10px 0;
        margin: 10px;
        box-sizing: border-box;
        background-color: #fff;
        .title{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            p{
                font-size: 16px;
                font-weight: 700;
            }
            .filter{
                display: flex;
                margin-right: 10px;
                .ivu-date-picker{
                    margin-left: 10px;
                }
            }
        }
    }

    @media screen and(max-width: 576px){
        
        .table-wrap .title {
            p{
                display: none;
            }
            
            .filter{
                .search{
                    width: 225px;
                }
                .all-user{
                     margin: 0 0 0 5px;
                     padding: 0 5px;
                 }
            }
        }
        
    }
</style>

