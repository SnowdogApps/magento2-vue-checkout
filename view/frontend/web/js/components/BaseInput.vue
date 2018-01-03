<template>
  <div>
    <label :for="name">
        {{ label }}
    </label>

    <input
      :type="type"
      :id="name"
      :name="name"
      :value="value"
      @input="$emit('input', $event.target.value)"
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
    type: {
      type: String
    },
    value: {
      type: String
    }
  }
}
</script>
