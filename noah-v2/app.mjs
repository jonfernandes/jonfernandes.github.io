import {
  calculateTopicPerformance,
  buildLearningPlan,
  getPretestQuestions,
  curriculumTopics,
} from './logic.mjs';

const pretestElement = document.getElementById('pretest');
const resultsElement = document.getElementById('results');

const questions = getPretestQuestions();

function renderPretest() {
  pretestElement.innerHTML = `
    <h2>Step 1: Quick Check-Up</h2>
    <p>Choose the answer you think is best. This is to help us choose what to learn next.</p>
    <form id="pretest-form">
      ${questions
        .map(
          (q, index) => `
            <div class="question">
              <fieldset>
                <legend><strong>Q${index + 1}.</strong> ${q.prompt}</legend>
                ${q.options
                  .map(
                    (option) => `
                      <label>
                        <input type="radio" name="q-${index}" value="${option}" required />
                        ${option}
                      </label>
                    `
                  )
                  .join('')}
              </fieldset>
            </div>
          `
        )
        .join('')}
      <button type="submit">Build my learning plan</button>
    </form>
  `;

  document.getElementById('pretest-form').addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const answers = questions.map((question, index) => {
    const selected = formData.get(`q-${index}`);
    return {
      topicId: question.topicId,
      correct: selected === question.answer,
    };
  });

  const performance = calculateTopicPerformance(answers);
  const plan = buildLearningPlan(performance);

  renderResults(performance, plan);
}

function renderResults(performance, plan) {
  const secureCount = Object.values(performance).filter((topic) => topic.level === 'secure').length;
  const topicLookup = Object.fromEntries(curriculumTopics.map((topic) => [topic.id, topic]));

  resultsElement.classList.remove('hidden');
  resultsElement.innerHTML = `
    <h2>Step 2: Your Learning Plan</h2>
    <p>You are already secure in <strong>${secureCount}</strong> out of ${curriculumTopics.length} topics.</p>
    ${
      plan.length
        ? `<p>Start from the top. The first topics are the most important to improve.</p>
           ${plan
             .map(
               (item, idx) => `
                <article class="plan-item">
                  <h3>${idx + 1}. ${item.title}
                    <span class="badge ${item.level}">${item.level}</span>
                  </h3>
                  <p><strong>Weekly target:</strong> ${item.recommendedMinutes} minutes</p>
                  <p>${item.summary}</p>
                  <ul>
                    ${topicLookup[item.topicId].learn.map((goal) => `<li>${goal}</li>`).join('')}
                  </ul>
                </article>
              `
             )
             .join('')}`
        : '<p>Amazing! You are secure in all topics. Keep practising mixed questions to stay sharp.</p>'
    }
  `;

  resultsElement.scrollIntoView({ behavior: 'smooth' });
}

renderPretest();
