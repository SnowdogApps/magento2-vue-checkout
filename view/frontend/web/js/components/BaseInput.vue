<template>
  <div v-bind:class="{ 'form-group--error': $v.name.$error }">
    <label :for="name">
        {{ label }}
    </label>

    <input
      :type="type"
      :id="name"
      :name="name"
      :value="value"
      @input="$v.name.$touch()"
    />
  </div>
  <span class="form-group__message">Field is required</span>
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
