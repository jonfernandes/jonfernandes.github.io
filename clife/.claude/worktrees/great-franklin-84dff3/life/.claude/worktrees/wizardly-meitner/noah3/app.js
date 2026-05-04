const assessmentQuestions = [
  {
    id: "n1",
    topic: "Number and Place Value",
    text: "What is 3,407,056 rounded to the nearest 10,000?",
    choices: ["3,410,000", "3,400,000", "3,407,000", "3,500,000"],
    correct: 0,
    explanation: "The thousands are 7,000, so round the 0 in the ten-thousands up to 1."
  },
  {
    id: "c1",
    topic: "Calculation",
    text: "What is 4,832 ÷ 8?",
    choices: ["584", "604", "614", "594"],
    correct: 1,
    explanation: "8 x 600 = 4,800 and 8 x 4 = 32, so total is 604."
  },
  {
    id: "f1",
    topic: "Fractions, Decimals and Percentages",
    text: "Which is equal to 0.375?",
    choices: ["3/4", "3/8", "5/8", "7/16"],
    correct: 1,
    explanation: "3/8 = 0.375 because 1/8 = 0.125 and 3 x 0.125 = 0.375."
  },
  {
    id: "r1",
    topic: "Ratio and Proportion",
    text: "Blue:red counters are in the ratio 3:2. If there are 12 blue, how many red?",
    choices: ["6", "8", "10", "18"],
    correct: 1,
    explanation: "3 parts = 12, so 1 part = 4. Red is 2 parts, so 8."
  },
  {
    id: "a1",
    topic: "Algebra",
    text: "If n + 7 = 19, what is n?",
    choices: ["10", "11", "12", "13"],
    correct: 2,
    explanation: "Undo +7 by subtracting 7: 19 - 7 = 12."
  },
  {
    id: "m1",
    topic: "Measurement",
    text: "How many millilitres are in 2.5 litres?",
    choices: ["250", "2,500", "25,000", "205"],
    correct: 1,
    explanation: "1 litre = 1,000 ml, so 2.5 litres = 2,500 ml."
  },
  {
    id: "g1",
    topic: "Geometry: Properties of Shapes",
    text: "What is the total of interior angles in a triangle?",
    choices: ["90°", "180°", "270°", "360°"],
    correct: 1,
    explanation: "Any triangle has angle sum 180 degrees."
  },
  {
    id: "gp1",
    topic: "Geometry: Position and Direction",
    text: "Point A is at (2, -3). Which quadrant is it in?",
    choices: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
    correct: 3,
    explanation: "Positive x and negative y means Quadrant IV."
  },
  {
    id: "s1",
    topic: "Statistics",
    text: "What is the mean of 6, 8, 10 and 12?",
    choices: ["8", "8.5", "9", "9.5"],
    correct: 2,
    explanation: "Add then divide by 4: (6+8+10+12)=36, and 36/4 = 9."
  },
  {
    id: "f2",
    topic: "Fractions, Decimals and Percentages",
    text: "What is 25% of 84?",
    choices: ["19", "20", "21", "24"],
    correct: 2,
    explanation: "25% is one quarter, and one quarter of 84 is 21."
  }
];

