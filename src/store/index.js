import { createStore } from 'vuex';

export default createStore({
  state: {
    questionBank: JSON.parse(localStorage.getItem('questionBank')) || [],
    currentBank: JSON.parse(localStorage.getItem('currentBank')) || null,
    currentQuestionIndex: JSON.parse(localStorage.getItem('currentQuestionIndex')) || 0,
    wrongQuestions: JSON.parse(localStorage.getItem('wrongQuestions')) || [],
    answeredQuestions: new Set(JSON.parse(localStorage.getItem('answeredQuestions')) || []),
    answeredResults: JSON.parse(localStorage.getItem('answeredResults')) || {}, 
    randomSequence: JSON.parse(localStorage.getItem('randomSequence')) || [],
  },
  mutations: {
    setQuestionBank(state, banks) {
      state.questionBank = banks;
      localStorage.setItem('questionBank', JSON.stringify(banks));
    },
    setCurrentBank(state, bank) {
      state.currentBank = bank;
      state.currentQuestionIndex = 0;
      state.randomSequence = [];
      localStorage.setItem('currentBank', JSON.stringify(bank));
      localStorage.setItem('currentQuestionIndex', 0);
      localStorage.removeItem('randomSequence');
    },
    nextQuestion(state) {
      if (state.currentQuestionIndex < (state.randomSequence.length > 0 ? state.randomSequence.length : state.currentBank.questions.length) - 1) {
        state.currentQuestionIndex++;
        localStorage.setItem('currentQuestionIndex', state.currentQuestionIndex);
      }
    },
    prevQuestion(state) {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        localStorage.setItem('currentQuestionIndex', state.currentQuestionIndex);
      }
    },
    setCurrentQuestionIndex(state, index) {
      state.currentQuestionIndex = index;
      localStorage.setItem('currentQuestionIndex', index);
    },
    generateRandomSequence(state) {
      if (state.randomSequence.length === 0) {
        const questionCount = state.currentBank.questions.length;
        state.randomSequence = Array.from({ length: questionCount }, (_, i) => i).sort(() => Math.random() - 0.5);
        localStorage.setItem('randomSequence', JSON.stringify(state.randomSequence));
      }
    },
    markWrong(state, question) {
      if (!state.wrongQuestions.some(q => q.id === question.id)) {
        state.wrongQuestions.push(question);
        localStorage.setItem('wrongQuestions', JSON.stringify(state.wrongQuestions));
      }
      state.answeredResults[question.id] = false; 
      localStorage.setItem('answeredResults', JSON.stringify(state.answeredResults));
    },
    markAnswered(state, { questionId, isCorrect }) {
      state.answeredQuestions.add(questionId);
      state.answeredResults[questionId] = isCorrect;
      if (isCorrect) {
        state.wrongQuestions = state.wrongQuestions.filter(q => q.id !== questionId);
        localStorage.setItem('wrongQuestions', JSON.stringify(state.wrongQuestions));
      }
      localStorage.setItem('answeredQuestions', JSON.stringify(Array.from(state.answeredQuestions)));
      localStorage.setItem('answeredResults', JSON.stringify(state.answeredResults));
    },
    resetState(state) {
      state.currentQuestionIndex = 0;
      state.wrongQuestions = [];
      state.answeredQuestions.clear();
      state.answeredResults = {};
      state.randomSequence = [];
      localStorage.removeItem('currentQuestionIndex');
      localStorage.removeItem('wrongQuestions');
      localStorage.removeItem('answeredQuestions');
      localStorage.removeItem('answeredResults');
      localStorage.removeItem('randomSequence');
    }
  },
  actions: {
    loadQuestionBank({ commit }) {
      fetch('/question-bank.json')
        .then(response => response.json())
        .then(data => {
          commit('setQuestionBank', data.banks);
        });
    }
  },
  getters: {
    currentQuestion(state) {
      if (state.randomSequence.length > 0) {
        return state.currentBank.questions[state.randomSequence[state.currentQuestionIndex]];
      }
      return state.currentBank.questions[state.currentQuestionIndex];
    },
    wrongQuestions(state) {
      return state.wrongQuestions;
    },
    currentQuestionAnswered(state) {
      const currentQuestionId = state.randomSequence.length > 0
        ? state.currentBank.questions[state.randomSequence[state.currentQuestionIndex]].id
        : state.currentBank.questions[state.currentQuestionIndex].id;
      return state.answeredQuestions.has(currentQuestionId);
    },
    currentQuestionResult(state) {
      const currentQuestionId = state.randomSequence.length > 0
        ? state.currentBank.questions[state.randomSequence[state.currentQuestionIndex]].id
        : state.currentBank.questions[state.currentQuestionIndex].id;
      return state.answeredResults[currentQuestionId];
    }
  }
});
