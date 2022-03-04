<template>
  <div :class="['input', { 'input--error': validation && validation.$error }]">
    <label :for="name">
      {{ label }}
    </label>
    <input
      :id="name"
      :type="type"
      :name="name"
      :readonly="readOnly"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
    <!-- <template v-if="validation">
      <span
        v-for="(value, key, index) in validation.$params"
        v-if="validation.$error && !validation[key]"
        :key="index"
      >
        {{ errorNotification[key] }}
      </span>
    </template> -->
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    validateType: {
      type: String,
      required: false,
      default: '',
    },
    value: {
      type: String,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    validation: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  emits: ['input'],
  data() {
    return {
      errorNotification: {
        required: 'This field is required!',
        email: 'Please enter a valid email address!',
      },
    };
  },
};
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
