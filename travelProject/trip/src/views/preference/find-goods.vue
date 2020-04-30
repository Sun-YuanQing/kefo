<template>
    <div class="findGoods">
        <Header title="查找商品" @change-router="$router.back();"></Header>
        <div class="transform">
            <div class="searchWrap">
                <h4>您想查找哪个商品？</h4>
                <Search v-model="searchVal" placeholder="输入商品名称" @on-search="handleSearch"></Search>
            </div>
        </div>
    </div>
</template>
<script>
import Header from '@/components/route-header'
import Search from '@/components/search'
import {setSearchVal } from '@/utils/auth.js'
export default {
    components: { Header, Search },
    data(){
        return{
            searchVal: "",
        }
    },
    methods:{
        handleSearch(){
            setSearchVal(this.searchVal);
            this.$router.push('/preference')
        }
    }
}
</script>
<style lang="less" scoped>
    .findGoods{
        height: 100%;
        // background-color: #fff;
        overflow: auto;
        .transform {
            height: calc(100% - 44px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .searchWrap{
                // display: flex;
                // flex-direction: column;
                // align-items: center;
                h4{
                    font-size: 18px;
                    margin-bottom: 20px;
                }
            }
        }
    }
</style>