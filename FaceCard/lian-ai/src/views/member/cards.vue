<template>
    <div class="fullscreen cards">
        <Header :title="itemId ? '使用卡项' : '卡项'"></Header>
        <div class="content" :style="{'margin-bottom': itemId ? '83px' : '0'}">
            <div class="card" v-for="(card,index) in cardList" :key="index">
                <img v-if="index==0 && configArr.length>0" src="../../assets/recommend-icon.svg" alt="">
                <div class="cardItem">
                    <div class="left">
                        <div class="cardBg" :style="{'backgroundImage': 'url('+card.Photo+')'}">
                            <p>{{card.ClassType}}</p>
                        </div>
                        <div class="cardType">
                            <p class="name">{{card.Name}} <img v-if="card.FeiKaCard" src="../../assets/face-card-price.svg" alt=""></p>
                            <p v-if="card.ClassType=='会员卡' || card.ClildType=='充值折扣'">余额<amount :value="card.Amount" style="color: #E94E27;"/></p>
                            <p v-if="card.ClassType!='会员卡'" class="spread" @click="showContent(index,card.UserCardProjectId)">卡项权益
                                <img :src="card.isShow ? require('../../assets/arrow-up.svg') : require('../../assets/arrow-down.svg')" alt="">
                            </p>
                            <p v-if="itemId" style="font-size: 13px;color: #E94E27;">*&nbsp;此卡含有{{itemType=='1' ? '项目/服务' : '产品'}}“{{itemName}}”</p>
                        </div>
                    </div>
                    <div class="right">
                        <p><span v-if="card.Expdate != '永久有效' && card.Expdate != '未激活'">有效期：</span>{{card.Expdate}}</p>
                        <p v-if="card.AboutToExpire" class="dueDays">即将到期</p>
                    </div>
                </div>

                <div class="cardContent" v-if="card.isShow && card.CardItem">
                    <limited-card-detail :dataList="cardList[index]" 
                                         :itemId="itemId" 
                                         :configArr="configArr" 
                                         :selectedItem="selectedItem"
                                         :feiKaCard="card.FeiKaCard"
                                         @changeConfig="changeConfig"></limited-card-detail>
                </div>
                
            </div>

            <div class="bottom" v-if="itemId">
                <Button  @click="$router.push({path: '/order',query: {userId,faceId,type: '1'}})">取消</Button>
                <Button type="primary" @click="sureConfig">确定</Button>
            </div>
        </div>
    </div>
