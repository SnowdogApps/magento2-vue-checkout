<template>
  <div :class="{'input--error': errors.has(name) }">
    <label :for="name">
      {{ label }}
    </label>

    <select
      :value="value"
      :name="name"
      :id="name"
      :data-vv-as="label"
      v-validate="validateType"
      @input="$emit('input', $event.target.value)"
    >
      <slot name="default-option"/>
      <template class="list-item" v-for="option in options">
        <slot v-bind="option"/>
      </template>
    </select>

    <span v-show="errors.has(name)" class="input__message">
      {{ errors.first(name) }}
    </span>
  </div>
</template>

<script>
export default {
  inject: ['$validator'],
  props: {
    options: {
      type: Array
    },
    label: {
      type: String
    },
    name: {
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

<style lang="scss" scoped>
.input {
  &--error {
    & > select {
      border-color: red;
    }

    & .input__message {
      display: block;
      color: red;
    }
  }
}
</style>
