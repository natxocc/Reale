<template>
  <div class="container">
    <!-- SELECT FILTERS -->
    <div class="row text-center">
      <div class="col-xs-12" style="padding: 10px">
        <q-input :label="$q.lang.FiltroRapido" dense type="text" v-model="quickFilter">
          <q-icon name="filter_list" slot="prepend"/>
          <q-icon @click="quickFilter = ''" class="cursor-pointer" name="close" slot="append"/>
        </q-input>
      </div>
    </div>
    <!-- TABLA DE DATOS -->
    <n-tables :columnDefs="columnDefs" :quickFilter="quickFilter" :rowClassRules="rowClassRules" :rowData="rowData"/>
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
      rowClassRules: {}
    };
  },
  methods: {
    callDataClients() {
      let self = this;
      this.callData({cmd: "getRecords", table: "Usuarios"}).then(function(response) {
        self.defineTable(response)
      });
    }
  },
  beforeMount() {
    this.callDataClients();
  },
  watch: {}
};
</script>

