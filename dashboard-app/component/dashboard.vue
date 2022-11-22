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
                <h2>the dashboard</h2>
                <p class="box-description">here you can find all related to your modules</p>
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

const xmlContentReg = /\r\n|\n/

export default {
  data() {
    return {
      dashboard: new this.$models.DashboardCollection(),
      isLoading: false,

      // start - xml parser
      file: null,
      fileParsed: false,
      fileName: '',
      fileError: '',
      fileMessage: 'Select a *.xml file',
      // end - xml parser
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
    // start - xml parser
    addFile () {
      let files = this.$refs.file.files
      if (files.length === 0) {
        this.$refs.file.value = null
        this.fileName = ''
        this.fileError = 'XML file is not selected'
        return
      }
      this.file = this.$refs.file
      let file = files[0]
      let fileType = file.type
      this.fileName = file.name
      if (file.name.includes('.xml')) {
        let reader = new FileReader()
        reader.onload = this.parseFileContent
        reader.readAsText(file)
        return
      }
      this.fileError = 'XML file format required'
    },
    parseFileContent (event) {
      let contentLines = event.target.result
      let parser = new DOMParser()
      let xmlDoc = parser.parseFromString(contentLines, 'text/xml')
      console.log(xmlDoc)
      let transmitterTag = xmlDoc.getElementsByTagName('cfdi:Receptor')[0]
      let dateTag = xmlDoc.getElementsByTagName('tfd:TimbreFiscalDigital')[0]
      console.log('cfdi:Emisor: Nombre:', transmitterTag.getAttribute('Nombre'))
      console.log('cfdi:Emisor: RFC:', transmitterTag.getAttribute('Rfc'))
      console.log('cfdi:Emisor: FECHA TIMBRADO:', dateTag.getAttribute('FechaTimbrado'))
      this.fileMessage = 'XML OK'
      this.fileParsed = true
    },
    // end - xml parser
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
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  margin: 0;
  text-transform: uppercase;
}

.box-description {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
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
