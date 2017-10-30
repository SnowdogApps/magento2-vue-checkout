<template>
  <div :class="fieldClass">
    <input
      type="checkbox"
      :id="id"
      :name="name"
      :class="inputClass"
      :checked="checked"
    />

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
      type: String
    },
    id: {
      type: String
    },
    name: {
      type: String
    },
    fieldClass: {
      type: String
    },
    inputClass: {
      type: String
    },
    text: {
      type: String
    },
    checked: {
      type: String
    }
  }
}
</script>
