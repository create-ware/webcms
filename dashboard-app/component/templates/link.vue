<template lang="html">
  <div id="link-wrapper" v-bind:style="this.getColor()">
    <i class="material-icons-round link-icon">
      {{ linkIcon }}
    </i>
    <a v-bind:href="linkURL" class="link-url" :target="linkTarget">
      {{ $t(linkLabel) }}
    </a>
  </div>
</template>

<script>
export default {
  props: [
    'linkURL',
    'linkIcon',
    'linkLabel',
    'linkColor',
    'linkTarget',
  ],
  data() {
    return {}
  },
  created() {},
  methods: {
    getColor () {
      if (this.linkColor)
        return `color: ${ this.linkColor }`

      return 'color: var(--main-text-color)'
    },
  },
}
</script>

<style scoped lang="css">
#link-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background: transparent;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  display: flex;
  font-size: var(--main-font-size);
  font-weight: 500;
  height: 14px;
  outline: none;
  padding: 6px 15px;
  position: relative;
  text-transform: capitalize;
  user-select: none;
}

#link-wrapper:hover {
  background-color: var(--main-hover-color);
  color: var(--main-accent-color) !important;
}

#link-wrapper .icon {
  color: inherit;
  font-size: 16px;
  margin-right: 5px;
}

.link-url {
  color: inherit;
  text-decoration: none;
}

.link-icon {
  font-size: 16px;
  line-height: 15px;
  margin-right: 5px;
}
</style>
