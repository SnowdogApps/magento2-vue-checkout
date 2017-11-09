<template>
    <div>
        <section class="shipping-information" v-if="step === 'addresses'">
            <h1>
                Billing Address
            </h1>
            
            <form class="billing-address__form">
                <template v-for="field in billingAddress">
                    <template v-if="field.type !== 'select'">
                        <BaseInput 
                            :label="field.label" 
                            :name="field.name" 
                            :type="field.type"
                            :value="field.value"
                            fieldclass="billing-address__field"
                            inputclass="input billing-address__input"
                        />
                    </template>
                    
                    <template v-if="field.type === 'select'">
                        <BaseSelect
                            :label="field.label"
                            :name="field.name"
                            :options="field.options"
                            fieldclass="billing-address__field"
                            selectclass="billing-address__select"
                            @change.native="changeSelection"
                        />
                    </template>

                    <template v-if="field.name === 'region_id'">
                        <BaseInput 
                            label="State/Province" 
                            name="region" 
                            type="text"
                            fieldclass="billing-address__field region--hidden"
                            inputclass="input billing-address__input"
                        />
                    </template>
                </template>
            </form>

            <h1>
                Shipping address
            </h1>

            <template>
                <BaseCheckbox 
                    id="shippingAddress"
                    labelclass="label"
                    fieldclass="checkbox shipping-address__field"
                    inputclass="shipping-address__checkbox"
                    checked="true"
                    name="shippingAddress"
                    text="My billing and shipping address are the same"
                    @change.native="toggleShippingAddress"
                />
            </template>

            <form class="shipping-address__form shipping-address--hidden">
                <template v-for="field in shippingAddress">
                    <template v-if="field.type !== 'select'">
                        <BaseInput 
                            :label="field.label" 
                            :name="field.name" 
                            :type="field.type"
                            :value="field.value"
                            fieldclass="shipping-address__field"
                            inputclass="input shipping-address__input"
                        />
                    </template>

                    <template v-if="field.type === 'select'">
                        <BaseSelect
                            :label="field.label"
                            :name="field.name"
                            :options="field.options"
                            fieldclass="shipping-address__field"
                            selectclass="shipping-address__select"
                            @change.native="changeSelection"
                        />
                    </template>

                    <template v-if="field.name === 'region_id'">
                        <BaseInput 
                            label="State/Province" 
                            name="region" 
                            type="text"
                            fieldclass="shipping-address__field region--hidden"
                            inputclass="input shipping-address__input"
                        />
                    </template>
                </template>

                <template>
                    <BaseButton
                        buttontype="button"
                        buttonclass="button"
                        text="Cancel"
                        @click.native="cancelShippingInformations"
                    />
                </template>
            </form>

            <template>
                <BaseButton
                    buttontype="button"
                    buttonclass="button"
                    text="Set Shipping Informations"
                    @click.native="setShippingInformation"
                />
            </template>
        </section>

        <section class="methods" v-if="step === 'methods'">
            <h1>
                Choose shipping and payment methods
            </h1>

            <h2>
                Shipping methods
            </h2>

            <template>
                <BaseShippingMethods
                    :options="shippingMethods"
                    :currencycode="totals.base_currency_code"
                    name="shipping"
                    labelclass="labels"
                    containerclass="methods__handler"
                    fieldclass="radio methods__field"
                    inputclass="methods__radio"
                />
            </template>

            <h2>
                Payment methods
            </h2>

            <template>
                <BasePaymentMethods
                    :options="paymentMethods"
                    name="payment"
                    labelclass="labels"
                    containerclass="methods__handler"
                    fieldclass="radio methods__field"
                    inputclass="methods__radio"
                />
            </template>

            <template>
                <BaseButton
                    buttontype="button"
                    buttonclass="button"
                    text="Go to summary"
                    @click.native="setMethods"
                />
            </template>

            <template>
                <BaseButton
                    buttontype="button"
                    buttonclass="button"
                    text="Back"
                    @click.native="step = 'summary'"
                />
            </template>
        </section>

        <section v-if="step === 'summary'">
            <h1>
                Summary
            </h1>

            <template>
                <BaseSummary
                    :items="totals.total_segments"
                    :discountamout="totals.discount_amount"
                    :itemsqty="totals.items_qty"
                    :currencycode="totals.base_currency_code"
                />
            </template>

            <template>
                <BaseButton
                    buttontype="button"
                    buttonclass="button"
                    text="Place order"
                    @click.native="makeOrder"
                />
            </template>
            
            <template>
                <BaseButton
                    buttontype="button"
                    buttonclass="button"
                    text="Back"
                    @click.native="step = 'methods'"
                />
            </template>
        </section>

        <section v-if="step === 'success'">
            <template>
                We did it!

                <a href="/what-is-new.html">
                    Back to category
                </a>
            </template>
        </section>

        <section v-if="step !== 'success'">
            <h1>
                Product List
            </h1>

            <template>
                <BaseProduct 
                    containerclass="grid"
                    itemclass="grid__columns"
                    :products="config.totalsData.items"
                    :currency="config.totalsData.base_currency_code"
                />
            </template>
        </section>
    </div>
