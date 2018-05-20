<template>
  <button :type="buttonType" :title="buttonTitle">
    {{ text }}
  </button>
</template>


<script>
export default {
  props: {
    buttonType: {
      type: String
    },
    text: {
      type: String
    },
    buttonTitle: {
      type: String
    }
  }
}
</script>
