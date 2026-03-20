import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getPretestQuestions,
  questionBank,
  calculateTopicPerformance,
  buildLearningPlan,
  summariseProgress,
} from './src/shared/curriculum.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 4173;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function sendJson(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/pretest') {
    return sendJson(res, 200, { questions: getPretestQuestions() });
  }

  if (req.method === 'POST' && url.pathname === '/api/plan') {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });

    req.on('end', () => {
      const payload = raw ? JSON.parse(raw) : { answers: [] };
      const submitted = Array.isArray(payload.answers) ? payload.answers : [];

      const marked = submitted.map((answer) => {
        const q = questionBank.find((item) => item.topicId === answer.topicId);
        return { topicId: answer.topicId, correct: q ? q.answer === answer.selected : false };
      });

      const performance = calculateTopicPerformance(marked);
      const plan = buildLearningPlan(performance);
      const progress = summariseProgress(performance);
      sendJson(res, 200, { plan, progress });
    });
    return;
  }

  const requestPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.join(__dirname, requestPath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mime[ext] ?? 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Year 6 Maths Mission running on http://0.0.0.0:${port}`);
});
