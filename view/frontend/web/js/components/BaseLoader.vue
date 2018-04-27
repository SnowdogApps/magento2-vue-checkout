<template>
  <div class="loader" v-if="loader">
    <svg>
      <circle cx="6" cy="6" r="6">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.1"
        />
      </circle>

      <circle cx="26" cy="6" r="6">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.2"
        />
      </circle>

      <circle cx="46" cy="6" r="6">
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
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    z-index: 9;

    svg {
      width: 53px;
      height: 12px;

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
