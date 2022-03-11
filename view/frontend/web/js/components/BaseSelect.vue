<template>
  <label :for="id">
    {{ label }}
  </label>
  <select
    :id="id"
    class="select"
    :value="modelValue"
    v-bind="{
      ...$attrs,
      onChange: ($event) => { $emit('update:modelValue', $event.target.value) }
    }"
  >
    <option
      v-for="option in options"
      :key="option"
      :value="option.value"
      :selected="option === modelValue"
    >
      {{ option.label }}
    </option>
  </select>
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
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
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

<style>
.select {
  width: 100%;
  padding: 5px 10px;
  border: 1px solid #ccc;
}
</style>
