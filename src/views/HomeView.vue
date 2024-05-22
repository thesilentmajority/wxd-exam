<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row class="mb-4">
          <v-col>
            <h1 class="text-center">选择题库</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-for="bank in questionBank"
            :key="bank.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card class="mx-auto mb-4" max-width="400">
              <v-card-title>
                <div class="wrap-text">{{ bank.name }}</div>
                <div>共 {{ bank.questions.length }} 题</div>
              </v-card-title>
              <v-card-actions>
                <v-btn color="primary" @click="selectBank(bank, 'sequential')">
                  顺序模式
                </v-btn>
                <v-btn color="secondary" @click="selectBank(bank, 'random')">
                  随机模式
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="mt-4">
          <v-col>
            <v-btn color="error" @click="clearRecords" block>
              清空所有做题记录
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="mt-4">
          <v-col>
            <v-btn color="info" @click="navigateToWrongQuestions" block>
              查看错题（{{ wrongQuestionsCount }}）
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <PageFooter />
  </v-app>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PageFooter from '../components/PageFooter.vue';

export default {
  name: 'HomeView',
  components: {
    PageFooter
  },
  computed: {
    ...mapState(['questionBank', 'wrongQuestions']),
    wrongQuestionsCount() {
      return this.wrongQuestions.length;
    }
  },
  methods: {
    ...mapActions(['loadQuestionBank']),
    ...mapMutations(['resetState']),
    selectBank(bank, mode) {
      this.$store.commit('setCurrentBank', bank);
      if (mode === 'random') {
        this.$store.commit('generateRandomSequence');
      }
      this.$router.push({ name: 'quiz', params: { mode } });
    },
    clearRecords() {
      this.resetState();
    },
    navigateToWrongQuestions() {
      this.$router.push({ name: 'wrongQuestions' });
    }
  },
  created() {
    this.loadQuestionBank();
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.wrap-text {
  white-space: normal;
  word-break: break-word;
}
</style>
