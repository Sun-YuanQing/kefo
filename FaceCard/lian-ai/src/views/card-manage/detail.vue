<template>
    <div class="fullscreen cardContent">
        <Header :title="cardDetail.ClassType"></Header>
        <div class="content">
            <div class="head" v-if="type=='0'">
                <Button @click="toEedit">编辑</Button>
                <Button @click="changeState">{{cardDetail.State=='0' ? '上架' : '下架'}}</Button>
            </div>
            <div class="cardBg">
                <div class="left" :style="{backgroundImage: 'url('+cardDetail.PhotoUrl+')'}">
                   <p class="name">{{cardDetail.ClassType}}</p>
                   <p v-if="cardDetail.IsForever">永久有效</p>
                   <p v-else>有效期：{{cardDetail.ValueDay}}天</p>
                </div>
                <div class="right">
                    <p><span>卡名称：</span>{{cardDetail.Name}}</p>
                    <div>
                        <p><span>状态</span>{{cardDetail.State=='0' ? '下架中' : '上架中'}}</p>
                        <p><span>网店售卡</span>{{cardDetail.IsInterSale ? '支持' : '不支持'}}</p>
                        <p><span>售价</span>￥{{cardDetail.CardPrice}}</p>
                        <p v-if="cardDetail.FeiKaPrice>0"><span>菲卡价</span>￥{{cardDetail.FeiKaPrice}}</p>
                        <p class="none"><span>已售</span>￥{{cardDetail.saleNum}}</p>
                    </div>
                </div>
                <div class="soldNum">已售{{cardDetail.saleNum}}</div>
            </div>
            <div class="tables">
                <div class="project" v-if="cardDetail.CardRightsItems">
                    <div class="list" v-if="isMerge">
                        <div v-if="cardDetail.CardRightsItems.Project.length>0">
                            <p class="title">项目/服务权益</p>
                            <Row :gutter="20">
                                <Col :xs="24" :sm="12" :md="8" :lg="6" v-for="(project,index) in cardDetail.CardRightsItems.Project" :key="index">
                                    <div>
                                        <span>{{project.ItemName}}</span>
                                        <amount :value="project.ItemPrice" style="padding-left: 10px;color: inherit;"/>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div v-if="cardDetail.CardRightsItems.Product.length>0">
                            <p class="title">产品权益</p>
                            <Row :gutter="20">
                                <Col :xs="24" :sm="12" :md="8" :lg="6" v-for="(product,index) in cardDetail.CardRightsItems.Product" :key="index">
                                    <div>
                                        <span>{{product.ItemName}}</span>
                                        <amount :value="product.ItemPrice" style="padding-left: 10px;color: inherit;"/>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <template v-else>
                        <div v-if="classType=='2' && cardDetail.IsUnionDisc" class="discount">全店统一{{cardDetail.Discount}}折优惠</div>
                        <div v-if="cardDetail.CardRightsItems.Project.length>0">
                            <p class="title">项目/服务权益</p>
                            <card-table :tableData="cardDetail.CardRightsItems.Project"
                                        :classes="1" :childClass="1" :toTalNum="cardDetail.ToTalNum"
                                        :type="classType" :childType="cardDetail.ChildType"></card-table>
                        </div>
                        <div v-if="cardDetail.CardRightsItems.Product.length>0">
                            <p class="title">产品</p>
                            <card-table :tableData="cardDetail.CardRightsItems.Product"
                                        :classes="2" :childClass="1"
                                        :type="classType" ></card-table>
                        </div>
                    </template>
                </div>
                <div class="present" v-if="cardDetail.CardGivingItems">
                    <div v-if="cardDetail.CardGivingItems.Project.length>0">
                        <p class="title">赠送项目/服务</p>
                        <card-table :tableData="cardDetail.CardGivingItems.Project"
                                    :classes="1" :childClass="2"
                                    :type="classType"></card-table>
                    </div>
                    <div v-if="cardDetail.CardGivingItems.Product.length>0">
                        <p class="title">赠送产品</p>
                        <card-table :tableData="cardDetail.CardGivingItems.Product"
                                    :classes="2" :childClass="2"
                                    :type="classType" ></card-table>
                    </div>
                    
                </div>
            </div>
            
        </div>
    </div>
