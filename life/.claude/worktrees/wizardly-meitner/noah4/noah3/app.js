const assessmentQuestions = [
  {
    id: "n1",
    topic: "Number & Place Value",
    question: "Which number is 10,000 more than 456,321?",
    options: ["466,321", "556,321", "457,321", "456,421"],
    answer: 0,
    hint: "Add 10,000 to the ten-thousands column."
  },
  {
    id: "n2",
    topic: "Number & Place Value",
    question: "Round 4,768,901 to the nearest 100,000.",
    options: ["4,700,000", "4,800,000", "4,770,000", "5,000,000"],
    answer: 1,
    hint: "Check the ten-thousands digit to decide up or down."
  },
  {
    id: "f1",
    topic: "Fractions, Decimals & Percentages",
    question: "What is 25% of 84?",
    options: ["18", "19", "21", "24"],
    answer: 2,
    hint: "25% is the same as one quarter."
  },
  {
    id: "f2",
    topic: "Fractions, Decimals & Percentages",
    question: "Which is equivalent to 3/5?",
    options: ["0.35", "0.6", "0.53", "6.5"],
    answer: 1,
    hint: "Divide 3 by 5."
  },
  {
    id: "m1",
    topic: "Calculation",
    question: "Calculate 3,024 ÷ 6.",
    options: ["54", "504", "506", "614"],
    answer: 1,
    hint: "Use short division with thousands, hundreds, tens, ones."
  },
  {
    id: "r1",
    topic: "Ratio & Proportion",
    question: "A recipe uses flour and sugar in the ratio 3:1. If flour is 12 spoons, how many spoons of sugar are needed?",
    options: ["2", "3", "4", "6"],
    answer: 2,
    hint: "Find the scale from 3 to 12 first."
  },
  {
    id: "a1",
    topic: "Algebra",
    question: "If n + 7 = 19, what is n?",
    options: ["10", "11", "12", "13"],
    answer: 2,
    hint: "Use the inverse operation."
  },
  {
    id: "g1",
    topic: "Geometry",
    question: "What is the area of a rectangle with length 9 cm and width 4 cm?",
    options: ["13 cm2", "18 cm2", "36 cm2", "72 cm2"],
    answer: 2,
    hint: "Area of a rectangle = length × width."
  },
  {
    id: "g2",
    topic: "Geometry",
    question: "Angles on a straight line add up to...",
    options: ["90 degrees", "180 degrees", "270 degrees", "360 degrees"],
    answer: 1,
    hint: "A straight line is half a full turn."
  },
  {
    id: "s1",
    topic: "Statistics",
    question: "In a table, Team A scored 12, 9, 15 points in three games. What is the total?",
    options: ["26", "34", "36", "39"],
    answer: 2,
    hint: "Add all three values."
  },
  {
    id: "f3",
    topic: "Fractions, Decimals & Percentages",
    question: "0.75 is the same as which fraction?",
    options: ["1/4", "1/2", "3/4", "4/3"],
    answer: 2,
    hint: "Think in hundredths first, then simplify."
  },
  {
    id: "m2",
    topic: "Calculation",
    question: "What is 24 x 15?",
    options: ["320", "340", "360", "380"],
    answer: 2,
    hint: "24 x (10 + 5)."
  }
];

