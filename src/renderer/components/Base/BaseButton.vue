<template>
  <div class="base-button"><slot></slot></div>
</template>

<style>
  .base-button {
    display: inline-block;
    background-image: linear-gradient(#6795fd 0%, #67ceff 100%);
    color: white;
    border-radius: 5px;
    box-shadow: 0px 0px 3px gray;
    padding: 7px 10px;
    user-select: none;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
  }
  .base-button:hover {
    opacity: 0.85;
  }
  .base-button:active {
    opacity: 0.7;
  }
</style>
