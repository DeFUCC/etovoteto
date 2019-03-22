const Card = Vue.component('wordcard', {
  template: '#wordcard',
  props: {
    word: {
      type: Object,
      default: {
        word: 'Несуществующее слово'
      }
    },
    status: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      open: {
        desc: false,
        author: false,
        authorDetails: false
      },
      currentState: 0,
      show:{}
    }
  },
  methods: {
    descOptions(id) {
      this.show[id]=true;
    }
  },
  mounted() {

  },
  computed: {
    parts() {
      let stress = this.word.stress - 1;
      let arr = [...this.word.word];
      let parts = [];
      parts[0] = arr.slice(0, stress).join('');
      parts[1] = arr.slice(stress, stress + 1).join('');
      parts[2] = arr.slice(stress + 1).join('');
      return parts
    }
  }
})


const AddWord = Vue.component('add', {
  template: '#add',
  props: {
    add: Object
  },
  data() {
    return {
      newStep: 0,
      author: {
        name: '',
        net: 'instagram',
        account: ''
      },
      valid: {
        word: false,
        desc: false,
        author: false
      },
      rules: {
        name: [
          v => !!v || 'Представьтесь, пожалуйста'
        ],
        account: [
          v => /[a-zA-Z0-9_.]*/.test(v) || 'Таких аккаунтов не бывает'
        ],
        desc: [
          v => v.length < 140 || 'Слишком длинное определение',
          v => v.length > 7 || 'Слишком короткое определение'
        ]
      },
      nets: [{
          name: 'instagram',
          url: 'https://instagram.com/'
        },
        {
          name: 'vk',
          url: 'https://vk.com/'
        },
        {
          name: 'facebook',
          url: 'https://facebook.com/'
        }
      ]
    }
  },
  methods: {
    create(wordObj, authorObj) {
      let {
        name,
        account,
        net
      } = authorObj;
      let authorId;
      console.log(authorObj)
      if (name) {
        client.createItem('authors', {
          name: name,
          status: 'draft',
          net: net,
          account: account
        }).then(
          data => {
            console.log(data)
            this.$emit('load', 10)
            authorId = data.data.id;
            this.createPair(wordObj, authorId)
          }
        ).catch(e => console.log(e));
      } else {
        this.createPair(wordObj);
      }

    },

    createPair(wordObj, authorId = null) {
      let {
        word,
        stress,
        desc
      } = wordObj;
      word = word[0].toUpperCase() + word.substring(1);
      let descId, wordId;

      let request = client.createItem('desc', {
        text: desc,
        author: authorId,
        status: 'draft'
      }).then(descData => {
        console.log('desc', descData);
        this.$emit('load', 30)

        descId = descData.data.id

        return client.createItem('words', {
          status: 'draft',
          word: word,
          author: authorId,
          stress: stress,
          primary_desc: descId,
        })
      }).then(wordData => {
        console.log('word', wordData)
        this.$emit('load', 60)
        wordId = wordData.data.id

        return client.createItem('words_desc', {
          words_id: wordId,
          desc_id: descId
        })
      }).then(linkData => {
        console.log('word-desc', linkData)
        this.$emit('added', word);
        this.$emit('load', undefined)
        return client.createItem('authors_desc', {
          authors_id: authorId,
          desc_id: descId
        })
      }).then(linkData => {
        console.log('authors-desc', linkData)

        return client.createItem('authors_words', {
          authors_id: authorId,
          words_id: wordId
        })
      }).then(linkData => {
        console.log('success!', linkData)
      })


    }
  },
  computed: {
    parts() {

      let stress = this.add.stress;
      let arr = this.add.word.split('');
      let parts = [];
      if (arr.length > 0) {
        arr[0] = arr[0].toUpperCase();
        parts[0] = arr.slice(0, stress).join('');

        parts[1] = arr.slice(stress, stress + 1).join('');

        parts[2] = arr.slice(stress + 1).join('');

      } else {
        parts = ['', '', '']
      }
      return parts
    },
    baseFilter() {
      let bases = []
      if (this.filter.draft) {

      }
    }
  },
  created() {

  }
});
