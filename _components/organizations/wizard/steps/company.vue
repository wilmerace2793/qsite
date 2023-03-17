<template>
  <div class="step-company">
    <h2 class="step-title">{{stepContent.title}}</h2>
    <p class="tw-text-base tw-px-14 tw-text-center tw-mb-10">{{ stepContent.summary }}</p>

    <div class="tw-px-10 tw-mb-8">
      <dynamic-field v-model="name" :field="formFields.nameOrganizations" />
    </div>

    <div class="step-sidebar ">
      <div class="select-company tw-max-w-md">
        <img :src="stepContent.image"/>
      </div>
    </div>

  </div>
</template>
<script>

export default {
  data() {
    return {
      name:'',
      stepContent: {
        title: '¿Cuál es el nombre de tu proyecto?',
        summary: 'El nombre de tu proyecto es la base para armar tu sitio web, sera el elemento que se usara para identificarlo.',
        image: 'http://imgfz.com/i/8jznp2c.png',
      }
    }
  },
  inject:['infoBase'],
  created() {
    console.warn(this.infoBase) // injected value
  },
  mounted() {
    this.$nextTick(async function () {
      this.getData();
      this.navNext();
    })
  },
  watch: {
    name(newName, oldName) {
      this.navNext();
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
  methods: {
    getData(){
      this.name = this.infoBase.organization;
    },
    navNext() {
      if(this.name.length>5){
        this.$emit("update", { active: true, info: this.name});
      }else {
        this.$emit("update", { active: false});
      }
    },
  }
}
</script>
<style>
.select-company {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
</style>