<template>
  <div>
    <AddressData
      v-for="address in addresses"
      :address="address"
      :key="address.id"
      class="address-item"
    />
  </div>
</template>

<script>
import AddressData from './AddressData.vue'

export default {
  components: {
    AddressData
  },
  computed: {
    addresses () {
      if (this.$store.state.customer !== null) {
        return this.$store.state.customer.addresses
      }
    }
  }
}
</script>

<style>
  .address-item {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #c2c2c2;
  }
</style>