const practiceBank = {
  "Number and Place Value": [
    {
      text: "What is 5,996,102 rounded to the nearest 100,000?",
      choices: ["5,900,000", "6,000,000", "5,996,000", "5,000,000"],
      correct: 1,
      explanation: "The ten-thousands value is 9, so round up to 6,000,000."
    },
    {
      text: "Which number is greatest?",
      choices: ["3,045,210", "3,450,120", "3,405,210", "3,450,021"],
      correct: 1,
      explanation: "Compare place value left to right; 3,450,120 is greatest."
    }
  ],
  "Calculation": [
    {
      text: "What is 7,245 - 2,968?",
      choices: ["4,277", "4,287", "4,377", "4,207"],
      correct: 0,
      explanation: "Use column subtraction carefully with exchanging."
    },
    {
      text: "What is 36 x 24?",
      choices: ["744", "764", "864", "884"],
      correct: 2,
      explanation: "36 x 20 = 720 and 36 x 4 = 144, total 864."
    }
  ],
  "Fractions, Decimals and Percentages": [
    {
      text: "Which fraction is equivalent to 0.2?",
      choices: ["1/2", "1/5", "2/3", "2/5"],
      correct: 1,
      explanation: "0.2 is two tenths, which simplifies to one fifth."
    },
    {
      text: "What is 3/4 as a percentage?",
      choices: ["25%", "50%", "70%", "75%"],
      correct: 3,
      explanation: "3/4 = 0.75 = 75%."
    }
  ],
  "Ratio and Proportion": [
    {
      text: "A drink uses orange:water = 1:4. If water is 20 cups, how much orange?",
      choices: ["4 cups", "5 cups", "16 cups", "24 cups"],
      correct: 1,
      explanation: "4 parts water = 20, so 1 part = 5."
    },
    {
      text: "Share £45 in the ratio 2:3. What is the larger share?",
      choices: ["£18", "£20", "£27", "£30"],
      correct: 2,
      explanation: "Total parts = 5, one part = 9, larger share is 3 parts = 27."
    }
  ],
  "Algebra": [
    {
      text: "If 3a = 27, what is a?",
      choices: ["6", "7", "8", "9"],
      correct: 3,
      explanation: "Divide both sides by 3: a = 9."
    },
    {
      text: "Continue the sequence: 5, 8, 11, 14, ...",
      choices: ["16", "17", "18", "19"],
      correct: 1,
      explanation: "It increases by 3 each time, so next is 17."
    }
  ],
  "Measurement": [
    {
      text: "How many metres are in 3.6 km?",
      choices: ["36 m", "360 m", "3,060 m", "3,600 m"],
      correct: 3,
      explanation: "1 km = 1,000 m, so 3.6 km = 3,600 m."
    },
    {
      text: "A rectangle is 9 cm by 4 cm. What is its area?",
      choices: ["13 cm²", "26 cm²", "36 cm²", "72 cm²"],
      correct: 2,
      explanation: "Area of rectangle = length x width = 36 cm²."
    }
  ],
  "Geometry: Properties of Shapes": [
    {
      text: "What is the name of a 6-sided polygon?",
      choices: ["Pentagon", "Hexagon", "Heptagon", "Octagon"],
      correct: 1,
      explanation: "A polygon with 6 sides is a hexagon."
    },
    {
      text: "Angles on a straight line add up to...",
      choices: ["90°", "180°", "270°", "360°"],
      correct: 1,
      explanation: "A straight line forms 180 degrees."
    }
  ],
  "Geometry: Position and Direction": [
    {
      text: "Starting north, turn clockwise by 90°. Which direction now?",
      choices: ["West", "East", "South", "North"],
      correct: 1,
      explanation: "A 90° clockwise turn from north points east."
    },
    {
      text: "Point B is (-4, 5). Which quadrant is it in?",
      choices: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
      correct: 1,
      explanation: "Negative x and positive y is Quadrant II."
    }
  ],
  "Statistics": [
    {
      text: "A bar chart shows 12, 15, 9, 14. What is the range?",
      choices: ["5", "6", "7", "8"],
      correct: 1,
      explanation: "Range = largest - smallest = 15 - 9 = 6."
    },
    {
      text: "What is the mean of 4, 7, 7, 10?",
      choices: ["6", "6.5", "7", "7.5"],
      correct: 2,
      explanation: "(4+7+7+10)=28 and 28/4 = 7."
    }
  ]
};

const state = {
  mode: "assessment",
  currentIndex: 0,
  currentQuestions: [],
  score: 0,
  topicStats: {},
  selectedAnswer: null,
  weakTopics: []
};

const screens = {
  home: document.getElementById("screen-home"),
  quiz: document.getElementById("screen-quiz"),
  summary: document.getElementById("screen-summary"),
  finish: document.getElementById("screen-finish")
};

const modeLabel = document.getElementById("mode-label");
const progress = document.getElementById("progress");
const questionText = document.getElementById("question-text");
const topicTag = document.getElementById("topic-tag");
const answers = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");

const summaryTitle = document.getElementById("summary-title");
const summaryText = document.getElementById("summary-text");
const weaknessList = document.getElementById("weakness-list");
const toLearningBtn = document.getElementById("to-learning-btn");
const restartBtn = document.getElementById("restart-btn");
const finishText = document.getElementById("finish-text");

