<template>
  <div class="small">
    <button class="button" @click="exportToPDF(0)">
      {{ download_status }}
    </button>
    <line-chart :chart-data="linedata" id="line"></line-chart>
  </div>
</template>

<script>
  import LineChart from './qcharts/LineChart.js'
  import Exporter from "vue-chartjs-exporter";
  export default {
    components: {
      LineChart
    },
    data () {
      return {
        download_status: "Download Charts",
        linedata: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
          ],
          datasets: [
            {
              label: "Data One",
              borderColor: "#FC2525",
              pointBackgroundColor: "white",
              borderWidth: 1,
              pointBorderColor: "white",
              backgroundColor: this.gradient,
              data: [40, 39, 10, 40, 39, 60, 40],
            },
            {
              label: "Data Two",
              borderColor: "#05CBE1",
              pointBackgroundColor: "white",
              pointBorderColor: "white",
              borderWidth: 1,
              backgroundColor: this.gradient2,
              data: [60, 55, 32, 10, 2, 12, 53],
            },
          ],
        },
      }
    },
    methods: {
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
    max-width: 600px;
    margin:  150px auto;
  }
</style>