const learningQuestions = [
  {
    id: "ln1",
    topic: "Number & Place Value",
    question: "Order these from smallest to largest: 0.7, 0.67, 0.076, 0.706",
    options: ["0.076, 0.67, 0.7, 0.706", "0.076, 0.67, 0.706, 0.7", "0.67, 0.076, 0.7, 0.706", "0.076, 0.7, 0.67, 0.706"],
    answer: 0,
    hint: "Write them with equal decimal places."
  },
  {
    id: "lf1",
    topic: "Fractions, Decimals & Percentages",
    question: "Find 10% of 460, then 5% of 460.",
    options: ["46 and 23", "46 and 18", "40 and 20", "23 and 46"],
    answer: 0,
    hint: "10% is divide by 10; 5% is half of 10%."
  },
  {
    id: "lm1",
    topic: "Calculation",
    question: "A shop has 1,248 stickers packed equally into 8 boxes. How many per box?",
    options: ["146", "156", "166", "176"],
    answer: 1,
    hint: "Use short division: 1248 ÷ 8."
  },
  {
    id: "lr1",
    topic: "Ratio & Proportion",
    question: "Red:Blue beads are in ratio 2:5. If there are 25 blue beads, how many red beads?",
    options: ["8", "10", "12", "15"],
    answer: 1,
    hint: "Find the multiplier from 5 to 25."
  },
  {
    id: "la1",
    topic: "Algebra",
    question: "y = 3x + 2. What is y when x = 4?",
    options: ["10", "12", "14", "16"],
    answer: 2,
    hint: "Substitute x = 4 into the formula."
  },
  {
    id: "lg1",
    topic: "Geometry",
    question: "A triangle has angles 35 degrees and 65 degrees. What is the third angle?",
    options: ["70 degrees", "80 degrees", "90 degrees", "100 degrees"],
    answer: 1,
    hint: "Angles in a triangle total 180 degrees."
  },
  {
    id: "ls1",
    topic: "Statistics",
    question: "A line graph shows temperatures: Mon 14, Tue 16, Wed 13. What is the difference between the highest and lowest?",
    options: ["2", "3", "4", "5"],
    answer: 1,
    hint: "Difference means subtract lowest from highest."
  },
  {
    id: "lf2",
    topic: "Fractions, Decimals & Percentages",
    question: "What is 3/8 as a decimal?",
    options: ["0.125", "0.375", "0.625", "0.83"],
    answer: 1,
    hint: "3 ÷ 8 gives the decimal value."
  },
  {
    id: "lg2",
    topic: "Geometry",
    question: "A shape is translated 4 right and 2 up. Which changes?",
    options: ["Its size", "Its orientation", "Its position", "Its side lengths"],
    answer: 2,
    hint: "Translation slides shapes without turning or resizing."
  },
  {
    id: "la2",
    topic: "Algebra",
    question: "Find two numbers with sum 20 and difference 4.",
    options: ["12 and 8", "13 and 7", "14 and 6", "15 and 5"],
    answer: 0,
    hint: "Check both total and difference."
  },
  {
    id: "lr2",
    topic: "Ratio & Proportion",
    question: "30% of a class of 30 are left-handed. How many pupils is that?",
    options: ["6", "8", "9", "12"],
    answer: 2,
    hint: "10% of 30 is 3, then multiply by 3."
  },
  {
    id: "ls2",
    topic: "Statistics",
    question: "A timetable says bus leaves at 14:35 and arrives 15:20. Journey time is...",
    options: ["35 minutes", "40 minutes", "45 minutes", "55 minutes"],
    answer: 2,
    hint: "Count from 14:35 to 15:00, then to 15:20."
  }
];

const screens = {
  home: document.getElementById("screen-home"),
  quiz: document.getElementById("screen-quiz"),
  summary: document.getElementById("screen-summary"),
  finish: document.getElementById("screen-finish")
};

const ui = {
  modeLabel: document.getElementById("mode-label"),
  progress: document.getElementById("progress"),
  questionText: document.getElementById("question-text"),
  topicTag: document.getElementById("topic-tag"),
  answers: document.getElementById("answers"),
  feedback: document.getElementById("feedback"),
  hint: document.getElementById("hint"),
  nextBtn: document.getElementById("next-btn"),
  summaryTitle: document.getElementById("summary-title"),
  summaryText: document.getElementById("summary-text"),
  weaknessList: document.getElementById("weakness-list"),
  finishText: document.getElementById("finish-text")
};

const state = {
  mode: "assessment",
  assessmentSet: [],
  learningSet: [],
  currentIndex: 0,
  scoreAssessment: 0,
  scoreLearning: 0,
  selectedAnswer: null,
  answered: false,
  topicStats: {}
};

function shuffle(array) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function initTopicStats() {
  state.topicStats = {};
  [...assessmentQuestions, ...learningQuestions].forEach((q) => {
    if (!state.topicStats[q.topic]) {
      state.topicStats[q.topic] = { asked: 0, correct: 0 };
    }
  });
}

function startAssessment() {
  state.mode = "assessment";
  state.assessmentSet = shuffle(assessmentQuestions).slice(0, 10);
  state.currentIndex = 0;
  state.scoreAssessment = 0;
  state.selectedAnswer = null;
  state.answered = false;
  initTopicStats();
  showScreen("quiz");
  renderQuestion();
}

function getCurrentSet() {
  return state.mode === "assessment" ? state.assessmentSet : state.learningSet;
}

