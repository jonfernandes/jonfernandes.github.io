const { createElement: h, useEffect, useState } = React;

const fallbackTopics = [
  {
    id: 'number-place-value',
    title: 'Number and Place Value',
    summary: 'Read, write, compare and round numbers up to 10,000,000, including negatives.',
    learningObjectives: [
      'Read and write numbers to ten million in digits and words.',
      'Compare and order whole numbers.',
      'Round numbers to powers of ten.',
      'Use negative numbers in context (temperature, money, floors).',
    ],
  },
  {
    id: 'four-operations',
    title: 'Four Operations',
    summary: 'Solve multi-step problems using addition, subtraction, multiplication and division.',
    learningObjectives: [
      'Use formal written methods accurately.',
      'Use order of operations in mixed calculations.',
      'Estimate and check answers using inverse operations.',
    ],
  },
  {
    id: 'fractions',
    title: 'Fractions, Decimals and Percentages',
    summary: 'Calculate with fractions and connect fractions, decimals and percentages.',
    learningObjectives: [
      'Simplify and compare fractions including > 1.',
      'Add and subtract fractions with different denominators.',
      'Know common fraction-decimal-percentage equivalents.',
    ],
  },
  {
    id: 'ratio',
    title: 'Ratio and Proportion',
    summary: 'Solve ratio language and scaling problems.',
    learningObjectives: [
      'Use ratio notation a:b and language correctly.',
      'Scale recipes or quantities up and down.',
      'Solve missing value proportion questions.',
    ],
  },
  {
    id: 'algebra',
    title: 'Algebra',
    summary: 'Use simple formulae, sequences and unknowns.',
    learningObjectives: [
      'Use letters to represent unknown numbers.',
      'Solve one-step equations.',
      'Generate and continue linear number sequences.',
    ],
  },
  {
    id: 'measurement',
    title: 'Measurement',
    summary: 'Convert units and calculate perimeter, area and volume.',
    learningObjectives: [
      'Convert between common metric units.',
      'Calculate area and perimeter of rectangles and compound rectilinear shapes.',
      'Calculate volume of cubes and cuboids.',
    ],
  },
  {
    id: 'geometry',
    title: 'Geometry',
    summary: 'Classify shapes and reason with angles, coordinates and transformations.',
    learningObjectives: [
      'Recognise and calculate missing angles.',
      'Describe position using all four quadrants.',
      'Reflect and translate shapes.',
    ],
  },
  {
    id: 'statistics',
    title: 'Statistics',
    summary: 'Read and interpret line graphs, pie charts and tables.',
    learningObjectives: [
      'Interpret and compare data from charts.',
      'Solve one- and two-step problems from data.',
      'Construct simple tables and line graphs.',
    ],
  },
];

const fallbackQuestionBank = [
  { topicId: 'number-place-value', prompt: 'Round 4,782,391 to the nearest 100,000.', options: ['4,700,000', '4,800,000', '4,900,000'], answer: '4,800,000' },
  { topicId: 'four-operations', prompt: 'What is 3,456 ÷ 9?', options: ['384', '394', '484'], answer: '384' },
  { topicId: 'fractions', prompt: 'Which is equivalent to 3/4?', options: ['6/10', '9/12', '12/20'], answer: '9/12' },
  { topicId: 'ratio', prompt: 'Red:Blue marbles are 2:3. If blue is 12, red is…', options: ['6', '8', '10'], answer: '8' },
  { topicId: 'algebra', prompt: 'If n + 7 = 19, what is n?', options: ['10', '12', '26'], answer: '12' },
  { topicId: 'measurement', prompt: 'Rectangle 8cm by 5cm has area…', options: ['13 cm²', '26 cm²', '40 cm²'], answer: '40 cm²' },
  { topicId: 'geometry', prompt: 'Angles in a triangle add up to…', options: ['90°', '180°', '360°'], answer: '180°' },
  { topicId: 'statistics', prompt: 'One quarter of a pie chart is what percent?', options: ['20%', '25%', '40%'], answer: '25%' },
];

