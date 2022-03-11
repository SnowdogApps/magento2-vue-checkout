<template>
  <div class="v-input">
    <label :for="id">
      {{ label }}
    </label>
    <input
      v-bind="$attrs"
      :id="id"
      type="text"
      class="v-input__field"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
    <template v-if="validation && validation.$error">
      <span
        v-for="error in validation.$errors"
        :key="error.$uid"
      >
        {{ error.$message }}
      </span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      default: ''
    },
    validation: {
      type: Object,
      required: false,
      default: () => { }
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      errorNotification: {
        required: 'This field is required!',
        email: 'Please enter a valid email address!'
      }
    }
  }
}
</script>

<style scoped>
.v-input {
  display: flex;
  flex-direction: column;
}

.v-input__field {
  padding: 5px 10px;
  border: 1px solid #ccc;
}
</style>
