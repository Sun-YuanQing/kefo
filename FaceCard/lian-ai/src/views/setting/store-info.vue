<template>
  <div class="fullscreen base-info">
    <Header title="基本信息"></Header>
    <div class="content">
      <div v-if="flag==1">
        <Form :label-width="100" class="form">
          <FormItem  label="店铺账号">
            <div>{{phone}}</div>
          </FormItem>
          <FormItem label="店铺logo" class="logo2">
            <img :src="formData.Logo" v-if="formData.Logo" style="width: 120px;height: 120px;" alt="">
          </FormItem>
          <FormItem label="店铺名称">
            <div>{{formData.SiteName}}</div>
          </FormItem>
          <FormItem label="主营类目">
            <div>{{formData.ItemName}}</div>
          </FormItem>
          <FormItem label="经营时间">
            <div>{{selectedWeeks}}&nbsp;&nbsp;
              {{formData.Operatinghours_F}}—{{formData.Operatinghours_B}}
            </div>
          </FormItem>
          <FormItem label="客服电话">
            <div>{{formData.Tel_F}}—{{formData.Tel_B}}</div>
          </FormItem>
          <FormItem label="店铺地址">
            <div>{{formData.Province + formData.City + formData.Town}}&nbsp;&nbsp;{{formData.Address}}</div>
          </FormItem>
          <FormItem label="店铺照片" >
            <ul class="imgList">
              <li v-for="(item,index) in formData.Photo" :key="index">
                <img :src="item" alt="" class="item">
              </li>
            </ul>
          </FormItem>
          <FormItem label="店铺说明">
            <div>{{formData.Description}}</div>
          </FormItem>
        </Form>
        <div class="logo">
          <img :src="formData.Logo" v-if="formData.Logo" alt="" style="width: 120px;height: 120px;border-radius: 4px;">
          <p>店铺logo</p>
        </div>
      </div>

      <Form  v-show="flag==2" ref="form" :model="formValidate" :rules="ruleValidate"
            :label-width="100" class="form" >
        <FormItem label="店铺名称" prop="SiteName">
          <Input v-model="formValidate.SiteName" :maxlength="16" @keydown.enter.native.prevent="searchHandle"></Input>
        </FormItem>
        <FormItem label="店铺logo" prop="Logo" class="logo2">
          <div class="upload">
            <input type="file" name="upLoadLogo" ref="upLoad" value="" 
                  accept="image/jpg, image/jpeg, image/png" @change="uploadLogo"/>
            <img src="@/assets/upload-icon.svg" alt="" srcset="">
            <img :src="formValidate.Logo.url" alt="" class="img" v-if="formValidate.Logo && formValidate.Logo.url">
          </div>
          <p v-if="formValidate.Logo && formValidate.Logo.url">重新上传</p>
          <p v-else>店铺logo</p>
        </FormItem>
        <FormItem label="主营类目" prop="ItemName">
          <Select v-model="formValidate.ItemName">
            <Option value="餐饮">餐饮</Option>
            <Option value="生活服务">生活服务</Option>
            <Option value="美容美发">美容美发</Option>
            <Option value="健身房">健身房</Option>
            <Option value="学习机构">学习机构</Option>
            <Option value="超市">超市</Option>
            <Option value="其他">其他</Option>
          </Select>
        </FormItem>
        <FormItem label="经营时间" required style="margin-bottom: 36px;">
          <FormItem prop="Operatingdate" class="week" style="margin-bottom: 20px;">
              <div style="position: relative" class="row" @click="isShowWeek = !isShowWeek">
                <Input :value="selectedWeeks" :readonly="true"/>
                <img :src="isShowWeek ? require('@/assets/arrow-up.svg') : require('@/assets/arrow-down.svg')" 
                    alt="" style="position: absolute;top: 20px;right: 20px;cursor: pointer;">
              </div>
              <CheckboxGroup v-if="isShowWeek" v-model="formValidate.Operatingdate" class="weekCheck">
                  <Checkbox v-for="(week,index) in weeks" 
                            :key="index" :label="week"></Checkbox>
              </CheckboxGroup>
          </FormItem>
          <Row class="row">
                <Col span="11" class="auto">
                    <FormItem prop="Operatinghours_F" style="margin-bottom: 0">
                      <TimePicker format="HH:mm" v-model="formValidate.Operatinghours_F"></TimePicker>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11" class="auto">
                    <FormItem prop="Operatinghours_B" style="margin-bottom: 0">
                      <TimePicker format="HH:mm" v-model="formValidate.Operatinghours_B"></TimePicker>
                    </FormItem>
                </Col>
          </Row>
        </FormItem>
        <FormItem label="客服电话"  required style="margin-bottom: 36px;">
          <Row class="row">
            <Col span="6" class="auto">
              <FormItem prop="Tel_F" style="margin-bottom: 0;" class="interval">
                <Input v-model="formValidate.Tel_F" placeholder="区号"></Input>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="16" class="auto">
              <FormItem prop="Tel_B" style="margin-bottom: 0;" class="interval">
                <Input v-model="formValidate.Tel_B" placeholder="输入手机号时区号可空"></Input>
              </FormItem>
            </Col>
          </Row>
          <p style="color: #999;font-size: 14px;margin-top: 5px;">此电话将于网店展示、预约、客户短信提醒等</p>
        </FormItem>
        <FormItem label="店铺照片" prop="Photo">
          <ul class="imgList">
              <li v-for="(item,index) in formValidate.Photo" :key="index">
                  <img class="item" :src="item.url">
                  <img class="delete" src="@/assets/delete-icon.svg" alt="" @click="deleteImg(index)">
              </li>
              <li class="upload">
                <input type="file" name="upLoad" ref="upLoad" value="" accept="image/jpg, image/jpeg, image/png"
                    multiple="multiple" @change="uploadImg"/>
                <img src="@/assets/upload-icon.svg" alt="" srcset="">
              </li>
          </ul>
          <p style="color: #999;margin-top: 0px;">最多支持4张图片，为了保证图片质量请尽量上传16:9的尺寸，仅支持jpeg、jpg、png格式，大小不超过1.0MB</p>
        </FormItem>
        <FormItem label="店铺地址" required>
          <FormItem prop="Province" style="margin-bottom: 20px;" class="row">
              <v-distpicker :province="formValidate.Province" 
                            :city="formValidate.City" 
                            :area="formValidate.Town"
                            @province="onChangeProvince" 
                            @city="onChangeCity" 
                            @area="onChangeArea"></v-distpicker>
          </FormItem>
          <FormItem prop="Address" class="interval">
            <div style="display: flex;flex-wrap: wrap;">
              <Input v-model="formValidate.Address" placeholder="详细地址，例：沙河街道16号楼5层501"></Input>
              <div    @click="getMyLocation" class="detailAddress">
                <img src="../../assets/location-icon.svg" alt="">
                <span style="padding-left: 5px;color: #3275F5">定位地址</span>
              </div>
            </div>
          </FormItem>
          <p  style="color: #999;font-size: 14px;margin-top: -18px;">店铺地址将会展示给会员，请填写详细地址，包括楼层、门牌号，方便会员查找</p>
        </FormItem>
        <FormItem label="店铺说明" prop="Description">
          <div class="textareaWrap">
            <Input  v-model="formValidate.Description" type="textarea" class="textarea"
                    :autosize="{minRows: 4,maxRows: 8}" :maxlength="100"
                    placeholder="介绍一下你的店铺吧，100字以内" />
            <div class="tip">{{formValidate.Description ? formValidate.Description.length : 0}}/100</div>
          </div>
        </FormItem>
        <FormItem class="logo" prop="Logo">
          <div class="upload">
            <input type="file" name="upLoadLogo" ref="upLoad" value="" 
                  accept="image/jpg, image/jpeg, image/png" @change="uploadLogo"/>
            <img src="@/assets/upload-icon.svg" alt="" srcset="">
            <img :src="formValidate.Logo.url" alt="" class="img" v-if="formValidate.Logo && formValidate.Logo.url">
          </div>
          <p v-if="formValidate.Logo && formValidate.Logo.url">重新上传</p>
          <p v-else>店铺logo</p>
        </FormItem>
      </Form>
    </div>

    <div class="bottom">
      <Button @click="flag=2" v-if="flag==1">编辑</Button>
      <Button @click="handleSubmit('form')" v-if="flag==2">保存</Button>
    </div>

    <Modal v-model="isShowMap" width="900" :mask-closable="false" class="mapModal">
        <p slot="header" style="text-align:center;font-size: 18px;">定位地址</p>
        <div class="content">
            <div class="head">
              <Input type="text" v-model="keyword"  placeholder="请输入你的详细地址" 
                     class="searchInput" @on-enter="searchKey">
                      <Icon type="ios-search" slot="prefix" size="24" style="margin-top: 5px"/></Input>
              <img src="../../assets/search-btn.svg"  alt="" @click="searchKey">
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

  </div>
