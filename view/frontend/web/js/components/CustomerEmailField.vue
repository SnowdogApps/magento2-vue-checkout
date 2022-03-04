<template>
  <FormKit
    v-model="email"
    type="email"
    label="Email address"
    validation="required|email"
    placeholder="Email"
    @input="checkIsEmailAvailable"
  />
  <span v-if="emailAvailabilityMessage" v-html="emailAvailabilityMessage" />
  <hr />
</template>

<script>
// import axios from './../utils/checkout-axios.js'
// import { required, email } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      email: "",
      emailAvailable: false,
    };
  },
  // validations: {
  //   email: {
  //     required,
  //     email
  //   }
  // },
  computed: {
    customerData() {
      return null;
      // return this.$store.state.customer
    },
    // ready () {
    //   return !this.$v.email.$invalid
    // },
    emailAvailabilityMessage() {
      if (this.email !== "" && !this.$v.email.$error) {
        if (this.emailAvailable) {
          return `You can create an account after checkout.`;
        } else {
          return `
            You already have an account with us.
            Sign in <a href="/customer/account/login/">here</a> or continue as guest.
          `;
        }
      } else {
        return false;
      }
    },
  },
  // watch: {
  //   ready (val) {
  //     this.$emit('ready', val)
  //   }
  // },
  created() {
    if (
      this.customerData !== null &&
      this.customerData.hasOwnProperty("email")
    ) {
      this.email = this.customerData.email;
    }
  },
  methods: {
    // touch () {
    //   this.$v.email.$touch()
    // },
    async checkIsEmailAvailable() {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        data: JSON.stringify({
          customerEmail: this.email,
        }),
        url: "/rest/V1/customers/isEmailAvailable",
      };

      try {
        const { data } = await this.axios(options);
        this.emailAvailable = data;
      } catch {
        console.error("Looks like there was a problem: \n", error);
      }

      // this.$store.commit('setItem', {
      //   item: 'customer',
      //   value: {
      //     email: this.email
      //   }
      // })
    },
  },
};
</script>
