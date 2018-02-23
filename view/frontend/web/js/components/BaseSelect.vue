<template>
  <div>
    <label :for="name">
      {{ label }}
    </label>

    <select
      :value="value"
      :name="name"
      :id="name"
      @input="$emit('input', $event.target.value)"
    >
      <slot name="default-option"/>
      <template class="list-item" v-for="option in options">
        <slot v-bind="option"/>
      </template>
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
    value: {
      type: String
    }
  }
}
</script>
