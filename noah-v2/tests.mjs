import test from 'node:test';
import assert from 'node:assert/strict';
import {
  curriculumTopics,
  calculateTopicPerformance,
  buildLearningPlan,
  getPretestQuestions,
} from './logic.mjs';

test('pretest includes one question per topic', () => {
  const questions = getPretestQuestions();
  assert.equal(questions.length, curriculumTopics.length);
  const topicSet = new Set(questions.map((q) => q.topicId));
  assert.equal(topicSet.size, curriculumTopics.length);
});

test('calculates topic performance by correctness ratio', () => {
  const answers = [
    { topicId: 'fractions', correct: true },
    { topicId: 'fractions', correct: false },
    { topicId: 'ratio', correct: true },
  ];

  const performance = calculateTopicPerformance(answers);

  assert.equal(performance.fractions.score, 0.5);
  assert.equal(performance.fractions.level, 'developing');
  assert.equal(performance.ratio.score, 1);
  assert.equal(performance.ratio.level, 'secure');
});

test('builds learning plan with weakest topics first', () => {
  const performance = {
    fractions: { score: 0.1, level: 'beginning' },
    ratio: { score: 0.45, level: 'developing' },
    algebra: { score: 0.85, level: 'secure' },
  };

  const plan = buildLearningPlan(performance);

  assert.deepEqual(
    plan.map((item) => item.topicId),
    ['fractions', 'ratio']
  );
  assert.equal(plan[0].recommendedMinutes >= plan[1].recommendedMinutes, true);
});

test('returns full support plan when no answers provided', () => {
  const plan = buildLearningPlan({});
  assert.equal(plan.length, curriculumTopics.length);
  assert.equal(plan.every((item) => item.level === 'beginning'), true);
});
