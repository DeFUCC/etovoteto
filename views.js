const WordsPage = Vue.component('words', {
  template:'#words',
  props: ['user'],
  data() {
    return {
      added:false,
      modes:['words','descs'],
      mode:0,
      statuses:['published','draft'],
      status:0,
      limit:5,
      limits:[1,5,10,20,50,100],
      addedWord:'',
      addedDesc:'',
      title:'Words page',
      words:[],
      descs:[],
      loaded:false,
      loading:0,
      validWord:false,
      add: {
        word: '',
        stress:null,
        desc:''
      },
      wordRules: [
          v => /^[А-Яа-яёЁ]*$/.test(v) || 'Только русские буквы',
          v => (v || '').indexOf(' ') < 0 || 'Только одно слово, без пробелов',
          v => (v || '').length<21 || 'Слишком длинное слово'
      ]

    }
  },
  watch: {
    status() {
      this.search()
    }
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
    descAdded(desc) {
      this.added=true;
      this.addedDesc=desc;
    },
    approve(word) {
      console.log(word);
      let appWord = client.updateItem('words',word.id,{status:'published'})
      appWord.then(()=>{
        client.updateItem('desc',word.primary_desc.id,{status:'published'})
      }).then(()=>{console.log('approved!')})
    },
    search() {
      if (this.mode==0) {
        this.loaded=false;
        client.getItems('words',{
          fields:'id,word,stress,primary_desc.id,descs.desc_id.*,descs.desc_id.author.*,author.name, author.net, author.account,status',
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
          this.descs=[];
          this.loaded=true;
        }).catch(error => console.log(error));
      }

      if (this.mode==1) {
        this.loaded=false;
        client.getItems('desc',{
          fields:'*.*, words.words_id.*',
          status: this.statuses[this.status],
          limit:this.limit,
          sort:'?',
          filter: {
            text: {
              contains: this.add.word
            }
          }
        }).then(data => {
          this.descs=data.data
          this.words=[];
          this.loaded=true;
        }).catch(error => console.log(error));
      }
    },
    getWords() {
      this.loaded=false;
      client.getItems('words',{
        fields:'id,word,stress,primary_desc.id,descs.desc_id.*,descs.desc_id.author.*,author.name, author.net, author.account,status',
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
  props: ['user'],
  data() {
    return {
      added:false,
      statuses:['published','draft'],
      status:0,
      limit:5,
      limits:[1,5,10,20,50,100],
      addedWord:'',
      addedDesc:'',
      title:'Descs page',
      words:[],
      descs:[],
      loaded:false,
      loading:0,
      validDesc:false,
      add: {
        word: '',
        stress:null,
        desc:''
      },
      descRules: [
          v => /^[А-Яа-яёЁ]*$/.test(v) || 'Только русские буквы',
          v => (v || '').length<30 || 'Слишком длинный запрос'
      ]

    }
  },
  watch: {
    status() {
      this.searchDesc()
    }
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
    descAdded(desc) {
      this.added=true;
      this.addedDesc=desc;
    },
    searchDesc() {
      this.loaded=false;

      client.getItems('desc',{
        fields:'*.*,words.words_id.*,words.words_id.author.*',
        status: this.statuses[this.status],
        limit:this.limit,
        sort:'?',
        filter: {
          text: {
            contains: this.add.desc
          }
        }
      }).then(data => {
        this.descs=data.data
        this.loaded=true;
      }).catch(error => console.log(error));
    },

    getDescs() {
      this.loaded=false;
      client.getItems('desc',{
        fields:'*.*,words.words_id.*,words.words_id.author.*',
        status:this.statuses[this.status],
        sort:'?',
        limit:this.limit
      }).then(data => {
        this.descs=data.data;
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
    this.getDescs();
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
