<template>
  <div :class="fieldclass">
    <input type="checkbox"
           :id="id"
           :name="name"
           :class="inputclass"
           :checked="checked"
    />

    <label :class="labelclass" :for="id">
      {{ text }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    labelclass: {
      type: String
    },
    id: {
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
    text: {
      type: String
    },
    checked: {
      type: String
    }
  }
}
</script>
