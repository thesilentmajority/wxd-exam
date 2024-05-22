<template>
  <v-card class="pa-4">
    <v-card-title class="wrap-text">
      {{ question.question }}
      <v-icon v-if="answerChecked" :color="isCorrect ? 'green' : 'red'" class="ml-2">
        {{ isCorrect ? 'mdi-check-circle' : 'mdi-close-circle' }}
      </v-icon>
    </v-card-title>
    <v-card-text>
      <div v-if="question.image" class="image-container">
        <v-img :src="`/image/${question.image}`" alt="Question Image" class="mb-4" max-height="300px" />
      </div>
      <v-radio-group v-model="selectedOption" @change="checkAnswer">
        <template v-for="option in shuffledOptions" :key="option">
          <v-radio
            :label="option"
            :value="option"
            class="my-2 wrap-text"
            :class="getOptionClass(option)"
            v-ripple
          />
        </template>
      </v-radio-group>
      <!--<v-alert v-if="answerChecked" :type="isCorrect ? 'success' : 'error'" class="mt-4">
        {{ isCorrect ? '答对了！' : '答错了！' }}
      </v-alert>-->
    </v-card-text>
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
    },
    getOptionClass(option) {
      if (!this.answerChecked) return '';
      if (option === this.question.answer) return 'correct animate';
      if (option === this.selectedOption) return 'incorrect animate';
      return '';
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
.correct {
  background-color: #d4edda; /* 绿色背景 */
}
.incorrect {
  background-color: #f8d7da; /* 红色背景 */
}
.animate {
  transition: background-color 0.5s ease;
}
</style>