</template>
<script>
import Header from '@/components/route-header'
import LimitedCardDetail from './components/limited-card-detail'
export default {
    components: { Header , LimitedCardDetail },
    data(){
        return{
            userId: '',
            faceId: '',
            itemId: '',
            itemName: '',
            itemType: '',
            index: null,
            cardList: [],
            configArr: [],
            selectedItem: {}
        }
    },
    created(){
        this.userId = this.$route.query.userId;
        this.faceId = this.$route.query.faceId;
        this.itemId = this.$route.query.itemId;
        this.itemName = this.$route.query.itemName;
        this.itemType = this.$route.query.itemType;
        this.index = this.$route.query.index;

        if(this.itemId){
            this.getCardConfig(); //匹配卡项
        }else{
            this.getCardList(); //我的全部卡项
        }
        
    },
    methods:{
        showContent(index,id){
            let flag = this.cardList[index].isShow;
            if(flag){
                this.$set(this.cardList[index],"isShow",false);
            }else{
                if(!this.itemId && id && !this.cardList[index].CardItem){
                    this.getCardDetail(index,id);
                }else{
                    this.$set(this.cardList[index],"isShow",true);
                }
            }
        },
        getCardList(){
            this.$Spin.show();
            const url = '/UserCardProject/GetUserCardList';
            this.$axios.post(url, { UserId: this.userId }).then(res => {
                this.$Spin.hide();
                let {Code,Data,Message} = res.data;
                if (Code === '0') {
                    this.cardList = Data.UserCards
                } else {
                    this.$Message.error(Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },
        getCardConfig(){
            this.$Spin.show();
            let url = '/UserCardProject/GetUserEffectCards';
            this.$axios.post(url, {UserId: this.userId,ItemId: this.itemId}).then(res => {
                this.$Spin.hide();
                let {Code,Data,Message} = res.data;
                if (res.data.Code === '0') {
                    this.cardList = Data.EffectCards.map(item => {
                        return{
                            ...item,
                            isShow: true
                        }

                    });
                    this.handleConfigCard()
                } else {
                    this.$Message.error(Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },

        // 匹配卡数据处理
        handleConfigCard(){
            for(let i=0;i<this.cardList.length;i++){
                if(this.cardList[i].CardItem.UnionDisc){
                    this.configArr.push({
                            ...this.cardList[i].CardItem,
                            Name: this.cardList[i].Name,
                            ClassType: this.cardList[i].ClassType,
                            Class: '1'
                        });
                }
                if(this.cardList[i].CardItem.ServiceItem && this.cardList[i].CardItem.ServiceItem.length>0){
                    let serviceArr = this.cardList[i].CardItem.ServiceItem;
                    let serviceIndex = serviceArr.findIndex(item => item.ItemId == this.itemId);
                    if(serviceIndex != -1){
                        // console.log(88,this.cardList[i].CardItem.ServiceItem[serviceIndex])
                        let newData1 = {
                            ...this.cardList[i].CardItem.ServiceItem[serviceIndex],
                            Name: this.cardList[i].Name,
                            ClassType: this.cardList[i].ClassType,
                            Class: '1'
                        }
                        this.configArr.push(newData1);
                    }
                    
                };
                if(this.cardList[i].CardItem.ProductItem && this.cardList[i].CardItem.ProductItem.length>0){
                    let productArr = this.cardList[i].CardItem.ProductItem;
                    let productIndex = productArr.findIndex(item => item.ItemId == this.itemId);
                    if(productIndex != -1){
                        let newData2 = {
                            ...this.cardList[i].CardItem.ProductItem[productIndex],
                            Name: this.cardList[i].Name,
                            ClassType: this.cardList[i].ClassType,
                            Class: '2'
                        }
                        this.configArr.push(newData2);
                    }
                    
                };
                if(this.cardList[i].CardItem.GiveServiceItem && this.cardList[i].CardItem.GiveServiceItem.length>0){
                    let giveServiceArr = this.cardList[i].CardItem.GiveServiceItem;
                    let giveServiceIndex = giveServiceArr.findIndex(item => item.ItemId == this.itemId);
                    if(giveServiceIndex != -1){
                        let newData3 = {
                            ...this.cardList[i].CardItem.GiveServiceItem[giveServiceIndex],
                            Name: this.cardList[i].Name,
                            ClassType: this.cardList[i].ClassType,
                            Class: '3'
                        }
                        this.configArr.push(newData3);
                    }
                    
                };
                if(this.cardList[i].CardItem.GiveProductItem && this.cardList[i].CardItem.GiveProductItem.length>0){
                    let giveProductArr = this.cardList[i].CardItem.GiveProductItem;
                    let giveProductIndex = giveProductArr.findIndex(item => item.ItemId == this.itemId);
                    if(giveProductIndex != -1){
                        let newData4 = {
                            ...this.cardList[i].CardItem.GiveProductItem[giveProductIndex],
                            Name: this.cardList[i].Name,
                            ClassType: this.cardList[i].ClassType,
                            Class: '4'
                        }
                        this.configArr.push(newData4);
                    }
                    
                };
                

            }
            if(this.configArr.length > 0) {
                this.selectedItem = this.configArr[0];
            }
            // console.log('this.configArr',this.configArr)
        },
        changeConfig(data){
            this.selectedItem = data;
            // console.log('data',data)
        },
        sureConfig(){
            // ActualPrice  CardProjectItemId  CardProjectId
            this.selectedItem = {
                ...this.selectedItem,
                orderIndex: this.index
            }
            localStorage.setItem('configItem-FK',JSON.stringify(this.selectedItem))
            this.$router.push({
                    path: '/order',
                    query: {
                            userId:this.userId,
                            faceId: this.faceId,
                            type: '1',
                            }
                })
        },

        getCardDetail(index,id){
            this.$Spin.show();
            const url = '/UserCardProject/GetUserCardProjectById';
            this.$axios.post(url, { UserCardProjectId: id }).then(res => {
                let {Code,Data,Message} = res.data;
                this.$Spin.hide();
                if (Code === '0') {
                    this.cardList[index].CardItem = Data.CardItem;
                    this.$set(this.cardList[index],"isShow",true);
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

</style>
<style scoped lang="less">
.content{
    background-color: #F7F8FA;
    .bottom{
        background: #fff;
        border-top: 1px solid #E4E4E4;
        display: flex;
        justify-content: center;
        position: fixed;
        bottom: 10px;
        left: 10px;
        right: 10px;
        padding: 15px 0;
        .ivu-btn{
            border-color: #333;
            width: 140px;
            line-height: 40px;
            &:first-of-type{
                margin-right: 20px;
            }
        }
    }
}

.card{
    margin: 10px;
    background-color: #fff;
    padding: 35px 20px;
    position: relative;
    > img{
        position: absolute;
        left: 0;
        top: 0;
    }
    .cardItem{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 35px;
        border-radius: 8px;
        font-size: 16px;
        .left{
            display: flex;
            align-items: center;
            .cardBg{
                width: 300px;
                height: 160px;
                margin-right: 40px;
                background-size: 100% 100%;
                // background-color: #8793FE;
                position: relative;
                p{
                    position: absolute;
                    left: 20px;
                    top: 30px;
                    color: #fff;
                    font-weight: 500;
                }
            }
            .cardType{
                line-height: 35px;
                .spread{
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    img{
                        margin-left: 10px;
                    }
                }
                .name{
                    font-size: 18px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    img{
                        margin-left: 10px;
                    }
                }
            }
        }
        .right{
            color: #999;
            .dueDays{
                text-align: right;
                font-size: 12px;
                color: #E94E27;
                line-height: 30px;
            }
        }
    }
    .cardContent{
        .discount{
            display: flex;
            align-items: center;
            p{
                width: 100%;
                text-align: center;
                line-height: 44px;
                background-color: #FFF6F4;
                color: #E94E27;
                font-weight: 600;
                font-size: 16px;
            }
            .selected{
                width: 16px;
                height: 16px;
                border: 1px solid #333;
                border-radius: 50%;
                margin-right: 5px;
            }
            img{
                margin-right: 5px;
            }
        }
        
    }
    
}
 @media screen and (max-width: 567px){
    .card{
        .cardItem {
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .left{
                width: 100%;
                justify-content: space-between;
                .cardBg{
                    width: 150px;
                    height: 80px;
                    margin-right: 0;
                }
            }
            .right{
                margin-top: 10px;
                .dueDays{
                    text-align: left;
                }
            }
        }
    }
    
 }
</style>