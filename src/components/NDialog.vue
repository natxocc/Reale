<template>
  <div>
    <q-dialog :maximized="true" transition-hide="slide-down" transition-show="slide-up" v-model="model">
      <q-card>
        <!-- TOOLBAR -->
        <q-toolbar class="bg-primary text-white">
          <q-btn @click="onSave" class="text-white" dense flat icon="save">{{$q.lang.Guardar}}</q-btn>
          <q-space/>
          <q-btn @click="readonly=true;$emit('cancel', true)" class="text-white" dense flat icon="close"></q-btn>
        </q-toolbar>
        <q-separator/>
        <!-- INICIO DE DATOS -->
        <q-card-section>
          <div class="row">
            <div :key="key" class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-bind="fields[key].props" v-for="(value,key, index) in data">
              <q-card-section>
                <!-- ES TEXTO -->
                <q-input :label="fields[key].name" @input="onChange(data[key], key)" dense stack-label type="text" v-bind="fields[key].props" v-if="fields[key].type =='text'" v-model="data[key]"></q-input>
                <!-- ES SELECT -->
                <q-select :label="fields[key].name" :options="options[key].options" :options-dense="true" @filter="filterFn" @input="onChange(data[key], key)" dense stack-label type="text" v-bind="fields[key].props" v-if="fields[key].type =='select' && options" v-model="data[key]"/>
                <!-- ES AUTOCOMPLETE -->
                <q-select :label="fields[key].name" :options="options[key].options" :options-dense="true" @filter="filterFn" @input="onChange(data[key], key)" @keyup.native="selected=key" @new-value="createValue" dense hide-selected input-debounce="0" stack-label type="text" use-input v-bind="fields[key].props" v-if="fields[key].type =='autocomplete' && options" v-model="data[key]"/>
                <!-- ES NUMERO -->
                <q-input :label="fields[key].name" @input="onChange(data[key], key)" dense stack-label type="number" v-bind="fields[key].props" v-if="fields[key].type =='number'" v-model="data[key]"></q-input>
                <!-- ES BIT -->
                <q-toggle :label="fields[key].name" dense v-bind="fields[key].props" v-if="fields[key].type =='bit'" v-model="data[key]"/>
                <!-- ES FECHA -->
                <q-input :label="fields[key].name" @input="onChange(data[key], key)" dense mask="date" v-bind="fields[key].props" v-if="fields[key].type.includes('date')" v-model="data[key]">
                  <q-icon class="cursor-pointer" name="event" slot="append">
                    <q-popup-proxy>
                      <q-date @input="onChange(data[key], key)" minimal todayBtn v-model="data[key]"/>
                    </q-popup-proxy>
                  </q-icon>
                </q-input>
              </q-card-section>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Custom from "../mixins";
export default {
  mixins: [Custom],
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
    onSave: function() {
      this.$emit("onSave", true);
    },
    onCancel: function() {
      this.$emit("onCancel", true);
      this.model = false;
    },
    onChange: function(value, key) {
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
    model: function(params) {
      this.options = JSON.parse(JSON.stringify(this.fields));
      if (!this.model) this.options = null;
    }
  }
};
</script>