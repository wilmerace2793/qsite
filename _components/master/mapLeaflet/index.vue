<template>
  <div id="mapLeafletcomponent" class="full-width">
    <!--map--->
    <div :id="mapId" :style="`width: 100%; height : ${height}`">
      <!-- search geolocation -->
      <div id="leaflet-search-box">
        <q-select
          v-if="!readOnly"
          v-show="showSearch"
          v-model="address"
          class="leaflet-search-box-input"
          input-class="q-pa-md"
          popup-content-class="leaflet-search-box-input"
          for="leaflet_search_input"
          :options="geolocations"
          :loading="searchLoading"
          behavior="menu"
          input-debounce="500"
          bg-color="white"
          hide-dropdown-icon        
          clearable
          use-input
          emit-value
          map-options
          square          
          dense
          @clear="geolocations = []"
          @filter="filterFn"
          @update:modelValue="emitResponseValue()"
        >
        <template v-slot:append v-if="address == null  || address == ''">
          <div class="q-pa-xs">
            <i class="fa-light fa-magnifying-glass fa-md"></i>
          </div>
        </template>
        </q-select>
      </div>    
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'
import "leaflet/dist/leaflet.css";
import 'leaflet-geosearch/dist/geosearch.css';
import "./plugins/fullscreen/Leaflet.fullscreen.js"
import "./plugins/editable/Leaflet.Editable.js"

export default defineComponent({
  props: {
    modelValue: {default: false},
    type: {default: false},
    mapId: { default: 'map'},
    height: {default: '400px'},
    label: {default: ''},
    readOnly: {type: Boolean, default: false},
    defaultCenter: {
      default: () => {
        return {lat: '4.6529539', lng: '-74.0835643' }
      }
    },
    emitDefault: {type: Boolean, default: false},
    polygonControls: { type: Boolean, default: false}, 
    points: { type: Array, default: []}, 
  },
  emit: ["update:modelValue"],
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
#leaflet-search-box{
  position: absolute;
  top: 0;
  z-index: 1000;  
  width: 100%;
  width: 100%;
  height: 64px;
  width: 100%;  
  height: 64px;
  display: grid;
  justify-content: center;  
  padding-top: 10px;
}

.leaflet-search-box-input {
  width: 380px;
}

.leaflet-control-fullscreen a {
  background:#fff url(./plugins//fullscreen/fullscreen.png) no-repeat 0 0;
  background-size:26px 52px;
  }
  .leaflet-touch .leaflet-control-fullscreen a {
    background-position: 2px 2px;
    }
  .leaflet-fullscreen-on .leaflet-control-fullscreen a {
    background-position:0 -26px;
    }
  .leaflet-touch.leaflet-fullscreen-on .leaflet-control-fullscreen a {
    background-position: 2px -24px;
    }

/* Do not combine these two rules; IE will break. */
.leaflet-container:-webkit-full-screen {
  width:100%!important;
  height:100%!important;
  }
.leaflet-container.leaflet-fullscreen-on {
  width:100%!important;
  height:100%!important;
  }

.leaflet-pseudo-fullscreen {
  position:fixed!important;
  width:100%!important;
  height:100%!important;
  top:0!important;
  left:0!important;
  z-index:99999;
  }

@media
  (-webkit-min-device-pixel-ratio:2),
  (min-resolution:192dpi) {
    .leaflet-control-fullscreen a {
      background-image:url(fullscreen@2x.png);
    }
  }
</style>
