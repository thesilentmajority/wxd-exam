<template>
  <v-card class="pa-4">
    <v-card-title class="wrap-text">{{ question.question }}</v-card-title>
    <v-card-text>
      <div v-if="question.image" class="image-container">
        <v-img :src="`/image/${question.image}`" alt="Question Image" class="mb-4" max-height="300px" />
      </div>
      <v-radio-group v-model="selectedOption" @change="checkAnswer">
        <v-radio
          v-for="option in shuffledOptions"
          :key="option"
          :label="option"
          :value="option"
          class="my-2 wrap-text"
        />
      </v-radio-group>
    </v-card-text>
    <v-card-actions>
      <v-alert
        v-if="answerChecked"
        :type="isCorrect ? 'success' : 'error'"
        class="mt-4"
        border="top"
      >
        {{ isCorrect ? '答对了！' : '答错了，正确答案是：' + question.answer }}
      </v-alert>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'QuestionComponent',
  props: ['question'],
  data() {
    return {
      selectedOption: '',
      answerChecked: false,
      isCorrect: false,
      shuffledOptions: []
    };
  },
  watch: {
    question: {
      immediate: true,
      handler() {
        // when question changes, reset the state
        this.selectedOption = '';
        this.answerChecked = false;
        this.isCorrect = false;
        this.shuffleOptions();
      }
    }
  },
  methods: {
    shuffleOptions() {
      this.shuffledOptions = [...this.question.options].sort(() => Math.random() - 0.5);
    },
    checkAnswer() {
      this.answerChecked = true;
      this.isCorrect = (this.selectedOption === this.question.answer);
      this.$emit('answered', { questionId: this.question.id, isCorrect: this.isCorrect });
      if (!this.isCorrect) {
        this.$emit('wrong', this.question);
      }
    }
  }
};
</script>

<style scoped>
.wrap-text {
  white-space: normal;
  word-break: break-word;
}
.my-2 {
  margin-top: 8px;
  margin-bottom: 8px;
}
.image-container {
  text-align: center;
}
</style>
