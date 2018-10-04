<template>
  <div>
    <p>
      {{ billingAddress.firstname }} {{ billingAddress.lastname }}
    </p>
    <p>
      {{ billingAddress.telephone }}
    </p>
    <p>
      {{ billingAddress.street[0] }} {{ billingAddress.street[1] }}
    </p>
    <p>
      {{ billingAddress.city }}
    </p>
    <p>
      {{ billingAddress.postcode }}
    </p>
    <p>
      {{ billingAddress.company }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    billingAddress: {
      type: Object,
      required: true
    }
  }
}
</script>
