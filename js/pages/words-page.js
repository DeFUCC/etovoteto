import client from '../client.js'
import wordCard from '../components/word-card.js'
import adder from '../components/adder.js'

export default {
  components:{
    wordCard,
    adder
  },
  template:`
      <v-container grid-list-lg="grid-list-lg">

        <v-layout row="row" wrap="wrap">

        <v-flex xs12="xs12" sm6="sm6" offset-sm3="offset-sm3">
          <v-form @submit.prevent="" v-model="validWord">
            <v-text-field @input="search(add.word)"  :rules="wordRules" outline counter hint="Найдите слово в словаре или предложите новое понятие" label="Введите придуманное вами слово" v-model="add.word"></v-text-field>
          </v-form>

        </v-flex>

        <v-flex xs12="xs12" sm6="sm6" offset-sm3="offset-sm3">
          <v-toolbar dark flat="flat" color="grey darken-1">
            <v-spacer></v-spacer>

            <v-btn icon="icon" :class="{'fa-spin':!loaded}"  @click="search()" >
                <v-icon>fa-redo</v-icon>
              </v-btn>

            <v-menu bottom="bottom" offset-y="offset-y">
              <!-- Activator -->

              <v-btn large class="title" slot="activator" icon="icon">
                {{limit}}&nbsp;
                <v-icon>fa-angle-down</v-icon>
              </v-btn>

              <!-- List -->
              <v-list dense="dense">
                <v-list-tile v-for="(lim,i) in limits" :key="i" @click="limit=lim;search()">

                  <v-list-tile-title >
                    {{lim}}
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>


            <v-btn-toggle dark v-model="status">
              <v-btn icon="icon"  >
                  <v-icon>fa-book</v-icon>
                </v-btn>

              <v-btn icon="icon"   >
                  <v-icon>fa-inbox</v-icon>
                </v-btn>
            </v-btn-toggle>
            <v-btn icon="icon" @click="$emit('auth')">
              <v-icon>fa-sign-in-alt</v-icon>{{userName}}</v-btn>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-flex>

        <v-flex  v-if="status==1" xs12="xs12" sm6="sm6" offset-sm3="offset-sm3">


          <v-alert transition="slide-y-transition" icon="fa-inbox"  value="true"  outline="outline" color="error" class="draft">
            <h3>Осторожно, черновики!</h3>
            Это новые слова и понятия, ожидающие модерации. За их содержание редакция ответственности не несёт.
          </v-alert>

        </v-flex>

        <v-flex xs12 sm6 offset-sm3 >
          <v-progress-linear
              color="grey"
              v-model="loading"
              height="2"
              :indeterminate="!loaded"></v-progress-linear>
          </v-progress-linear>
        </v-flex>



        <v-flex v-if="words" xs12="xs12" sm6="sm6" offset-sm3="offset-sm3" v-for="word in words" v-bind:key="word.id">

          <word-card @load="loading=$event" @descAdded="descAdded($event)" :word="word"></word-card>

          <v-card v-if="word.status != 'published' && userName == 'Admin'">
            <v-card-actions>
              <v-btn icon @click="approve(word)">
                <v-icon>fa-check-double</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>

        </v-flex>

        <v-flex xs12="xs12" sm6 offset-sm3>

          <adder v-if="add.word && validWord && words.length==0" :add="add" @load="loading=$event" @wordAdded="wordAdded($event)" @descAdded="descAdded($event);"></adder>

        </v-flex>

        <v-snackbar vertical v-model="added" top color="grey" :timeout="6000">
          <span class="subheading" v-if="addedWord">Слово «{{addedWord}}» добавлено в черновики.</span>
          <span class="subheading" v-if="addedDesc">Определение «{{addedDesc}}» добавлено в черновики.</span>
          <v-btn dark="dark" flat="flat" @click="added = false">
            Close
          </v-btn>
        </v-snackbar>

      </v-layout>
    </v-container>
  `,
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
      }).then(()=>{
        console.log('approved!');
        this.search();
      })
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
}
