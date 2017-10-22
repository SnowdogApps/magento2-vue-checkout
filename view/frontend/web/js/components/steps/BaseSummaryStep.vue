<template>
    <section v-if="step === 'summary'">
        <h1>
            Summary
        </h1>

        <BaseSummary
            :items="totals.total_segments"
            :discountamout="totals.discount_amount"
            :itemsqty="totals.items_qty"
            :currencycode="totals.base_currency_code"
        />

        <BaseButton
            buttontype="button"
            buttonclass="button"
            text="Place order"
            @click.native="makeOrder"
        />
    
        <BaseButton
            buttontype="button"
            buttonclass="button"
            text="Back"
            @click.native="changeStep('methods')"
        />
    </section>
</template>

<script>
import BaseButton from '../BaseButton.vue'
import BaseSummary from '../BaseSummary.vue'

export default {
    components: {
        BaseButton,
        BaseSummary,
    },
    data() {
        return {
            baseUrl: baseUrl,
            config: this.$store.state.config
        }
    },
    computed: {
        cartId() {
            return this.$store.state.cart;
        },
        step() {
            return this.$store.state.step;
        },
        totals() {
            return this.$store.state.totals;
        },
        selectedMethods() {
            return this.$store.state.selectedMethods;
        }
    },
    methods: {
        changeStep(newStep) {
            this.$store.commit('updateStep', newStep);
        },
        makeOrder() {
            this.request(
                `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/order`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "paymentMethod": {
                            "method": this.selectedMethods.paymentMethod.method,
                        }
                    })
                }
            )
                .then(response => {
                    this.$store.commit('updateStep', 'success');
                })
        }
    }
}
</script>
