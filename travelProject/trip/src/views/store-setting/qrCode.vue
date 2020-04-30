<template>
    <div class="qrCodeSetting">
        <h3>网店二维码</h3>
        <p class="tip">将生成的二维码保存至相册再分享至朋友圈，或打印张贴在店铺显眼处，顾客扫码即可进入小程序。</p>
        <div class="imgWrap">
            <img :src="imgUrl" alt="">
        </div>
        <div class="footer">
            <Button type="primary" @click="isShow=true">联系定制</BUtton>
            <Button type="primary" @click="downLoadUrl">保存到相册</Button>
        </div>
        <Modal v-model="isShow" width="500" :mask-closable="false" 
               :footer-hide="true"
               class="linkModal" @on-cancel="isShow=false">
            <p slot="header" style="text-align:center;font-size: 18px;">联系我们</p>
            <img src="../../assets/link-modal.svg" alt="">
        </Modal>
    </div>
</template>

<script>
import{ getQRCoderUrl, downloadQRCoderUrl } from '@/api/store-setting.js'
export default {
    data(){
        return{
            isShow: false,
            imgUrl: ""
        }
    },
    created(){
        this.getImg();
    },
    methods: {
        getImg(){
            this.$Spin.show();
            getQRCoderUrl().then(res => {
                this.$Spin.hide();
                this.imgUrl = res.Data.QrCoderUrl;
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        downLoadUrl(){
            this.$Spin.show();
            const name = "二维码.jpg";
            let url = 'QRCoder/DownloadQRCoderUrl';
            this.axios({
		        url: url,
                method: 'get',
                responseType: "blob"
		      }).then(data => {
                this.$Spin.hide();
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
		        
		     }).catch(err => {
                this.$Spin.hide();
            });
        }

    }
}
</script>
<style lang="less" scoped>
    .qrCodeSetting{
        padding: 10px 20px;
        .tip{
            color: #999;
            line-height: 2;
        }
        .imgWrap{
            width: 250px;
            height: 250px;
            // background: url('../../assets/qr-code.png');
            // background-size: cover;
            margin-top: 20px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .footer{
            padding: 20px 0;
            border-top: 1px solid #e4e4e4;
            display: flex;
            justify-content: center;
            position: fixed;
            bottom: 10px;
            left: 125px;
            right: 15px;
            .ivu-btn{
                width: 200px;
                line-height: 40px;
                height: 40px;
                &:first-of-type{
                    margin-right: 20px;
                }
            }
        }
    }
    .linkModal{
        img{
            margin: 0 20px 20px 20px;
        }
    }
</style>