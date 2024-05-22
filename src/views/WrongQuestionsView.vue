<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row class="mb-4">
          <v-col>
            <h1 class="text-center">错题</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-for="question in wrongQuestions"
            :key="question.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card class="mx-auto mb-4" max-width="400">
              <QuestionComponent :question="question" @answered="handleAnswered" />
            </v-card>
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
import { mapGetters, mapMutations } from 'vuex';
import QuestionComponent from '../components/QuestionComponent.vue';

export default {
  name: 'WrongQuestionsView',
  components: { QuestionComponent },
  computed: {
    ...mapGetters(['wrongQuestions'])
  },
  methods: {
    ...mapMutations(['markAnswered']),
    handleAnswered({ questionId, isCorrect }) {
      this.markAnswered({ questionId, isCorrect });
    },
    goHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