</template>

<script>
import Header from '@/components/route-header'
import { getObjectURL,getImgToBase64,dataURLtoFile } from '@/utils/format.js'
import VDistpicker from 'v-distpicker'
import { TMap } from '@/utils/TMap'
export default {
  name: 'baseInfo',
  components: { Header,VDistpicker },
  data() {
    const validateDate = (rule, value, callback) => {
        if(this.formValidate.Operatingdate.length===0){
          callback(new Error('请选择经营时间'));
        }else{
          callback();
        }
    };

    const validatePhoto = (rule, value, callback) => {
        if(this.formValidate.Photo.length===0){
          callback(new Error('请上传店铺照片'));
        }else{
          callback();
        }
    };

    const validateLogo = (rule, value, callback) => {
        if(!this.formValidate.Logo || !this.formValidate.Logo.url){
          callback(new Error('请上传店铺logo'));
        }else{
          callback();
        }
    };

    const validateTel = (rule, value, callback) => {
        let phone = /^\d{7,8}$/,area = /^0\d{2,3}$/
        if(value==''){
          if(phone.test(this.formValidate.Tel_B)){
            callback(new Error('请填写区号'));
          }else{
            callback();
          }
        }else{
          if(!area.test(value)){
            callback(new Error('区号格式不正确'));
          }else{
            callback();
          }
        }
        
    };
    const validateMobile  = (rule, value, callback) => {
      let mobile = /^1\d{10}$/ , phone = /^\d{7,8}$/;
      if(value==''){
        callback(new Error('请填写手机号/座机号'));
      }else if(!mobile.test(value) && !phone.test(value)){
        callback(new Error('手机号/座机号格式不正确'));
      }else{
        callback();
      }
    }
    const validateProvince = (rule, value, callback) => {
      if(this.formValidate.Province=='' && this.formValidate.City=='' && this.formValidate.Town==''){
        callback(new Error('请选择省市区'));
      }else if(this.formValidate.City=='' && this.formValidate.Town==''){
        callback(new Error('请选择市和区'));
      }else if(this.formValidate.Province==''){
        callback(new Error('请选择省'));
      }else if(this.formValidate.City==''){
        callback(new Error('请选择城市'));
      }else if(this.formValidate.Town==''){
        callback(new Error('请选择区域'));
      }
      else{
        callback();
      }
    }

    return {
      isShowWeek: false,
      isShowMap: false,
      keyword: '',
      positions: [],
      markers: [],
      selectedPosition: {},
      phone: '',
      flag: 1,
      weeks: ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],
      formData: {},
      formValidate: {
        // ItemName: '',
        // SiteName: '',
        // Operatingdate: [],
        // Description: '',
        // Photo: [],
        // Logo: '',
        // Operatinghours_F: '',
        // Operatinghours_B: '',
        // Tel_F: '',
        // Tel_B: '',
        // Province: '',
        // City: '',
        // Town: '',
        // Address: '',
        // Lon: '', //经度
        // Lat: '' //纬度
      },
      modalData: {
        latitude: '',
        longitude: '',
      },
      map: null,// 地图实例
      market: null,// 坐标
      ruleValidate: { 
          SiteName:[
              { required: true, message: '请输入店铺名称', trigger: 'blur' },
          ],
          ItemName: [
              { required: true, message: '请选择主营类目', trigger: 'change' },
          ],
          Operatinghours_F:[
              { required: true, message: '请选择开始经营时间', trigger: 'change' },
          ],
          Operatinghours_B: [
              { required: true, message: '请选择结束经营时间', trigger: 'change' },
          ],
          Tel_B:[
              { required: true, validator: validateMobile, trigger: 'blur' },
          ],
          Tel_F: [
              { validator: validateTel, trigger: 'blur' },
          ],
          Operatingdate:[
              { required: true, validator: validateDate, trigger: 'change' },
          ],
          Photo:[
              { required: true, validator: validatePhoto, trigger: 'change' },
          ],
          Logo:[
              { required: true, validator: validateLogo, trigger: 'change' },
          ],
          Province: [
              { required: true, validator: validateProvince, trigger: 'change' },
          ],
          Address:[
              { required: true, message: '请输入详细地址', trigger: 'blur' },
          ],
      }
    }

  },
  computed: {
    selectedWeeks(){
      if(this.formValidate.Operatingdate){
        // let arr = this.formValidate.Operatingdate;
        // if(arr.includes('星期一') && arr.includes('星期二') && arr.includes('星期三') && arr.includes('星期四') 
        //     && arr.includes('星期五') && arr.includes('星期六') && arr.includes('星期日')){
        //       return '星期一至星期天'
        // }else if(arr.includes('星期一') && arr.includes('星期二') && arr.includes('星期三') && arr.includes('星期四') 
        //     && arr.includes('星期五') && arr.includes('星期六')){
        //       return '星期一至星期六'
        // }else if(arr.includes('星期一') && arr.includes('星期二') && arr.includes('星期三') && arr.includes('星期四') 
        //     && arr.includes('星期五')){
        //       return '星期一至星期五'
        // }else{
        //   return this.formValidate.Operatingdate.join(',');
        // }
        return this.formValidate.Operatingdate.join(',');
        
      }else{
        return '';
      }
      
    }
  },
  beforeCreate(){
      // 创建指针指向地图组件调用方法
      window.qqMapComponent = this;
  },
  created() {
    this.phone = localStorage.getItem("currentUserNname");
    this.getAdminUser();
  },

  methods: {
    getAdminUser() {
      let url = "/User/GetAdminUser";
      this.axios.post(url)
        .then(res => {
          let { Data, Code, Message } = res.data;
          if (Code == 0) {
            this.formData = JSON.parse(JSON.stringify(Data.LoginUser));
            this.formValidate = Data.LoginUser;
            this.formValidate.Operatingdate = this.formValidate.Operatingdate && this.formValidate.Operatingdate.length>0 ?  this.formValidate.Operatingdate.split(',') : ''


            //网络地址图片转换成file文件
            if(this.formValidate.Photo && this.formValidate.Photo.length>0){
                this.formValidate.Photo = this.formValidate.Photo.map(item => {
                    return { url: item,file: null }
                })
                let self = this;
                for(let i=0; i<this.formValidate.Photo.length; i++){
                    let file;
                    getImgToBase64(this.formValidate.Photo[i].url,function(data){
                        file = dataURLtoFile(data,"Photo"+(i+1));
                        self.formValidate.Photo[i].file = file;
                    });
                }
            }

            if(this.formValidate.Logo){
                this.formValidate.Logo = { url: this.formValidate.Logo,file: null};
                let self = this;
                getImgToBase64(this.formValidate.Logo.url,function(data){
                    self.formValidate.Logo.file = dataURLtoFile(data,"Logo");
                });
                
            }


          } else {

            this.$Message.error(Message)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    searchHandle(e) {
      if (e.keyCode == 13) {
        return false;
      }
    },
    onChangeProvince(data) {
      this.formValidate.Province = data.value;
    },
    onChangeCity(data) {
      this.formValidate.City = data.value;
    },
    onChangeArea(data) {
      this.formValidate.Town = data.value;
    },

    //上传logo
    uploadLogo(e){
      let file = e.target.files[0];
      let types = ['image/jpg', 'image/jpeg', 'image/png'];
      if(file){
        let size = file.size/1024/1024;
        if(!types.includes(file.type)){
            this.$Message.warning("上传的图片格式不正确！");
            return ;
        }else if(size>1){
            this.$Message.warning(file.name+" 这张图大小超过1MB");
            return ;
        }else{
          this.formValidate.Logo = {
            file: file,
            url: getObjectURL(file)
          }
        }
        
      }
    },

    uploadImg(e){
        let files = e.target.files;
        // console.log('files',files)
        let types = ['image/jpg', 'image/jpeg', 'image/png'];
        if((this.formValidate.Photo.length + files.length) > 4 ){
          this.$Message.warning("最多上传4张照片");
        }else{
          for(let i in files){
            
            if(files[i].size){
                let size = files[i].size/1024/1024;
                if(!types.includes(files[i].type)){
                    this.$Message.warning("上传的图片格式不正确！");
                    return ;
                } else if(size>1){
                    this.$Message.warning(files[i].name+" 这张图大小超过1MB");
                    return ;
                }else{
                    let item = {
                            file: files[i],
                            url: getObjectURL(files[i])
                        }
                    this.formValidate.Photo.push(item);
                }
                
            }
            
          }
        }
        
    },

    deleteImg(index){
      this.$Modal.confirm({
            title: '请确认是否删除此照片',
            onOk: () => {
              this.formValidate.Photo.splice(index,1);
            }
        })
    },

    handleSubmit(name) {
      // console.log(this.formValidate)
      this.$refs[name].validate((valid) => {
        if (valid) {
            this.updateStore();
        } else {
          this.$Message.error('有必填信息未填写');
        }
      })
    },
    //修改
    updateStore() {
      this.$Spin.show();
      let formInfo = new FormData();
      formInfo.append("Logo",this.formValidate.Logo.file,"Logo");
      for(let i=0;i<this.formValidate.Photo.length;i++){
          formInfo.append("Photo"+(i+1),this.formValidate.Photo[i].file,"Photo"+(i+1));
      }
      for(let x in this.formValidate){
            if(x != "Logo" && x != "Photo"){
              if(x=='Operatingdate'){
                formInfo.append(x,this.formValidate[x].join(','));
              }else{
                formInfo.append(x,this.formValidate[x]);
              }
              
            }
            
        }
      let url = "/User/UpdateSiteBase";
      this.axios.post(url, formInfo, {
        headers: {
          'access-token': window.localStorage.getItem('token'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        this.$Spin.hide();
        let { Data, Code, Message } = res.data;
        if (Code == 0) {
          this.$Message.success("修改成功");
          localStorage.setItem('siteName', this.formValidate.SiteName);
          this.flag = 1;
        } else {
          this.$Message.error(Message)
        }
      }).catch(err => {
        console.log(err)
      })
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
    getMyLocation() { 
      this.isShowMap=true;
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
      // console.log('position',position); 
      this.modalData.latitude = position.lat; 
      this.modalData.longitude = position.lng; 
      this.setMap(); 
    }, 
    showErr() { 
      console.log("定位失败"); 
      this.getMyLocation();
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
        console.log('ev',ev);
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
            // else if(d.area){
            //     let lat = parseFloat(d.area.pointy);
            //     let lng = parseFloat(d.area.pointx);
            //     this.setMarker(lat,lng);
            // } else if(d.city){
            //     let lat = parseFloat(d.city.pointy);
            //     let lng = parseFloat(d.city.pointx);
            //     this.setMarker(lat,lng);
            // } 
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
      this.isShowMap=false;
      if(this.selectedPosition){
        let {addr, POI_PATH, pointx, pointy} = this.selectedPosition;
        // console.log(addr, POI_PATH[0].cname, pointx, pointy)
        // this.formValidate.Province = POI_PATH[0].cname;
        // this.formValidate.City = POI_PATH[1].cname;
        // this.formValidate.Town = POI_PATH[2].cname;
        this.formValidate.Address = addr;
        this.formValidate.Lon = pointx;
        this.formValidate.Lat = pointy;
      }else{
        this.formValidate.Lon = this.modalData.longitude;
        this.formValidate.Lat = this.modalData.latitude;
      }
    }

  },

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
.base-info {
  .ivu-form {
    .distpicker-address-wrapper{
      select{
        width: 32.2%;
      }
    }
    .ivu-select {
      width: auto;
      margin-right: 15px;
    }
    .ivu-select-single .ivu-select-selection {
      width: 320px;
    }
    textarea.ivu-input{
      font-size: 14px;
      line-height: 2;
    }
    .ivu-input-wrapper{
      width: 320px;
    }
    .weekCheck{
      .ivu-checkbox{
          display: none;
        }
    }
    
    @media screen and (max-width: 768px) {
      .ivu-select-single .ivu-select-selection {
        width: 230px;
      }
      .ivu-input-wrapper{
        width: 230px;
      }
    }
    .auto .ivu-input-wrapper{
      width: auto;
    }
    .interval .ivu-form-item-error-tip{
      top: 150%;
    }
  }
}
</style>

<style lang="less" scoped>
.base-info{
  background-color: #F7F8FA;
  .content{
    margin: 10px;
    background-color: #fff;
    position: relative;
    padding-bottom: 120px;
    .ivu-form {
      margin: 30px 0;
      p{
        line-height: 1.3;
      }
      .ivu-form-item {
        margin-bottom: 24px;
        .row{
          width: 320px;
        }
        @media screen and (max-width: 768px){
          .row{
            width: 230px;
          }
        }
        .ivu-form-item-label {
          font-size: 20px !important;
        }
        .ivu-form-item-content {
          font-size: 20px;
        }
      }
      .detailAddress{
        display: flex;
        align-items: center;
        height: 40px;
        padding-left: 10px;
        cursor: pointer
      }
      
      .week{
        .weekCheck{
          max-width: 668px;
          margin: 15px 20px 0;
          display: flex;
          flex-wrap: wrap;
          font-size: 14px;
          box-shadow:2px 2px 8px 0px rgba(232,232,232,1);
          .ivu-checkbox-group-item{
            border: 1px solid #E4E4E4;
            padding: 0 18px;
            margin: 10px 5px;
            border-radius: 4px;
          }
          .ivu-checkbox-wrapper-checked{
            border-color: #3275F5;
              position: relative;
              overflow: hidden;
              &::after {
                content: "";
                width: 25px;
                height: 25px;
                border: 1px solid #3275f5;
                background-color: #3275f5;
                position: absolute;
                right: 0;
                bottom: -1px;
                transform: rotate(45deg) translate(72%);
                z-index: 3;
              }
              &::before {
                content: "✔";
                position: absolute;
                right: 0px;
                bottom: -10px;
                color: #fff;
                font-size: 12px;
                z-index: 6;
              }
          }
          
        }
      }
      .textareaWrap{
         width: 600px;
         position: relative;
        .textarea{
          width: 600px;
          height: auto;
        }
        .tip{
          position: absolute;
          bottom: 0;
          right: 5px;
          color: #999;
        }

      }
      
      @media screen and (max-width: 768px){
          .textareaWrap{
            width: 100%;
            .textarea{
              width: 100%;
            }
          }
        }

      .imgList{
        display: flex;
        flex-wrap:wrap;
        li{
            margin-right: 20px;
            margin-bottom: 10px;
            position: relative;
            .delete{
              position: absolute;
              right: -5px;
              top: -5px;
            }
        }
        li,img.item{
          width: 240px;
          height: 135px;
          border-radius: 4px;
        }
        .upload{
            width: 240px;
            height: 135px;
            border: 1px dashed #999;
            line-height: 135px;
            text-align: center;
            input{
              position: absolute;
              width: 240px;
              height: 135px;
              right: 0;
              top: 0;
              cursor: pointer;
              opacity: 0;
              z-index: 5;
            }
        }
      }
      
    }
    
  }
  .logo{
      position: absolute;
      right: 80px;
      top: 30px;
      p{
        margin-top: 10px;
        margin-left: 25px;
      }
  }
  .logo2{
    display: none;
    p{
      display: none;
    }
  }
  .logo,.logo2{
      font-size: 16px;
      .upload{
        width: 120px;
        height: 120px;
        border: 1px dashed #999;
        line-height: 120px;
        text-align: center;
        border-radius: 4px;
        position: relative;
        input{
            position: absolute;
            width: 120px;
            height: 120px;
            right: 0;
            top: 0;
            cursor: pointer;
            opacity: 0;
            z-index: 5;
          }
        .img{
            border-radius: 4px;
            position: absolute;
            width: 126px;
            height: 126px;
            left: -3px;
            top: -3px;
            z-index: 3;
        }
      }
      
    }
    @media screen and (max-width:576px){
      .logo{
        display: none;
      }
      .logo2{
        display: block;
      }
      
    }
  .bottom{
      background: #fff;
      width: 100%;
      border-top: 1px solid #E4E4E4;
      display: flex;
      justify-content: center;
      padding: 15px 0;
      position: fixed;
      bottom: 10px;
      z-index: 99;
      .ivu-btn{
        height: 40px;
        width: 200px;
        background-color: #333;
        color:#fff;
      }
  }
}
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
