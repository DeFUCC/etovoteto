export default {
  template: `
  <v-card :class="{'grey draft lighten-2':desc.status=='draft'}">

    <v-card-title>
      <div class="subheading">
        {{desc.text}}
      </div>

      <v-spacer></v-spacer>

      <v-menu v-if="desc.author" v-model="open.author" nudge-bottom="16" top="top" left="left" transition="slide-x-transition" origin="right">

        <v-btn slot="activator" v-if="desc.author.name!='Аноним'" small="small" icon="icon">
          <v-icon  color="grey">fa-user-circle</v-icon>
        </v-btn>

        <v-card width="280">
          <v-list class="grey">
            <v-list-tile>

              <v-list-tile-content>
                <v-list-tile-title>
                  <v-icon >fa-user-circle</v-icon>
                  {{desc.author.name}}</v-list-tile-title>
                <v-list-tile-sub-title v-if="desc.author.account">
                  <v-icon >fab fa-{{desc.author.net}}</v-icon>
                  {{desc.author.account}}
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

      <v-btn color="grey lighten-3" :class="{'turn180':open.desc}" @click="open.desc=!open.desc" small="small" icon="icon">
        <v-icon color="grey">fa-angle-down</v-icon>
      </v-btn>

    </v-card-title>

    <v-slide-y-transition>
      <v-card-text v-if="desc.words" class="grey" :class="{'lighten-3':desc.status=='published','lighten-1':desc.status=='draft'}" v-show="open.desc">
      <v-layout column>
      <v-flex :key="word.words_id.id" v-for="word in desc.words">
        <v-card :class="{'draft':word.words_id && word.words_id.status != 'published'}">

              <v-card-text>
              <v-layout row>
                <v-flex xs10>
                  <h2 v-if="word.words_id.word" class="the-word">
                    {{getParts(word)[0]}}{{getParts(word)[1]}}&#x301{{getParts(word)[2]}}
                  </h2>
                </v-flex>
                <v-flex row text-xs-center xs2>
                  <v-icon v-if="desc.primary_word && desc.primary_word.id==word.words_id.id" small>fa-dot-circle</v-icon>
                  <v-menu  v-if="word.words_id.author" nudge-bottom="16" top="top" left="left" transition="slide-x-transition" origin="right">

                  <v-btn slot="activator" v-if="word.words_id.author.name!='Аноним'" small="small" icon="icon">
                    <v-icon  color="grey">fa-user-circle</v-icon>
                  </v-btn>

                  <v-card width="280">
                    <v-list class="grey">
                      <v-list-tile>

                        <v-list-tile-content>
                          <v-list-tile-title>
                            <v-icon >fa-user-circle</v-icon>
                            {{word.words_id.author.name}}</v-list-tile-title>
                          <v-list-tile-sub-title v-if="word.words_id.author.account">
                            <v-icon >fab fa-{{word.words_id.author.net}}</v-icon>
                            {{word.words_id.author.account}}
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


  </v-card>
  `,
  props: ['desc'],
  data() {
    return {
      open: {
        desc: false,
        author: false,
        authorDetails: false,
        newWord: false
      },
      currentState: 0,
      valid: {
        desc: false
      },

      show: {}
    }
  },
  methods: {
    getParts(word) {
      let parts = [];
      if (word.words_id) {
        let stress = word.words_id.stress;
        let arr = [...word.words_id.word];

        parts[0] = arr.slice(0, stress).join('');
        parts[1] = arr.slice(stress, stress + 1).join('');
        parts[2] = arr.slice(stress + 1).join('');
      }
      return parts
    }
  },
  mounted() {

  },
  computed: {

  }
}
