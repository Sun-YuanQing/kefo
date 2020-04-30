<template>
  <FullPage title="扫码配置">
    <div class="card-config">
      <div class="card-info">
        <img :src="img" alt="">
        <div class="card" :style="{'background-image':'url('+BaseQrCoderUrl+')'}" style="background-size: 100% 100%;">
          <h3>{{CardName}}</h3>
        </div>
        <div class="config">
          <p class="align-center item" style="padding-bottom: 35px;">
            <span class="label">名称</span>
            <Input class="input" :maxlength="8" v-model="CardName"/>
            <span style="color: #999; font-size: 14px">（最多可输入8个字）</span>
          </p>
        </div>
      </div>
      <div class="buttons">
        <Button @click="showModal = true" type="primary">联系定制</Button>
        <Button @click="handleSaveImg" type="primary">保存到本地</Button>
      </div>
    </div>
    <Modal title="联系定制" v-model="showModal">
      <img style="width: 100%; padding: 0 30px" src="@/assets/contact.svg" alt="">
      <div slot="footer"></div>
    </Modal>
  </FullPage>
</template>

<script>
  import FullPage from 'src/components/fullscreen-page'
  import IMG_HD from 'src/assets/scan-hd.png'
  import IMG from 'src/assets/scan.png'
  import CODE from 'src/assets/code-test.png'

  export default {
    name: 'qrcode-setting-config',
    components: { FullPage },
    data() {
      return {
        img: '',
        CardName: '',
        BaseQrCoderUrl: '',
        showModal: false,
      }
    },
    created() {
      this.BaseQrCoderUrl = this.$route.query.url;
    },
    
    methods: {
      handleSaveImg() {
        const self = this;
        if (!this.CardName){
            this.$Message.error('请输入卡名称')
            return 
        }else{
          const url = '/QRCoder/GetQRCoderUrl'
          this.$axios.post(url,{Name: this.CardName}).then(res => {
            if (res.data.Code === '0') {
              
              // const data = res.data.Data;
              // this.BaseQrCoderUrl = data.BaseQrCoderUrl;
              self.downLoad()
              
            } else {
              this.$Message.error(res.data.Message);
            }
          }).catch(e => {
            throw new Error(e)
          })
        } 
        
      },
      // download(url) {
      //   // 创建隐藏的可下载链接
      //   const eleLink = document.createElement('a');
      //   eleLink.setAttribute('target','_blank')
      //   // 下载图片文件名就按照时间戳来
      //   eleLink.download = `${this.CardName}.png`;
      //   eleLink.style.display = 'none';

      //   // 触发图片onload是个异步过程，因此，需要在回调中处理
      //   eleLink.href = url;
      //   // 触发点击
      //   document.body.appendChild(eleLink);
      //   eleLink.click();
      //   // 然后移除
      //   document.body.removeChild(eleLink);
      // },

      downLoad(){
        console.log(6,9);
        const name = `${this.CardName}.png`;
        const url = 'QRCoder/DownloadQRCoderUrl?SITEID='+window.localStorage.getItem('siteId');
	  		this.$axios({
		        method: "get",
		        url: url,
		        responseType: "blob"
		      }).then(data => {
		        console.log(data,9);
		        if (!data) {
		          return;
		        }
		        // debugger;
		        if (window.navigator.msSaveOrOpenBlob) {   // if browser is IE
		            navigator.msSaveBlob(url, name);//filename文件名包括扩展名，下载路径为浏览器默认路径
		        }else{
	        		let url = window.URL.createObjectURL(data.data);
			        let link = document.createElement("a");
			        link.style.display = "none";
			        link.href = url;
			        link.setAttribute("downLoad", name); //设置文件名称
			        document.body.appendChild(link);
			        link.click();
		        }
		        
		     });
      
  		},
      
      
    },
  }
</script>

<style lang="less" scoped>
  .card-config {
    display: flex;
    flex-direction: column;
    // height: 100%;

    .card-info {
      display: flex;
      align-items: center;

      .card {
        width: 291px;
        height: 433px;
        background-image: url('../../assets/scan.png');
        background-size: 100% 100%;
        text-align: center;

        h3 {
          font-size: 16px;
          padding-top: 173px;
        }
      }

      .config {
        padding-left: 36px;
        font-size: 18px;

        .item {
          display: flex;
          align-items: center;
        }

        .label {
          margin-right: 10px;
        }

        .input {
          width: 300px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background-color: #fff;
        }

      }
    }

    .buttons {
      align-self: center;
      // margin-top: auto;
      margin-top: 100px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 20px;

      button {
        width: 200px;
        height: 50px;
      }
    }
  }

  @media screen and (max-width:768px){
    .card-config{
      .buttons{
        margin-top: 30px;
        button{
          width: 110px;
        }
      }
      .card-info{
        flex-direction: column;
        .card{
          margin-bottom: 30px;
        }
        .config {
          padding-left: 0;
          .item{
            flex-direction: column;
            .label{
              align-self: flex-start;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width:576px){
    .card-config .card-info{
      .card{
        width: 100%;
      }
      
    }
  }
</style>
