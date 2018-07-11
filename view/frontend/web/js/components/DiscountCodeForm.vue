<template>
  <div>
    <h2>
      Discount
    </h2>

    <div class="discount-code">
      <form class="discount__form">
        <BaseInput
          v-model="discountCode"
          type="text"
          label="Apply Discount Code"
          name="discount_code"
        />

        <BaseButton
          class="button"
          button-type="button"
          text="Apply Discount"
          @click.native="applyDiscount"
        />
      </form>

      <div class="discount-code__container">
        <div
          v-for="(discount, index) in discountCodes"
          :key="index"
          class="discount-code__item"
        >
          {{ disconut.text }}
        </div>
      </div>
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
      discountCode: ''
    }
  },
  computed: {
    discountCodes () {
      return this.$store.state.discountCodes
    }
  },
  methods: {
    applyDiscount () {
      // start loading here
      this.$store.dispatch('applyDiscount', this.discountCode)
    }
  }
}
</script>
