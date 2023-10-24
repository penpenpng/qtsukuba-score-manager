<template>
  <div>
    <base-button class="append-button" @click.native="push('appendPlayer')">プレイヤーを追加</base-button>
    <div class="players">
      <player-control
        v-for="(playerId, no) in playerOrder"
        :key="playerId"
        :player-id="playerId"
        :player-no="no + 1"></player-control>
    </div>
    <div class="actions">
      <base-button
        @click.native="push('resolveSlash')"
        class="button execute-button">スコア処理</base-button>
      <base-button
        @click.native="push('resetSelections')"
        class="button">選択状態を解除</base-button>
    </div>
  </div>
</template>

<style scoped>
  .append-button {
    margin: 10px;
    margin-top: 0;
  }

  .actions {
    padding: 15px;
  }
  .actions .button {
    margin-left: 15px;
  }
  .actions .execute-button {
    background: orange;
  }
</style>

<style>
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
  }
</script>
