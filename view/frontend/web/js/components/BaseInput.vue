<template>
  <div :class="{'input--error': errors.has(name) }">
    <label :for="name">
      {{ label }}
    </label>

    <input
      :type="type"
      :id="name"
      :name="name"
      :data-vv-as="label"
      v-validate="validateType"
      @input="$emit('input', $event.target.value)"
    />

    <span v-show="errors.has(name)" class="input__message">
      {{ errors.first(name) }}
    </span>
  </div>
</template>

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

<script>
export default {
  inject: ['$validator'],
  props: {
    label: {
      type: String
    },
    name: {
      type: String
    },
    type: {
      type: String
    },
    value: {
      type: String
    },
    validateType: {
      type: String
    }
  }
}
</script>
