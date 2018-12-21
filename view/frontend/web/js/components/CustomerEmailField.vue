<template>
  <div>
    <BaseInput
      v-model.trim="$v.email.$model"
      :validation="$v.email"
      label="Email"
      name="email"
      type="email"
      @input="checkIsEmailAvailable"
    />
    <span
      v-if="emailAvailabilityMessage"
      v-html="emailAvailabilityMessage"
    />
    <hr>
  </div>
</template>

<script>
import BaseInput from './BaseInput.vue'
import axios from './../utils/checkout-axios.js'
import { required, email } from 'vuelidate/lib/validators'

export default {
  components: {
    BaseInput
  },
  data () {
    return {
      email: '',
      emailAvailable: false
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  computed: {
    customerData () {
      return this.$store.state.customer
    },
    ready () {
      return !this.$v.email.$invalid
    },
    emailAvailabilityMessage () {
      if (this.email !== '' && !this.$v.email.$error) {
        if (this.emailAvailable) {
          return `You can create an account after checkout.`
        } else {
          return `
            You already have an account with us.
            Sign in <a href="/customer/account/login/">here</a> or continue as guest.
          `
        }
      } else {
        return false
      }
    }
  },
  watch: {
    ready (val) {
      this.$emit('ready', val)
    }
  },
  created () {
    if (
      this.customerData !== null &&
      this.customerData.hasOwnProperty('email')
    ) {
      this.email = this.customerData.email
    }
  },
  methods: {
    touch () {
      this.$v.email.$touch()
    },
    checkIsEmailAvailable () {
      const options = {
        method: 'POST',
        data: JSON.stringify({
          'customerEmail': this.email
        }),
        url: 'customers/isEmailAvailable'
      }
      axios(options)
        .then(({data}) => {
          this.emailAvailable = data
        })
        .catch(error => {
          console.error('Looks like there was a problem: \n', error)
        })

      this.$store.commit('setItem', {
        item: 'customer',
        value: {
          email: this.email
        }
      })
    }
  }
}
</script>
