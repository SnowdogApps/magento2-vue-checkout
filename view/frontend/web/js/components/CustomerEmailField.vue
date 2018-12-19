<template>
  <div>
    <BaseInput
      v-model.trim="$v.customer.email.$model"
      :validation="$v.customer.email"
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
import { requiredIf, email } from 'vuelidate/lib/validators'

export default {
  components: {
    BaseInput
  },
  data () {
    return {
      customer: {
        email: '',
        emailAvailable: false
      }
    }
  },
  validations: {
    customer: {
      email: {
        required: requiredIf(function () {
          return !this.isCustomerLoggedIn
        }),
        email
      }
    }
  },
  computed: {
    ready () {
      return !this.$v.customer.email.$invalid
    },
    emailAvailabilityMessage () {
      if (this.customer.email !== '' && !this.$v.customer.email.$error) {
        if (this.customer.emailAvailable) {
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
  methods: {
    touch () {
      this.$v.customer.email.$touch()
    },
    checkIsEmailAvailable () {
      const options = {
        method: 'POST',
        data: JSON.stringify({
          'customerEmail': this.customer.email
        }),
        url: 'customers/isEmailAvailable'
      }
      axios(options)
        .then(({data}) => {
          this.customer.emailAvailable = data
        })
        .catch(error => {
          console.error('Looks like there was a problem: \n', error)
        })
    }
  }
}
</script>
