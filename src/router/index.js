import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import QuizView from '../views/QuizView.vue';
import WrongQuestionsView from '../views/WrongQuestionsView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/quiz/:mode', name: 'quiz', component: QuizView },
  { path: '/wrong-questions', name: 'wrongQuestions', component: WrongQuestionsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
