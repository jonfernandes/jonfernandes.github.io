import test from 'node:test';
import assert from 'node:assert/strict';
import {
  curriculumTopics,
  getPretestQuestions,
  calculateTopicPerformance,
  buildLearningPlan,
  summariseProgress,
} from './src/shared/curriculum.mjs';

test('pretest returns one question per Year 6 curriculum topic', () => {
  const questions = getPretestQuestions();
  assert.equal(questions.length, curriculumTopics.length);
  assert.equal(new Set(questions.map((q) => q.topicId)).size, curriculumTopics.length);
});

test('topic performance correctly maps scores to secure/developing/beginning', () => {
  const performance = calculateTopicPerformance([
    { topicId: 'fractions', correct: true },
    { topicId: 'fractions', correct: false },
    { topicId: 'ratio', correct: true },
    { topicId: 'ratio', correct: true },
    { topicId: 'algebra', correct: false },
  ]);

  assert.equal(performance.fractions.level, 'developing');
  assert.equal(performance.ratio.level, 'secure');
  assert.equal(performance.algebra.level, 'beginning');
});

test('learning plan prioritises weakest topics and excludes secure topics', () => {
  const performance = {
    fractions: { score: 0.2, level: 'beginning' },
    ratio: { score: 0.5, level: 'developing' },
    algebra: { score: 1, level: 'secure' },
  };

  const plan = buildLearningPlan(performance);

  assert.deepEqual(plan.map((item) => item.topicId), ['fractions', 'ratio']);
  assert.equal(plan[0].recommendedMinutes, 90);
  assert.equal(plan[1].recommendedMinutes, 60);
});

test('empty input produces full starter plan and progress summary', () => {
  const performance = calculateTopicPerformance([]);
  const plan = buildLearningPlan(performance);
  const progress = summariseProgress(performance);

  assert.equal(plan.length, curriculumTopics.length);
  assert.equal(progress.secureCount, 0);
  assert.equal(progress.totalTopics, curriculumTopics.length);
});
