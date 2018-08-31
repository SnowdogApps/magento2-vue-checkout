<template>
  <button
    :type="type"
    class="button"
  >
    <span class="button__handler">
      <span class="button__text">
        {{ text }}
      </span>
      <BaseLoader v-show="loader" />
    </span>
  </button>
</template>

<script>
import BaseLoader from './BaseLoader.vue'

export default {
  components: {
    BaseLoader
  },
  props: {
    type: {
      type: String,
      default: 'button'
    },
    text: {
      type: String,
      required: true
    },
    loader: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  &__handler {
    display: flex;
    align-items: center;
  }

  &__text {
    display: block;
    white-space: nowrap;
  }

  &:disabled {
    opacity: 0.5;
  }
}

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
