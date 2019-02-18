<template>
  <div id="app">
    <q-layout>
      <!-- HEADER Y TOOLBAR -->
      <q-header :bordered="true" :elevated="true" :reveal="true">
        <q-toolbar>
          <q-btn @click="menu.left = !menu.left" dense flat icon="menu" round/>
          <q-toolbar-title>
            <strong>CRC</strong> Reale
          </q-toolbar-title>
          <q-space/>
          <q-btn :label="lang" color="secondary" size="sm" text-color="primary">
            <q-menu>
              <q-list dense>
                <q-item @click="lang='ca'" clickable v-close-menu>
                  <q-item-section>CATALÀ</q-item-section>
                </q-item>
                <q-item @click="lang='es'" clickable v-close-menu>
                  <q-item-section>ESPAÑOL</q-item-section>
                </q-item>
                <q-separator/>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn @click="sendBug" dense flat icon="bug_report" round/>
          <q-btn @click="menuUser" dense flat icon="person" round/>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <!-- DIALOGO USUARIO -->
        <div class="justify-around">
          <q-dialog v-model="user.dialog">
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar color="primary" icon="person" text-color="white"/>
                <span class="q-ml-sm text-h4">{{$q.lang.InicioSesion}}</span>
              </q-card-section>
              <q-card-section class="row items-center">
                <div class="row q-col-gutter-x-2 q-col-gutter-y-sm">
                  <div class="col-12">
                    <q-input :label="$q.lang.Usuario" type="text" v-model="user.user">
                      <q-icon name="person" slot="prepend"/>
                      <q-icon @click="user.user = ''" class="cursor-pointer" name="close" slot="append"/>
                    </q-input>
                  </div>
                  <div class="col-12">
                    <q-input :label="$q.lang.Clave" :type="user.passShow ? 'text' : 'password'" @keyup.enter="login " v-model="user.pass">
                      <q-icon name="lock" slot="prepend"/>
                      <q-icon @click="user.pass = ''" class="cursor-pointer" name="close" slot="append"/>
                      <q-icon :name="user.passShow ? 'visibility' : 'visibility_off'" @click="user.passShow=!user.passShow" class="cursor-pointer" slot="append"/>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn :label="$q.lang.label.cancel" @click="user.dialog=false" color="negative" flat/>
                <q-btn :label="$q.lang.label.ok" @click="login" color="primary" flat/>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <!-- MENU LEFT -->
        <q-drawer :bordered="true" :elevated="true" :overlay="true" side="left" v-model="menu.left">
          <q-btn class="full-width" flat icon="home" inline to="/"></q-btn>
          <q-list :separator="true" bordered>
            <q-item :key="i" :to="option.to" clickable v-for="(option,i) in menu.leftList" v-ripple>
              <q-item-section avatar>
                <q-icon :name="option.icon" color="primary"/>
              </q-item-section>
              <q-item-section>{{$q.lang.menu[option.name]}}</q-item-section>
            </q-item>
          </q-list>
        </q-drawer>
        <!-- MENU RIGHT -->
        <q-drawer :bordered="true" :elevated="true" :overlay="true" side="right" v-model="menu.right">
          <div class="row text-center">
            <div class="col">
              <q-chip :label="user.name" color="primary" icon="person" outline square text-color="white"/>
            </div>
          </div>
          <div class="row text-center">
            <div class="col">
              <q-chip :label="user.mail" color="primary" icon="email" outline square text-color="white"/>
            </div>
          </div>
          <div class="row text-center">
            <div class="col">
              <q-btn @click="logout" class="q-mt-md" color="secondary">{{$q.lang.CerrarSesion}}</q-btn>
            </div>
          </div>
        </q-drawer>
        <!-- ROUTER VIEW -->
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
          <router-view/>
        </transition>
      </q-page-container>
    </q-layout>
  </div>
</template>
<script>
import Custom from "./mixins";
export default {
  mixins: [Custom],
  data() {
    return {
      menu: {
        left: false,
        right: false,
        leftList: [
          {
            icon: "euro_symbol",
            name: this.$q.lang.menu.Recibos,
            to: "/recibos/gestion"
          },
          {
            icon: "timeline",
            name: this.$q.lang.menu.Polizas,
            to: "/polizas/altas"
          },
          {
            icon: "contacts",
            name: this.$q.lang.menu.Clientes,
            to: "/clientes"
          },
          {
            icon: "healing",
            name: this.$q.lang.menu.Siniestros,
            to: "/recibos"
          },
          {
            icon: "person",
            name: this.$q.lang.menu.Usuarios,
            to: "/usuarios"
          },
          {
            icon: "person",
            name: this.$q.lang.menu.Registros,
            to: "/registros"
          }
        ]
      },
      user: {
        user: null,
        pass: null,
        name: null,
        mail: null,
        passShow: false,
        dialog: false
      }
    };
  },
  methods: {
    login() {
      let self = this;
      this.callData({cmd: "login", user: self.user.user, pass: self.user.pass})
        .then(function(response) {
          if (response.success) {
            localStorage.sid = response.sid;
            localStorage.mail = response.info.data.email;
            localStorage.username = response.info.data.fullname;
            self.$q.notify({
              message: self.$q.lang.Bienvenido + " " + response.info.data.fullname,
              icon: "check",
              color: "positive"
            });
          } else {
            //this.logout();
            self.$q.notify({
              message: self.$q.lang.UsuarioClaveIncorrecta,
              icon: "close",
              color: "negative"
            });
            self.logout();
          }
        })
        .catch(function(response) {
          self.$q.notify({
            message: self.$q.lang.ErrorRed,
            color: "negative"
          });
        });
      this.user.dialog = false;
    },
    logout() {
      let self = this;
      this.callData({cmd: "logout"});
      localStorage.removeItem("sid");
      localStorage.removeItem("mail");
      localStorage.removeItem("username");
      self.user.name = localStorage.username;
      self.user.mail = localStorage.mail;
      this.menu.left = false;
      this.menu.right = false;
    },
    checkUser() {
      let self = this;
      this.callData({cmd: "checkUser"})
        .then(function(response) {
          if (response.success) {
            self.user.name = localStorage.username;
            self.user.mail = localStorage.mail;
          } else {
            self.logout();
          }
        })
    },
    menuUser() {
      if (localStorage.sid) {
        this.menu.right = !this.menu.right;
      } else {
        this.user.dialog = true;
      }
    },
    sendBug() {
      window.open("https://github.com/natxocc/CRC/issues", "_system");
    }
  },
  beforeMount() {
    if (localStorage.sid) this.checkUser();
    localStorage.url = "http://servidor/crc/php/post.php";
    if (window.location.hostname != "localhost") localStorage.url = "http://" + window.location.hostname + "/crc/php/post.php";
  },
  created() {}
};
</script>