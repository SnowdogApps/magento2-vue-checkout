import Vue from './lib/vue.js'
import button from './components/button.vue'

var getApiMethods = {
    methods: {
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

var app = new Vue({
    el: '#checkout',
    data: {
        baseUrl: window.location.origin,
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
    mixins: [getApiMethods],
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
        }
    }
});
