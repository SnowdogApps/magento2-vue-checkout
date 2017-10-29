<template>
  <div :class="containerClass">
    <template v-for="option in options">
      <div
        :class="fieldClass"
        :key="option.id"
      >
        <input
          type="radio"
          :id="option.code"
          :name="name"
          :value="option.code"
          :class="inputClass"
        />

        <label
          :class="labelClass"
          :for="option.code"
        >
          {{ option.title }}
        </label>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array
    },
    labelClass: {
      type: String
    },
    name: {
      type: String
    },
    containerClass: {
      type: String
    },
    fieldClass: {
      type: String
    },
    inputClass: {
      type: String
    }
  }
}
</script>
