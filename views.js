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




const WordsPage = Vue.component('words', {
  template:'#words',
  data() {
    return {
      title:'Words page',
      words:[],
      newWord:false,
      stress:0,
      newStep:1,
      valid:false,
      validDesc:true,
      add: {
        word: '',
        stress:0,
        desc:''
      },
      descRules: [
        v => v.length<140 || 'Слишком длинное определение',
        v => v.length>7 || 'Слишком короткое определение'
      ],
      wordRules:[
        v => /^[А-Яа-яёЁ]+$/.test(v) || 'Только русские буквы',
        v => (v || '').indexOf(' ') < 0 || 'Только одно слово, без пробелов'
      ],
    }
  },
  methods: {
    resetSearch() {
      this.add.stress=0;
      this.newStep=1;
      this.stress=0;
    },
    search(word) {
      this.resetSearch();

      client.getItems('words',{
        filter: {
          word: {
            contains: word
          }
        }
      }).then(data => {
        console.log('search')
        if(data.data.length==0) {
          this.newWord=true;
        } else {this.newWord=false}
        this.words=data.data
      }).catch(error => console.log(error));
    },
    getWords(limit=100) {
      client.getItems('words',{
        fields:'word,stress,primary_desc.text,author.*,author.avatar.*.*',
        sort:'?',
        limit:limit
      }).then(data => {
        console.log(data)
        this.words=data.data
      }).catch(error => console.log(error));

    }
  },
  computed: {
    parts() {
      let stress=this.add.stress-1;
      let arr = [...this.add.word];
      let parts=[];
      parts[0]=arr[0].toUpperCase() + arr.slice(1,stress).join('');
      parts[1]=arr.slice(stress,stress+1).join('');
      parts[2]=arr.slice(stress+1).join('');
      return parts
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
      descs:[]
    }
  },
  created() {
    client.getItems('desc',{
      fields:'id,text,author.name,author.link',
      limit:100
    }).then(data => {
      console.log(data)
      this.descs=data.data
    }).catch(error => console.log(error));
  }
})
