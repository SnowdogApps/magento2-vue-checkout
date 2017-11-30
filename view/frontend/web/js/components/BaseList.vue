<template>
  <ul :class="ulClass">
    <li
      :class="liClass"
      v-for="item in items"
      :key="item.id"
    >
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
    ulClass: {
      type: String
    },
    liClass: {
      type: String
    },
    items: {
      type: Array
    }
  }
}
</script>
