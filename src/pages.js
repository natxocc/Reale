const Main = {
  name: "Main",
  mixins: [mixins],
  template: 
`
    <div>
      <!-- MENU IZQUIERDA -->
      <v-navigation-drawer v-model="menu.left" fixed app disable-resize-watcher>
        <template>
          <v-card>
            <v-card-actions>
              <v-btn flat color="primary" to="/">Agencia Reale Valls</v-btn>
            </v-card-actions>
          </v-card>
        </template>
        <template>
          <v-expansion-panel>
            <v-expansion-panel-content
              v-for="(option,i) in menu.options"
              :key="i"
            >
              <div slot="header">
                <v-icon>{{ option.icon }}</v-icon>
                {{ option.name }}
              </div>
              <v-list>
                <v-list-tile
                  v-for="(sub,i) in option.subs"
                  :to="sub.to"
                  :key="i"
                >
                  <v-list-tile-action></v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ sub.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </template>
      </v-navigation-drawer>
      <!-- TOOLBAR -->
      <v-toolbar
        color="primary"
        dark
        fixed
        app
        :scroll-threshold="200"
        scroll-off-screen
      >
        <v-toolbar-side-icon
          @click.stop="menu.left = !menu.left"
          color="secondary"
          flat
        ></v-toolbar-side-icon>
        <v-toolbar-title>CRC Reale Valls</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- BOTON USUARIO -->
        <div v-if="user.logged">
          <v-menu bottom origin="top right" transition="scale-transition">
            <v-btn flat icon slot="activator" color="secondary">
              <v-icon>person</v-icon>
            </v-btn>
            <v-layout align-baseline class="pa-2" style="background: white">
              <v-flex text-xs-center>
                <v-list>
                  <v-btn block @click="user.logged=false">Cerrar Sesion</v-btn>
                </v-list>
                <v-list>
                  <v-btn block @click="user.logged=false">Mis archivos</v-btn>
                </v-list>
              </v-flex>
            </v-layout>
          </v-menu>
        </div>
        <div v-else>
          <v-btn flat icon @click="user.dialog=true" color="red">
            <v-icon>person</v-icon>
          </v-btn>
        </div>
      </v-toolbar>
      <!-- DIALOGO CONEXION USUARIO -->
      <v-dialog v-model="user.dialog" @keydown.esc="user.dialog=false">
        <v-card>
          <v-card-title class="headline secondary" primary-title
            >Inicio de sesión</v-card-title
          >
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="user.name"
                clearable
                label="Usuario"
                required
              ></v-text-field>
              <v-text-field
                v-model="user.pass"
                clearable
                label="Contraseña"
                required
                type="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="user.dialog=false; user.logged=!user.logged"
              >Aceptar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- CONTENIDO Y ROUTER -->
      <v-content>
        <v-container fluid fill-height>
          <v-layout justify-center align-center>
            <v-flex text-xs-center>
              <v-btn flat @click="getLang('ca')">ca</v-btn>
              <v-btn flat @click="getLang('es')">es</v-btn>
              <router-view></router-view>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <!-- DATEPICKER -->
      <v-flex xs12 sm6 class="my-3">
        <v-date-picker
          v-model="picker"
          :first-day-of-week="0"
          :locale="setLang"
        ></v-date-picker>
      </v-flex>
      <!-- BOTON VOLVER A INICIO -->
      <v-fab-transition>
        <v-btn
          v-scroll="onScroll"
          v-show="gotop"
          :style="{bottom: $vuetify.breakpoint.smOnly ? '64px' : '' }"
          fab
          dark
          fixed
          bottom
          right
          color="red"
          @click="toTop"
        >
          <v-icon>keyboard_arrow_up</v-icon>
        </v-btn>
      </v-fab-transition>
      <!-- PIE DE PAGINA -->
      <v-footer app color="primary" dark>
        <span class="white--text"
          >&copy; Ntx Software v0.1 {{ menu.leftList }}</span
        >
      </v-footer>
    </div>
  `,
  data() {
    return {
      tt: null,
      picker: new Date().toISOString().substr(0, 10),
      gotop: false,
      menu: {
        left: false,
        right: false,
        leftList: null
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
    onScroll() {
      // if (typeof window === "undefined") return;
      const top = window.pageYOffset || document.documentElement.offsetTop || 0;
      this.gotop = top > 200;
    },
    toTop() {
      this.$router.push({ hash: "" });
      this.$vuetify.goTo(0);
    },
    login() {
      let self = this;
      this.callData({
        cmd: "login",
        user: self.user.user,
        pass: self.user.pass
      })
        .then(function(response) {
          if (response.success) {
            localStorage.sid = response.sid;
            localStorage.mail = response.info.data.email;
            localStorage.username = response.info.data.fullname;
          } else {
            self.logout();
          }
        })
        .catch(function(response) {});
      this.user.dialog = false;
    },
    logout() {
      let self = this;
      this.callData({ cmd: "logout" });
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
      this.callData({ cmd: "checkUser" }).then(function(response) {
        if (response.success) {
          self.user.name = localStorage.username;
          self.user.mail = localStorage.mail;
        } else {
          self.logout();
        }
      });
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
    this.getLang(localStorage.lang);
    this.menu.leftList = [
      {
        icon: "euro_symbol",
        name: this.lang.menu.Recibos,
        to: "/recibos/gestion"
      },
      {
        icon: "timeline",
        name: this.lang.menu.Polizas,
        to: "/polizas/altas"
      },
      {
        icon: "contacts",
        name: this.lang.menu.Clientes,
        to: "/clientes"
      },
      {
        icon: "healing",
        name: this.lang.menu.Siniestros,
        to: "/recibos"
      },
      {
        icon: "person",
        name: this.lang.menu.Usuarios,
        to: "/usuarios"
      },
      {
        icon: "person",
        name: this.lang.menu.Registros,
        to: "/registros"
      }
    ];
    // this.$lang = this.$loc["ca"];
    // console.log(this.$lang[tt]);
    // console.log(this.$vuetify.t(this.$lang));
    if (localStorage.sid) this.checkUser();
    localStorage.url = "http://servidor/lib/php/post.php";
  },
  created() {}
};
const Home = {
  name: "home",
  template: `<div>
  <button></button>
</div>`
};
const Recibos = {
  name: "Recibos",
  template: `
  <div class="container">
    <!-- TABS -->
 <q-tabs active-bg-color="primary" active-color="white" class="bg-secondary text-primary" dense indicator-color="transparent" inline-label top-indicator v-model="myRoute">
      <q-route-tab :label="$lang.Gestion" icon="assignment_turned_in" name="gestion" to="/recibos/gestion"/>
      <q-route-tab :label="$lang.BajasPendientes" icon="assignment_returned" name="bajas" to="/recibos/bajas"/>
      <q-route-tab :label="$lang.Liquidacion" icon="credit_card" name="liq" to="/recibos/liq"/>
      <q-tab :label="calculos.importe" class="text-primary" disabled icon="euro_symbol"/>
    </q-tabs>
    <!-- SELECT FILTERS TOTALS-->
    <div>
      <div class="row text-center">
        <div class="col-xs-12 col-md-4" style="padding: 10px">
          <q-input :label="$lang.FiltroRapido" dense type="text" v-model="quickFilter">
            <q-icon name="filter_list" slot="prepend"/>
            <q-icon @click="quickFilter = ''" class="cursor-pointer" name="close" slot="append"/>
          </q-input>
        </div>
        <!-- FILTER ONLY GESTION -->
        <template v-if="this.$route.params.recibo=='gestion'">
          <div class="col-xs-12 col-md-4" style="padding: 10px">
            <q-select :label="$lang.FiltrosDeEstado" :options="this.$lang.estados" @input="callDataGestion" dense expandBesides multiple optionsDense v-model="filter.estadosSel"/>
          </div>
          <div class="col-xs-6 col-md-2" style="padding: 10px">
            <q-select :label="$lang.HistorialUsuario" :options="this.$lang.userby" @input="callDataGestion" dense expandBesides optionsDense v-model="filter.userby"/>
          </div>
          <div class="col-xs-6 col-md-2" style="padding: 10px">
            <q-toggle :label="$lang.TodosLosRegistros" @input="callDataGestion" dense v-model="filter.alldata">
              <q-tooltip anchor="top middle" self="bottom middle">{{$lang.TodosLosRegistrosT}}</q-tooltip>
            </q-toggle>
          </div>
        </template>
        <!-- FILTER ONLY BAJAS -->
        <template v-else-if="this.$route.params.recibo=='bajas'">
          <div class="col-xs-12 col-md-4" style="padding: 10px">
            <q-select :label="$lang.ano" :options="filter.years" @input="callDataBajas" dense expandBesides optionsDense v-model="filter.year"/>
          </div>
          <div class="col-xs-12 col-md-4" style="padding: 10px">
            <q-select :label="$lang.mes" :options="filter.months" @input="callDataBajas" dense expandBesides optionsDense v-model="filter.month"/>
          </div>
        </template>
        <!-- FILTER ONLY LIQ & CAJA -->
        <template v-else-if="this.$route.params.recibo=='liq'">
          <div class="col-xs-12 col-md-4" style="padding: 10px">
            <q-select :label="$lang.ano" :options="filter.years" @input="callDataLiq" dense expandBesides optionsDense v-model="filter.year"/>
          </div>
          <div class="col-xs-12 col-md-4" style="padding: 10px">
            <q-select :label="$lang.semana" :options="filter.weeks" @input="callDataLiq" dense expandBesides optionsDense v-model="filter.week"/>
          </div>
        </template>
      </div>
      <!-- MINI TOOLBAR-->
      <q-bar class="bg-primary text-white">
        <q-btn @click="dialogModel=true" dense flat icon="add" v-if="!recibo.selected && !recibo.selectedSub">{{$lang.NuevoRecibo}}</q-btn>
        <q-btn @click="dialogModel=true" dense flat icon="add" v-if="recibo.selected">{{$lang.NuevaGestion}}</q-btn>
        <q-btn @click="dialogModel=true" dense flat icon="edit" v-if="recibo.selectedSub">{{$lang.EditarGestion}}</q-btn>
        <q-btn @click="onDelete" color="warning" dense flat icon="delete" v-if="recibo.selected">{{$lang.EliminarRecibo}}</q-btn>
        <q-btn @click="onDelete" color="warning" dense flat icon="delete" v-if="recibo.selectedSub">{{$lang.EliminarGestion}}</q-btn>
        <q-space/>
        <!-- COLORS HELP -->
        <div>
          <q-btn color="primary" icon="help_outline" size="sm">
            <q-popup-proxy>
              <q-list dense>
                <q-item :key="key" :style="{'background-color': helpColors[key]}" v-for="(value, key) in $lang.ayuda">
                  <q-item-section>
                    <q-item-label>{{value}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-popup-proxy>
          </q-btn>
        </div>
      </q-bar>
    </div>
    <!-- TABLA DE DATOS -->
    <!-- <n-tables :columnDefs="columnDefs" :columnDefsSub="columnDefsSub" :filters="filters" :masterDetail="true" :quickFilter="quickFilter" :rowClassRules="rowClassRules" :rowData="rowData" @gridData="gridData" @rowSelected="rowSelected" @rowSelectedSub="rowSelectedSub"/> -->
    <!-- DIALOGO -->
    <!-- <n-dialog :data="dialogData" :fields="dialogFields" :model="dialogModel" @cancel="dialogModel=false" @onChange="onChange" @onSave="onSave"></n-dialog> -->
  </div>

  `,
  components: {
    NTables
    // NDialog
  },
  mixins: [mixins],
  data() {
    return {
      filters: null,
      filter: {
        userby: {
          value: "NombreTomador",
          label: this.$lang.userby[0].label
        },
        estadosSel: [
          {
            value: "PENDIENTE",
            label: this.$lang.estados[0].label
          },
          {
            value: "DEVUELTO",
            label: this.$lang.estados[1].label
          }
        ],
        alldata: false,
        years: [],
        weeks: [],
        months: [],
        month: parseInt(("0" + (new Date().getMonth() + 1)).slice(-2)),
        year: new Date().getFullYear(),
        week: 1
      },
      rowClassRules: {
        error:
          "data.Estado.includes('COBRADO') && data.Gestion.includes('ANULADO')",
        pendiente:
          "data.Estado.includes('PENDIENTE') && data.Gestion.includes('PE')",
        anulado:
          "data.Estado.includes('ANULADO') || (data.Gestion.includes('AN') && !data.Estado.includes('COBRADO'))",
        cobrado:
          "data.Estado.includes('COBRADO') || (data.Gestion.includes('CO') && data.Importe == data.Cobrado)"
      },
      // RECIBO
      recibo: {
        selected: null,
        selectedSub: false
      },
      // GESTION
      myRoute: this.$route.params.recibo,
      // CALCULOS
      calculos: {
        importe: null
      },
      helpColors: [
        "",
        "#fcf18e",
        "#88c9ff",
        "rgb(182, 255, 191)",
        "rgb(252, 151, 151)",
        "#a8a8a7"
      ]
    };
  },
  methods: {
    onChange(value, key) {
      if (
        this.dialogData["Gestion"] == "COME" ||
        this.dialogData["Gestion"] == "COTR"
      ) {
        this.dialogFields["Importe"].props.disable = false;
      } else {
        this.dialogFields["Importe"].props.disable = true;
      }
    },
    onSave() {
      console.log(this.dialogData);
      this.dialogModel = false;
      let self = this;
      this.callData({
        cmd: this.cmd,
        idkey: this.idKey,
        idvalue: this.dialogData[this.idKey],
        data: this.dialogData,
        table: this.dialogTable
      }).then(() => self.init());
    },
    onDelete() {
      let self = this;
      this.$q
        .dialog({
          message: this.$lang.EliminarRegistro,
          cancel: true
        })
        .onOk(() => {
          this.callData({
            cmd: "deleteRecord",
            idkey: this.idKey,
            idvalue: this.dialogData[this.idKey],
            table: this.table
          }).then(() => self.init());
        })
        .onCancel(() => {});
    },
    // CALL DATA GESTION
    callDataGestion() {
      let self = this;
      let dateini = new Date();
      dateini.setMonth(dateini.getMonth() - 13);
      dateini = dateini.toISOString().substr(0, 10);
      let dateend = new Date().toISOString().substr(0, 10);
      let where = "(",
        or = "";
      for (let i = 0; i < this.filter.estadosSel.length; i++) {
        where += or + "Estado LIKE '" + this.filter.estadosSel[i].value + "%'";
        or = " OR ";
      }
      where += ")";
      if (!this.filter.alldata)
        where +=
          " AND (FechaEfecto BETWEEN '" + dateini + "' AND '" + dateend + "')";
      where += " ORDER BY Situacion DESC";
      this.callData({
        cmd: "getRecords",
        table: "Recibos",
        where,
        subtable: "RecibosGestion",
        id: this.filter.userby.value
      }).then(function(response) {
        self.defineDialog(self.columnDefs);
        self.dialogTable = "Recibos";
        self.dialogFields["Gestion"].options = self.$lang.gestion;
        self.dialogFields["Gestion"].type = "select";
        self.dialogFields["Estado"].options = self.$lang.estados;
        self.dialogFields["Estado"].type = "select";
      });
    },
    // CALL DATA BAJAS
    callDataBajas() {
      let self = this;
      let where =
        "(Gestion LIKE 'ANULADO') AND (FechaEfecto LIKE '" +
        this.filter.year +
        "-" +
        this.filter.month +
        "%')";
      this.callData({
        cmd: "getRecords",
        table: "Recibos",
        where
      }).then(function(response) {});
    },
    // CALL DATA LIQ
    callDataLiq() {
      let self = this;
      let days = this.getDaysWeek(this.filter.year, this.filter.month);
      let where =
        "(Estado LIKE 'COBRADO') AND (Situacion>='" +
        days.dateini +
        "' AND Situacion<='" +
        days.dateend +
        "') ORDER BY Situacion DESC";
      this.callData({
        cmd: "getRecords",
        table: "Recibos",
        where
      }).then(function(response) {});
    },
    // CALL DATA RECIBO
    callDataRecibo() {
      let self = this;
      let where = "(CodigoRecibo='" + this.$route.params.recibo + "')";
      this.callData({
        cmd: "getRecords",
        table: "Recibos",
        where
      }).then(function(response) {});
    },
    // SELECTED ROW
    rowSelected: function(data) {
      if (data) {
        this.recibo.selected = true;
        this.defineDialog(this.columnDefsSub, false, "RecibosGestion");
        //Defaults
        this.dialogData["CodigoRecibo"] = data.CodigoRecibo;
        this.dialogData["CodigoPoliza"] = data.CodigoPoliza;
        this.dialogData["NombreTomador"] = data.NombreTomador;
        this.dialogData["Usuario"] = localStorage.username;
      } else {
        this.recibo.selected = false;
        this.defineDialog(this.columnDefs, false, "Recibos");
        this.dialogFields["Estado"].options = this.$lang.estados;
        this.dialogFields["Estado"].type = "select";
      }
      this.dialogFields["Gestion"].options = this.$lang.gestion;
      this.dialogFields["Gestion"].type = "select";
    },
    // SELECTED SUB ROWS
    rowSelectedSub: function(data) {
      this.dialogTable = "RecibosGestion";
      if (data) {
        this.defineDialog(this.columnDefsSub, data);
        this.recibo.selectedSub = true;
        this.dialogFields["Gestion"].options = this.$lang.gestion;
        this.dialogFields["Gestion"].type = "select";
      } else {
        this.recibo.selectedSub = false;
        return;
      }
    },
    //CALCULATE
    gridData(data) {
      let sumCobrado = 0;
      let sumImporte = 0;
      for (let i = 0; i < data.length; i++) {
        sumCobrado = sumCobrado + data[i].data.Cobrado;
        sumImporte = sumImporte + data[i].data.Importe;
      }
      this.calculos.importe =
        this.$route.params.recibo == "caja"
          ? Number(sumCobrado).toFixed(2)
          : Number(sumImporte).toFixed(1);
    },
    // INITIALIZATION
    init() {
      this.recibo.selected = null;
      this.recibo.selectedSub = false;
      this.dialogModel = false;
      this.filter.months = this.getMonths();
      this.filter.weeks = this.getWeeks();
      this.filter.years = this.getYears();
      if (this.$route.params.recibo == "bajas") this.callDataBajas();
      if (this.$route.params.recibo == "gestion") this.callDataGestion();
      if (this.$route.params.recibo == "liq") this.callDataLiq();
      if (this.$route.params.recibo == "") this.callDataRecibo();
    }
  },
  beforeMount() {
    this.init();
  },
  watch: {
    $route: "init"
  }
};

const Error404 = {
  name: "Error404",
  template: `<div>
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-404"></div>
      <h1>404</h1>
      <h2>Oops! Página inexistente</h2>
      <p>Lo sentimos, la página solicitada no existe, fué eliminada, cambiada de nombre o está temporalmente
        indisponible</p>
      <a href="#">Volver a Inicio</a>
    </div>
  </div>
</div>`
};

const Clientes = {
  name: "Clientes",
  template: `<div class="container">
  <div class="row text-center">
    <div class="col-xs-12" style="padding: 10px">
      <q-input :label="$lang.FiltroRapido" dense type="text" v-model="quickFilter">
        <q-icon name="filter_list" slot="prepend" />
        <q-icon @click="quickFilter = ''" class="cursor-pointer" name="close" slot="append" />
      </q-input>
    </div>
  </div>
  <n-tables :columnDefs="columnDefs" :quickFilter="quickFilter" :rowClassRules="rowClassRules" :rowData="rowData" />
</div>
  `,
  components: {
    NTables
  },
  mixins: [mixins],
  data() {
    return {
      // TABLE
      rowClassRules: {}
    };
  },
  methods: {
    callDataClients() {
      let self = this;
      this.callData({
        cmd: "getRecords",
        table: "Clientes"
      }).then(function(response) {
        self.defineTable(response);
      });
    }
  },
  beforeMount() {
    this.callDataClients();
  },
  watch: {}
};
