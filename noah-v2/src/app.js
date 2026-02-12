const { createElement: h, useEffect, useState } = React;

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/api/pretest').then((res) => res.json()).then((data) => setQuestions(data.questions));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const payload = questions.map((q, i) => ({ topicId: q.topicId, selected: answers[i] }));
    const res = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: payload }),
    });
    setResult(await res.json());
  };

  return h('main', { className: 'app' }, [
    h('h1', { key: 'h1' }, '🚀 Year 6 Maths Mission'),
    h('p', { key: 'intro', className: 'intro' }, 'Take this quick check-up first, then follow your personal plan.'),
    h('section', { key: 'test', className: 'card' }, [
      h('h2', { key: 'title' }, 'Step 1: Quick Check-Up'),
      h(
        'form',
        { key: 'form', onSubmit: submit },
        [
          ...questions.map((q, index) =>
            h('div', { key: q.topicId, className: 'question' }, [
              h('p', { key: `p-${q.topicId}` }, [h('strong', { key: `s-${q.topicId}` }, `Q${index + 1}. `), q.prompt]),
              ...q.options.map((option) =>
                h('label', { key: `${q.topicId}-${option}` }, [
                  h('input', {
                    type: 'radio',
                    name: `q-${index}`,
                    value: option,
                    required: true,
                    onChange: (e) => setAnswers((prev) => ({ ...prev, [index]: e.target.value })),
                  }),
                  option,
                ])
              ),
            ])
          ),
          h('button', { key: 'button', type: 'submit' }, 'Build my learning plan'),
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
