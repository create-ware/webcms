<script>
import { HorizontalBar } from 'vue-chartjs'


export default {
  extends: HorizontalBar,
  props: [
    'chartdata',
    'options',
  ],
  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}
</script>
