


// TABLES






const NTables ={
template: `<div style="text-align: left">
  <ag-grid-vue :animateRows="true" :columnDefs="columnDefs" :columnTypes="columnTypes" :defaultColDef="defaultColDef"
    :detailCellRendererParams="detailCellRendererParams" :enableCellChangeFlash="true" :enableRangeSelection="true"
    :floatingFilter="false" :localeText="localeText" :masterDetail="masterDetail" :rowClassRules="rowClassRules"
    :rowData="rowData" :sideBar="sideBar" :sizeColsToFix="true" :statusBar="statusBar" :suppressColumnVirtualisation="true"
    :suppressDragLeaveHidesColumns="true" :suppressMakeColumnVisibleAfterUnGroup="true" :suppressSizeToFit="true"
    @cell-clicked="onCellClicked" @cell-value-changed="onCellValueChanged" @filter-changed="onFilterChanged"
    @grid-ready="onGridReady" @row-data-changed="onRowDataChanged" @selection-changed="onSelectionChanged" class="ag-theme-balham"
    multiSortKey="ctrl" rowGroupPanelShow="always" style="height: 500px;"></ag-grid-vue>
</div>`,
 name: "NTables",
   props: {
     columnDefs: null,
     columnDefsSub: null,
     rowData: null,
     masterDetail: null,
     rowClassRules: null,
     filters: null,
     quickFilter: null
   },
   data() {
     return {
       // Uso AgGrid
       gridApi: null,
       columnApi: null,
       detailCellRendererParams: null,
       rowSelection: null,
       defaultColDef: {
         enablePivot: false,
         editable: false,
         resizable: true,
         filter: true,
         sortable: true
       },
       columnTypes: {
         date: {
           filter: "agSetColumnFilter"
         },
         datetime: {
           filter: "agSetColumnFilter"
         },
         text: {
           filter: "agSetColumnFilter"
         },
         number: {
           filter: "agNumberColumnFilter",
           enableValue: true,
           enableRowGroup: true
         },
         general: {
           filter: "agSetColumnFilter",
           enableRowGroup: true
         },
         bit: {
           filter: "agSetColumnFilter",
           enableRowGroup: true,
           cellRenderer: function (params) {
             return `<input type='checkbox' onclick="return false;" ${params.value ? "checked" : ""} />`;
           }
         }
       },
       statusBar: {
         statusPanels: [{
           statusPanel: "agTotalRowCountComponent",
           align: "left"
         }, {
           statusPanel: "agFilteredRowCountComponent"
         }, {
           statusPanel: "agSelectedRowCountComponent"
         }, {
           statusPanel: "agAggregationComponent"
         }]
       },
       sideBar: {
         toolPanels: [{
           id: "columns",
           labelDefault: "Columns",
           labelKey: "columns",
           iconKey: "columns",
           toolPanel: "agColumnsToolPanel"
         }],
         defaultToolPanel: "",
         enablePivot: false
       },
       localeText: null
     };
   },
   components: {
    // "ag-grid-vue": AgGridVue.AgGridVue
   },
   methods: {
     onGridReady(params) {
       if (params.api && params.columnApi) {
         this.gridApi = params.api;
         this.columnApi = params.columnApi;
         this.gridApi.sizeColumnsToFit();
         //this.autoSizeColumns();
       }
     },
     onRowDataChanged(params) {
       if (params.api && params.columnApi) {
         this.gridApi = params.api;
         this.columnApi = params.columnApi;
         this.gridApi.sizeColumnsToFit();
         this.createSubtable();
         this.autoFilter();
       }
     },
     autoSizeColumns() {
       var allColumnIds = [];
       if (this.columnApi) {
         this.columnApi.getAllColumns().forEach(function (column) {
           allColumnIds.push(column.colId);
         });
         this.columnApi.autoSizeColumns(allColumnIds);
       }
     },
     autoFilter() {
       if (this.gridApi) {
         this.gridApi.setFilterModel(this.filters);
         this.onFilterChanged();
       }
     },
     onFilterChanged(event) {
       if (this.gridApi) {
         this.$emit("gridData", this.gridApi.rowModel.rootNode.childrenAfterFilter);
       }
     },
     onCellClicked(event) {
       this.$emit("cellClicked", event);
     },
     onSelectionChanged(params) {
       let row = [];
       row = this.gridApi.getSelectedRows();
       this.$emit("rowSelected", row[0]);
     },
     onCellValueChanged(value) {},
     createSubtable() {
       let self = this;
       var subGrid;
       this.detailCellRendererParams = {
         detailGridOptions: {
           enableRangeSelection: true,
           columnDefs: this.columnDefsSub,
           defaultColDef: this.defaultColDef,
           columnTypes: this.columnTypes,
           localeText: localeText,
           onGridReady(params) {
             this.gridApi = params.api;
           },
           onFirstDataRendered(params) {
             params.api.sizeColumnsToFit();
           },
           onCellValueChanged(value) {},
           onSelectionChanged(event) {
             let row = {};
             row = this.gridApi.getSelectedRows();
             self.$emit("rowSelectedSub", row[0]);
           }
         },
         getDetailRowData: (params) => {
           params.successCallback(params.data.callRecords);
         },
         template: function (params) {
           return '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' + '  <div ref="eDetailGrid" style="height: 90%;"></div>' + "</div>";
         }
       };
     }
   },
   beforeMount() {
     var lang = require(`../lang/${localStorage.lang}.tables`);
     this.localeText = lang.default;
   },
   created() {},
   watch: {
     quickFilter: function () {
       this.gridApi.setQuickFilter(this.quickFilter);
     },
     filters: {
       handler(val) {
         this.autoFilter();
       },
       deep: true
     }
   }
};

















