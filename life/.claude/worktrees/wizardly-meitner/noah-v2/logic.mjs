export const curriculumTopics = [
  {
    id: 'number-place-value',
    title: 'Number and Place Value',
    summary: 'Read, write, compare and round numbers up to 10,000,000 and use negative numbers.',
    learn: [
      'Read and write numbers to ten million in words and digits.',
      'Compare numbers using <, > and =.',
      'Round whole numbers to nearest 10, 100, 1,000 and beyond.',
      'Use negative numbers in real contexts like temperature and money.'
    ],
  },
  {
    id: 'four-operations',
    title: 'Addition, Subtraction, Multiplication and Division',
    summary: 'Use formal written methods and mental methods for all four operations.',
    learn: [
      'Use long multiplication for 4-digit by 2-digit calculations.',
      'Use long division with remainders.',
      'Check answers with inverse operations and estimation.',
      'Solve multi-step problems with all four operations.'
    ],
  },
  {
    id: 'fractions',
    title: 'Fractions, Decimals and Percentages',
    summary: 'Compare, simplify, and calculate with fractions; connect to decimals and percentages.',
    learn: [
      'Simplify fractions and find equivalent fractions.',
      'Compare and order fractions, including those > 1.',
      'Add and subtract fractions with different denominators.',
      'Solve problems involving percentages and decimal equivalents.'
    ],
  },
  {
    id: 'ratio',
    title: 'Ratio and Proportion',
    summary: 'Solve ratio and proportion problems and scale values up/down.',
    learn: [
      'Use ratio language like 2:3.',
      'Scale recipes, maps and quantities up/down.',
      'Solve missing value problems in proportion.'
    ],
  },
  {
    id: 'algebra',
    title: 'Algebra',
    summary: 'Use simple formulae and find unknown values in number sentences.',
    learn: [
      'Use letters to represent numbers.',
      'Find unknown values in equations.',
      'Generate and describe number sequences.'
    ],
  },
  {
    id: 'measurement',
    title: 'Measurement',
    summary: 'Convert units and solve problems involving perimeter, area and volume.',
    learn: [
      'Convert units of length, mass and capacity.',
      'Calculate perimeter and area of rectangles and compound shapes.',
      'Estimate and calculate volume of cubes and cuboids.'
    ],
  },
  {
    id: 'geometry',
    title: 'Geometry: Properties of Shape, Position and Direction',
    summary: 'Draw, classify and reason about 2D/3D shapes and angles.',
    learn: [
      'Classify angles and calculate missing angles.',
      'Draw 2D shapes accurately using given dimensions and angles.',
      'Describe position using coordinates and reflection/translation.'
    ],
  },
  {
    id: 'statistics',
    title: 'Statistics',
    summary: 'Interpret, construct and solve problems using pie charts and line graphs.',
    learn: [
      'Read data from line graphs and pie charts.',
      'Construct and interpret simple tables.',
      'Solve one- and two-step questions from data.'
    ],
  },
];

export const questionBank = [
  { topicId: 'number-place-value', prompt: 'Round 4,782,391 to the nearest 100,000.', options: ['4,700,000', '4,800,000', '4,900,000'], answer: '4,800,000' },
  { topicId: 'four-operations', prompt: 'What is 3,456 ÷ 9?', options: ['384', '394', '484'], answer: '384' },
  { topicId: 'fractions', prompt: 'Which is equivalent to 3/4?', options: ['6/10', '9/12', '12/20'], answer: '9/12' },
  { topicId: 'ratio', prompt: 'Red:Blue marbles are in ratio 2:3. If there are 12 blue, how many red?', options: ['6', '8', '10'], answer: '8' },
  { topicId: 'algebra', prompt: 'If n + 7 = 19, what is n?', options: ['10', '12', '26'], answer: '12' },
  { topicId: 'measurement', prompt: 'A rectangle is 8cm by 5cm. What is its area?', options: ['13 cm²', '26 cm²', '40 cm²'], answer: '40 cm²' },
  { topicId: 'geometry', prompt: 'Angles in a triangle add to?', options: ['90°', '180°', '360°'], answer: '180°' },
  { topicId: 'statistics', prompt: 'If 1/4 of a pie chart is cats, what percentage is cats?', options: ['20%', '25%', '40%'], answer: '25%' },
];

export function getPretestQuestions() {
  return curriculumTopics.map((topic) => {
    const topicQuestion = questionBank.find((q) => q.topicId === topic.id);
    return { ...topicQuestion };
  });
}

export function calculateTopicPerformance(answers) {
  const grouped = answers.reduce((acc, item) => {
    acc[item.topicId] ??= { total: 0, correct: 0 };
    acc[item.topicId].total += 1;
    acc[item.topicId].correct += item.correct ? 1 : 0;
    return acc;
  }, {});

  return Object.entries(grouped).reduce((acc, [topicId, data]) => {
    const score = data.correct / data.total;
    acc[topicId] = {
      score,
      level: score >= 0.8 ? 'secure' : score >= 0.4 ? 'developing' : 'beginning',
    };
    return acc;
  }, {});
}

export function buildLearningPlan(performance) {
  const hasPerformance = Object.keys(performance).length > 0;
  const sourceTopics = hasPerformance
    ? curriculumTopics.filter((topic) => performance[topic.id])
    : curriculumTopics;

  const plan = sourceTopics.map((topic) => {
    const topicPerformance = performance[topic.id] ?? { score: 0, level: 'beginning' };
    const recommendedMinutes = topicPerformance.level === 'beginning' ? 90 : topicPerformance.level === 'developing' ? 60 : 30;
    return {
      topicId: topic.id,
      title: topic.title,
      level: topicPerformance.level,
      score: topicPerformance.score,
      recommendedMinutes,
      summary: topic.summary,
      learn: topic.learn,
    };
  });

  return plan
    .filter((item) => item.level !== 'secure')
    .sort((a, b) => b.recommendedMinutes - a.recommendedMinutes || a.title.localeCompare(b.title));
}
