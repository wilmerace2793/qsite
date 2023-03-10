<template>
  <div class="step-company">
    <h2 class="step-title-1">¿Cuál es el nombre de tu negocio o proyecto?</h2>
    <p class="tw-text-sm tw-px-10 tw-text-center tw-mb-10">El nombre de tu negocio o proyecto es la base para armar tu sitio web, sera el elemento que se uso para identificarlo.</p>

    <div class="tw-px-8 tw-mb-8">
      <dynamic-field v-model="name" :field="formFields.nameOrganizations" />
    </div>

    <h2 class="tw-text-lg tw-px-10 tw-pb-1 tw-font-bold">
      <q-icon name="fas fa-arrow-right tw--ml-2 tw-mr-2" style="animation: bounce-left 1s infinite;"></q-icon>Selecciona una categoria:
    </h2>

    <div class="step-categories tw-px-8 tw-mt-2 tw-overflow-hidden">
      <dynamic-field v-model="options" :field="formFields.category" />
    </div>

    <div class="step-sidebar ">
      <div class="select-project tw-max-w-md">
        <p class="tw-text-sm tw-px-8 tw-mb-10">Con la seleccion de la categoria conoceremos la temática de tu sitio web, y podremos proporcionarte las plantillas con los
        textos y la estructura que más se adapten a tu proyecto o negocio.</p>
          <img src="./images/project.svg"/>
      </div>
    </div>

  </div>
</template>
<script>

export default {
  data() {
    return {
      name:'',
      options: '',
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
        },
        category: {
          value: "1",
          type: "optionGroup",
          isTranslatable: false,
          props: {
            dense: true,
            inline: true,
            options: [
              { label: 'viajes1', value: "1" },
              { label: 'tienda online', value: "0" },
              { label: 'moda y estilo', value: "2" },
              { label: 'tienda', value: "3" },
              { label: 'educacion', value: "4" },
              { label: 'tienda', value: "5" },
              { label: 'viajes', value: "6" },
              { label: 'tiendaasd', value: "7" },
              { label: 'viajes', value: "8" },
              { label: 'tienda', value: "9" },
            ],
          },
        },
      };
    },
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
</style>