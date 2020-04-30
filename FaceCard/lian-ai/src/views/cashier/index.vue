<template>
    <div class="cashier">
        <div class="echarts-wrap">
            <Row class="condition">
                <Col :xs="24" :sm="12">
                    <router-link to="/cashRecord">
                        <p style="font-size: 14px;">今日收款金额(元）</p>
                        <div style="font-weight: 700;">
                            <span style="font-size: 30px">{{Math.floor(statistics.tRecharge)}}</span>
                            <span style="font-size: 22px">.{{Number(statistics.tRecharge).toFixed(2).substr(-2, 2)}}</span>&nbsp;
                            <!-- <img src="@/assets/detail-icon.svg" alt=""> -->
                        </div>
                        <div>
                            <span style="padding-right: 10px;">收银&nbsp;&nbsp;{{statistics.tofflineRecharge}}</span>
                            <span>充值&nbsp;&nbsp;{{statistics.tonlineRecharge}}</span>
                        </div>
                    </router-link>
                </Col>
                <Col :xs="24" :sm="12">
                    <router-link to="/chargeRecord">
                        <p style="font-size: 14px;">今日会员消耗金额(元）</p>
                        <div style="font-weight: 700;">
                            <span style="font-size: 30px">{{Math.floor(statistics.tConsume)}}</span>
                            <span style="font-size: 22px">.{{Number(statistics.tConsume).toFixed(2).substr(-2, 2)}}</span>&nbsp;
                            <!-- <img src="@/assets/detail-icon.svg" alt=""> -->
                        </div>
                    </router-link>
                </Col>
            </Row>
            <div class="chart">
                <div id="chartBar" style="height: 350px;width: 100%;"></div>
            </div>


        </div>
        <div class="function">
            <div class="title">常用功能</div>
            <Row class="list">
                <Col :xs="24" :sm="6">
                    <router-link to="/cash">
                        <img src="@/assets/cash-icon.svg" alt="">
                        <span>快捷收银</span>
                    </router-link>
                </Col>
                <Col :xs="24" :sm="6">
                    <router-link to="/bill">
                        <img src="@/assets/record-icon.svg" alt="">
                        <span>明细记录</span>
                    </router-link>
                </Col>
                <!-- <Col :xs="24" :sm="6">
                    <router-link to="/index">
                        <img src="@/assets/record-icon.svg" alt="">
                        <span>报表</span>
                    </router-link>
                </Col> -->
            </Row>
        </div>
    </div>
</template>
<script>
var echarts = require("echarts/lib/echarts");
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require("echarts/lib/chart/bar"); //柱状图

require('echarts/theme/macarons') // echarts theme
export default {
    data(){
        return{
            num: 900,
            statistics: {
                "tRecharge": 0,  //今天收款
                "tofflineRecharge": 0,//收银
                "tonlineRecharge": 0,//充值
                "tConsume": 0,//消耗
            },
            chart: null,
            xAxisData: ['1','2','3','4','5','6','7'],
            dataList: {
                'consume':  [60, 50, 70, 26, 128, 80, 80],
                'collection': [30, 60, 90, 170, 30, 70, 75],
            },
        }
    },
    mounted(){
        this.getCollectStatistics();
        this.__resizeHandler = () => {
            if (this.chart) {
                this.chart.resize()
            }
        }
        window.addEventListener('resize', this.__resizeHandler)
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        window.removeEventListener('resize', this.__resizeHandler)
        this.chart = null;
    },
    methods: {
        getCollectStatistics(){
            let url = "/Report/GetCollectStatistics";
            this.$axios
            .post(url)
            .then(res => {
                let {Code,Message,Data } = res.data;
                if (Code === '0') {
                    this.statistics = Data.Statistics;
                    this.xAxisData = Data.Statistics.dateArr
                    this.dataList.consume = Data.Statistics.consumeArr;
                    this.dataList.collection = Data.Statistics.rechargeArr;
                    this.initChart();
                } else {
                    this.$Message.error(Message)
                    
                }
            })
            .catch(err => {
                this.$Message.error(err)
            });
        } ,
        initChart() {
            this.chart = echarts.init(document.getElementById('chartBar'), 'macarons')
            const that = this;
            this.chart.setOption({
                title: {
                    text: '近七日营业情况',
                    left: 'left',
                    textStyle: {
                        color: '#333',
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                color: ['#86ABF1', '#AEDAB6'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    }
                },
                calculable : true,
                legend: {
                    data: [{
                            icon: 'circle',
                            name: '收款',
                        },{
                            icon: 'circle',
                            name: '消费',
                        }],
                    itemGap: 10,
                    textStyle: {
                        color: '#999',
                    },
                    align: 'left',
                    right: 10
                },
                grid: {
                    top: '16%',
                    bottom: '3%',
                    left: '1%',
                    right: '1%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        name: '时间',
                        data: that.xAxisData,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#999'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#999',//左边线的颜色
                                width:'1'//坐标线的宽度
                            }
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '金额(元)',
                        axisLabel: {
                            textStyle: {
                                color: '#999'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#999',//左边线的颜色
                                width:'1'//坐标线的宽度
                            }
                        },
                    }
                ],
                series: [
                    {
                        name:'收款',
                        type:'bar',
                        barWidth: '12%',
                        data:that.dataList['collection']
                    },
                    {
                        name:'消费',
                        type:'bar',
                        barWidth: '12%',
                        data:that.dataList['consume']
                    }
                ],
                animationEasing: 'cubicInOut',
                animationDuration: 2600
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .cashier{
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 10px;
        box-sizing: border-box;
        background: #F7F8FA;
        .echarts-wrap,.function{
            width: 100%;
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            box-sizing: border-box;
        }
        .echarts-wrap{
            .condition{
                width: 100%;
                box-sizing: border-box;
                padding: 30px 0;
                .ivu-col{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 20px;
                    a{
                        color: #333;
                        text-align: center;
                    }
                }
            }
            .chart{
                width: 100%;
                // width: calc(100% - 110px);
                position: relative;
            }
        }
        .function{
            margin-top: 10px;
            padding: 30px;
            .title{
                font-size: 16px;
                font-weight: 700;
            }
            .list{
                .ivu-col{
                    a{
                        display: flex;
                        align-items: center;
                        width: 100%;
                        height: 80px;
                        font-size: 16px;
                        color: #333;
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

