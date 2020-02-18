export default {
  template:`
  <v-container grid-list-lg="grid-list-lg">
    <v-layout row="row" wrap="wrap">
      <v-flex xs12="xs12" sm6="sm6" offset-sm3="offset-sm3">

        <h1 v-if="me">Я ЗДЕСЬ!</h1>
        {{me}}
        <p>
          Этот раздел доступен только авторам. Но автором может стать каждый! Достаточно представиться и войти.
        </p>
      </v-flex>
      <v-flex xs12="xs12" sm6="sm6" offset-sm3="offset-sm3">
        <v-form v-model="valid">
          <v-text-field autofocus="autofocus" outline="outline" counter="counter" hint="" :rules="rules.email" validate-on-blur="validate-on-blur" browser-autocomplete="browser-autocomplete" label="Эл. почта" v-model="user.email"></v-text-field>
          <v-text-field
            browser-autocomplete="browser-autocomplete"
            outline="outline"
            counter="counter"
            hint=""
            :rules="rules.password"
            validate-on-blur="validate-on-blur"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'visibility' : 'visibility_off'"
            @click:append="showPassword = !showPassword"
            label="Пароль"
            v-model="user.password"></v-text-field>

          <v-flex v-if="!register" text-xs-center="text-xs-center">
            <v-btn dark="dark" @click="register=true">Представиться</v-btn>
            <v-btn outline="outline" :disabled="!valid" @click="login(user)">Войти</v-btn>
          </v-flex>

          <v-text-field v-if="register" outline="outline" counter="counter" hint="Имя и фамилия или псевдоним" :rules="rules.name" label="Имя" v-model="user.name"></v-text-field>

          <v-text-field v-if="register" outline="outline" counter="counter" hint="Ваш аккаунт в выбранной сети" :rules="rules.account" label="Аккаунт" v-model="user.account">

            <v-menu slot="prepend-inner">
              <v-btn slot="activator" flat="flat" large="large" icon="icon">
                <v-icon>fab fa-{{user.net}}</v-icon>
                <v-icon>fa-angle-down</v-icon>
              </v-btn>

              <v-list>
                <v-list-tile v-for="(net, index) in nets" :key="index" @click="user.net=net.name">
                  <v-list-tile-title>
                    <v-icon>fab fa-{{net.name}}</v-icon>
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>

          </v-text-field>

          <v-flex v-if="register" text-xs-center="text-xs-center">
            <v-btn @click="register(user)" raised="raised" :disabled="!valid">Представиться</v-btn>
          </v-flex>

        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
  `,
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
}
