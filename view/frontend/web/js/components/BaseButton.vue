<template>
  <button :type="buttontype"
          :title="buttontitle"
  >
    {{ text }}
  </button>
</template>


<script>
export default {
  props: {
    buttontype: {
        type: String
    },
    text: {
        type: String
    },
    buttontitle: {
        type: String
    }
  }
}
</script>
