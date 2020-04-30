import Vue from 'vue';
const EventBus = new Vue({
  data: {
    msg         : 'Hello world',
    clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
  },
  computed: {
  	
  },
  watch: {
    // 这里为了实现对象引用监听，然后触发change事件，实现状态同步
    msg(val) {
      this.$emit('msg-change', { value: val });
    },
  },
  created() {

  },
  methods: {
  	
  },
  
});

EventBus.$on('msg-change', (payload) => {
  //console.log(`Msg has changed to ${payload.value}`);
  EventBus.msg = payload.value;
});

export default EventBus;