</template>

<script>
import BaseButton from './button.vue'
import BaseCheckbox from './checkbox.vue'
import BaseInput from './input.vue'
import BasePaymentMethods from './payment-methods.vue'
import BaseProduct from './product.vue'
import BaseSelect from './select.vue'
import BaseShippingMethods from './shipping-methods.vue'
import BaseSummary from './summation.vue'

export default {
    components: {
        BaseButton,
        BaseCheckbox,
        BaseInput,
        BasePaymentMethods,
        BaseProduct,
        BaseSelect,
        BaseShippingMethods,
        BaseSummary
    },
    data() {
        return {
            baseUrl: window.location.origin + '/',
            config: config,
            billingAddress: billingAddress,
            shippingAddress: {},
            paymentMethods: [],
            shippingMethods: [],
            shippingInformation: shippingInformation,
            totals: {},
            selectedMethods: selectedMethods,
            regionList: regionList,
            step: 'addresses'
        }
    },
    computed: {
        cartId() {
            return this.config.quoteData.entity_id;
        },
        cart() {
            const cart = this.config.quoteData;
            cart.items = this.config.quoteItemData;
            return cart;
        }
    },
    filters: {
        currency(value) {
            return parseFloat(value).toFixed(2);
        },
        trimZero(value) {
            return parseInt(value);
        }
    },
    methods: {
        parseJSON(response) {
            return new Promise(
                (resolve) => response.json()
                    .then((json) => resolve({
                        status: response.status,
                        ok: response.ok,
                        json
                    }))
            )
        },
        request(url, params = {}) {
            return new Promise((resolve, reject) => {
                fetch(url, params)
                    .then(this.parseJSON)
                    .then((response) => {
                        if (response.ok) {
                            return resolve(response.json)
                        }
                        // extract the error from the server's json
                        return reject(response.json)
                    })
                    .catch((error) => reject({
                        networkError: error.message
                    }));
            })
        },
        setShippingInformation() {
            this.request(
                `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/shipping-information`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.getShippingInformation())
                }
            )
                .then(response => {
                    this.totals = response.totals;
                    this.getPaymentMethods();
                    this.getShippingMethods();
                    this.step = 'methods';
                });
        },
        setMethods() {
            this.request(
                `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/collect-totals`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.getSelectedMethods())
                }
            )
                .then(response => {
                    this.totals = response;
                    this.getSummary();
                    this.step = 'summary';
                });
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
                    this.step = 'success';
                })
        },
        settingData(elements, object) {
            elements.forEach(element => {
                const id    = element.id,
                      value = element.value;

                if (element.tagName === "INPUT" && value.length > 0) {
                    if (id === 'street[0]') {
                        object.street = [value];
                    }
                    else if (id === 'street[1]') {
                        object.street.push(value);
                    }
                    else {
                        object[id] = value;
                    }
                }
                else if (id === 'region_id' && value.length > 0) {
                    object[id] = parseInt(value);
                    object['region'] = element.selectedOptions[0].innerHTML.trim();
                }
                else if (id === 'country_id' && value.length > 0) {
                    object[id] = value;
                }
                else {
                    this.returnError();
                    return false;
                }
            });

            return object;
        },
        returnError(element, cssClass, text) {

        },
        changeSelection(event) {
            const getForm        = event.srcElement.parentElement.parentElement,
                  countryId      = getForm.querySelector('#country_id'),
                  eventSelectId  = event.srcElement.id,
                  inputRegion    = getForm.querySelector('#region'),
                  regionId       = getForm.querySelector('#region_id');
                  
            if ( countryId == getForm.querySelector("#"+eventSelectId)) {
                const eventOptionValue = event.srcElement.selectedOptions[0].value,
                      propertyRegions  = this.returnCountryRegions(this.regionList, eventOptionValue);

                inputRegion.value = "";

                if (propertyRegions.length > 1) {
                    regionId.innerHTML = propertyRegions.join(" ");

                    this.regionToggle(inputRegion.parentNode, regionId.parentNode, 'region--hidden');
                }
                else {
                    this.regionToggle(regionId.parentNode, inputRegion.parentNode, 'region--hidden');
                }
            }
            else if (regionId == getForm.querySelector("#"+eventSelectId)) {
                const eventOptionCountryId = event.srcElement.selectedOptions[0].dataset.countryid,
                      eventOptionValue     = event.srcElement.selectedOptions[0].value;

                if (!countryId.querySelector(`option[value="${eventOptionCountryId}"]`).selected) {
                    const propertyRegions = this.returnCountryRegions(this.regionList, eventOptionCountryId);

                    regionId.innerHTML = propertyRegions.join(" ");
                    regionId.querySelector(`option[value="${eventOptionValue}"]`).selected = true;
                    countryId.querySelector(`option[value="${eventOptionCountryId}"]`).selected = true;

                    this.regionToggle(inputRegion.parentNode, regionId.parentNode, 'region--hidden');
                }
            }
        },
        returnCountryRegions(regions, optionToCompare) {
            let newRegionList = [];

            newRegionList.push(`
                <option value="">
                    <?= /* @escapeNotVerified */ __('Please select a region, state or province.'); ?>
                </option>
            `);

            regions.forEach(region => {
                if (region.country_id === optionToCompare) {
                    newRegionList.push(`
                        <option value="${region.value}" data-countryid="${region.country_id}">
                            ${region.label}
                        </option>
                    `);
                }
            });

            return newRegionList;
        },
        regionToggle(elementToHide, elementToShow, classToToggle) {
            elementToHide.classList.add(classToToggle);
            elementToShow.classList.remove(classToToggle);
        },
        toggleShippingAddress(event) {
            const element      = event.srcElement,
                  shippingForm = document.querySelector('.shipping-address__form');

            if (element.checked) {
                this.shippingAddress = {};

                if (!shippingForm.classList.contains('shipping-address--hidden')) {
                    shippingForm.classList.add('shipping-address--hidden');
                }
            }
            else {
                this.shippingAddress = shippingAddress;

                if (shippingForm.classList.contains('shipping-address--hidden')) {
                    shippingForm.classList.remove('shipping-address--hidden');
                }
                 
            }
        },
        cancelShippingInformations() {
            const shippingCheckbox = document.getElementById('shippingAddress'),
                  shippingForm     = document.querySelector('.shipping-address');

            this.shippingAddress = {};
            shippingForm.classList.add('shipping-address--hidden');
            shippingCheckbox.checked = true;
        },
        getShippingInformation() {
            const object                  = {},
                response                = this.shippingInformation.addressInformation,
                billingAddressForm      = document.querySelector('.billing-address__form')
                                                    .querySelectorAll('input, select, textarea'),
                shippingAddressCheckbox = document.getElementById('shippingAddress'),
                shippingAddressForm     = document.querySelector('.shipping-address__form')
                                                    .querySelectorAll('input, select, textarea');

            this.settingData(billingAddressForm, response.billing_address);
            
            if (shippingAddressCheckbox.checked) {
                response.shipping_address = response.billing_address;
                response.shipping_address['same_as_billing'] = 1;
            }
            else {
                this.settingData(shippingAddressForm, response.shipping_address);
            }

            /*
            * Must set it to static b/c can't set only shipping address
            * API don't have endpoint to ONLY shipping address
            * Endpoint with billing address are useless in guest cart
            *
            **/
            response.shipping_method_code = 'flatrate';
            response.shipping_carrier_code = 'flatrate';

            object.addressInformation = response;

            return object;
        },
        getSelectedMethods() {
            const returnObj      = this.selectedMethods,
                shippingMethod = document.querySelector('input[name="shipping"]:checked'),
                paymentMethod  = document.querySelector('input[name="payment"]:checked');

            if (shippingMethod.value.length > 0) {
                returnObj.shippingCarrierCode = shippingMethod.value;
                returnObj.shippingMethodCode = shippingMethod.dataset.methodCode;
            }
            else {
                this.returnError();
                return false;
            }
            
            if (paymentMethod.value.length > 0) {
                returnObj.paymentMethod.method = paymentMethod.value;                        
            }
            else {
                this.returnError();
                return false;
            }

            return returnObj;
        },
        getPaymentMethods() {
            /* 
            * Getting payment methods by our shipping information which
            * we was setting before
            * 
            **/ 
            this.request(
                `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/payment-methods`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then(response => {
                    this.paymentMethods = response;
                });
        },
        getShippingMethods() {
            /* 
            * getting payment methods by our shipping information which
            * we was setting before
            * 
            **/ 
            this.request(
                `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/shipping-methods`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then(response => {
                    this.shippingMethods = response;
                });
        },
        getSummary() {
            const shippingMethodCode = this.shippingInformation;

            /**
             * Update static shipping method - now it's choosen
             * Must use this endpoint again
             * 
             */
            shippingMethodCode.addressInformation.shipping_method_code = this.selectedMethods.shippingMethodCode;
            shippingMethodCode.addressInformation.shipping_carrier_code = this.selectedMethods.shippingCarrierCode;

            this.request(
                `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/shipping-information`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(shippingMethodCode)
                }
            )
                .then(response => {
                    this.request(
                        `${this.baseUrl}index.php/rest/V1/guest-carts/${this.cartId}/totals`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                    .then(response => {
                        this.totals = response;
                    });
                });
        }
    }
}
</script>