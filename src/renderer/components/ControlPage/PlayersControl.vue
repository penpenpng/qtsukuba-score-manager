<template>
  <div>
    <base-button @click.native="appendPlayer">プレイヤーを追加</base-button>
    <div class="players">
      <player-control
        v-for="(playerId, no) in playerOrder"
        :key="playerId"
        :player-id="playerId"
        :player-no="no + 1"></player-control>
    </div>
    <div class="actions">
      <base-button
        @click.native="resolveSlash"
        class="button execute-button">スコア処理</base-button>
      <base-button
        @click.native="reset"
        class="button">リセット</base-button>
      <base-button
        @click.native="redo"
        class="button">スコア処理をキャンセルする</base-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .actions {
    padding: 15px;

    .button {
      margin-left: 15px;
    }
    
    .execute-button {
      background: orange;
    }
  }
</style>

<style lang="scss">
  .actions {
    background: #e4fcff;
  }
</style>


<script>
  import { mapState } from "vuex"
  import PlayerControl from "./PlayerControl.vue"

  export default {
    components: {
      PlayerControl,
    },
    computed: {
      ...mapState({
        playerOrder: state => state.playerOrder,
      })
    },
    methods: {
      appendPlayer() {
        this.push("appendPlayer")
      },
      resolveSlash() {
        this.push("resolveSlash")
      },
      redo() {

      },
      reset() {
        this.push("resetSelections")
      },
    }
  }
</script>
