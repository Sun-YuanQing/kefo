<template>
    <div id="qqmap"></div>
</template>
<script>
export default {
    props:{
        lat: Number,// 纬度，注意限制为Number类型
        lng: Number,// 经度，注意限制为Number类型
        keyword: String// 搜索关键字，注意限制为String类型
        // ['lat','lng','keyword']
    },
    data() {
        return {
            map: null,// 地图实例
            market: null// 坐标
        }
    },
    beforeCreate(){
        // 创建指针指向该组件调用方法
        window.qqMapComponent = this;
    },
    mounted(){
        console.log(this.lat,this.lng);
        // 判断是否已经引入地图库
        if(!window.mapScript){
            // init是引入完成后的回调函数，见33行末尾->callback=init
            window.init = ()=>{
                window.mapScript = true;
                this.getMap();
            }
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://map.qq.com/api/js?v=2.exp&key=3DXBZ-OK6C3-TKY3M-YT5OA-CKMYH-GCFLR&callback=init";
            document.body.appendChild(script);
            window.mapScript = true;
        } else {
            this.getMap();
        }
    },
    watch: {
        // 监听经纬度变化
        lat(){
            var latLng = this.getLatLng();
            this.marker.setPosition(latLng);
        }
    },
    methods: {
        // 关键字搜索
        searchKey(){
            console.log(this.keyword);
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
            console.log(ev);
            let d = ev.detail;
            if(d){
                if(d.pois && d.pois.length){
                    let lat = parseFloat(d.pois[0].pointy);
                    let lng = parseFloat(d.pois[0].pointx);
                    this.setMarker(lat,lng);
                } else if(d.area){
                    let lat = parseFloat(d.area.pointy);
                    let lng = parseFloat(d.area.pointx);
                    this.setMarker(lat,lng);
                } else if(d.city){
                    let lat = parseFloat(d.city.pointy);
                    let lng = parseFloat(d.city.pointx);
                    this.setMarker(lat,lng);
                } else {

                }
            }
        },
        // 设置坐标点
        setMarker(lat,lng){
            let latlng = this.getLatLng(lat,lng);
            this.marker.setPosition(latlng);
            this.map.setCenter(latlng);
            this.$emit('getPosition',latlng);
        },
        // 获取地图经纬度实例对象
        getLatLng(lat,lng){
            return new qq.maps.LatLng(lat || this.lat || 23.12463, lng || this.lng || 113.36199);
        },
        // 创建实例
        getMap(){
            var div = document.getElementById("qqmap");
            var center = this.getLatLng();
            // 创建地图实例
            var map = new qq.maps.Map(div, {
                zoom: 16,
                center
            });
            this.map = map;
            // 创建地图坐标实例
            this.marker = new qq.maps.Marker({
                position: center,
                draggable: true,
                map
            });
            // 创建监听地图点击事件，移动坐标
            var listener = qq.maps.event.addListener(
                map,
                'click',
                e=>{
                    this.marker.setPosition(e.latLng);
                    this.$emit('getPosition',e.latLng);
                }
            );
            // 监听坐标拖拽事件
            qq.maps.event.addListener(this.marker, 'dragend', ()=>{
                this.$emit('getPosition',this.marker.getPosition());
            });
        }
    }
}
</script>
<style scoped>
#qqmap{width: 100%;height: 400px;}
</style>