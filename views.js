// ROUTES Components

const AuthorPage = Vue.component('author', {
  template:'#author',
  data() {
    return {
      title:'Authors page',
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
  }
})




const WordsPage = Vue.component('words', {
  template:'#words',
  data() {
    return {
      title:'Words page',
      words:[],
      add: {
        word: '',
        stress:'',
        desc:''
      },

      rules:[
        v => (v || '').indexOf(' ') < 0 ||
              'Только одно слово, без пробелов'
      ],
    }
  },
  methods: {
    search(word) {
      client.getItems('words',{
        filter: {
          word: {
            contains: word
          }
        }
      }).then(data => {
        console.log(data)
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
  created() {
    this.getWords();
  }
})


const AddWordPage = Vue.component('addword', {
  template:'#addword',
  data() {
    return {
      title:'Add word page',
      words:[],
      addWord: {
        title: '',
        stress:'',
        desc:''
      }
    }
  },
  methods: {
    getWords(limit=100) {
      client.getItems('words',{
        fields:'word,stress,primary_desc.text,author.name,author.link',
        sort:'?',
        limit:limit
      }).then(data => {
        console.log(data)
        this.words=data.data
      }).catch(error => console.log(error));
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
