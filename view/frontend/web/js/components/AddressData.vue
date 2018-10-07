<template>
  <address>
    {{ address.firstname }} {{ address.lastname }}<br>
    {{ address.street[0] }} {{ address.street[1] }}<br>
    {{ address.city }}<br>
    {{ address.postcode }}<br>
    {{ address.region }}<br>
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
