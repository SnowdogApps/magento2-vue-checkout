<template>
  <div :class="fieldclass">
    <label :for="name">
        {{ label }}
    </label>

    <input :type="type"
           :id="name"
           :name="name"
           :class="inputclass"
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
    fieldclass: {
      type: String
    },
    inputclass: {
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