document.getElementById("start-btn").addEventListener("click", startAssessment);
nextBtn.addEventListener("click", handleNext);
toLearningBtn.addEventListener("click", startLearningMode);
restartBtn.addEventListener("click", resetToHome);
document.getElementById("play-again-btn").addEventListener("click", resetToHome);
document.querySelectorAll(".quit-btn").forEach((button) => {
  button.addEventListener("click", resetToHome);
});

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function startAssessment() {
  state.mode = "assessment";
  state.currentQuestions = [...assessmentQuestions];
  state.currentIndex = 0;
  state.score = 0;
  state.selectedAnswer = null;
  state.weakTopics = [];
  state.topicStats = {};

  state.currentQuestions.forEach((q) => {
    if (!state.topicStats[q.topic]) {
      state.topicStats[q.topic] = { correct: 0, total: 0 };
    }
  });

  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = state.currentQuestions[state.currentIndex];
  const total = state.currentQuestions.length;

  modeLabel.textContent = state.mode === "assessment" ? "Assessment" : "Learning Mode";
  progress.textContent = `Question ${state.currentIndex + 1} of ${total}`;
  questionText.textContent = q.text;
  topicTag.textContent = `Topic: ${q.topic}`;
  feedback.textContent = "";
  nextBtn.disabled = true;
  state.selectedAnswer = null;

  answers.innerHTML = "";
  q.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = choice;
    btn.addEventListener("click", () => selectAnswer(idx));
    answers.appendChild(btn);
  });
}

function selectAnswer(idx) {
  if (state.selectedAnswer !== null) {
    return;
  }

  state.selectedAnswer = idx;
  const q = state.currentQuestions[state.currentIndex];
  const all = Array.from(answers.children);
  const isCorrect = idx === q.correct;

  all.forEach((button, buttonIdx) => {
    button.disabled = true;
    if (buttonIdx === q.correct) {
      button.classList.add("correct");
    }
    if (buttonIdx === idx && !isCorrect) {
      button.classList.add("wrong");
    }
  });

  if (isCorrect) {
    state.score += 1;
    feedback.textContent = `Correct. ${q.explanation}`;
  } else {
    feedback.textContent = `Not quite. ${q.explanation}`;
  }

  if (state.mode === "assessment") {
    state.topicStats[q.topic].total += 1;
    if (isCorrect) {
      state.topicStats[q.topic].correct += 1;
    }
  }

  nextBtn.disabled = false;
}

function handleNext() {
  state.currentIndex += 1;

  if (state.currentIndex < state.currentQuestions.length) {
    renderQuestion();
    return;
  }

  if (state.mode === "assessment") {
    showAssessmentSummary();
  } else {
    showFinish();
  }
}

function showAssessmentSummary() {
  showScreen("summary");

  summaryTitle.textContent = `Assessment Score: ${state.score}/10`;
  summaryText.textContent = "Great effort. We will now focus on topics where you need more practice.";

  const weakTopics = Object.entries(state.topicStats)
    .map(([topic, stats]) => ({ topic, accuracy: stats.total ? stats.correct / stats.total : 1 }))
    .filter((x) => x.accuracy < 1)
    .sort((a, b) => a.accuracy - b.accuracy)
    .map((x) => x.topic);

  state.weakTopics = weakTopics.length ? weakTopics : pickRandomTopics(3);

  weaknessList.innerHTML = "";
  state.weakTopics.forEach((topic) => {
    const item = document.createElement("div");
    item.className = "weakness-item";
    item.textContent = topic;
    weaknessList.appendChild(item);
  });
}

function startLearningMode() {
  const selectedTopics = state.weakTopics.slice(0, 5);
  let practiceQuestions = [];

  selectedTopics.forEach((topic) => {
    const bank = practiceBank[topic] || [];
    practiceQuestions = practiceQuestions.concat(
      bank.map((q, idx) => ({ ...q, id: `${topic}-${idx}`, topic }))
    );
  });

  if (practiceQuestions.length < 10) {
    const fallbackTopics = Object.keys(practiceBank);
    fallbackTopics.forEach((topic) => {
      if (practiceQuestions.length >= 10) {
        return;
      }
      (practiceBank[topic] || []).forEach((q, idx) => {
        if (practiceQuestions.length < 10) {
          practiceQuestions.push({ ...q, id: `${topic}-extra-${idx}`, topic });
        }
      });
    });
  }

  state.mode = "learning";
  state.currentQuestions = shuffle(practiceQuestions).slice(0, 10);
  state.currentIndex = 0;
  state.score = 0;
  showScreen("quiz");
  renderQuestion();
}

function showFinish() {
  showScreen("finish");
  const total = state.currentQuestions.length;
  finishText.textContent = `You got ${state.score}/${total} in learning mode. Keep practising and you will level up fast.`;
}

function resetToHome() {
  showScreen("home");
}

function pickRandomTopics(count) {
  return shuffle(Object.keys(practiceBank)).slice(0, count);
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
