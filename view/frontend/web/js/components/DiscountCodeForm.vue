<template>
  <div>
    <h2>
      {{ $t('Discount') }}
    </h2>
    <div class="discount-code">
      <form class="discount__form">
        <BaseInput
          v-model="discount.code"
          :read-only="couponCode !== ''"
          :label="$t('Apply Discount Code')"
          name="discount-code"
        />
        <BaseButton
          v-if="couponCode === ''"
          :loader="loader"
          :text="$t('Apply Discount')"
          class="button"
          with-loader
          @click.native="applyDiscount"
        />
        <BaseButton
          v-else
          :loader="loader"
          :text="$t('Remove Discount')"
          class="button"
          @click.native="removeDiscount"
        />
        <p
          v-if="error"
          class="discount__form-error"
        >
          {{ error }}
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
      error: ''
    }
  },
  computed: {
    couponCode () {
      return this.$store.getters.couponCode
    }
  },
  created () {
    if (this.couponCode !== '') {
      this.discount.code = this.couponCode
      this.discount.method = 'PUT'
    }
  },
  methods: {
    applyDiscount () {
      this.error = ''
      this.discount.method = 'PUT'
      this.loader = true

      this.$store.dispatch('manageDiscount', this.discount)
        .then(() => {
          this.$store.dispatch('getTotals')
          this.loader = false
        })
        .catch((error) => {
          this.loader = false

          if (error.status === 404) {
            this.error = this.$t('Coupon code not found!', { code: this.discount.code })
          } else {
            this.error = this.$t('Something goes wrong when trying to send coupon code. Please try again later.')
          }
        })
    },
    removeDiscount () {
      this.error = ''
      this.discount.method = 'DELETE'
      this.loader = true

      this.$store.dispatch('manageDiscount', this.discount)
        .then(() => {
          this.loader = false
          this.discount.code = ''
          this.$store.dispatch('getTotals')
        })
        .catch((error) => {
          this.loader = false

          if (error.status === 404) {
            this.error = this.$t('Failed when trying to delete coupon code', { code: this.discount.code })
          } else {
            this.error = this.$t('Something goes wrong when trying to delete coupon code')
          }
        })
    }
  }
}
</script>
