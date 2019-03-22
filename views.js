const WordsPage = Vue.component('words', {
  template:'#words',
  props: ['user'],
  data() {
    return {
      added:false,
      statuses:['published','draft'],
      status:0,
      limit:5,
      limits:[1,5,10,20,50,100],
      addedWord:'',
      title:'Words page',
      words:[],
      loaded:false,
      loading:0,
      validWord:false,
      add: {
        word: '',
        stress:0,
        desc:''
      },
      wordRules: [
          v => /^[А-Яа-яёЁ]*$/.test(v) || 'Только русские буквы',
          v => (v || '').indexOf(' ') < 0 || 'Только одно слово, без пробелов'
      ]

    }
  },
  watch: {
    status() {() => {
      console.log('wow!')
      this.getWords()
    }}
  },
  methods: {
    clearWord() {
      this.add.word='';
      this.add.stress=0;
      this.add.desc=''

    },
    wordAdded(word) {
      this.added=true;
      this.addedWord=word;
      this.add.word='';
      this.getWords();
    },
    search() {
      this.loaded=false;

      client.getItems('words',{
        fields:'word,stress,primary_desc.id,descs.desc_id.*,author.name, author.net, author.account,status',
        status: this.statuses[this.status],
        limit:this.limit,
        sort:'?',
        filter: {
          word: {
            contains: this.add.word
          }
        }
      }).then(data => {
        this.words=data.data
        this.loaded=true;
      }).catch(error => console.log(error));
    },

    getWords() {
      this.loaded=false;
      client.getItems('words',{
        fields:'word,stress,primary_desc.id,descs.desc_id.*,author.name, author.net, author.account,status',
        status:this.statuses[this.status],
        sort:'?',
        limit:this.limit
      }).then(data => {
        this.words=data.data;
        this.loaded=true;
      }).catch(error => console.log(error));

    }
  },
  computed: {
    userName() {
      if(this.user && this.user.data && this.user.data.first_name) {
        return this.user.data.first_name
      }
    }
  },
  created() {
    this.getWords();
  }
})





const DescPage = Vue.component('descs', {
  template:'#descs',
  data() {
    return {
      title:'Descriptions page',
      limit:10,
      descs:[]
    }
  },
  created() {
    client.getItems('desc',{
      fields:'id,text,author.name,author.account,author.net',
      limit:this.limit
    }).then(data => {
      console.log(data)
      this.descs=data.data
    }).catch(error => console.log(error));
  }
})

// ROUTES Components

const AuthorPage = Vue.component('author', {
  template:'#author',
  data() {
    return {
      title:'Authors page',
      me:null,
      valid:false,
      showPassword:false,
      register:false,
      nets: [
        {name:'instagram', url:'https://instagram.com/'},
        {name:'vk', url:'https://vk.com/'},
        {name:'facebook', url:'https://facebook.com/'}
      ],
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
        net:'instagram',
        account:'',
        email:'',
        password:''
      }
    }
  },
  computed: {

  },
  methods: {
    login(user) {
      client.login({
        email:user.email,
        password:user.password
      }).then(
        data => client.getMe().then(me => this.me=me)
      ).catch(error => console.log(error))

    }
  },
  created() {
    console.log(client.loggedIn);
    client.getMe().then(me=>console.log(me)).catch(e=>console.log(e));

  }
})
