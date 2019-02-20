<template>
  <div class="container">
    <!-- TABS -->
    <q-tabs active-bg-color="primary" active-color="white" class="bg-secondary text-primary" dense indicator-color="transparent" inline-label top-indicator v-model="myRoute">
      <q-route-tab :label="$q.lang.Gestion" icon="assignment_turned_in" name="gestion" to="/recibos/gestion"/>
      <q-route-tab :label="$q.lang.BajasPendientes" icon="assignment_returned" name="bajas" to="/recibos/bajas"/>
      <q-route-tab :label="$q.lang.Liquidacion" icon="credit_card" name="liq" to="/recibos/liq"/>
      <q-tab :label="calculos.importe" class="text-primary" disabled icon="euro_symbol"/>
    </q-tabs>
    <!-- SELECT FILTERS TOTALS-->
    <div>
      <div class="row text-center">
        <div class="col-xs-12 col-md-4" style="padding: 10px">
          <q-input :label="$q.lang.FiltroRapido" dense type="text" v-model="quickFilter">
            <q-icon name="filter_list" slot="prepend"/>
            <q-icon @click="quickFilter = ''" class="cursor-pointer" name="close" slot="append"/>
          </q-input>
        </div>
        <!-- FILTER ONLY GESTION -->
        <template v-if="this.$route.params.recibo=='gestion'">
          <div class="col-xs-12 col-md-4" style="padding: 10px">
            <q-select :label="$q.lang.FiltrosDeEstado" :options="this.$q.lang.estados" @input="callDataGestion" dense expandBesides multiple optionsDense v-model="filter.estadosSel"/>
          </div>
          <div class="col-xs-6 col-md-2" style="padding: 10px">
            <q-select :label="$q.lang.HistorialUsuario" :options="this.$q.lang.userby" @input="callDataGestion" dense expandBesides optionsDense v-model="filter.userby"/>
          </div>
          <div class="col-xs-6 col-md-2" style="padding: 10px">
            <q-toggle :label="$q.lang.TodosLosRegistros" @input="callDataGestion" dense v-model="filter.alldata">
              <q-tooltip anchor="top middle" self="bottom middle">{{$q.lang.TodosLosRegistrosT}}</q-tooltip>
            </q-toggle>
          </div>
        </template>
        <!-- FILTER ONLY BAJAS -->
        <template v-else-if="this.$route.params.recibo=='bajas'">
          <div class="col-xs-12 col-md-4" style="padding: 10px">
            <q-select :label="$q.lang.ano" :options="filter.years" @input="callDataBajas" dense expandBesides optionsDense v-model="filter.year"/>
          </div>
          <div class="col-xs-12 col-md-4" style="padding: 10px">
            <q-select :label="$q.lang.mes" :options="filter.months" @input="callDataBajas" dense expandBesides optionsDense v-model="filter.month"/>
          </div>
        </template>
        <!-- FILTER ONLY LIQ & CAJA -->
        <template v-else-if="this.$route.params.recibo=='liq'">
          <div class="col-xs-12 col-md-4" style="padding: 10px">
            <q-select :label="$q.lang.ano" :options="filter.years" @input="callDataLiq" dense expandBesides optionsDense v-model="filter.year"/>
          </div>
          <div class="col-xs-12 col-md-4" style="padding: 10px">
            <q-select :label="$q.lang.semana" :options="filter.weeks" @input="callDataLiq" dense expandBesides optionsDense v-model="filter.week"/>
          </div>
        </template>
      </div>
      <!-- MINI TOOLBAR-->
      <q-bar class="bg-primary text-white">
        <q-btn @click="dialogModel=true" dense flat icon="add" v-if="!recibo.selected && !recibo.selectedSub">{{$q.lang.NuevoRecibo}}</q-btn>
        <q-btn @click="dialogModel=true" dense flat icon="add" v-if="recibo.selected">{{$q.lang.NuevaGestion}}</q-btn>
        <q-btn @click="dialogModel=true" dense flat icon="edit" v-if="recibo.selectedSub">{{$q.lang.EditarGestion}}</q-btn>
        <q-btn @click="onDelete" color="warning" dense flat icon="delete" v-if="recibo.selected">{{$q.lang.EliminarRecibo}}</q-btn>
        <q-btn @click="onDelete" color="warning" dense flat icon="delete" v-if="recibo.selectedSub">{{$q.lang.EliminarGestion}}</q-btn>
        <q-space/>
        <!-- COLORS HELP -->
        <div>
          <q-btn color="primary" icon="help_outline" size="sm">
            <q-popup-proxy>
              <q-list dense>
                <q-item :key="key" :style="{'background-color': helpColors[key]}" v-for="(value, key) in $q.lang.ayuda">
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
    <n-tables :columnDefs="columnDefs" :columnDefsSub="columnDefsSub" :filters="filters" :masterDetail="true" :quickFilter="quickFilter" :rowClassRules="rowClassRules" :rowData="rowData" @gridData="gridData" @rowSelected="rowSelected" @rowSelectedSub="rowSelectedSub"/>
    <!-- DIALOGO -->
    <n-dialog :data="dialogData" :fields="dialogFields" :model="dialogModel" @cancel="dialogModel=false" @onChange="onChange" @onSave="onSave"></n-dialog>
  </div>
