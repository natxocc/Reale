<template>
  <div class="container">
    <!-- TABS -->
    <q-tabs active-bg-color="primary" active-color="white" class="bg-secondary text-primary" dense indicator-color="transparent" inline-label top-indicator v-model="tab">
      <q-route-tab :label="$q.lang.Altas" icon="assignment_turned_in" name="gestion" to="/polizas/altas"/>
      <q-route-tab :label="$q.lang.Bajas" icon="assignment_returned" name="bajas" to="/polizas/bajas"/>
      <q-tab :label="calculos.importe" class="text-primary" disabled icon="euro_symbol"/>
    </q-tabs>
    <!-- SELECT FILTERS GESTION ALTAS Y BAJAS-->
    <div class="row text-center">
      <div class="col-xs-12 col-sm-4" style="padding: 10px">
        <q-input :label="$q.lang.FiltroRapido" dense type="text" v-model="quickFilter">
          <q-icon name="filter_list" slot="prepend"/>
          <q-icon @click="quickFilter = ''" class="cursor-pointer" name="close" slot="append"/>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-4" style="padding: 10px">
        <q-select :label="$q.lang.ano" :options="filter.years" @input="init" dense expandBesides optionsDense v-model="filter.year"/>
      </div>
      <div class="col-xs-12 col-sm-4" style="padding: 10px">
        <q-select :label="$q.lang.mes" :options="filter.months" @input="init" dense expandBesides optionsDense v-model="filter.month"/>
      </div>
    </div>
    <!-- TABLA DE DATOS -->
    <n-tables :columnDefs="columnDefs" :quickFilter="quickFilter" :rowClassRules="rowClassRules" :rowData="rowData" @gridData="gridData"/>
  </div>
</template>

<script>
import NTables from "../components/NTables.vue";
import Custom from "../mixins";
export default {
  components: {
    NTables
  },
  mixins: [Custom],
  data() {
    return {
      // TABLE
      rowClassRules: {},
      filter: {
        years: [],
        months: [],
        month: ("0" + (new Date().getMonth() + 1)).slice(-2),
        year: new Date().getFullYear()
      },
      tab: this.$route.params.poliza,
      // CALCULOS
      calculos: {
        importe: null,
        cobrado: null
      }
    };
  },
  methods: {
    // CALL ALTAS
    callDataAltas() {
      let self = this;
      let where = "(TipoInformacion LIKE 'Nueva%' ) AND (FechaAlta LIKE '" + this.filter.year + "-" + this.filter.month + "%')";
      this.callData({cmd: "getRecords", table: "Polizas", where}).then(function(response) {
        self.defineTable(response);
      });
    },
    // CALL BAJAS
    callDataBajas() {
      let self = this;
      let where = "(TipoInformacion LIKE 'Anula%' )  AND (FechaBaja LIKE '" + this.filter.year + "-" + this.filter.month + "%')";
      this.callData({cmd: "getRecords", table: "Polizas", where}).then(function(response) {
        self.defineTable(response);
      });
    },
    //CALCULATE
    gridData(data) {
      let sumCobrado = 0;
      let sumImporte = 0;
      for (let i = 0; i < data.length; i++) {
        sumCobrado = sumCobrado + data[i].data.Cobrado;
        sumImporte = sumImporte + data[i].data.Importe;
      }
      this.calculos.importe = Number(sumImporte).toFixed(1);
      this.calculos.cobrado = Number(sumCobrado).toFixed(1);
    },
    // INITIALIZATION
    init() {
      if (this.$route.params.poliza == "bajas") this.callDataBajas();
      if (this.$route.params.poliza == "altas") this.callDataAltas();
    }
  },
  beforeMount() {
    this.init();
    this.filter.months = this.getMonths();
    this.filter.years = this.getYears();
  },
  watch: {
    $route: "init"
  }
};
</script>