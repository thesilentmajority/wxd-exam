<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row class="mb-4">
          <v-col>
            <h1 class="text-center">题目</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <QuestionComponent
              :question="currentQuestion"
              @wrong="markAsWrong"
              @answered="handleAnswered"
            />
          </v-col>
        </v-row>
        <v-row class="mt-4 align-center justify-center">
          <v-col cols="auto">
            <v-btn
              color="primary"
              @click="prev"
              :disabled="currentQuestionIndex === 0"
            >
              上一题
            </v-btn>
          </v-col>
          <v-col cols="auto" class="text-center">
            第
            <v-text-field
              v-model.number="currentInputIndex"
              label=""
              type="number"
              @change="jumpToQuestion"
              min="1"
              :max="totalQuestions"
              class="mt-0"
              hide-details
              dense
              style="width: 60px; display: inline-block;"
            ></v-text-field>
            题 / 共 {{ totalQuestions }} 题
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              @click="next"
              :disabled="currentQuestionIndex === totalQuestions - 1"
            >
              下一题
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="mt-4">
          <v-col>
            <v-alert
              v-if="currentQuestionAnswered"
              :type="currentQuestionResult ? 'success' : 'error'"
              class="mt-4"
              border="top"
            >
              已经回答，结果是：{{ currentQuestionResult ? '正确' : '错误' }}
            </v-alert>
          </v-col>
        </v-row>
        <v-row class="mt-4">
          <v-col>
            <v-btn color="primary" @click="goHome" block>
              返回主页
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import QuestionComponent from '../components/QuestionComponent.vue';

export default {
  name: 'QuizView',
  components: { QuestionComponent },
  data() {
    return {
      currentInputIndex: 1
    };
  },
  computed: {
    ...mapGetters(['currentQuestion', 'currentQuestionResult']),
    ...mapState(['currentQuestionIndex', 'currentBank', 'answeredQuestions', 'randomSequence']),
    currentQuestionAnswered() {
      return this.answeredQuestions.has(this.currentQuestion.id);
    },
    mode() {
      return this.$route.params.mode;
    },
    totalQuestions() {
      return this.currentBank.questions.length;
    }
  },
  watch: {
    currentQuestionIndex(val) {
      this.currentInputIndex = val + 1;
    }
  },
  methods: {
    ...mapMutations(['nextQuestion', 'prevQuestion', 'markWrong', 'markAnswered', 'setCurrentQuestionIndex']),
    next() {
      this.nextQuestion();
    },
    prev() {
      this.prevQuestion();
    },
    markAsWrong(question) {
      this.markWrong(question);
    },
    handleAnswered({ questionId, isCorrect }) {
      this.markAnswered({ questionId, isCorrect });
    },
    jumpToQuestion() {
      if (this.currentInputIndex >= 1 && this.currentInputIndex <= this.totalQuestions) {
        this.setCurrentQuestionIndex(this.currentInputIndex - 1);
      } else {
        this.currentInputIndex = this.currentQuestionIndex + 1;
      }
    },
    jumpToFirstUnansweredQuestion() {
      const unansweredIndex = this.currentBank.questions.findIndex(question => !this.answeredQuestions.has(question.id));
      if (unansweredIndex !== -1) {
        this.setCurrentQuestionIndex(unansweredIndex);
      }
    },
    goHome() {
      this.$router.push('/');
    }
  },
  created() {
    if (this.mode === 'random' && this.randomSequence.length === 0) {
      this.$store.commit('generateRandomSequence');
    }
    if (this.mode === 'sequential') {
      this.jumpToFirstUnansweredQuestion();
    }
    this.currentInputIndex = this.currentQuestionIndex + 1;
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