</template>

<script>
import NTables from "../components/NTables.vue";
import NDialog from "../components/NDialog.vue";
import Custom from "../mixins";
export default {
  components: {
    NTables,
    NDialog
  },
  mixins: [Custom],
  data() {
    return {
      filters: null,
      filter: {
        userby: {
          value: "NombreTomador",
          label: this.$q.lang.userby[0].label
        },
        estadosSel: [{value: "PENDIENTE", label: this.$q.lang.estados[0].label}, {value: "DEVUELTO", label: this.$q.lang.estados[1].label}],
        alldata: false,
        years: [],
        weeks: [],
        months: [],
        month: parseInt(("0" + (new Date().getMonth() + 1)).slice(-2)),
        year: new Date().getFullYear(),
        week: 1
      },
      rowClassRules: {
        error: "data.Estado.includes('COBRADO') && data.Gestion.includes('ANULADO')",
        pendiente: "data.Estado.includes('PENDIENTE') && data.Gestion.includes('PE')",
        anulado: "data.Estado.includes('ANULADO') || (data.Gestion.includes('AN') && !data.Estado.includes('COBRADO'))",
        cobrado: "data.Estado.includes('COBRADO') || (data.Gestion.includes('CO') && data.Importe == data.Cobrado)"
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
      helpColors: ["", "#fcf18e", "#88c9ff", "rgb(182, 255, 191)", "rgb(252, 151, 151)", "#a8a8a7"]
    };
  },
  methods: {
    onChange(value, key) {
      if (this.dialogData["Gestion"] == "COME" || this.dialogData["Gestion"] == "COTR") {
        this.dialogFields["Importe"].props.disable = false;
      } else {
        this.dialogFields["Importe"].props.disable = true;
      }
    },
    onSave() {
      console.log(this.dialogData)
      this.dialogModel = false;
      let self = this;
      this.callData({cmd: this.cmd, idkey: this.idKey, idvalue: this.dialogData[this.idKey], data: this.dialogData, table: this.dialogTable}).then(()=>self.init());
    },
    onDelete() {
      let self = this;
      this.$q
        .dialog({
          message: this.$q.lang.EliminarRegistro,
          cancel: true
        })
        .onOk(() => {
          this.callData({cmd: "deleteRecord", idkey: this.idKey, idvalue: this.dialogData[this.idKey], table: this.table}).then(()=>self.init());
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
      if (!this.filter.alldata) where += " AND (FechaEfecto BETWEEN '" + dateini + "' AND '" + dateend + "')";
      where += " ORDER BY Situacion DESC";
      this.callData({cmd: "getRecords", table: "Recibos", where, subtable: "RecibosGestion", id: this.filter.userby.value}).then(function(response) {
        self.defineDialog(self.columnDefs);
        self.dialogTable = "Recibos";
        self.dialogFields["Gestion"].options = self.$q.lang.gestion;
        self.dialogFields["Gestion"].type = "select";
        self.dialogFields["Estado"].options = self.$q.lang.estados;
        self.dialogFields["Estado"].type = "select";
      });
    },
    // CALL DATA BAJAS
    callDataBajas() {
      let self = this;
      let where = "(Gestion LIKE 'ANULADO') AND (FechaEfecto LIKE '" + this.filter.year + "-" + this.filter.month + "%')";
      this.callData({cmd: "getRecords", table: "Recibos", where}).then(function(response) {});
    },
    // CALL DATA LIQ
    callDataLiq() {
      let self = this;
      let days = this.getDaysWeek(this.filter.year, this.filter.month);
      let where = "(Estado LIKE 'COBRADO') AND (Situacion>='" + days.dateini + "' AND Situacion<='" + days.dateend + "') ORDER BY Situacion DESC";
      this.callData({cmd: "getRecords", table: "Recibos", where}).then(function(response) {});
    },
    // CALL DATA RECIBO
    callDataRecibo() {
      let self = this;
      let where = "(CodigoRecibo='" + this.$route.params.recibo + "')";
      this.callData({cmd: "getRecords", table: "Recibos", where}).then(function(response) {});
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
        this.dialogFields["Estado"].options = this.$q.lang.estados;
        this.dialogFields["Estado"].type = "select";
      }
      this.dialogFields["Gestion"].options = this.$q.lang.gestion;
      this.dialogFields["Gestion"].type = "select";
    },
    // SELECTED SUB ROWS
    rowSelectedSub: function(data) {
      this.dialogTable = "RecibosGestion";
      if (data) {
        this.defineDialog(this.columnDefsSub, data);
        this.recibo.selectedSub = true;
        this.dialogFields["Gestion"].options = this.$q.lang.gestion;
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
      this.calculos.importe = this.$route.params.recibo == "caja" ? Number(sumCobrado).toFixed(2) : Number(sumImporte).toFixed(1);
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
</script>