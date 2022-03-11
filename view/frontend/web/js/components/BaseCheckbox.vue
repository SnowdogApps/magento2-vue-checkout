<template>
  <div :class="fieldClass">
    <input
      :id="id"
      :name="name"
      :class="inputClass"
      :checked="value"
      type="checkbox"
      @change="$emit('input', $event.target.checked)"
    >
    <label
      :class="labelClass"
      :for="id"
    >
      {{ text }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    labelClass: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    fieldClass: {
      type: String,
      required: true
    },
    inputClass: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  emits: ['input']
}
</script>
