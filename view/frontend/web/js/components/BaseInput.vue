<template>
  <div :class="{ 'input--error': $v.field.$error }">
    <label :for="name">
        {{ label }}
    </label>

    <input
      :type="type"
      :id="name"
      :name="name"
      v-model="field"
      @input="$v.field.$touch()"
    />

    <span class="input__message" v-if="!$v.field.required">
      Field is required
    </span>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      field: this.value
    }
  },
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
    }
  },
  validations: {
    field: {
      required
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

  &__message {
    display: none;
  }
}
</style>
