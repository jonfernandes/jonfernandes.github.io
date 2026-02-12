export const curriculumTopics = [
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

export const questionBank = [
  { topicId: 'number-place-value', prompt: 'Round 4,782,391 to the nearest 100,000.', options: ['4,700,000', '4,800,000', '4,900,000'], answer: '4,800,000' },
  { topicId: 'four-operations', prompt: 'What is 3,456 ÷ 9?', options: ['384', '394', '484'], answer: '384' },
  { topicId: 'fractions', prompt: 'Which is equivalent to 3/4?', options: ['6/10', '9/12', '12/20'], answer: '9/12' },
  { topicId: 'ratio', prompt: 'Red:Blue marbles are 2:3. If blue is 12, red is…', options: ['6', '8', '10'], answer: '8' },
  { topicId: 'algebra', prompt: 'If n + 7 = 19, what is n?', options: ['10', '12', '26'], answer: '12' },
  { topicId: 'measurement', prompt: 'Rectangle 8cm by 5cm has area…', options: ['13 cm²', '26 cm²', '40 cm²'], answer: '40 cm²' },
  { topicId: 'geometry', prompt: 'Angles in a triangle add up to…', options: ['90°', '180°', '360°'], answer: '180°' },
  { topicId: 'statistics', prompt: 'One quarter of a pie chart is what percent?', options: ['20%', '25%', '40%'], answer: '25%' },
];

export function getPretestQuestions() {
  return curriculumTopics.map((topic) => questionBank.find((q) => q.topicId === topic.id)).filter(Boolean);
}

export function calculateTopicPerformance(answers = []) {
  const grouped = answers.reduce((acc, answer) => {
    acc[answer.topicId] ??= { total: 0, correct: 0 };
    acc[answer.topicId].total += 1;
    acc[answer.topicId].correct += answer.correct ? 1 : 0;
    return acc;
  }, {});

  return curriculumTopics.reduce((acc, topic) => {
    const row = grouped[topic.id] ?? { total: 0, correct: 0 };
    const score = row.total === 0 ? 0 : row.correct / row.total;
    let level = 'beginning';
    if (score >= 0.8) level = 'secure';
    else if (score >= 0.4) level = 'developing';
    acc[topic.id] = { score, level };
    return acc;
  }, {});
}

export function buildLearningPlan(performance) {
  const keys = Object.keys(performance ?? {});
  const topics = keys.length > 0
    ? curriculumTopics.filter((topic) => keys.includes(topic.id))
    : curriculumTopics;

  return topics
    .map((topic) => {
      const current = performance[topic.id] ?? { score: 0, level: 'beginning' };
      const recommendedMinutes = current.level === 'beginning' ? 90 : current.level === 'developing' ? 60 : 30;
      return {
        topicId: topic.id,
        title: topic.title,
        summary: topic.summary,
        learningObjectives: topic.learningObjectives,
        ...current,
        recommendedMinutes,
      };
    })
    .filter((topic) => topic.level !== 'secure')
    .sort((a, b) => b.recommendedMinutes - a.recommendedMinutes || a.title.localeCompare(b.title));
}

export function summariseProgress(performance) {
  const values = Object.values(performance);
  const secureCount = values.filter((item) => item.level === 'secure').length;
  return {
    secureCount,
    totalTopics: curriculumTopics.length,
  };
}
