<template lang="html">
  <div id="wrapper">
    <Header/>
    <BoxWrapper
      style="background-color: transparent; box-shadow: none; padding: 0; margin: 0;">
      <div id="content-wrapper">
        <div
          class="dashboard-box">
          <div class="section-wrapper">
            <VuePerfectScrollbar class="scroll-area">
              <div class="content">
                <h2>Title</h2>
                <p class="box-description">Description box</p>
              </div>
            </VuePerfectScrollbar>
          </div>
        </div>
      </div>
    </BoxWrapper>
  </div>
</template>


<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import BoxWrapper from './templates/box-wrapper.vue'
import Header from './templates/header.vue'
import LoadingBar from './templates/loading-bar.vue'
import pieChart from './chart/pie-chart.vue'
import Button from './templates/button.vue'

export default {
  data() {
    return {
      dashboard: new this.$models.DashboardCollection(),
      isLoading: false,
    }
  },
  components: {
    VuePerfectScrollbar,
    BoxWrapper,
    Header,
    LoadingBar,
    pieChart,
    Button,
  },
  created () {
    this.setup()
    this.$eventHub.$on('dashboard-app-user-loaded', () => {
      this.setup()
    })
  },
  methods: {
    setup () {

    },
  },
}
</script>

<style scoped lang="css">

.wrapper {
  position: relative;
}

h2 {
  color: var(--main-text-color);
  display: flex;
  flex-grow: 1;
  font-size: var(--main-font-size);
  font-weight: bold;
  margin: 0;
}

.box-description {
  font-size: var(--main-font-size);
  font-weight: 500;
  margin: 0;
  padding: 0;
  color: var(--main-text-color);
}

.content {
  padding: 10px;
}

.buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

#content-wrapper {
  box-sizing: content-box;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
}

.dashboard-box {
  display: flex;
  flex-flow: row wrap;
  flex-wrap: wrap;
  justify-content: space-around;
}

.section-wrapper {
  background-color: var(--main-box-bg-color);
  border-radius: 20px;
  box-shadow: var(--main-box-shadow);
  flex-grow: 1;
  height: 300px;
  margin: 5px;
  overflow-y: auto;
  overflow: auto;
  position: relative;
  width: 300px;
  max-width: 300px;
}


@media (max-width: 940px) {
  #content-wrapper {
    box-sizing: content-box;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: center;
  }
}

@media (max-width: 720px) {
  #content-wrapper {
    box-sizing: content-box;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    justify-content: center;
  }
}

</style>
