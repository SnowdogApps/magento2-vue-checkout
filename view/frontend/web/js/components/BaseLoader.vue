<template>
  <div
    v-if="loader"
    class="loader"
  >
    <LoaderIcon/>
  </div>
</template>

<script>
import LoaderIcon from '../assets/loader.svg'

export default {
  components: {
    LoaderIcon
  },
  computed: {
    loader () {
      return this.$store.state.loader
    }
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
