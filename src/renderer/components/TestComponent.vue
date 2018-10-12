<template>
  <div>
    <span @click="inc">
      remote state: {{ this.$store.state.Counter.main }}
    </span>
  </div>
</template>

<script>
  export default {
    methods: {
      inc() {
        this.push("INCREMENT_MAIN_COUNTER")
      },
    },
  }
</script>
