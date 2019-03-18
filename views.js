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
      validAuthor:false,
      add: {
        word: '',
        stress:0,
        desc:''
      },
      author: {
        name:'',
        net:'instagram',
        account:''
      },
      rules: {
        name: [
          v => !!v || 'Представьтесь, пожалуйста'
        ],
        account: [
          v => /[a-zA-Z0-9_.]*/.test(v) || 'Таких аккаунтов не бывает'
        ],
        desc: [
          v => v.length<140 || 'Слишком длинное определение',
          v => v.length>7 || 'Слишком короткое определение'
        ],
        word: [
          v => /^[А-Яа-яёЁ]*$/.test(v) || 'Только русские буквы',
          v => (v || '').indexOf(' ') < 0 || 'Только одно слово, без пробелов'
        ]
      },
      nets: [
        {name:'instagram', url:'https://instagram.com/'},
        {name:'vk', url:'https://vk.com/'},
        {name:'facebook', url:'https://facebook.com/'}
      ],
    }
  },
  methods: {
    resetSearch() {
      this.add.stress=0;
      this.newStep=1;
      this.stress=0;
    },
    search(word, limit=30) {
      this.resetSearch();

      client.getItems('words',{
        status: 'published',
        limit:limit,
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

    create(wordObj,authorObj) {
      let {name,account,net} = authorObj;
      let authorId;
      console.log(authorObj)
      if (name) {
        client.createItem('authors',{
          name:name,
          status:'draft',
          net:net,
          account:account
        }).then(
          data => {
            console.log(data)
            authorId=data.data.id;
            this.createPair(wordObj,authorId)
          }
        ).catch(e=>console.log(e));
      } else {
        this.createPair(wordObj);
      }

    },
    createPair(wordObj,authorId=null) {
      let {word,stress,desc} = wordObj;
      word = word[0].toUpperCase() + word.substring(1);
      let descId, wordId;

      let request = client.createItem('desc', {
        text:desc,
        author:authorId,
        status:'draft'
      }).then(descData => {
          console.log('desc',descData);
          descId=descData.data.id

          return client.createItem('words',{
            status: 'draft',
            word: word,
            author:authorId,
            stress: stress,
            primary_desc:descId,
          })
      }).then(wordData => {
          console.log('word',wordData)
          wordId=wordData.data.id

          return client.createItem('words_desc', {
            words_id:wordId,
            desc_id:descId
          })
      }).then(linkData => {
            console.log('word-desc',linkData)

            return client.createItem('authors_desc', {
              authors_id:authorId,
              desc_id:descId
            })
      }).then(linkData => {
            console.log('authors-desc',linkData)

            return client.createItem('authors_words', {
              authors_id:authorId,
              words_id:wordId
            })
      }).then(linkData => {
        console.log('success!',linkData)
      })


    },


    getWords(limit=100) {
      client.getItems('words',{
        fields:'word,stress,primary_desc.text,author.name, author.net, author.account',
        status:'published',
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
      if (!this.add.word) {this.add.word=''}
      let stress=this.add.stress-1;
      let arr = this.add.word.split('');
      let parts=[];
      if (arr.length>0) {
        arr[0] = arr[0].toUpperCase();
        parts[0]=arr.slice(0,stress).join('');

        parts[1]=arr.slice(stress,stress+1).join('');

        parts[2]=arr.slice(stress+1).join('');

      } else {
        parts=['','','']
      }
      return parts
    },
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
      fields:'id,text,author.name,author.account,author.net',
      limit:100
    }).then(data => {
      console.log(data)
      this.descs=data.data
    }).catch(error => console.log(error));
  }
})
