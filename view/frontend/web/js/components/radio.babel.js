define([
    'vue'
   ], function(Vue) {
       'use strict'
   
       return Vue.component('radiofield', {
           props: {
               label: {
                   type: String
               },
               labelclass: {
                   type: String
               },
               name: {
                   type: String
               },
               fieldclass: {
                   type: String
               },
               inputclass: {
                   type: String
               },
               value: {
                   type: String
               }
           },
           template: 
           `
           <div :class="fieldclass">
                <input type="radio" 
                       :id="value" 
                       :name="name" 
                       :value="value"
                       :class="inputclass" 
                />

                <label :class="labelclass" :for="value">
                    {{ label }}
                </label>
           </div>
           `
       });
   });
   