const Card = Vue.component('wordcard', {
  template: '#wordcard',
  props: {
    word: {
      type:Object,
      default:{word:'Несуществующее слово'}
    },
    state: {
      type:Number,
      default:0
    }
  },
  data() {
    return {
      states:3,
      open: {
        desc:false,
        author:false,
        authorDetails:false
      },
      currentState:0
    }
  },
  methods: {
    changeState(state) {
      this.currentState=state;
    }
  },
  mounted() {
  },
  computed: {
    rotate() {
      let rot=[];
      let state = this.currentState;
      for (let i=0;i<this.states;i++) {
        if (i>state) {rot.push(1)}
        if (i==state) {rot.push(0)}
        if (i<state) {rot.push(-1)}
      }
      return rot
    },
    parts() {
      let stress=this.word.stress-1;
      let arr = [...this.word.word];
      let parts=[];
      parts[0]=arr.slice(0,stress).join('');
      parts[1]=arr.slice(stress,stress+1).join('');
      parts[2]=arr.slice(stress+1).join('');
      return parts
    }
  }
})


const AddCard = Vue.component('add-card',{
  template:'#add-card',
  props: ['word'],
  data() {
    return {
      open: false,
      title: '',
      text:'',
      type:''
    }
  },
  methods: {
    flip() {
      this.open=!this.open;
    }
  }
});
