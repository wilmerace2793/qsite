<template>
  <div class="step-sterm">
    <h2 class="step-title-1">{{stepContent.title}}</h2>
    

    <div class=" tw-px-12">
 
        <div class="tw-flex tw-overflow-hidden">
            <q-checkbox dense v-model="buttonTerms" color="primary" />
            <div class="tw-pl-3">
                Se aplican las Condiciones de uso de Wygo. Se aplica la <a href="#" target="_blank" class="text-primary">Política de privacidad</a> de Wygo.
            </div>
        </div>

    </div>


    <div class="step-sidebar ">
      
        
    </div>



  </div>
</template>
<script>
export default {
  data() {
    return {
      buttonTerms: false,
      stepContent: {
        title: 'Condiciones de uso',
        summary: '',
        image: '',
      }
    }
  },
  computed: {
    formFields() {
      return {
        nameOrganizations: {
          type: "input",
          props: {
            icon: "corporate_fare",
            label: "Nombre",
            color: "primary",
            rounded: true,
            dense: false
          },
        }
      };
    },
  },
  watch: {
    buttonTerms(newTerms, oldTerms) {
      this.$emit("update", newTerms);
    }
  },
}
</script>
<style>
.step-categories .q-radio {
  margin-bottom: 10px;
}
.select-project {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
.step-categories .q-option-group--inline > div {
    width: 32%;
}
.step-categories .q-radio__label {
  color: #000;
}
</style>