function renderQuestion() {
  const set = getCurrentSet();
  const q = set[state.currentIndex];
  ui.modeLabel.textContent = state.mode === "assessment" ? "Assessment Mode" : "Learning Mode";
  ui.progress.textContent = `Question ${state.currentIndex + 1} of ${set.length}`;
  ui.questionText.textContent = q.question;
  ui.topicTag.textContent = `Topic: ${q.topic}`;
  ui.feedback.textContent = "";
  ui.hint.textContent = "";
  ui.nextBtn.disabled = true;
  state.answered = false;
  state.selectedAnswer = null;

  ui.answers.innerHTML = "";
  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = option;
    button.addEventListener("click", () => onAnswer(index));
    ui.answers.appendChild(button);
  });
}

function onAnswer(index) {
  if (state.answered) return;

  const set = getCurrentSet();
  const q = set[state.currentIndex];
  state.answered = true;
  state.selectedAnswer = index;
  ui.nextBtn.disabled = false;

  state.topicStats[q.topic].asked += 1;
  const buttons = [...ui.answers.querySelectorAll("button")];

  buttons.forEach((btn, i) => {
    if (i === q.answer) {
      btn.classList.add("correct");
    }
    if (i === index && i !== q.answer) {
      btn.classList.add("wrong");
    }
    btn.disabled = true;
  });

  if (index === q.answer) {
    ui.feedback.textContent = "Nice work. That is correct!";
    state.topicStats[q.topic].correct += 1;
    if (state.mode === "assessment") {
      state.scoreAssessment += 1;
    } else {
      state.scoreLearning += 1;
    }
  } else {
    ui.feedback.textContent = "Good try. Let's learn from this one.";
    ui.hint.textContent = `Hint: ${q.hint}`;
  }
}

function nextQuestion() {
  const set = getCurrentSet();
  state.currentIndex += 1;

  if (state.currentIndex >= set.length) {
    if (state.mode === "assessment") {
      renderAssessmentSummary();
    } else {
      renderFinish();
    }
    return;
  }

  renderQuestion();
}

function buildLearningSet() {
  const topicWeakness = Object.entries(state.topicStats)
    .filter(([, stats]) => stats.asked > 0)
    .map(([topic, stats]) => {
      const accuracy = stats.correct / stats.asked;
      return { topic, accuracy };
    })
    .sort((a, b) => a.accuracy - b.accuracy);

  const prioritizedTopics = topicWeakness.map((item) => item.topic);
  const sortedLearning = shuffle(learningQuestions).sort((a, b) => {
    const indexA = prioritizedTopics.indexOf(a.topic);
    const indexB = prioritizedTopics.indexOf(b.topic);
    const rankA = indexA === -1 ? 999 : indexA;
    const rankB = indexB === -1 ? 999 : indexB;
    return rankA - rankB;
  });

  return sortedLearning.slice(0, 10);
}

function renderAssessmentSummary() {
  showScreen("summary");
  ui.summaryTitle.textContent = "Assessment Complete";
  ui.summaryText.textContent = `You scored ${state.scoreAssessment}/10. Next: focused practice on your weakest topics.`;

  const weakest = Object.entries(state.topicStats)
    .filter(([, stats]) => stats.asked > 0)
    .map(([topic, stats]) => ({ topic, asked: stats.asked, correct: stats.correct, accuracy: Math.round((stats.correct / stats.asked) * 100) }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  ui.weaknessList.innerHTML = "";
  weakest.forEach((item) => {
    const div = document.createElement("div");
    div.className = "weakness-item";
    div.textContent = `${item.topic}: ${item.correct}/${item.asked} correct (${item.accuracy}%)`;
    ui.weaknessList.appendChild(div);
  });
}

function startLearningMode() {
  state.mode = "learning";
  state.learningSet = buildLearningSet();
  state.currentIndex = 0;
  state.scoreLearning = 0;
  showScreen("quiz");
  renderQuestion();
}

function renderFinish() {
  showScreen("finish");
  const learningTotal = state.learningSet.length;
  ui.finishText.textContent = `Assessment score: ${state.scoreAssessment}/10. Learning score: ${state.scoreLearning}/${learningTotal}. Keep practising your weakest areas and try again.`;
}

document.getElementById("start-btn").addEventListener("click", startAssessment);
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document.getElementById("to-learning-btn").addEventListener("click", startLearningMode);
document.getElementById("restart-btn").addEventListener("click", startAssessment);
document.getElementById("play-again-btn").addEventListener("click", startAssessment);
