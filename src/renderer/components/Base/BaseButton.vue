<template>
  <div class="base-button"><slot></slot></div>
</template>

<style lang="scss">
  .base-button {
    display: inline-block;
    background-image: linear-gradient(#6795fd 0%, #67ceff 100%);
    color: white;
    border-radius: 5px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.29);
    padding: 7px 10px;
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
