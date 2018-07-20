<template>
  <div>
    <h2>
      Discount
    </h2>

    <div class="discount-code">
      <form class="discount__form">
        <BaseInput
          v-model="discount.code"
          :read-only="readOnly"
          type="text"
          label="Apply Discount Code"
          name="discount_code"
        />

        <BaseButton
          v-if="!readOnly"
          class="button"
          button-type="button"
          text="Apply Discount"
          with-loader
          @click.native="applyDiscount"
        />

        <BaseButton
          v-if="readOnly"
          class="button"
          button-type="button"
          text="Remove Discount"
          with-loader
          @click.native="removeDiscount"
        />
      </form>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'

export default {
  components: {
    BaseButton,
    BaseInput
  },
  data () {
    return {
      discount: {
        method: '',
        code: ''
      },
      readOnly: false
    }
  },
  methods: {
    applyDiscount () {
      this.discount.method = 'PUT'
      this.$store.commit('setItem', { item: 'loader', value: true })
      this.$store.dispatch('manageDiscount', this.discount)
        .then(() => {
          this.readOnly = true
          this.$store.dispatch('updateTotals')
        })
    },
    removeDiscount () {
      this.discount.method = 'DELETE'
      this.$store.commit('setItem', { item: 'loader', value: true })
      this.$store.dispatch('manageDiscount', this.discount)
        .then(() => {
          this.readOnly = false
          this.discount.code = ''
          this.$store.dispatch('updateTotals')
        })
    }
  }
}
</script>
