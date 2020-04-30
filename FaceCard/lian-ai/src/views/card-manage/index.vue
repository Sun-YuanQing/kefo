<template>
    <div class="fullscreen cardManage">
        <Header title="卡项管理"></Header>
        <div class="content">
            <div class="head">
                <Button style="border-color: #333;font-weight: 700;" @click="isAdd = true;">+添加卡项</Button>
                <Search v-model="searchVal" placeholder="请输入关键词" @on-search="getData"></Search>
            </div>
            <div class="dataNone" v-if="cardList.length===0 && isLoaded ">还没有卡项，快去 <a href="#" @click="isAdd=true">添加卡项</a> 吧！</div>
            <div class="cards" v-if="cardList.length!==0">
                <RadioGroup v-model="radio" type="button">
                    <Radio :label="0">全部</Radio>
                    <Radio :label="1">次卡</Radio>
                    <Radio :label="2">折扣卡</Radio>
                    <Radio :label="3">体验卡</Radio>
                </RadioGroup>
                <!-- :style="{height: height-338+'px'}" -->
                <ul :style="{height: height-338+'px'}">
                    <li v-for="(card,index) in currenCardList" :key="index" :style="{backgroundImage: 'url('+card.PhotoUrl+')'}">
                        
                        <div v-if="isEdit" class="checkMark" @click="handleCheck(card.CardId)">
                            <img v-if="checked.includes(card.CardId)" src="@/assets/checkmark.svg" alt="">
                        </div>
                        <div class="details" @click="$router.push({  path: '/cardDetail',query:{cardId: card.CardId,type: '0'}})">
                            <div>
                                <p class="name">{{card.ClassType}}</p>
                                <p class="alias">{{card.CardName}}</p>
                            </div>
                            <div class="number">
                                <p>已售{{card.SellNum}}</p>
                                <p v-if="card.IsInterSale"><img src="../../assets/online.svg" alt=""><span>支持网店</span></p>
                            </div>
                            <p v-if="card.State=='0'" class="shelve">未上架</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="bottom" v-if="cardList.length!==0">
                    <Button v-if="!isEdit" @click="isEdit=true;">编辑</Button>
                    <div v-else>
                        <Checkbox :value="checkAll" @click.prevent.native="handleCheckAll" class="selectAll">全选</Checkbox>
                        <ButtonGroup>
                            <Button @click="isShelve">上架</Button>
                            <Button @click="isSoldOut">下架</Button>
                        </ButtonGroup>
                        <Button class="delete" @click="isDelete">删除</Button>
                        <Button @click="isEdit=false;" >取消</Button>
                    </div>
            </div>
            
        </div>
        <Modal v-model="isAdd" width="500" :closable="false" :mask-closable="false" class="addModel">
            <p slot="header" style="text-align:center;font-size: 18px;">选择卡项类型</p>
            <ul>
                <li v-for="(item,index) in typeList" :key="index"  @click="selectType(item.classType)">
                    <img class="icon"  v-if="selectedType==item.classType" src="@/assets/checkmark.svg" alt="">
                    <img class="img" :src="item.img" alt="">
                </li>
            </ul>
            <div slot="footer" style="text-align:center">
                <Button style="color: #333;border-color: #333;margin-right: 20px;" @click="isAdd=false;">取消</Button>
                <Button type="primary" @click="$router.push('/editCard?classType='+selectedType)"> 下一步</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
