<template>
  <div :class="{ 'form-group--error': required }">
    <label :for="name">
        {{ label }}
    </label>

    <input
      :type="type"
      :id="name"
      :name="name"
      :value="value"
      @input="checkInput"
    />
    <pre>value: {{ $v.value }}</pre>
    <span class="form-group__message" v-if="!$v.value.required">Field is required</span>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
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
    required: {
      type: String
    }
  },
  computed: {
    checkInput() {
      return $v.value.$touch();
    }
  },
  validations: {
    value: {
      required
    }
  }
}
</script>
