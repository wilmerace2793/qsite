<template>
  <div class="step-plan">
    <h2 class="step-title">Selecciona tu Plan Wygo </h2>

    <q-tabs
        v-model="tab"
        class="text-primary tw-mb-5"
    >
      <q-tab name="mes" label="1 Mes"/>
      <q-tab name="meses"  label="12 Meses"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="tw-pb-4">
      <q-tab-panel name="mes">
        <q-list
          bordered 
          separator 
          class="tw-mb-4 cursor-pointer item-plan"
          v-if="item.type=='mes'" 
          @click="selected=item"  
          :class="{ activePlan : item.name === selected.name }"
          v-for="(item, index) in plans" :key="index">
          <q-expansion-item 
            :group="item.type"
            expand-icon-toggle
          >
            <template v-slot:header>
              <q-item-section>
                <div class="tw-text-lg tw-font-semibold">{{item.name}}</div>
                <div class="tw-text-xs">{{ item.summary }}</div>
              </q-item-section>

              <q-item-section side>
                <div class="row items-center ">
                  <span class="tw-font-bold">{{item.price}}</span> / {{item.period}}
                </div>
              </q-item-section>
            </template>
            <q-card>
              <q-separator />
              <q-card-section v-html="item.description"></q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="meses">
        <q-list
          bordered 
          separator 
          class="tw-mb-4 cursor-pointer item-plan"
          v-if="item.type=='meses'" 
          @click="selected=item"  
          v-for="(item, index) in plans" :key="index">
          <q-expansion-item 
            :class="{ activePlan : item.name === selected.name }"
            :group="item.type"
            expand-icon-toggle
          >
            <template v-slot:header>
              <q-item-section>
                <div class="tw-text-lg tw-font-semibold">{{item.name}}</div>
                <div class="tw-text-xs">{{ item.summary }} </div>
              </q-item-section>

              <q-item-section side>
                <div class="row items-center ">
                  <span class="tw-font-bold">{{item.price}}</span> / {{item.period}}
                </div>
              </q-item-section>
            </template>
            <q-card>
              <q-separator />
              <q-card-section v-html="item.description"></q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>

    <div class="step-sidebar">
      <q-card class="select-card tw-border-t-8 tw-max-w-lg" flat bordered v-if="selected">
        <q-card-section>
          <div class="text-h5 q-mb-xs">{{selected.name}}</div>
           <div class="text-caption text-grey overflow-ellipsis overflow-hidden">{{selected.summary }}</div>
          <div class="text-right q-mt-sm">
            <span class="text-h6 tw-font-bold text-primary ">{{selected.price}}</span> / {{selected.period}}
          </div>  
        </q-card-section>
        <q-separator />
        <q-card-section class="tw-text-xs" v-html="selected.description"></q-card-section>
      </q-card>

      <div class="select-card tw-max-w-md" v-else>
        <img src="./images/plans.svg"/>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      tab: 'mes',
      selected: { 
          name:'Wygo Basic 1', 
          summary: 'Tu página web profesional',
          description: '<ul><li>Plantillas con diseño profesional Blog</li><li>Dominio gratis por un año</li><li>Certificado SSL</li></ul>',
          price: '$75.000',
          period: '1 Mes',
          type: 'mes'
      },
      plans: [
        { 
          name:'Wygo Basic 1', 
          summary: 'Tu página web profesional',
          description: '<ul><li>Plantillas con diseño profesional Blog</li><li>Dominio gratis por un año</li><li>Certificado SSL</li></ul>',
          price: '$75.000',
          period: '1 Mes',
          type: 'mes'
        },
        { 
          name:'Wygo Basic 2', 
          summary: 'Tu página web profesional',
          description: '<ul><li>Plantillas con diseño profesional Blog</li><li>Dominio gratis por un año</li><li>Certificado SSL</li></ul>',
          price: '$455.000',
          period: '12 Meses',
          type: 'meses'
        },
        { 
          name:'Wygo eCommerce 1', 
          summary: 'Tu tienda online profesional',
          description: '<ul><li>Plantillas con diseño profesional Blog</li><li>Dominio gratis por un año</li><li>Certificado SSL</li></ul>',
          price: '$75.000',
          period: '1 Mes',
          type: 'mes'
        },
        { 
          name:'Wygo eCommerce 2', 
          summary: 'Tu tienda online profesional',
          description: '<ul><li>Plantillas con diseño profesional</li>	<li>Dominio gratis por un año</li>	<li>Certificado SSL</li>	<li>Productos ilimitados</li>	<li>Carrito de compras</li>	<li>Todas las funciones de Ecommerce</li>	<li>No cobramos comisión</li>	<li>Chat de WhatsApp</li>	<li>Cupones de descuento</li>	<li>Gestión de inventario</li>	<li>Multiples pasarela de pagos</li>	<li>Gestión&nbsp;de pedidos</li>	<li>Notificaciones automáticas por correo</li>	<li>SEO disponible</li>	<li>Pixel facebook Google analytics Google tag manager</li>	<li>Ancho de banda: ilimitado</li>	<li>Espacio de almacenamiento 60 GB</li>	<li>Cuentas de correo electronico incluido</li>	<li>10 productos configurados por nuestro equipo&nbsp; <strong><a data-toggle="tooltip" title="" data-original-title="Un especilista en proyectos es asignado a tu sitio web para realizar la carga inicial de la información de tu empresa en el sitio web de acuerdo a la estructura web seleccionada">(?)</a></strong></li></ul>',
          price: '$650.000',
          period: '12 Meses',
          type: 'meses'
        },
      ],
    }
  },
}
</script>
<style>
.step-plan .select-card {
  border-color: var(--q-color-primary);
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
.step-plan .item-plan  {
  @apply tw-p-0 tw-relative;
  transition: background-color .1s,color .1s;
}
.step-plan .activePlan .q-item {
  @apply tw-text-white;
  background-color: var(--q-color-primary);
}
.step-plan .activePlan .q-expansion-item__content {
  @apply tw-border;
  border-color: var(--q-color-primary);
}
.step-plan .activePlan .q-item__section--side {
  @apply tw-text-white;
  transition: color .1s;
}
.step-plan .item-plan .q-expansion-item:after {
  @apply tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-border tw-border-transparent;
  transition: border-color .2s,top .2s,right .2s,bottom .2s,left .2s;
  content: "";
}
.step-plan .activePlan .q-expansion-item:after, .step-plan .item-plan:hover .q-expansion-item:after {
  @apply tw--top-1.5 tw--right-1.5 tw--bottom-1.5 tw--left-1.5;
  border-color: var(--q-color-primary);
}
.step-plan .q-expansion-item__toggle-icon {
  @apply tw-z-10;
}
</style>

