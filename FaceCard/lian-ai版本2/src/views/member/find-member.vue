<template>
  <div class="user">
    <Header title="查找会员"></Header>
    <div class="transform">
      <div ref="userSearch" class="user-search">
        <h4>您想查找哪位会员？</h4>
        <p>可对会员详细进行操作…</p>
        <div class="search-con">
          <Search v-model="searchVal" placeholder="姓名/手机号" @on-search="handleSearch"></Search>
          <Button :disabled="!totalUser" class="all-user" to="/memberList">所有会员({{totalUser}})
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from 'src/components/search'
  import Header from 'src/components/route-header'
  import Pager from 'src/components/pager'
  import { formatPhone } from 'src/utils/index'

  export default {
    name: 'user',
    components: { Search,Header},
    data() {
      return {
        totalUser: 0,
        searchVal: ""
      }
    },
   created(){
       this.getTotalUser();
   },
    mounted(){

    },
    methods: {
      getTotalUser() {
        const url = '/User/GetUserCount'
        this.$axios.post(url).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.totalUser = data.Total;
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },

      handleSearch() {
        if(this.totalUser){
            this.$router.push({
                path: 'memberList',
                query: {
                    key: this.searchVal
                }
            })
        }
        
      },
    },
  }
</script>

<style scoped lang="less">
  .user {
    height: 100%;
    background-color: #fff;
    overflow: auto;

    .transform {
      height: calc(100% - 44px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-self: center;
    }
    .user-search {
      display: flex;
      flex-direction: column;
      align-self: center;
      margin-bottom: 6px;

      h4 {
        font-size: 18px;
        height: 25px;
      }

      .search-con {
        display: flex;
        margin-top: 33px;
      }

      .all-user {
        margin-left: 20px;
        height: 40px;
      }
    }

  }
  @media screen and (max-width:576px){
   .user .user-search .search-con{
     flex-direction: column;
   }
   .user .user-search .all-user{
     margin: 10px 0;
   }
   .search{
     margin-top: 25px;
   }
  }
</style>