</template>
<script>
import Header from '@/components/route-header'
import CardTable from './components/card-table'
export default {
    components: { Header,CardTable },
    data(){
        return{
            cardId: '',
            type: '',
            classType: '',
            cardDetail: {},
            isMerge: false
        }
    },
    computed: {
       
    },
    created(){
        this.cardId = this.$route.query.cardId;
        this.type = this.$route.query.type;

        this.getData();
    },
    methods:{
        getData(){
            let url = '/CardProject/GetCardPeojectByCardId?cardId=' + this.cardId;
            this.$Spin.show();
            this.$axios.post(url).then(res => {
                this.$Spin.hide();
                const { Code, Message, Data } = res.data;
                if (Code === '0') {
                    this.cardDetail = Data;
                    this.classType = this.cardDetail.ClassType=='次卡' ? '1' : this.cardDetail.ClassType=="折扣卡" ? '2' : '3';
                    this.isMerge = !this.cardDetail.ChildType.includes('单项有限次') && !this.cardDetail.ChildType.includes('多项有限次') && this.classType=='1'
                } else {
                    this.$Message.error(Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },
        toEedit(){
            this.$router.push({
                        path: '/editCard',
                        query:{
                            cardId: this.cardDetail.Id,
                            classType: this.classType}
                        })
        },

        //上架与下架
        changeState(){
            this.$Spin.show();
            this.$axios.post('/CardProject/SetCardProjectUpDown',{
                CardIds: [this.cardDetail.Id],
                State: this.cardDetail.State == "1" ? "0" : "1"
            }).then(res => {
                this.$Spin.hide();
                const { Code, Message, Data } = res.data;
                if (Code === '0') {
                    this.cardDetail.State == "1" ? this.cardDetail.State = "0" : this.cardDetail.State = "1"
                    this.$Message.success(this.cardDetail.State == "1" ? "下架成功" : "上架成功");
                } else {
                    this.$Message.error(Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },


    }
}
</script>
<style lang="less">
.cardContent .list .big-num{
    font-size: 18px;
}
</style>
<style lang="less" scoped>
    .cardContent{
        background-color: #F7F8FA;
        .content{
            .head{
                margin: 10px;
                background-color: #fff;
                padding: 20px;
                .ivu-btn{
                    border-color: #333;
                    width: 140px;
                    margin-right: 30px;
                }
            }
            .cardBg{
                margin: 10px;
                background-color: #fff;
                padding: 35px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                .soldNum{
                    position: absolute;
                    right: 20px;
                    top: 35px;
                    color: #E94E27
                }
                .left{
                    width: 300px;
                    height: 160px;
                    padding: 20px;
                    box-sizing: border-box;
                    border-radius: 12px;
                    color: #fff;
                    background-size: 100% 100%;
                    color: 14px;
                    line-height: 2;
                    margin-right: 20px;
                    .name{
                        font-size: 18px;
                    }
                   
                }
                .right{
                    width: calc(100% - 320px);
                    font-size: 16px;
                    font-weight: 700;
                    span{
                        color: #666;
                        font-weight: normal;
                        padding-right: 10px;
                    }
                    &>div{
                        font-size: 14px;
                        display: flex;
                        // justify-content: space-around;
                        flex-wrap: wrap;
                        background-color: #f9f9f9;
                        border-radius: 6px;
                        margin-top: 20px;
                        padding: 10px 20px;
                        .none{
                            display: none;
                        }
                        p{
                            margin-right: 3%;
                            min-width: 22%;
                            line-height: 1.6;

                        }
                    }
                }
            }
            .tables{
                margin: 10px;
                background-color: #fff;
                padding: 35px 20px;
                font-size: 14px;
                .discount{
                    text-align: center;
                    line-height: 44px;
                    background-color: #FFF6F4;
                    color: #E94E27;
                    font-weight: 600;
                    font-size: 16px;
                }
                .title{
                    margin: 25px 0 15px 15px;
                    font-weight: 700;
                }
            .tip{
                display: flex;
                align-items: center;
                color: #E94E27;
                margin-top: 30px;
                img{
                    margin-right: 10px;
                }
            }
            .list{
                    border-top: 10px solid #F7F8FA;
                    font-size: 16px;
                    .title{
                        margin: 25px 0 15px 0;
                        font-weight: 700;
                        font-size: 14px;
                    }
                    .ivu-row{
                        .ivu-col {
                            margin-bottom: 15px;
                            &>div{
                                text-align: center;
                                border: 1px solid #e4e4e4;
                                border-radius: 4px;
                                line-height: 44px;
                            }
                        }
                    }
                }
            }
        }
    }
     @media screen and (max-width:767px){
         .cardContent .content{
             .cardBg{
                 .right > div p{
                    margin-right: 5%;
                    min-width: 45%;
                }
             }
         }
     }
    @media screen and (max-width:576px){
        .cardContent .content{
                .head{
                    padding: 10px;
                    .ivu-btn{
                        width: auto;
                        margin-right: 10px;
                    }
                }
                .cardBg{
                    padding: 20px;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    .soldNum{
                        display: none;
                    }
                    .left{
                        // align-self: center;
                        margin-right: 0;
                        margin-bottom: 20px;
                    }
                    .right{
                        width: 100%;
                        &>div {
                            .none{
                                display: block;
                            }
                        }
                        
                    }
                }
                .tables{
                    padding: 20px;
                }
            }
        
    }
   
</style>