// DIALOG
















const NDialog = {
  template: `<div>
  <q-dialog :maximized="true" transition-hide="slide-down" transition-show="slide-up" v-model="model">
    <q-card>
      <!-- TOOLBAR -->
      <q-toolbar class="bg-primary text-white">
        <q-btn @click="onSave" class="text-white" dense flat icon="save">{{$q.lang.Guardar}}</q-btn>
        <q-space />
        <q-btn @click="readonly=true;$emit('cancel', true)" class="text-white" dense flat icon="close"></q-btn>
      </q-toolbar>
      <q-separator />
      <!-- INICIO DE DATOS -->
      <q-card-section>
        <div class="row">
          <div :key="key" class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-bind="fields[key].props" v-for="(value,key, index) in data">
            <q-card-section>
              <!-- ES TEXTO -->
              <q-input :label="fields[key].name" @input="onChange(data[key], key)" dense stack-label type="text" v-bind="fields[key].props"
                v-if="fields[key].type =='text'" v-model="data[key]"></q-input>
              <!-- ES SELECT -->
              <q-select :label="fields[key].name" :options="options[key].options" :options-dense="true" @filter="filterFn"
                @input="onChange(data[key], key)" dense stack-label type="text" v-bind="fields[key].props" v-if="fields[key].type =='select' && options"
                v-model="data[key]" />
              <!-- ES AUTOCOMPLETE -->
              <q-select :label="fields[key].name" :options="options[key].options" :options-dense="true" @filter="filterFn"
                @input="onChange(data[key], key)" @keyup.native="selected=key" @new-value="createValue" dense
                hide-selected input-debounce="0" stack-label type="text" use-input v-bind="fields[key].props" v-if="fields[key].type =='autocomplete' && options"
                v-model="data[key]" />
              <!-- ES NUMERO -->
              <q-input :label="fields[key].name" @input="onChange(data[key], key)" dense stack-label type="number"
                v-bind="fields[key].props" v-if="fields[key].type =='number'" v-model="data[key]"></q-input>
              <!-- ES BIT -->
              <q-toggle :label="fields[key].name" dense v-bind="fields[key].props" v-if="fields[key].type =='bit'"
                v-model="data[key]" />
              <!-- ES FECHA -->
              <q-input :label="fields[key].name" @input="onChange(data[key], key)" dense mask="date" v-bind="fields[key].props"
                v-if="fields[key].type.includes('date')" v-model="data[key]">
                <q-icon class="cursor-pointer" name="event" slot="append">
                  <q-popup-proxy>
                    <q-date @input="onChange(data[key], key)" minimal todayBtn v-model="data[key]" />
                  </q-popup-proxy>
                </q-icon>
              </q-input>
            </q-card-section>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</div>`,
  mixins: [mixins],
    name: "NDialog",
    props: {
      model: null,
      data: null,
      fields: null
    },
    data() {
      return {
        selected: false,
        options: null
      };
    },
    computed: {},
    methods: {
      onSave: function () {
        this.$emit("onSave", true);
      },
      onCancel: function () {
        this.$emit("onCancel", true);
        this.model = false;
      },
      onChange: function (value, key) {
        if (this.data[key].value) this.data[key] = this.data[key].value;
        this.$emit("onChange", this.data[key], key);
      },
      createValue(val, done) {
        done(val);
      },
      selectKey(key) {
        this.selected = key;
      },
      filterFn(val, update, abort) {
        if (!this.selected) {
          update(() => {});
          return;
        }
        if (this.fields[key].type == "select") {
          update(() => {});
          return;
        }

        let fields = this.fields[this.selected].options;
        if (val === "") {
          update(() => {
            this.options[this.selected].options = fields;
            return;
          });
        } else {
          update(() => {
            const value = val.toLowerCase();
            if (!fields[0].label) {
              this.options[this.selected].options = fields.filter(
                (v) =>
                v
                .toString()
                .toLowerCase()
                .indexOf(value) > -1
              );
            } else {
              fields = fields.map((x) => x.label);
              this.options[this.selected].options = fields.filter(
                (v) =>
                v
                .toString()
                .toLowerCase()
                .indexOf(value) > -1
              );
            }
          });
        }
      }
    },
    beforeMount() {},
    watch: {
      model: function (params) {
        this.options = JSON.parse(JSON.stringify(this.fields));
        if (!this.model) this.options = null;
      }
    }
};
