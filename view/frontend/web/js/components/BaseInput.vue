<template>
  <div :class="{'input--error': errors.has(name) }">
    <label :for="name">
      {{ label }}
    </label>
    <input
      v-validate="validateType"
      :type="type"
      :id="name"
      :name="name"
      :data-vv-as="label"
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
    <span
      v-show="errors.has(name)"
      class="input__message"
    >
      {{ errors.first(name) }}
    </span>
  </div>
</template>

<script>
export default {
  inject: ['$validator'],
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    validateType: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  &--error {
    & > input {
      border-color: red;
    }

    & .input__message {
      display: block;
      color: red;
    }
  }
}
</style>
