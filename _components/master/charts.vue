<template>
  <div 
    class="q-mt-sm box box-auto-hieght small">
    <!-- <button class="button" @click="exportToPDF(0)">
      {{ download_status }}
    </button> -->
    <!-- component chart -->
    <line-chart :chart-data="data" :options="options" id="line"></line-chart>
  </div>
</template>

<script>
  import LineChart from './qcharts/LineChart.js'
  import Exporter from "vue-chartjs-exporter";
  export default {
    components: {
      LineChart
    },
    props: {
      lineData: []
    },
    data () {
      return {
        download_status: "Download Charts",
        options :{
          responsive: true,
          maintainAspectRatio: false,
        }
      }
    },
    computed: {
      //set chart's labels
      dataLabels () {
        if(!this.lineData.length) return [];
        const label = [{name:'0', label:'0',data:0}]
        this.lineData.map((item) => {
          label.push({
            name:`${item.firstName} ${item.lastName}`,
            label: `${item.firstName} ${item.lastName}, ${this.$trn(item.amount)}, ${this.$trn(item.points)}`,
            data: item.points
          })
        })
        return label
      },
      //set data set
      dataSets () {
        if (!this.dataLabels.length) return [];
        return [{
          label: this.$tr('iauctions.cms.bid'),
          borderColor: this.randomColor(),
          pointBackgroundColor: this.randomColor(),
          borderWidth: 1,
          pointBorderColor: "white",
          //backgroundColor: this.gradient,
          data: this.dataLabels.map(({data}) => data )
        }]
      },
      //reder chart
      data () {
        return {
          height: 580,
          labels: this.dataLabels.map(({name}) => name),
          datasets: this.dataSets
        }
      }
    },
    methods: {
      //create random color
      randomColor () {
        return `#${Math.floor(Math.random()*16777215).toString(16)}`
      },
      //esport oto pdf chart
      exportToPDF() {
        this.download_status = "Processing...";
        let line = document.getElementById("line");

        const exp = new Exporter([line]);
        exp.export_pdf().then((pdf) => {
          pdf.save("charts.pdf");
          this.download_status = "Download Charts";
        });
      },
    },
  }
</script>

<style>
  .small {
    width: 100%;
    height: 450px;
  }
</style>