import Header from '@/components/route-header'
import Search from 'src/components/search'
export default {
    components: { Header ,Search },
    data(){
        return{
            height: document.documentElement.clientHeight || document.body.clientHeight,
            isAdd: false,
            searchVal: "",
            radio: 0,
            isEdit: false,
            checkAll: false,
            checked: [],
            typeList:[{
                classType: '1',
                img: require("@/assets/number-card.svg")
            },{
                classType: '2',
                img: require("@/assets/discount-card.svg")
            },{
                classType: '3',
                img: require("@/assets/experience-card.svg")
            }],
            selectedType: "1",
            cardList:[],
            isLoaded: false,
        }
    },
    computed: {
        currenCardList(){
            switch(this.radio) {
                case 0:
                    return this.cardList
                    break;
                case 1:
                    return this.cardList.filter(item => item.ClassType=='次卡')
                    break;
                case 2:
                    return this.cardList.filter(item => item.ClassType=='折扣卡')
                    break;
                case 3:
                    return this.cardList.filter(item => item.ClassType=='体验卡')
                    break;
                default:
                    return this.cardList
            } 
        }
    },
    created(){
        this.getData();
    },
    methods:{
        getData(){
            let url = '/CardProject/GetCardPeojectManagerBySiteId';
            this.$Spin.show();
            this.$axios.post(url,{ClassType: '',Key: this.searchVal}).then(res => {
                this.$Spin.hide();
                const { Code, Message, Data } = res.data;
                if (Code === '0') {
                    this.isLoaded = true;
                    this.cardList = Data;
                } else {
                    this.$Message.error(Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },
        handleCheck(id) {
            if (!this.isEdit) return;
            if (this.checked.includes(id)) {
                const index = this.checked.findIndex(item => item === id);
                this.checked.splice(index, 1)
            } else {
                this.checked.push(id)
            }

            if(this.checked.length === this.currenCardList.length){
                this.checkAll = true;
            }else{
                this.checkAll = false;
            }
        },
        handleCheckAll(){
            this.checkAll = !this.checkAll;
            if (this.checkAll) {
                this.currenCardList.forEach(item => {
                    if(!this.checked.includes(item.CardId)){
                        this.checked.push(item.CardId)
                    }
                })
            } else {
                this.checked = [];
            }
        },
        //上架与下架
        changeState(val){
            this.$Spin.show();
            this.$axios.post('/CardProject/SetCardProjectUpDown',{
                CardIds: this.checked,
                State: val
            }).then(res => {
                this.$Spin.hide();
                const { Code, Message, Data } = res.data;
                if (Code === '0') {
                    this.$Message.success(val == "0" ? "下架成功" : "上架成功");
                    this.getData();
                } else {
                    
                    this.$Message.error(Message);
                    
                }
            }).catch(e => {
                throw new Error(e)
            })
        },
        //上架
        isShelve(){
            // this.currenCardList
            if(this.checked.length>0){
                this.$Modal.confirm({
                    title: '请确认是否将所选卡项上架',
                    onOk: () => {

                        this.changeState("1")
                    }
                })
            }else{
                this.$Message.warning("您还没有选择卡项");
            }
            
        },
        //下架
        isSoldOut(){
            if(this.checked.length>0){
                this.$Modal.confirm({
                    title: '请确认是否将所选卡项下架',
                    onOk: () => {

                        this.changeState("0")

                    }
                })
            }else{
                this.$Message.warning("您还没有选择卡项");
            }
            
        },
        isDelete(){
            if(this.checked.length>0){
                this.$Modal.confirm({
                    title: '请确认是否删除所选卡项',
                    onOk: () => {
                        this.$Spin.show();
                        this.$axios.post('/CardProject/DelSub',{CardIds: this.checked}).then(res => {
                            this.$Spin.hide();
                            const { Code, Message, Data } = res.data;
                            if (Code === '0') {
                                this.$Message.success("删除成功");
                                this.getData();
                            } else {
                                this.$Message.error(Message);
                            }
                        }).catch(e => {
                            throw new Error(e)
                        })

                    }
                })
            }else{
                this.$Message.warning("您还没有选择卡项");
            }
            
        },

        selectType(type){
            this.selectedType = type;
        }


    }
}
</script>
<style lang="less">
    .cardManage{
        .ivu-radio-group-button .ivu-radio-wrapper-checked{
            color: inherit;
            background-color: #fff;
            font-weight: 700;
        }
    }
     @media screen and (max-width:576px){
        .cardManage .ivu-radio-group-button .ivu-radio-wrapper{
            padding: 0 10px;
        }
    }
</style>
<style lang="less" scoped>
    .cardManage{
        background-color: #F7F8FA;
        .content{
            .head{
                margin: 10px;
                background-color: #fff;
                display: flex;
                justify-content: space-between;
                padding: 20px 30px;
            }
            .dataNone{
                    text-align: center;
                    color: #999;
                    a{
                        color: #E94E27;
                        text-decoration: underline;
                        line-height: 200px;
                    }
                }
            .cards{
                margin: 10px;
                background-color: #fff;
                padding: 30px 35px 10px;
                box-sizing: border-box;
                min-height: calc(100% - 165px);
                max-height: calc(100% - 165px);
                // overflow: auto;
                ul{
                    padding: 35px 0 0;
                    display: flex;
                    flex-wrap: wrap;
                    // display: grid;
                    // box-sizing: border-box;
                    // grid-template-columns: repeat(3, 309px);
                    // grid-gap: 30px 20px;
                    // justify-items: center;
                    // justify-content: center;
                    overflow: auto;
                    li{
                        width: 300px;
                        height: 160px;
                        margin: 0 20px 25px 0;
                        background-size: 100% 100%;
                        // background-color: #6FB5FE;
                        color: #fff;
                        box-sizing: border-box;
                        padding: 22px 20px 14px;
                        position: relative;
                        .checkMark {
                            position: absolute;
                            right: -10px;
                            top: -10px;
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            box-shadow: 0 0 0 1px #333;
                            background-color: #fff;

                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .details{
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            .name{
                                font-size: 20px;
                            }
                            .alias{
                                line-height: 40px;
                            }
                            .number{
                                display: flex;
                                justify-content: space-between;
                                font-size: 12px;
                                p:nth-of-type(2){
                                    display: flex;
                                    align-items: center;
                                    img{
                                        padding-right: 5px;
                                    }
                                }
                            }
                            .shelve{
                               position: absolute;
                               right: 20px;
                               top: 10px;
                               font-size: 12px;
                               border: 1px solid #fff;
                               border-radius: 8px;
                               padding: 0 6px;
                            }
                        }
                        
                    }
                }
                
            }
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
                    width: 200px;
                    line-height: 40px;
                }
                &>div{
                    .ivu-btn{
                        width: 112px;
                    }
                    .delete{
                        margin: 15px 60px 15px 30px;
                    }
                    .selectAll{
                        margin-right: 60px;
                        font-size: 16px;
                    }
                }
            }
            
        }
    }
    .addModel{
        @media screen and (max-width: 576px){
            ul{
                img.img{
                    width: 90px;
                }
            }
        }
        ul{
            display: flex;
            justify-content: center;
            li{
                border: 1px dashed #999;
                margin-right: 10px;
                border-radius: 8px;
                position: relative;
                cursor: pointer;
                &:last-of-type{
                    margin-right: 0;
                }
                .icon{
                    position: absolute;
                    top: -8px;
                    left: -8px;
                }
            }
        }
        .ivu-btn{
            width: 120px;
            line-height: 36px;
        }
    }
    // @media screen and (max-width:992px){
    //     .cardManage .content .cards ul{
    //         grid-template-columns: repeat(2, 309px);
    //     }
    // }
    // @media screen and (max-width:767px){
    //     .cardManage .content .cards ul{
    //         grid-template-columns: repeat(1, 309px);
    //     }
    // }
    @media screen and (max-width:700px){
        .cardManage .content .bottom>div{
            .ivu-btn{
                width: auto;
                padding: 0;
                line-height: 30px;
            }
            .delete{
                margin: 0 5px 0 10px;
            }
            .selectAll{
                margin-right: 10px;
                font-size: 16px;
            }
        }
    }
    @media screen and (max-width:576px){
        .cardManage{
            .content{
                .head{
                    padding: 10px;
                    .ivu-btn{
                        margin-right: 10px;
                    }
                }
                .cards{
                    padding: 10px;
                    ul{
                        // margin: 20px 0;
                        // justify-content: flex-start;
                    }
                }
            }
        }
    }
</style>