function buildFallbackResult(questions, answersByIndex) {
  const performance = {};

  for (const topic of fallbackTopics) {
    const question = questions.find((q) => q.topicId === topic.id);
    const answerIndex = questions.indexOf(question);
    const selected = answersByIndex[answerIndex];
    const isCorrect = question ? selected === question.answer : false;
    const score = isCorrect ? 1 : 0;

    performance[topic.id] = {
      score,
      level: score >= 0.8 ? 'secure' : score >= 0.4 ? 'developing' : 'beginning',
    };
  }

  const plan = fallbackTopics
    .map((topic) => {
      const current = performance[topic.id];
      const recommendedMinutes = current.level === 'beginning' ? 90 : current.level === 'developing' ? 60 : 30;
      return {
        topicId: topic.id,
        title: topic.title,
        summary: topic.summary,
        learningObjectives: topic.learningObjectives,
        level: current.level,
        score: current.score,
        recommendedMinutes,
      };
    })
    .filter((topic) => topic.level !== 'secure')
    .sort((a, b) => b.recommendedMinutes - a.recommendedMinutes || a.title.localeCompare(b.title));

  return {
    progress: {
      secureCount: Object.values(performance).filter((item) => item.level === 'secure').length,
      totalTopics: fallbackTopics.length,
    },
    plan,
  };
}

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    fetch('./api/pretest')
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => setQuestions(data.questions))
      .catch(() => {
        setQuestions(fallbackQuestionBank);
        setIsOfflineMode(true);
      });
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const payload = questions.map((q, i) => ({ topicId: q.topicId, selected: answers[i] }));

    if (isOfflineMode) {
      setResult(buildFallbackResult(questions, answers));
      return;
    }

    try {
      const res = await fetch('./api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payload }),
      });
      if (!res.ok) throw new Error('API unavailable');
      setResult(await res.json());
    } catch {
      setResult(buildFallbackResult(questions, answers));
      setIsOfflineMode(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasCurrentAnswer = answers[currentQuestionIndex] !== undefined;

  return h('main', { className: 'app' }, [
    h('h1', { key: 'h1' }, '🚀 Year 6 Maths Mission'),
    h('p', { key: 'intro', className: 'intro' }, 'Take this quick check-up first, then follow your personal plan.'),
    isOfflineMode
      ? h('p', { key: 'offline', className: 'intro' }, 'Running in static mode (GitHub Pages): your personalised plan is generated directly in your browser.')
      : null,
    h('section', { key: 'test', className: 'card' }, [
      h('h2', { key: 'title' }, 'Step 1: Quick Check-Up'),
      h(
        'form',
        { key: 'form', onSubmit: submit },
        [
          currentQuestion
            ? h('p', { key: 'progress' }, `Question ${currentQuestionIndex + 1} of ${questions.length}`)
            : null,
          currentQuestion
            ? h('div', { key: currentQuestion.topicId, className: 'question' }, [
                h('p', { key: `p-${currentQuestion.topicId}` }, [h('strong', { key: `s-${currentQuestion.topicId}` }, `Q${currentQuestionIndex + 1}. `), currentQuestion.prompt]),
                ...currentQuestion.options.map((option) =>
                  h('label', { key: `${currentQuestion.topicId}-${option}` }, [
                    h('input', {
                      type: 'radio',
                      name: `q-${currentQuestionIndex}`,
                      value: option,
                      checked: answers[currentQuestionIndex] === option,
                      required: true,
                      onChange: (e) => setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: e.target.value })),
                    }),
                    option,
                  ])
                ),
              ])
            : null,
          !isLastQuestion
            ? h(
                'button',
                {
                  key: 'next',
                  type: 'button',
                  disabled: !hasCurrentAnswer,
                  onClick: () => setCurrentQuestionIndex((idx) => Math.min(idx + 1, questions.length - 1)),
                },
                'Next question'
              )
            : h('button', { key: 'button', type: 'submit', disabled: !hasCurrentAnswer }, 'Build my learning plan'),
        ]
      ),
    ]),
    result
      ? h('section', { key: 'result', className: 'card' }, [
          h('h2', { key: 'result-title' }, 'Step 2: Your Learning Plan'),
          h('p', { key: 'progress' }, [
            'You are secure in ',
            h('strong', { key: 'secure' }, String(result.progress.secureCount)),
            ` out of ${result.progress.totalTopics} topics.`,
          ]),
          ...result.plan.map((item, index) =>
            h('article', { key: item.topicId, className: 'plan-item' }, [
              h('h3', { key: `h3-${item.topicId}` }, [
                `${index + 1}. ${item.title} `,
                h('span', { key: `badge-${item.topicId}`, className: `badge ${item.level}` }, item.level),
              ]),
              h('p', { key: `m-${item.topicId}` }, [h('strong', { key: `ms-${item.topicId}` }, 'Weekly target: '), `${item.recommendedMinutes} minutes`]),
              h('p', { key: `sum-${item.topicId}` }, item.summary),
              h('ul', { key: `ul-${item.topicId}` }, item.learningObjectives.map((goal) => h('li', { key: goal }, goal))),
            ])
          ),
        ])
      : null,
  ]);
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
