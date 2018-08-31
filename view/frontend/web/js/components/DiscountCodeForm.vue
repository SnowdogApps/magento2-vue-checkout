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
          :loader="loader"
          class="button"
          button-type="button"
          text="Apply Discount"
          with-loader
          @click.native="applyDiscount"
        />

        <BaseButton
          v-if="readOnly"
          :loader="loader"
          class="button"
          button-type="button"
          text="Remove Discount"
          @click.native="removeDiscount"
        />

        <p
          v-if="error.isVisible"
          class="discount__form-error"
        >
          {{ error.message }}
        </p>
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
      loader: false,
      readOnly: false,
      error: {
        isVisible: false,
        message: ''
      }
    }
  },
  methods: {
    applyDiscount () {
      this.error.isVisible = false
      this.discount.method = 'PUT'
      this.loader = true

      this.$store.dispatch('manageDiscount', this.discount)
        .then(() => {
          this.readOnly = true
          this.$store.dispatch('getTotals')
          this.loader = false
        })
        .catch((error) => {
          this.error.isVisible = true
          this.readOnly = false
          this.loader = false

          if (error.status === 404) {
            this.error.message = `Coupon code not found! Failed when trying to activate: '${this.discount.code}' coupon code. Please use another one.`
          } else {
            this.error.message = 'Something goes wrong when trying to send coupon code. Please try again later.'
          }
        })
    },
    removeDiscount () {
      this.error.isVisible = false
      this.discount.method = 'DELETE'
      this.loader = true

      this.$store.dispatch('manageDiscount', this.discount)
        .then(() => {
          this.readOnly = false
          this.discount.code = ''
          this.$store.dispatch('getTotals')
        })
        .catch((error) => {
          this.error.isVisible = true
          this.readOnly = false
          this.loader = false

          if (error.status === 404) {
            this.error.message = `Failed when trying to delete: '${this.discount.code}' coupon code. Coupon code not found!`
          } else {
            this.error.message = 'Something goes wrong when trying to delete coupon code. Please try again later.'
          }
        })
    }
  }
}
</script>
