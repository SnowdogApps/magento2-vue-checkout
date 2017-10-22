<template>
    <ul :class="ulclass">
        <li :class="liclass" v-for="item in items">
            Name: {{ item.name }}
            Qty: {{ item.qty }}
            Price: {{ item.price }}
            Total: {{ item.qty * item.price }}
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        ulclass: {
            type: String
        },
        liclass: {
            type: String
        },
        items: {
            type: Array
        },
    }
}
</script>
