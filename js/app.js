import client from './client.js'
import router from './pages/router.js'


Vue.use(Vuetify, {
 iconfont: 'fa'
})

// VUE APP

const thisApp = new Vue({
  el:'#app',
  router:router,
  data: {
    title:'ЭТОВОТЭТО',
    newUser:false,
    auth:false,
    valid:false,
    loggedIn:false,
    me:'',
    statusToggle:0,
    showPassword:false,
    rules: {
      name: [
        v => !!v || 'Представьтесь, пожалуйста'
      ],
      account: [
        v => /^[a-zA-Z0-9_][a-zA-Z0-9_.]*/.test(v) || 'Таких аккаунтов не бывает'
      ],
      password: [
        v => v.length > 7 || 'Пароль должен быть более 8 символов'
      ],
      email: [
        v => !!v || 'Укажите почту',
        v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || 'Нужен правильный адрес почты'
      ]
    },
    user: {
      name:'',
      email:'',
      password:''
    }
  },
  watch: {

  },
  methods: {
    login(user) {
      client.login({
        email:user.email,
        password:user.password
      }).then(
        data => client.getMe().then(me => {
          this.me=me;console.log(me);
          this.loggedIn=client.loggedIn
        })
      ).catch(error => console.log(error))

    }
  },
  computed: {

  },
  created() {

  }
});
