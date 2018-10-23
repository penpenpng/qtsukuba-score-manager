<template>
  <div class="base-button"><slot></slot></div>
</template>

<style lang="scss">
  .base-button {
    display: inline-block;
    background: darkgray;
    color: white;
    border-radius: 5px;
    padding: 10px;
    user-select: none;
    cursor: pointer;
    text-decoration: none;
    text-align: center;

    &:hover {
      opacity: 0.85;
    }

    &:active {
      opacity: 0.7;
    }
  }
</style>

