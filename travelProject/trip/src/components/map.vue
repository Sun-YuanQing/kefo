<template>
    <Modal v-model="isShow" width="900" @on-cancel="cancel"
            :mask-closable="false" class="mapModal">
        <p slot="header" style="text-align:center;font-size: 18px;">定位地址</p>
        <div class="content">
            <div class="head">
                <Input type="text" v-model="keyword"  placeholder="请输入你的详细地址" 
                        class="searchInput" @on-enter="searchKey">
                        <Icon type="ios-search" slot="prefix" size="24" style="margin-top: 5px"/></Input>
                <img src="@/assets/search-btn.svg"  alt="" @click="searchKey">
            </div>
            <div class="container">
                <div id="container"></div>
                <ul>
                    <li v-for="(position,index) in positions" :key="index" 
                        :class="{selected: selectedPosition.uid == position.uid}"
                        @click="selectAddr(position)">
                    <p><span></span>{{position.name}}</p>
                    <p>{{position.addr}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div slot="footer" style="text-align:center">
            <Button type="primary" @click="makeLocs">确定定位</Button>
        </div>
    </Modal>
</template>
<script>
import { TMap } from '@/utils/TMap'
export default {
    props: ['isShowMap','type'],
    data(){
        return{
            isShow: false,
            modalData: {
                latitude: '',
                longitude: '',
            },
            map: null,// 地图实例
            market: null,// 坐标
            positions: [],
            keyword: '',
            selectedPosition: {},
        }
    },
    watch: {
        isShowMap(val){
            this.isShow = val;
        },
    },
    beforeCreate(){
        // 创建指针指向地图组件调用方法
        window.qqMapComponent = this;
    },
    methods: {
        cancel(){
            this.$emit('closeMap')
        },
        //初始化地图
        initMap(){
            var geolocation = new qq.maps.Geolocation("XHXBZ-6BOKU-TV3VN-2OSNR-AXFOH-ZYFZB", "赣州国旅-门店定位"); 
            if (navigator.geolocation) {
                geolocation.getLocation(this.showPosition, this.showError);
            } else {
                this.$Message.error("此浏览器不支持定位")
            }

        },
        getLocation() { 
            // 判断是否已经引入地图库
            if(!window.mapScript){
                TMap('XHXBZ-6BOKU-TV3VN-2OSNR-AXFOH-ZYFZB').then(qq => {
                    window.mapScript = true;
                    this.initMap();
                });
            }else{
                this.initMap();
            }

        }, 
        showPosition(position) { 
            console.log('position',position); 
            this.modalData.latitude = position.lat; 
            this.modalData.longitude = position.lng; 
            this.setMap(); 
        }, 
        showErr() { 
            console.log("定位失败"); 
            this.getLocation();
        },
        setMap(){
            var myLatlng = new qq.maps.LatLng(this.modalData.latitude,this.modalData.longitude); //定义工厂模式函数 
            var myOptions = { 
                zoom: 13, //设置地图缩放级别 
                center: myLatlng, 
                mapTypeId: qq.maps.MapTypeId.ROADMAP  //设置地图样式详情参见MapType
            }
            var map = new qq.maps.Map(document.getElementById("container"), myOptions);
            this.map = map;
            //给定位的位置添加图片标注 
            // var marker = new qq.maps.Marker({ position: myLatlng, map: map });
            this.marker = new qq.maps.Marker({ position: myLatlng, map: map });
        },

        // 关键字搜索
        searchKey(){
            let script = document.createElement('script');
            let keyword = encodeURIComponent(this.keyword || '');
            // 搜索接口，通过jsonp请求通过callback调用getRegionKey方法
            let src = `https://apis.map.qq.com/jsapi?qt=poi&wd=${keyword}&key=3DXBZ-OK6C3-TKY3M-YT5OA-CKMYH-GCFLR&output=jsonp&pf=jsapi&cb=window.qqMapComponent.getRegionKey`;
            script.src = src;
            document.body.appendChild(script);
        },
        // 关键字回调，见54行最后->cb=window.qqMapComponent.getRegionKey
        getRegionKey(ev){
            // ev是回调返回的参数，详见回调
            // 如果关键字可能搜索出两个不同的地区信息，有可能会报错，这个没有做错误处理
            // 例如：关键字'白云区'
            // console.log('ev',ev);
            let d = ev.detail;
            if(d){
                if(d.pois && d.pois.length){
                    this.positions = d.pois;
                    var latlngBounds = new qq.maps.LatLngBounds();
                    // console.log(this.positions)
                    this.selectedPosition = d.pois[0];
                    let lat = parseFloat(d.pois[0].pointy);
                    let lng = parseFloat(d.pois[0].pointx);
                    this.setMarker(lat,lng);
                } 
                else{
                    this.$Message.error("没有找到要搜索的内容")
                    // this.setMarker(this.modalData.latitude,this.modalData.longitude);
                }
            }
        },
        // 获取地图经纬度实例对象
        getLatLng(lat,lng){
            return new qq.maps.LatLng(lat,lng);
        },

        // 设置坐标点
        setMarker(lat,lng){
            let latlng = this.getLatLng(lat,lng);
            this.marker.setPosition(latlng);
            this.map.setCenter(latlng);
        },

        selectAddr(item){
            this.selectedPosition = item;
            let lat = parseFloat(item.pointy);
            let lng = parseFloat(item.pointx);
            this.setMarker(lat,lng);
        },

        //确定定位
        makeLocs(){
            this.cancel();
            if(this.selectedPosition){
                let {addr, name, POI_PATH, pointx, pointy} = this.selectedPosition;
                // console.log(addr, POI_PATH[0].cname, pointx, pointy)
                this.$parent.formValidate.Province = POI_PATH[2].cname;
                this.$parent.formValidate.City = POI_PATH[1].cname;
                if(this.type==1){
                    this.$parent.formValidate.Area = POI_PATH[0].cname;
                }else{
                    this.$parent.formValidate.Town = POI_PATH[0].cname;
                }
                this.$parent.formValidate.Address = name;
                this.$parent.formValidate.Lon = pointx;
                this.$parent.formValidate.Lat = pointy;
            }else{
                this.$parent.formValidate.Lon = this.modalData.longitude;
                this.$parent.formValidate.Lat = this.modalData.latitude;
            }
        }
    }
}
</script>
<style lang="less">
    .mapModal .ivu-modal {
        height: 95%;
        overflow-y: auto;
        .searchInput{
            width: calc(100% - 102px);
            .ivu-input{
                padding-left: 28px;
                font-size: 14px;
            }
        }
    }
</style>
<style lang="less" scoped>
    .mapModal{
        .content{
            margin-top: -15px;
            .head{
                display: flex;
                align-items: center;
            }
            .container{
                margin-top: 10px;
                display: flex;
                flex-wrap: wrap;
                #container {
                    min-width: 420px;
                    min-height:380px;
                    margin-right: 10px;
                }
                ul{
                    width: calc(100% - 430px);
                    margin-top: 10px;
                    height: 380px;
                    overflow-y: auto;
                    li{
                        margin-bottom: 10px;
                        line-height: 1.6;
                        cursor: pointer;
                        p:nth-of-type(1) {
                            display: flex;
                            font-size: 14px;
                            align-items: center;
                            span{
                                display: inline-block;
                                width: 6px;
                                height: 6px;
                                border-radius: 50%;
                                background: #c5c5c5;
                                margin-right: 5px;
                            }
                        }
                        p:nth-of-type(2){
                            font-size: 12px;
                            color: #999;
                        }
                    }
                    .selected{
                        p:nth-of-type(1){
                            color: #E94E27;
                            span{
                            background: #E94E27;
                            }
                        }
                    }
                }
            }
            
        }
    }
</style>