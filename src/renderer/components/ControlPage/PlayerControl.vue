<template>
  <div class="player-control">
    <base-button
      class="mark-button"
      :class="{marked: marked}"
      @click.native="markPlayer">Mark</base-button>
    <div class="actions">
      <span> No. {{ playerNo }} </span>
      <input
        class="slasher-radio"
        :id="'slash-' + playerId"
        type="radio"
        :value="playerId"
        v-model="slasherId">
      <label :for="'slash-' + playerId">解答権</label>
      <input
        class="correct-check"
        :id="'correct-' + playerId"
        type="checkbox"
        :value="playerId"
        v-model="correctlyAnswererIds">
      <label :for="'correct-' + playerId">正解</label>
    </div>
    <input
      class="input-name"
      type="text"
      v-model="name">
    <input
      v-for="scoreKey in Object.keys(player.score)"
      :key="scoreKey"
      class="input-score"
      type="number"
      :value="player.score[scoreKey].value"
      @input="updateScore($event, scoreKey)">
    <div class="float-right">
      <base-button class="delete-button" @click.native="deletePlayer">プレイヤーを削除</base-button>
    </div>
  </div>
</template>

<style scoped>
  .player-control {
    background: ivory;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .player-control .mark-button {
    background: lightgray;
    margin: 5px;
  }
  .player-control .mark-button.marked {
    background: gold;
    color: black;
  }
  .player-control .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    margin-right: 10px;
  }
  .player-control .actions .slasher-radio {
    display: none;
  }
  .player-control .actions .slasher-radio + label {
    cursor: pointer;
    display: inline-block;
    margin-left: 10px;
    padding: 7px 10px;
    box-shadow: 0px 0px 3px gray;
    border-radius: 5px;
    background: lightgray;
    color: darkgray;
  }
  .player-control .actions .slasher-radio + label:hover {
    opacity: 0.7;
  }
  .player-control .actions .slasher-radio:checked + label {
    background: gold;
    color: black;
  }
  .player-control .actions .correct-check {
    display: none;
  }
  .player-control .actions .correct-check + label {
    cursor: pointer;
    display: inline-block;
    margin-left: 10px;
    padding: 7px 10px;
    box-shadow: 0px 0px 3px gray;
    border-radius: 5px;
    background: lightgray;
    color: darkgray;
  }
  .player-control .actions .correct-check + label:hover {
    opacity: 0.7;
  }
  .player-control .actions .correct-check:checked + label {
    background: lightgreen;
    color: black;
  }
  .player-control .input-name {
    width: 100px;
  }
  .player-control .input-score {
    width: 50px;
  }
  .player-control .float-right {
    flex-grow: 2;
  }
  .player-control .delete-button {
    float: right;
    margin-right: 10px;
    background: indianred;
  }
</style>

<script>
  export default {
    props: [
      "playerId",
      "playerNo",
    ],
    computed: {
      player() {
        return this.$store.state.players[this.playerId]
      },
      scoreDefinitons() {
        return this.$store.state.scoreDefinitons
      },
      marked() {
        return this.$store.state.markedId === this.playerId
      },
      correctlyAnswererIds: {
        get() {
          return this.$store.state.correctlyAnswererIds
        },
        set(value) {
          this.push("updateCorrectlyAnswererIds", value)
        },
      },
      slasherId: {
        get() {
          return this.$store.state.slasherId
        },
        set(value) {
          this.push("updateSlasherId", value)
        },
      },
      name: {
        get() {
          return this.player.name
        },
        set(value) {
          this.push("updatePlayerName", {
            id: this.playerId,
            name: value,
          })
        },
      },
    },
    methods: {
      updateScore(e, key) {
        this.push("updateScore", {
          playerId: this.playerId,
          scoreKey: key,
          value: e.target.value,
        })
      },
      deletePlayer() {
        this.push("deletePlayer", this.playerId)
      },
      markPlayer() {
        this.push("markPlayer", this.playerId)
      }
    }
  }
</script>
