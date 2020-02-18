import client from '../client.js'

export default {
  template: `
  <v-flex>
  <v-flex v-if="newWord" ma-3="ma-3">
    <h3 >Такого слова ещё нет в нашем словаре. Давайте добавим!</h3>
  </v-flex>
    <v-expansion-panel v-model="newStep">
      <v-expansion-panel-content v-show="newWord">
        <div slot="header">
          Ударение
        </div>
        <div slot="actions">
          <v-icon>fa-angle-down</v-icon>
        </div>
        <v-card>
          <v-card-text>
          <v-btn-toggle v-model="add.stress">
            <v-btn @click="newStep=1;add.stress=index" v-for="(letter,index) in add.word" :key="index">{{letter}}</v-btn>
          </v-btn-toggle>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header">
          Определение
        </div>
        <div slot="actions">
          <v-icon>fa-angle-down</v-icon>
        </div>
        <v-card>
          <v-card-text>
          <h2 mb-2="mb-2" class="the-word">
            {{parts[0]}}{{parts[1]}}&#x301{{parts[2]}}
            &mdash; это
          </h2>
          <v-form @submit.prevent="" v-model="valid.desc">
            <v-textarea :rules="rules.desc" box="box" auto-grow="auto-grow" counter="140" hint="Что это слово могло бы обозначать?" v-model="add.desc"></v-textarea>

            <v-btn outline="outline" :disabled="!valid.desc" @click="newStep=3">Аноним</v-btn>
            <v-btn dark="dark" :disabled="!valid.desc" @click="newStep=2">Автор</v-btn>

          </v-form>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header">
          Автор
        </div>
        <div slot="actions">
          <v-icon>fa-angle-down</v-icon>
        </div>
        <v-card>
          <v-card-text>
            <v-form v-model="valid.author">
            <v-text-field outline="outline" counter="counter" hint="Имя и фамилия или псевдоним" :rules="rules.name" label="Имя" v-model="author.name"></v-text-field>
            <v-text-field outline="outline" counter="counter" hint="Ваш аккаунт в выбранной сети" :rules="rules.account" label="Аккаунт" v-model="author.account">
              <v-menu ma-0 slot="prepend-inner">
                <v-btn slot="activator" flat="flat" large="large" icon="icon">
                  <v-icon>fab fa-{{author.net}}</v-icon>&nbsp;
                  <v-icon>fa-angle-down</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile v-for="(net, index) in nets" :key="index" @click="author.net=net.name">
                    <v-list-tile-title>
                      <v-icon>fab fa-{{net.name}}</v-icon>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-text-field>
            <v-btn @click="newStep=3">Представиться</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header">
          Подтверждение
        </div>
        <div slot="actions">
          <v-icon>fa-angle-down</v-icon>
        </div>
        <v-card>
          <v-card-text>
          <v-layout>
            <v-flex>
              <v-card color="grey lighten-3">
                <v-card-title>
                  <div>
                    <h2 class="the-word">{{parts[0]}}{{parts[1]}}&#x301{{parts[2]}}

                    </h2>
                    <p>{{add.desc}}
                    </p>
                  </div>

                </v-card-title>
                <v-card-actions>
                  <v-icon>fa-account-circle</v-icon>
                  {{author.name || 'Аноним'}}</v-card-actions>

              </v-card>
            </v-flex>
          </v-layout>
          <small>Новые слова проходят модерацию 1—4 дня</small><br />
          <v-btn dark="dark" :disabled="!valid.desc" @click="newStep=5;send()">Отправить</v-btn>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-flex>
  `,
  props: {
    add: Object
  },
  data() {
    return {
      newWord: true,
      newStep: 0,
      data:{},
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
        word: [
            v => /^[А-Яа-яёЁ]*$/.test(v) || 'Только русские буквы',
            v => (v || '').indexOf(' ') < 0 || 'Только одно слово, без пробелов',
            v => (v || '').length<21 || 'Слишком длинное слово'
        ],
        name: [
          v => !!v || 'Представьтесь, пожалуйста'
        ],
        account: [
          v => /[a-zA-Z0-9_.]*/.test(v) || 'Таких аккаунтов не бывает'
        ],
        desc: [
          v => (v && v.length < 140) || 'Слишком длинное определение',
          v => (v && v.length > 7) || 'Слишком короткое определение'
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
        },
        {
          name: 'twitter',
          url: 'https://twitter.com/'
        }
      ]
    }
  },
  methods: {
    findAuthor() {
      let filter = {
      };
      if (!this.author.name) {
        filter.name={eq:'Аноним'}
      } else if (!this.author.account) {
        filter.name= {eq:this.author.name}
      } else {
        filter.net= {eq:this.author.net};
        filter.account= {eq:this.author.account}
      }
      console.log(filter)
      return client.getItems('authors', {filter})
    },
    createAuthor() {
      return client.createItem('authors', {
        name: this.author.name,
        status: 'draft',
        net: this.author.net,
        account: this.author.account
      })
    },
    createDesc() {
      return client.createItem('desc', {
        text: this.add.desc,
        author: this.data.authorId,
        primary_word: this.data.wordId,
        status: 'draft'
      })
    },
    addDescToWord() {
      return client.updateItem('words', this.data.wordId, {
        primary_desc: this.data.descId
      })
    },
    createWord() {
      let word = this.add.word[0].toUpperCase() + this.add.word.substring(1);
      return client.createItem('words', {
        status: 'draft',
        word: word,
        author: this.data.authorId,
        stress: this.add.stress,
        primary_desc: this.data.descId,
      })
    },
    createWordsDesc() {
      return client.createItem('words_desc', {
        words_id: this.data.wordId,
        desc_id: this.data.descId
      })
    },
    createAuthorsWords() {
      return client.createItem('authors_words', {
        authors_id: this.data.authorId,
        words_id: this.data.wordId
      })
    },
    createAuthorsDesc() {
      return client.createItem('authors_desc', {
        authors_id: this.data.authorId,
        desc_id: this.data.descId
      })
    },
    success() {
      if (this.data.added) {
        this.$emit('wordAdded', this.data.added);
      } else {
        this.$emit('descAdded',this.add.desc)
      }
      this.$emit('load', undefined);
      console.log('success');
    },
    send() {
      let data = {}
      console.log(this.add)
      let create;

      //Получаем автора (Аноним - тоже автор)
      let getAuthor = this.findAuthor()
        //Ищем и получаем список
          .then (authorList => {
            let response;
            //Если список не пустой — берем первое совпадение
            if (authorList.data.length>0) {
              this.data.authorId = authorList.data[0].id
              response = authorList.data[0];
            } else {
              //Иначе создаём нового автора
              response = this.createAuthor()
            }
            return response
          })
          .then(author => {
            //Записываем автора
            console.log(author)
            this.data.authorId=author.id || author.data.id
          })
          .catch(e=>{console.log(e)})


          // ЕСЛИ СЛОВО УЖЕ ЕСТЬ - вызов из карточки
        if (this.add.id) {
        //  Добавляем определение к имеющемуся слову
          this.data.wordId=this.add.id;
          create = getAuthor.then(() =>{
            return this.createDesc()
          })
            // Добавляем связь
            .then( desc => {
              this.$emit('load', 50)
              this.data.descId=desc.data.id;
              return this.createWordsDesc()
            })
            .then(() => {
              return this.createAuthorsDesc()
            })
            .catch(e=>console.log(e))
        }

        if (!this.add.id) {
          // Добавляем новое слово
          create = getAuthor.then(() => {
            return this.createWord()
          })
            //Добавляем новое определение
            .then( word => {
              this.data.added = this.add.word;
              this.$emit('load', 20);
              this.data.wordId = word.data.id;
              return this.createDesc()
            })
            //Добавляем связь
            .then( desc => {
              this.$emit('load', 40);
              this.data.descId = desc.data.id;
              return this.createWordsDesc()
            })
            //Добавляем определение к слову
            .then( link => {
              return this.addDescToWord()
            })
            .then( link => {
              return this.createAuthorsDesc()
            })
            .then( link => {
              return this.createAuthorsWords()
            })
            .catch(e=>console.log(e))
        }
        //Завершаем процесс
        create.then(this.success)
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
    }
  },
  created() {
    if (this.add.id) {
      this.newWord = false;
      this.newStep=1;
    }
  }
}
