<template>
  <button :type="buttonType">
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    buttonType: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>
