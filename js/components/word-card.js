import adder from '../components/adder.js'

export default {
  components:{
    adder
  },
  template: `
  <v-card :class="{'grey draft lighten-2':word.status=='draft'} ">

    <v-card-title>
      <h2 v-if="word" class="the-word">
        {{parts[0]}}{{parts[1]}}&#x301{{parts[2]}}
      </h2>

      <v-spacer></v-spacer>

      <v-menu v-if="word.author" v-model="open.author" nudge-bottom="16" top="top" left="left" transition="slide-x-transition" origin="right">

        <v-btn slot="activator" v-if="word.author.name!='Аноним'" small="small" icon="icon">
          <v-icon  color="grey">fa-user-circle</v-icon>
        </v-btn>

        <v-card width="280">
          <v-list class="grey">
            <v-list-tile>

              <v-list-tile-content>
                <v-list-tile-title>
                  <v-icon >fa-user-circle</v-icon>
                  {{word.author.name}}</v-list-tile-title>
                <v-list-tile-sub-title v-if="word.author.account">
                  <a target="_blank" :href="nets[word.author.net]+word.author.account"><v-icon >fab fa-{{word.author.net}}</v-icon>
                  {{word.author.account}}</a>
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon="icon" @click="open.author = false">
                  <v-icon>fa-times-circle</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>


        <v-btn :class="{'turn45':open.newDesc}" @click="open.newDesc=!open.newDesc" small icon><v-icon color="grey">fa-plus-circle</v-icon></v-btn>

      <v-btn color="grey lighten-3" :class="{'turn180':open.desc}" @click="open.desc=!open.desc" small="small" icon="icon">
        <v-icon color="grey">fa-angle-down</v-icon>
      </v-btn>

    </v-card-title>

    <v-slide-y-transition>
      <v-card-text v-if="word.descs" class="grey" :class="{'lighten-3':word.status=='published','lighten-1':word.status=='draft'}" v-show="open.desc">
      <v-layout column>
      <v-flex :key="desc.desc_id.id" v-for="desc in word.descs">
        <v-card :class="{'grey lighten-2':word.primary_desc && word.primary_desc.id!=desc.desc_id.id, 'draft':desc.desc_id.status!='published'}">
          <v-card-text>
          <v-layout row>
            <v-flex xs10>

             {{desc.desc_id.text}}

            </v-flex>

            <v-flex row text-xs-center xs2>
              <v-icon v-if="word.primary_desc && word.primary_desc.id==desc.desc_id.id" small>fa-dot-circle</v-icon>
              <v-menu  v-if="desc.desc_id.author" nudge-bottom="16" top="top" left="left" transition="slide-x-transition" origin="right">

              <v-btn slot="activator" v-if="desc.desc_id.author.name!='Аноним'" small="small" icon="icon">
                <v-icon  color="grey">fa-user-circle</v-icon>
              </v-btn>

              <v-card width="280">
                <v-list class="grey">
                  <v-list-tile>

                    <v-list-tile-content>
                      <v-list-tile-title>
                        <v-icon >fa-user-circle</v-icon>
                        {{desc.desc_id.author.name}}</v-list-tile-title>
                      <v-list-tile-sub-title v-if="desc.desc_id.author.account">
                        <v-icon >fab fa-{{desc.desc_id.author.net}}</v-icon>
                        {{desc.desc_id.author.account}}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-btn icon="icon" @click="open.author = false">
                        <v-icon>fa-times-circle</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-menu>
            </v-flex>
          </v-layout>
           </v-card-text>

        </v-card>
        </v-flex>
        </v-layout>
      </v-card-text>
    </v-slide-y-transition>

    <v-slide-y-transition>
      <adder v-show="open.newDesc" :add="word"
      @load="$emit('load',$event)" @descAdded="$emit('descAdded',$event);open.newDesc=false"></adder>
    </v-slide-y-transition>

  </v-card>
  `,
  props: ['word'],
  data() {
    return {
      open: {
        desc: false,
        author: false,
        authorDetails: false,
        newDesc: false
      },
      currentState: 0,
      nets: {
        instagram:'https://instagram.com/',
        vk:'https://vk.com/',
        facebook:'https://facebook.com/'
      },
      valid: {
        desc: false
      },

      show: {}
    }
  },
  methods: {
    descOptions(id) {
      this.show[id] = true;
    }
  },
  mounted() {

  },
  computed: {
    parts() {
      let stress = this.word.stress;
      let arr = [...this.word.word];
      let parts = [];
      parts[0] = arr.slice(0, stress).join('');
      parts[1] = arr.slice(stress, stress + 1).join('');
      parts[2] = arr.slice(stress + 1).join('');
      return parts
    }
  }
}
