<template>
  <BaseInput
    id="email"
    v-model="v$.email.$model"
    type="email"
    label="Email address"
    :validation="v$.email"
    placeholder="Email"
    @input="checkIsEmailAvailable"
  />
  <span
    v-if="isEmailValid"
    v-html="emailAvailabilityMessage"
  />
</template>

<script>
import { useStore } from '@/store/index.js'
import { mapState } from 'pinia'
import BaseInput from './BaseInput.vue'

import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default {
  emits: ['valid'],
  setup () {
    return { v$: useVuelidate() }
  },
  components: {
    BaseInput
  },
  data() {
    return {
      email: '',
      isEmailAvailable: false
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  computed: {
    ...mapState(useStore, ['customer']),
    isEmailValid () {
      return !this.v$.email?.$invalid
    },
    emailAvailabilityMessage() {
      if (this.isEmailAvailable) {
        return 'You can create an account after checkout.'
      } else {
        return `
          You already have an account with us.
          Sign in <a href="/customer/account/login/">here</a> or continue as guest.
        `
      }
    }
  },
  watch: {
    isEmailValid (val) {
      this.$emit('valid', val)
    }
  },
  created() {
    if (this.customer !== null && this.customer.email) {
      this.email = this.customer.email
    }
  },
  methods: {
    validate () {
      this.v$.email.$touch()
    },
    async checkIsEmailAvailable() {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        data: JSON.stringify({
          customerEmail: this.email
        }),
        url: '/rest/V1/customers/isEmailAvailable'
      }

      try {
        const { data } = await this.axios(options)
        this.isEmailAvailable = data
        useStore().customer = { emai: this.email }
      } catch (error) {
        console.error('Looks like there was a problem: \n', error)
      }
    }
  }
}
</script>
