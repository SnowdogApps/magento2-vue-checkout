<template>
  <div :class="fieldClass">
    <label :for="name">
      {{ label }}
    </label>

    <select
      :name="name"
      :id="name"
      :class="selectClass"
    >
      <option
        v-for="option in options"
        :key="option.id"
        :value="option.value"
        :selected="option.selected"
        :disabled="option.disabled"
        :data-countryid="option.country_id"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array
    },
    label: {
      type: String
    },
    name: {
      type: String
    },
    fieldClass: {
      type: String
    },
    selectClass: {
      type: String
    }
  }
}
</script>
