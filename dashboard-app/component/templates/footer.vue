

<template lang="html">
    <div id="footer-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="css">
#footer-wrapper {
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  margin: 3px 10px 0px 10px;
  position: relative;
  z-index: 1;
}

#footer-wrapper > div {
  margin-left: 4px;
}

#footer-wrapper > div:first-child {
  margin-left: 0;
}

.data {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-font-size);
  font-weight: 400;
  margin: 4px;
}
</style>
