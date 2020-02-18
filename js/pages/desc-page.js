import client from '../client.js'
import descCard from '../components/desc-card.js'

export default {
  components: {
    descCard
  },
  template:`
      <v-container grid-list-lg="grid-list-lg">

        <v-layout row="row" wrap="wrap">

        <v-flex xs12="xs12" sm6="sm6" offset-sm3="offset-sm3">
          <v-form @submit.prevent="" v-model="validDesc">
            <v-text-field @input="searchDesc()"  :rules="descRules" outline counter hint="Найдите понятие в словаре или предложите новое" label="Несуществующее понятие" v-model="add.desc"></v-text-field>
          </v-form>

        </v-flex>

        <v-flex xs12="xs12" sm6="sm6" offset-sm3="offset-sm3">
          <v-toolbar dark flat="flat" color="grey darken-1">
            <v-spacer></v-spacer>

            <v-btn icon="icon" :class="{'fa-spin':!loaded}"  @click="searchDesc()" >
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
                <v-list-tile v-for="(lim,i) in limits" :key="i" @click="limit=lim;searchDesc()">

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



        <v-flex v-if="descs" xs12="xs12" sm6="sm6" offset-sm3="offset-sm3" v-for="desc in descs" v-bind:key="desc.id">

        <desc-card @load="loading=$event" @wordAdded="wordAdded($event)" :desc="desc"></desc-card>

        </v-flex>

        <v-flex xs12="xs12" sm6 offset-sm3>

          <this-add v-if="add.word && validWord && words.length==0" :add="add" @load="loading=$event" @wordAdded="wordAdded($event)" @descAdded="descAdded($event);"></this-add>

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
}
