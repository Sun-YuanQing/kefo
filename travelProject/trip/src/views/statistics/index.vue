<template>
    <div class="mainWrap statistics">
        <div class="headMemu">
            <div class="breadcrumb">
                <span>数据管理</span>
                <span>/商家设置</span>
            </div>
            <Menu mode="horizontal" theme="light" active-name="1">
                <MenuItem name="1" to="/setting/merchant">商家设置</MenuItem>
                <MenuItem name="2">供应商设置</MenuItem>
                <MenuItem name="3">产品设置</MenuItem>
                <MenuItem name="4">游客类型设置</MenuItem>
            </Menu>
        </div>

        <div class="contentWrap">
            <div class="content">
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'statistics',
    data(){
        return {

        }
    }
}
</script>
<style lang="less" scoped>
    
</style>