<template>
  <div v-if="ruleKey === 'SohosaiBoard'">
    <label class="field">
      <span class="label">押して正解時の点数</span>
      <input type="number" v-model.number="pointSlashCorrect" />
    </label>
    <label class="field">
      <span class="label">押さずに正解時の点数</span>
      <input type="number" v-model.number="pointBoardCorrect" />
    </label>
    <label class="field">
      <span class="label">押して誤答時のペナルティ</span>
      <input type="number" v-model.number="penaltySlashWrong" />
    </label>
    <label class="field">
      <span class="label">画像クイズ正解時の点数</span>
      <input type="number" v-model.number="pointVisualBoardCorrect" />
    </label>
    <label class="field">
      <span class="label">単独正解ボーナス</span>
      <input type="number" v-model.number="soloBonus" />
    </label>
  </div>
  <div v-else-if="ruleKey === 'CyanaTennis'">
    <label class="field">
      <span class="label">目標点数</span>
      <input type="number" v-model.number="goal" />
    </label>
  </div>
  <div v-else />
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      ruleKey: (state) => state.ruleKey,

      configSohosaiBoard: (state) => state.config.SohosaiBoard,
      configCyanaTennis: (state) => state.config.CyanaTennis,
    }),

    // SohosaiBoard
    pointSlashCorrect: {
      get() {
        return this.configSohosaiBoard.pointSlashCorrect;
      },
      set(value) {
        this.push("updateConfig", {
          ruleKey: "SohosaiBoard",
          config: {
            ...this.configSohosaiBoard,
            pointSlashCorrect: value,
          },
        });
      },
    },
    pointBoardCorrect: {
      get() {
        return this.configSohosaiBoard.pointBoardCorrect;
      },
      set(value) {
        this.push("updateConfig", {
          ruleKey: "SohosaiBoard",
          config: {
            ...this.configSohosaiBoard,
            pointBoardCorrect: value,
          },
        });
      },
    },
    pointVisualBoardCorrect: {
      get() {
        return this.configSohosaiBoard.pointVisualBoardCorrect;
      },
      set(value) {
        this.push("updateConfig", {
          ruleKey: "SohosaiBoard",
          config: {
            ...this.configSohosaiBoard,
            pointVisualBoardCorrect: value,
          },
        });
      },
    },
    penaltySlashWrong: {
      get() {
        return this.configSohosaiBoard.penaltySlashWrong;
      },
      set(value) {
        this.push("updateConfig", {
          ruleKey: "SohosaiBoard",
          config: {
            ...this.configSohosaiBoard,
            penaltySlashWrong: value,
          },
        });
      },
    },
    soloBonus: {
      get() {
        return this.configSohosaiBoard.soloBonus;
      },
      set(value) {
        this.push("updateConfig", {
          ruleKey: "SohosaiBoard",
          config: {
            ...this.configSohosaiBoard,
            soloBonus: value,
          },
        });
      },
    },

    // CyanaTennis
    goal: {
      get() {
        return this.configCyanaTennis.goal;
      },
      set(value) {
        this.push("updateConfig", {
          ruleKey: "CyanaTennis",
          config: {
            ...this.configCyanaTennis,
            goal: value,
          },
        });
      },
    },
  },
};
</script>

<style>
.field {
  display: block;
}

.label {
  display: inline-block;
  width: 200px;
}
</style>
