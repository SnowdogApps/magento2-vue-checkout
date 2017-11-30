<template>
  <div :class="fieldClass">
    <label :for="name">
        {{ label }}
    </label>

    <input
      :type="type"
      :id="name"
      :name="name"
      :class="inputClass"
      :value="value"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: {
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
    type: {
      type: String
    },
    value: {
      type: String
    }
  }
}
</script>
