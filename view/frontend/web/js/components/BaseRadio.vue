<template>
  <div class="v-radio">
    <input
      :id="id"
      :checked="modelValue === value"
      type="radio"
      :value="value"
      v-bind="$attrs"
      @change="$emit('update:modelValue', value)"
    >
    <label
      :for="id"
      class="v-radio__label"
    >
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Number, Object],
      default: ''
    },
    value: {
      type: [String, Number, Object],
      required: true
    },
    validation: {
      type: Object,
      required: false,
      default: () => { }
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.v-radio {
  display: flex;
  align-items: center;
}

.v-radio__label {
  display: flex;
  margin: 0;
}
</style>
