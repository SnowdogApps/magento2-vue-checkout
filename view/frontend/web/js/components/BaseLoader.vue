<template>
  <div class="loader" v-if="loader">
    <svg>
      <circle cx="4" cy="4" r="4">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.1"
        />
      </circle>

      <circle cx="18" cy="4" r="4">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.2"
        />
      </circle>

      <circle cx="32" cy="4" r="4">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.3"
        />
      </circle>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
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

<script>
export default {
  computed: {
    loader () {
      return this.$store.state.loader
    }
  }
}
</script>
