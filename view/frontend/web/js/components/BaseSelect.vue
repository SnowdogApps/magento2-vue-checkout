<template>
    <div :class="fieldclass">
        <label :for="name">
            {{ label }}
        </label>
        
        <select :name="name" :id="name" :class="selectclass">
            <option v-for="option in options" 
                    :value="option.value" 
                    :selected="option.selected" 
                    :disabled="option.disabled"
                    :data-countryid="option.country_id"
            >
                {{ option.label }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array
        },
        label: {
            type: String
        },
        name: {
            type: String
        },
        fieldclass: {
            type: String
        },
        selectclass: {
            type: String
        }
    }
}
</script>
