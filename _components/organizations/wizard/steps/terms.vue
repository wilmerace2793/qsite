<template>
  <div class="step-terms">
    <h2 class="step-title">{{stepContent.title}}</h2>
    <div class="tw-mx-auto tw-text-base tw-max-w-sm">
        <div class="tw-flex tw-overflow-hidden tw-mb-3">
            <q-checkbox dense v-model="buttonEmail" color="primary" />
            <div class="tw-pl-3 text-justify">
              Sí, quiero recibir correos electrónicos con consejos prácticos, novedades y ofertas especiales para mi página web.
            </div>
        </div>
        <div class="tw-flex tw-overflow-hidden tw-mb-3">
            <q-checkbox dense v-model="buttonTerms" color="primary" />
            <div class="tw-pl-3 text-justify">
                Se aplican las <a href="#" target="_blank" class="text-primary">Condiciones de uso</a> de Wygo. Se aplica la <a href="#" target="_blank" class="text-primary">Política de privacidad</a> de Wygo.
            </div>
        </div>
    </div>
    <div class="step-sidebar ">
      <div class="terms-text tw-max-w-sm">
        <p class="tw-text-base tw-mb-8 text-center">{{stepContent.summary}}</p>
        <img :src="stepContent.image" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      buttonEmail: false,
      buttonTerms: false,
      stepContent: {
        title: 'Condiciones de uso',
        summary: 'Acepta nuestras Condiciones de uso para disfrutar de todas las bondades que tiene Wygo para ti',
        image: 'http://imgfz.com/i/5E7Qrbq.png',
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
      this.$emit("update",  { active: newTerms });
    }
  },
}
</script>
<style>
.step-terms .terms-text {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
</style>