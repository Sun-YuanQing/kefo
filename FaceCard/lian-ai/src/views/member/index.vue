<template>
    <div class="member">
        <div class="condition-wrap">
            <Row class="member-condition">
                <Col :xs="24" :sm="8">
                    <router-link to="/todayMember">
                        <p style="font-size: 14px;">今日新增会员</p>
                        <div class="amount">
                            <span>{{userStatistics.tcount}}</span>
                            <!-- <img src="@/assets/detail-icon.svg" alt=""> -->
                        </div>
                        <p>昨日<span style="padding-left: 10px;">{{userStatistics.ycount}}</span></p>
                    </router-link>
                </Col>
                <Col :xs="24" :sm="8">
                    <router-link to="/monthMember">
                        <p style="font-size: 14px;">本月新增会员</p>
                        <div class="amount">
                            <span>{{userStatistics.mcount}}</span>
                            <!-- <img src="@/assets/detail-icon.svg" alt=""> -->
                        </div>
                        <p>上月<span style="padding-left: 10px;">{{userStatistics.lmcount}}</span></p>
                    </router-link>
                </Col>
                <Col :xs="24" :sm="8">
                    <router-link to="/memberList">
                        <p style="font-size: 14px;">会员总数</p>
                        <div class="amount">
                            <span>{{userStatistics.totalUser}}</span>
                            <!-- <img src="@/assets/detail-icon.svg" alt=""> -->
                        </div>
                    </router-link>
                </Col>
            </Row>
            <Row class="member-condition amount-condition">
                <Col :xs="24" :sm="8">
                    <div>
                        <p style="font-size: 14px;">会员总充值金额(元）</p>
                        <div class="amount">
                            <span>{{Math.floor(userStatistics.totalRecharge)}}</span>
                            <span style="font-size: 22px">.{{Number(userStatistics.totalRecharge).toFixed(2).substr(-2, 2)}}</span>&nbsp;
                        </div>
                    </div>
                </Col>
                <Col :xs="24" :sm="8">
                    <div>
                        <p style="font-size: 14px;">会员消耗金额(元）</p>
                        <div class="amount">
                            <span>{{Math.floor(userStatistics.totalConsume)}}</span>
                            <span style="font-size: 22px">.{{Number(userStatistics.totalConsume).toFixed(2).substr(-2, 2)}}</span>&nbsp;
                        </div>
                    </div>
                </Col>
                <Col :xs="24" :sm="8">
                    <div>
                        <p style="font-size: 14px;">会员剩余金额(元）</p>
                        <div class="amount">
                            <span>{{Math.floor(userStatistics.totalCard)}}</span>
                            <span style="font-size: 22px">.{{Number(userStatistics.totalCard).toFixed(2).substr(-2, 2)}}</span>&nbsp;
                        </div>
                    </div>
                </Col>
            </Row>
            


        </div>
        <div class="function">
            <div class="title">常用功能</div>
            <Row class="list">
                <Col :xs="24" :sm="6">
                    <!-- <router-link to="/index"> -->
                    <div @click="isAdd=true;">
                        <img src="@/assets/add-icon.svg" alt="">
                        <span>添加会员</span>
                    </div>
                    <!-- </router-link> -->
                </Col>
                <Col :xs="24" :sm="6">
                    <router-link to="/charge">
                        <img src="@/assets/member-charge-icon.svg" alt=""> 
                        <span>会员充值</span>
                    </router-link>
                </Col>
                <Col :xs="24" :sm="6">
                    <router-link to="/memberList">
                        <img src="@/assets/member-icon.svg" alt="">
                        <span>会员列表</span>
                    </router-link>
                </Col>
                <Col :xs="24" :sm="6">
                    <router-link to="/findMember">
                        <img src="@/assets/search-icon.svg" alt="">
                        <span>查找会员</span>
                    </router-link>
                </Col>
            </Row>
        </div>
         <!-- 添加会员 -->
        <add-member :isShow="isAdd" title="2" :form="{}" @cancel-add="isAdd = false" ></add-member>
    </div>
</template>
<script>
import AddMember from 'src/components/add-member'
export default {
    components: { AddMember },
    data(){
        return{
            num: 50,
            isAdd:  false,
            userStatistics: {
                "tcount": 0,  //今天数量
                "ycount": 0,  //昨天
                "mcount": 0,  // 当月
                "lmcount": 0, //上月
                "totalUser": 0, //总会员
                "totalRecharge": 0, //总充值
                "totalConsume": 0, //总消费
                "totalCard": 0 //会员总金额
            }
            
        }
    },
    created(){
        this.getUserStatistics();
    },
    beforeDestroy() {

    },
    methods: {
        getUserStatistics(){
            let url = "/Report/GetUserStatistics";
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    this.userStatistics = res.data.Data.Statistics;
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
<style lang="less" scoped>
    .member{
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 10px;
        box-sizing: border-box;
        background: #F7F8FA;
        .condition-wrap,.function{
            width: 100%;
            background: #fff;
            border-radius: 8px;
            box-sizing: border-box;
        }
        
        .condition-wrap{
            .amount-condition{
                border-top: 1px solid #f5f5f5;
            }
            .member-condition{
                position: relative;
                width: 100%;
                box-sizing: border-box;
                padding: 50px 0;
                .ivu-col{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 20px;
                    position: relative;
                    a,div{
                        color: #333;
                        text-align: center;
                        .amount{
                            font-weight: 700;
                            font-size: 30px;
                            img{
                                padding-left: 18px;
                            }
                        }
                    }
                }
            }
        }
        .function{
            padding: 20px;
            margin-top: 10px;
            padding: 30px;
            .title{
                font-size: 16px;
                font-weight: 700;
            }
            .list{
                .ivu-col{
                    a,div{
                        display: flex;
                        align-items: center;
                        width: 100%;
                        height: 80px;
                        font-size: 16px;
                        color: #333;
                        cursor: pointer;
                        img{
                            padding: 0 10px 0 20px;
                        }
                    }
                }
                li a{
                    display: flex;
                    align-items: center;
                    width: 200px;
                    height: 80px;
                    font-size: 16px;
                    color: #333;
                    img{
                        padding: 0 10px 0 20px;
                    }
                }
            }
        }
    }
</style>

