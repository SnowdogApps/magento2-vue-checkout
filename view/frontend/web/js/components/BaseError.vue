<template>
  <div
    class="error"
    :class="{ errorClass : errorClass, 'error--hidden' : errorHidden }"
  >
    <div class="erorr__wrapper">
      <svg class="error__icon">
          <use xlink:href="./assets/close.svg"></use>
      </svg>

      <span class="error__text">
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errorClass: {
      type: String
    },
    text: {
      type: String
    }
  },
  computed: {
    errorHidden() {
      return this.$store.errorHidden;
    }
  },
  methods: {
    autoHideError() {
      if (!this.$store.errorHidden) {
        setInterval(function() {
          this.$store.errorHidden = true;
        }, 5000);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .error {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 10px;
    background-color: #ff8989;
    border-top: 1px solid #ff6060;
    text-align: center;

    &--hidden {
      display: none;
    }

    &__text {
      color: #444;
    }

    &__error-icon {
      fill: #444;
    }
  }
</style>
