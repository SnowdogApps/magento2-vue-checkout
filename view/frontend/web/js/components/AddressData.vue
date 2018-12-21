<template>
  <address :class="{ active: address.default_billing }">
    {{ address.firstname }} {{ address.lastname }}<br>
    {{ address.street[0] }} {{ address.street[1] }}<br>
    {{ address.city }}<br>
    {{ address.postcode }}<br>
    <template v-if="typeof address.region === 'object'">
      {{ address.region.region }}<br>
    </template>
    <template v-else>
      {{ address.region }}<br>
    </template>
    {{ address.country_id.label }}<br>
    {{ address.telephone }}<br>
    {{ address.company }}
  </address>
</template>

<script>
export default {
  props: {
    address: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
  .active {
    border: 1px solid #000;
  }
</style>
