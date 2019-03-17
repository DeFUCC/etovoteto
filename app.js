const client = new DirectusSDK({
  url:'http://etovoteto.ru/api/public',
  project:'_',
  persist:true,
  storage: window.localStorage
});


// ROUTER Config

const router = new VueRouter({
//  mode: 'history',
  routes:[
    {path:'/author', component:AuthorPage},
    {path:'/', component:WordsPage},
    {path:'/desc', component:DescPage}

  ]
})



// VUE APP

const thisApp = new Vue({
  el:'#app',
  router:router,
  data: {
    title:'ЭТОВОТЭТО',
  },
  methods: {

  },
  created() {

  }
});
