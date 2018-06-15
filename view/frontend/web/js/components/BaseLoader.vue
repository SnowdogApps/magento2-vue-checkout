<template>
  <div class="loader" v-if="loader">
    <LoaderIcon/>
  </div>
</template>

<script>
import LoaderIcon from '../assets/loader.svg'

export default {
  computed: {
    loader () {
      return this.$store.state.loader
    }
  },
  components: {
    LoaderIcon
  }
}
</script>

<style lang="scss">
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-left: 10px;

    svg {
      width: 36px;
      height: 8px;

      circle {
        fill: #47b784;
        stroke: none;
      }
    }
  }
</style>
