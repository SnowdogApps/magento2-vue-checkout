<template>
  <button
    :type="buttonType"
    :disabled="isBlocked"
    class="button"
  >
    <div class="button__handler">
      <span class="button__text">
        {{ text }}
      </span>

      <template v-if="withLoader">
        <BaseLoader/>
      </template>
    </div>
  </button>
</template>

<script>
import BaseLoader from './BaseLoader.vue'

export default {
  components: {
    BaseLoader
  },
  props: {
    buttonType: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    withLoader: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    isBlocked () {
      return this.$store.state.loader
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
</style>
