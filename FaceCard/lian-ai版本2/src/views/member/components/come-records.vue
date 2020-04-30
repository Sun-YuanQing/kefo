<template>
  <div class="tab-table">
    <header>
      <RadioGroup @on-change="onRadioChange" v-model="radio" type="button">
        <Radio :label="1">统计</Radio>
        <Radio :label="2">明细</Radio>
      </RadioGroup>
      <!-- <p>到店总数：<span>{{report.TotalCount}}</span>次</p> -->
    </header>
    <div>
      <div v-if="radio === 1" class="stat-cards">
        <Card class="card">
          <div slot="title" class="card-title">到店频率</div>
          <div class="body">
            <h3><span>{{report.Frequency}}</span>天到店<span>1</span> 次</h3>
            <Progress :percent="percent" style="width: 80%" hide-info></Progress>
          </div>
        </Card>
        <Card class="card">
          <div slot="title" class="card-title">
            <span>到店数据</span>
            <RadioGroup class="card-onData" v-model="comeRadio" @on-change="toShopRadioChange">
              <Radio label="SevenCount">近7天</Radio>
              <Radio label="ThirtyCount">近30天</Radio>
              <Radio label="YearCount">近1年</Radio>
            </RadioGroup>
          </div>
          <div class="body">
            <Charts class="chart" :options="pie"></Charts>
          </div>
        </Card>
        <Card class="card">
          <div slot="title" class="card-title">会员转化时间</div>
          <div class="body" v-if="userId">
            <h3><span>{{report.ConvertDays}}</span>天</h3>
            <p>第{{report.BeMemberCount}}次到店，成为会员</p>
          </div>
          <div v-else class="body" style="font-size: 14px;color: #999;">
            还未成为会员哦～
          </div>
        </Card>
      </div>
      <div v-else class="table-wrap">
        <Table :columns="columns" :data="tableData" stripe></Table>
        <footer>
          <Pager :total="total" @on-change="historyPageChange"></Pager>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import Pager from '@/components/pager'
  import Charts from 'vue-echarts'
  import 'echarts/lib/chart/pie'
  import { setTimeout } from 'timers';

  export default {
    name: 'come-records',
    props: {
      faceId: {
        required: true
      },
      userId: '',
      stat: {}
    },
    components: { Charts, Pager },
    data() {
      return {
        radio: 1,
        comeRadio: 'SevenCount',
        columns: [
          {
            title: '时间',
            key: 'CreatedTime',
            minWidth: 160
          },
          {
            title: '特征',
            key: 'Smile',
            minWidth: 60
          },
          {
            title: '次数',
            key: 'Count',
            minWidth: 60
          },
        ],
        total: 0,
        tableData: [],
        postData: {
          PageIndex: 1,
          PageSize: 10
        },
        pie: {
          animation: true,
          tooltip: {
            trigger: 'item',
            formatter: "{c}次 <br/><span style='font-size: 12px'>{a}</span>"
          },
          series: [
            {
              name: '到店',
              type: 'pie',
              radius: ['50%', '100%'],
              startAngle: 60,
              avoidLabelOverlap: false,
              hoverAnimation: false,
              legendHoverLink: false,
              color: ['#f1ab6f', '#f4f4f7'],
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter: [
                    '{a|0}{c|次}',
                    '{b|到店}'
                  ].join('\n'),
                  rich: {
                    a: {
                      fontSize: '30',
                      color: '#333'
                    },
                    c: {
                      fontSize: '14',
                      color: '#333'
                    },
                    b: {
                      fontSize: '10',
                      color: '#999'
                    }
                  }
                },
                emphasis: {
                  show: false,
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                { value: 0, name: '到店' },
                { value: 30, name: '数据' },
              ]
            }
          ]
        }
      }
    },
    computed: {
      report() {
        return {
          "Frequency": "0",  //到店频率
          "SevenCount": 0,
          "ThirtyCount": 0,
          "YearCount": 0,
          "ConvertDays": 0,
          "BeMemberCount": 0,
          ...this.stat
        }
      },
      percent() {
        const num = Number(this.report.Frequency);
        if (num === 0) return 100;
        if (!num) return 0;
        return 1 / num * 100
      }
    },
    created(){
      this.toShopRadioChange(this.comeRadio)
    },
    methods: {
      onRadioChange(e) {
        e === 2 && this.getHistory()
      },
      historyPageChange({ PageIndex, PageSize }) {
        this.postData = { ...this.postData, PageIndex, PageSize }
        this.getHistory()
      },
      toShopRadioChange(label) {
        const count = {
          'SevenCount': 7,
          'ThirtyCount': 30,
          'YearCount': 360
        }
        this.comeRadio = label;
        this.pie.series[0].data[0].value = this.report[label];
        this.pie.series[0].label.normal.formatter = [
          `{a|${this.report[label]}}{c|次}`,
          '{b|到店}'
        ].join('\n')
        this.pie.series[0].data[1].value = Math.max(count[label] - this.report[label], 0);
      },
      getHistory() {
        const url = '/User/GetVisitHistory'
        const postData = {
          ...this.postData,
          FaceId: this.faceId
        }
        this.$axios.post(url, postData).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.total = data.Total;
            this.tableData = data.VisitHistoty
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .tab-table {
    flex: 1;
    padding: 18px 18px 20px;
    // background-color: #f7f8fa;
    position: relative;

    header {
      // padding-bottom: 22px;
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      position: absolute;
      top: -35px;
      right: 18px;

      p {
        color: #666;
        font-size: 16px;

        span {
          font-size: 18px;
          color: #000;
          font-weight: bold;
        }
      }
    }

    .stat-cards {
      .card{
        margin-bottom: 10px;
      }
      .chart {
        width: 138px;
        height: 138px;
      }
    }
  }
  @media screen and (max-width: 768px){
    .tab-table .stat-cards{
      grid-template-columns: repeat(1, 1fr);
    }
  }
  @media screen and (max-width: 576px){
    .tab-table header{
      position: relative;
      top: -10px;
      right: 0;
    }
    
  }
  .stat-cards .card .body h3 span{
    font-size: 30px;
  }
  .stat-cards .card .card-title{
    font-weight: 700;
  }
  .card-onData{
    width: calc(100% - 80px);
  }
  .ivu-radio-wrapper{
    font-weight: normal;
  }

</style>
