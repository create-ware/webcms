<template lang="html">
  <div id="modal-box-wrapper">
    <div id="position-wrapper">
      <LoadingBar v-if="isLoading"/>
      <div id="modal-box-content">
        <div id="header">
          <h2>
            {{ modalTitle }}
          </h2>
          <p id="modal-description">
            {{ modalDescription }}
          </p>
        </div>
        <div id="content">
          <VuePerfectScrollbar id="scrollbar">
          <div
            id="content"
            v-if="invoices.getModels().length">
            <div
              v-for="(invoice) in invoices.getModels()"
              v-bind:class="{
                'invoice': true,
                'remove': invoice.get('remove')
                }">
              <div
                class="invoice-info"
                v-on:click="onInvoiceClick(invoice)">
                <div
                  class="thumbnail"
                  v-bind:style="getStyles(invoice)">
                  <i class="letter">
                    {{ getLetterFromInvoiceName(invoice) }}
                  </i>
                </div>
                <p class="invoice-name">
                  {{ invoice.get('uuid') }} |
                  {{ invoice.get('name') }} |
                  {{ invoice.get('rfc') }} |
                  {{ invoice.get('concept') }} |
                  {{ invoice.get('subtotal') }} |
                  {{ invoice.get('tax') }} |
                  {{ invoice.get('total') }} |
                  {{ invoice.get('stamp_date') }}
                </p>
              </div>
              <ButtonIcon
                v-if="!invoice.get('remove')"
                class="button-action"
                buttonIcon="cancel"
                v-bind:buttonAction="onClickToRemove"
                v-bind:buttonData="invoice"/>
              <ButtonIcon
                v-if="invoice.get('remove')"
                class="button-action"
                buttonIcon="add"
                v-bind:buttonAction="onClickToAdd"
                v-bind:buttonData="invoice"/>
            </div>
          </div>
          </VuePerfectScrollbar>
        </div>
        <div id="footer">
          <InvoiceFile v-bind:onLoad="onLoadFile"/>
          <Button
            buttonIcon="done"
            v-bind:buttonAction="this.onClickClose">
            {{ $t('accept') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import Button from './button.vue'
import LoadingBar from './loading-bar.vue'
import ButtonIcon from './button-icon.vue'
import InvoiceFile from './invoice-file.vue'

export default {
  props: [
    'modalTitle',
    'modalDescription',
    'onClickClose',
    'onClickSelect',
    'invoices',
    'onClickRemove',
    'onClickAdd',
  ],
  data () {
    return {
      libraryModalData: {
        modalTitle: 'all invoices',
        modalDescription: 'chose one invoice or upload new',
        closeInvoiceModal: this.closeLibraryModal,
        onInvoiceSelect: this.onSelectInvoice,
      },
      isLoading: false,
    }
  },
  components: {
    VuePerfectScrollbar,
    Button,
    LoadingBar,
    ButtonIcon,
    InvoiceFile,
  },
  methods: {
    openLibraryModal () {
      this.$eventHub.$emit('invoice-modal', this.libraryModalData)
    },
    closeLibraryModal () {
      this.$eventHub.$emit('invoice-modal', null)
    },
    onSelectInvoice (data) {
      this.closeLibraryModal()
      this.onClickSelect(data)
    },
    getStyles (invoice) {
      let invoiceName = invoice.get('name')
      return this.$getHexColor(invoiceName)
    },
    getLetterFromInvoiceName (invoice) {
      let invoiceOriginalName = invoice.get('name')[0]
      return invoiceOriginalName
    },
    onInvoiceClick (invoice) {
      // let invoiceURL = invoice.getInvoiceURL()
      // window.open(invoiceURL, '_blank')
      console.log('== open file - not implemented ==')
    },
    onClickToRemove (invoice) {
      for (let attachment of this.invoices.getModels()) {
        let id = attachment.get('id')
        let fileId = invoice.get('id')
        let attachmentIdToRemove = invoice.get('id')
        let currentAttachmentId = attachment.get('id')
        if (attachmentIdToRemove === currentAttachmentId && id === undefined || id === 0) {
          this.invoices.remove(attachment)
          break
        }
        if (id === fileId) {
          attachment.set('remove', true)
          break
        }
      }
      this.onClickRemove(invoice)
    },
    onClickToAdd (invoice) {
      for (let attachment of this.invoices.getModels()) {
        let id = attachment.get('id')
        let invoiceId = invoice.get('id')
        if (id === invoiceId) {
          attachment.set('remove', false)
          return
        }
      }
      this.onClickAdd(invoice)
    },
    onLoadFile (invoice) {
      this.invoices.add(invoice)
    },
  },
}
</script>

<style scoped lang="css">
h2 {
  color: var(--main-accent-color);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1;
  margin: 0;
  padding: 0;
}

#modal-description {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 20px;
  margin-bottom: 5px;
  margin-top: 0;
}

#modal-box-wrapper {
  background-color: var(--main-modal-bkg);
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 4;
}

#position-wrapper {
  box-sizing: border-box;
  margin: auto;
  max-width: 1145px;
  padding: 6px;
  position: relative;
  width: 100%;
}

#modal-box-content {
  background-color: var(--main-box-bg-color);
  border-radius: 7px;
  box-shadow: var(--main-box-shadow);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 480px;
  margin: auto;
  overflow: hidden;
  position: relative;
  transition-duration: 200ms;
  transition-property: background-color;
  width: 100%;
}

#scrollbar {
  flex-grow: 1;
}

#content {
  height: 100%;
  position: relative;
}

#footer {
  box-sizing: border-box;
  display: flex;
  flex-grow: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin: 8px 0 0 0;
  padding: 8px;
  width: 100%;
}

.invoice {
  border-radius: 7px;
  cursor: pointer;
  display: flex;
  margin: 0 8px;
  max-width: 100%;
  padding: 0 8px;
  position: relative;
}

.invoice:nth-child(even) {
  background-color: var(--main-table-bg-row);
}

.invoice.remove {
  background-color: var(--main-red-color);
}

.invoice-info {
  display: flex;
  padding: 4px 0;
  width: calc(100% - 50px);
}

.invoice-name {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-accent-font-size);
  line-height: 1;
  margin: 0 0 0 8px;
  position: relative;
  text-overflow: ellipsis;
}

.invoice:hover {
  background-color: var(--main-hover-color);
}

.invoice:active {
  background-color: var(--main-active-color);
}

.invoice:active .invoice-name {
  color: var(--main-accent-color);
}

.thumbnail {
  align-self: center;
  border-radius: 7px;
  display: flex;
  flex-shrink: 0;
  height: 24px;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 24px;
}

.letter {
  align-self: center;
  color: var(--main-letter-color);
  display: flex;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  margin: auto;
  margin: auto;
  position: absolute;
  text-transform: uppercase;
}

.button-action {
  margin: 4px;
  max-height: 24px;
  position: absolute !important;
  right: 6px;
  z-index: 2;
  top: 0;
  bottom: 0;
}

#content {
  height: 280px;
}


#header {
  margin: 8px 8px 0 8px;
}

h2 {
  color: var(--main-accent-color);
  font-size: calc(var(--main-font-size) - 2px);
  font-weight: bold;
  letter-spacing: normal;
  padding: 0;
  margin: 0;
  text-transform: uppercase;
  white-space: nowrap;
}

#modal-description {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 600;
  padding: 0;
  margin: 0;
}
</style>
