<template>
  <BaseRadio
    v-for="(option, index) in options"
    :id="option[idKey]"
    :key="index"
    :value="valueKey ? option[valueKey]: option"
    :label="option[labelKey]"
    :name="name"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  />
  <template v-if="validation && validation.$error">
    <span
      v-for="error in validation.$errors"
      :key="error.$uid"
    >
      {{ error.$message }}
    </span>
  </template>
</template>

<script>
import BaseRadio from './BaseRadio.vue'
export default {
  components: {
    BaseRadio
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Number, Object],
      required: true
    },
    labelKey: {
      type: String,
      required: true
    },
    valueKey: {
      type: String,
      default: null
    },
    idKey: {
      type: String,
      default: null
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
