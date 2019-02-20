<template>
  <div style="text-align: left">
    <!-- TABLA DE DATOS -->
    <ag-grid-vue
      :animateRows="true"
      :columnDefs="columnDefs"
      :columnTypes="columnTypes"
      :defaultColDef="defaultColDef"
      :detailCellRendererParams="detailCellRendererParams"
      :enableCellChangeFlash="true"
      :enableRangeSelection="true"
      :floatingFilter="false"
      :localeText="localeText"
      :masterDetail="masterDetail"
      :rowClassRules="rowClassRules"
      :rowData="rowData"
      :sideBar="sideBar"
      :sizeColsToFix="true"
      :statusBar="statusBar"
      :suppressColumnVirtualisation="true"
      :suppressDragLeaveHidesColumns="true"
      :suppressMakeColumnVisibleAfterUnGroup="true"
      :suppressSizeToFit="true"
      @cell-clicked="onCellClicked"
      @cell-value-changed="onCellValueChanged"
      @filter-changed="onFilterChanged"
      @grid-ready="onGridReady"
      @row-data-changed="onRowDataChanged"
      @selection-changed="onSelectionChanged"
      class="ag-theme-balham"
      multiSortKey="ctrl"
      rowGroupPanelShow="always"
      style="height: 500px;"
    ></ag-grid-vue>
  </div>
</template>

<script>
//           :rowMultiSelectWithClick="false"
import {AgGridVue} from "ag-grid-vue";
import Vue from "vue";
import localeText from "../lang/es.tables";

// EXPORT DEFAULT
export default {
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
          cellRenderer: function(params) {
            return `<input type='checkbox' onclick="return false;" ${params.value ? "checked" : ""} />`;
          }
        }
      },
      statusBar: {
        statusPanels: [{statusPanel: "agTotalRowCountComponent", align: "left"}, {statusPanel: "agFilteredRowCountComponent"}, {statusPanel: "agSelectedRowCountComponent"}, {statusPanel: "agAggregationComponent"}]
      },
      sideBar: {
        toolPanels: [
          {
            id: "columns",
            labelDefault: "Columns",
            labelKey: "columns",
            iconKey: "columns",
            toolPanel: "agColumnsToolPanel"
          }
        ],
        defaultToolPanel: "",
        enablePivot: false
      },
      localeText: null
    };
  },
  components: {
    AgGridVue
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
        this.columnApi.getAllColumns().forEach(function(column) {
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
      let row=[];
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
            let row={};
            row = this.gridApi.getSelectedRows();
            self.$emit("rowSelectedSub", row[0]);
          }
        },
        getDetailRowData: (params) => {
          params.successCallback(params.data.callRecords);
        },
        template: function(params) {
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
    quickFilter: function() {
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
</script>

