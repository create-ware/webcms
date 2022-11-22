<template lang="html">
  <div id="wrapper">
    <input
      id="input"
      type="file"
      ref="file"
      name="file"
      @change="addFile()"/>
    <div
      v-bind:class="{
        'dropzone': true,
        'error': fileError,
      }"
      ref="dropzone">
      <div>
        <p class="description">
          {{ $t('choose a file or drag it here') }}
        </p>
        <p class="file-name">
          {{ fileName }}
        </p>
        <p v-if="fileError">
          {{ fileError }}
        </p>
        <i class="material-icons-round">
          cloud_upload
        </i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'xmlProps',
    'onLoad',
  ],
  data () {
    return {
      file: null,
      fileName: '',
      fileError: '',
      invoiceData: {
        name: '',
        rfc: '',
        stamp_date: '',
        subtotal: 0.0,
        tax: 0.0,
        total: 0.0,
        concept: '',
        uuid: '',
      },
    }
  },
  components: {},
  created () {
  },
  mounted () {
    this.addDragEnterAndLeaveEventListener()
  },
  methods: {
    addFile () {
      let files = this.$refs.file.files
      if (files.length === 0) {
        this.$refs.file.value = null
        this.fileName = ''
        this.fileError = 'select a *.xml file'
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
      this.fileError = 'select a *.xml file'
      this.$refs.file.value = null
    },
    parseFileContent (event) {
      let contentLines = event.target.result
      let parser = new DOMParser()
      let xmlDoc = parser.parseFromString(contentLines, 'text/xml')
      // NOTE: xml tags
      let transmitterTag = xmlDoc.getElementsByTagName('cfdi:Emisor')[0]
      let stampTag = xmlDoc.getElementsByTagName('tfd:TimbreFiscalDigital')[0]
      let cfdiTag = xmlDoc.getElementsByTagName('cfdi:Comprobante')[0]
      let cfdiTransTag = xmlDoc.getElementsByTagName('cfdi:Traslado')[0]
      let cfdiConceptTag = xmlDoc.getElementsByTagName('cfdi:Concepto')
      let concepts = ''
      for (let concept of cfdiConceptTag)
        concepts = `${ concepts }\n${ concept.getAttribute('Cantidad') } | ${ concept.getAttribute('Descripcion') }`
      this.invoiceData = {
        name: transmitterTag.getAttribute('Nombre'),
        rfc: transmitterTag.getAttribute('Rfc'),
        stamp_date: stampTag.getAttribute('FechaTimbrado'),
        subtotal: cfdiTag.getAttribute('SubTotal'),
        tax: cfdiTransTag.getAttribute('Importe'),
        total: cfdiTag.getAttribute('Total'),
        concept: concepts,
        uuid: stampTag.getAttribute('UUID'),
      }
      this.reset()
      this.onLoad(this.invoiceData)
    },
    addDragEnterAndLeaveEventListener () {
      this.$refs.file.addEventListener('dragover', e => {
        e.preventDefault()
        e.stopPropagation()
        this.$refs.dropzone.classList.add('dragover')
      })
      this.$refs.file.addEventListener('dragleave', e => {
        e.preventDefault()
        e.stopPropagation()
        this.$refs.dropzone.classList.remove('dragover')
      })
      this.$refs.file.addEventListener('drop', e => {
        this.$refs.dropzone.classList.remove('dragover')
      })
    },
    reset () {
      this.$refs.file.value = null
      this.fileName = ''
      this.fileError = ''
    },
  },
}
</script>

<style scoped lang="css">

#wrapper {
  margin: auto auto 8px auto;
  position: relative;
  width: 100%;
}

#input {
  background-color: transparent;
  cursor: pointer;
  display: flex;
  height: 100%;
  left: 0;
  opacity: 0;
  outline: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

.dropzone {
  background-color: #f8f8f8;
  border-radius: 8px;
  border: 2px dashed #ccc;
  box-sizing: border-box;
  color: var(--main-text-color);
  display: flex;
  height: 100px;
  left: 0;
  pointer-events: none;
  position: relative;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
}

.dropzone.error {
  border: 2px dashed red;
}

.dropzone.dragover {
  background-color: var(--main-active-color);
}

.dropzone p {
  font-size: var(--main-accent-font-size);
  margin: 0;
}

.dropzone i {
  font-size: 40px;
}

.dropzone div {
  align-self: center;
  display: flex;
  flex-direction: column;
  margin: auto;
  text-align: center;
}
</style>
