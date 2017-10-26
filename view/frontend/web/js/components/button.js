define([
    'vue'
], function(Vue) {
    'use strict'

    return Vue.component('buttonelement', {
        props: {
            buttontype: {
                type: String
            },
            text: {
                type: String
            },
            buttontitle: {
                type: String
            }
        },
        template:
        `
        <button :type="buttontype"
                :title="buttontitle"
        >
            {{ text }}
        </button>
        `
    });
});
