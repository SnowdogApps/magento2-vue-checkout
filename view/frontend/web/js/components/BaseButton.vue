<template>
  <button :type="buttontype"
          :class="buttonclass"
          :title="buttontitle"
  >
    {{ text }}
  </button>
</template>


<script>
export default {
  props: {
    buttonclass: {
        type: String
    },
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
