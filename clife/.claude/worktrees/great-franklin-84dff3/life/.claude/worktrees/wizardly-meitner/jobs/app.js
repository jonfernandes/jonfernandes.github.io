const roles = [
  'machine learning engineer',
  'ai engineer',
  'data scientist'
];

const sources = [
  {
    name: 'LinkedIn',
    url: (role) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(role)}&location=United%20Kingdom&f_TPR=r86400`
  },
  {
    name: 'Totaljobs',
    url: (role) => `https://www.totaljobs.com/jobs?keywords=${encodeURIComponent(role)}&location=UK&sort=2&postedWithin=1`
  },
  {
    name: 'Reed',
    url: (role) => `https://www.reed.co.uk/jobs/${encodeURIComponent(role)}-jobs-in-united-kingdom?datecreatedoffset=Last24Hours`
  },
  {
    name: 'CWJobs',
    url: (role) => `https://www.cwjobs.co.uk/jobs?keywords=${encodeURIComponent(role)}&location=UK&sort=2&postedWithin=1`
  }
];

const proxies = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://r.jina.ai/http://${url.replace(/^https?:\/\//, '')}`
];

const jobsList = document.getElementById('jobs-list');
const statusEl = document.getElementById('status');
const emptyStateEl = document.getElementById('empty-state');
const quickLinksEl = document.getElementById('quick-links');
const refreshBtn = document.getElementById('refresh-btn');

function setStatus(message) {
  statusEl.textContent = message;
}

function normalizeText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function parseJobs(html, sourceName) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const links = Array.from(doc.querySelectorAll('a[href]'));
  const sourceHostHints = {
    LinkedIn: '/jobs/view/',
    Totaljobs: '/job/',
    Reed: '/jobs/',
    CWJobs: '/job/'
  };
  const hint = sourceHostHints[sourceName] || '/job';

  return links
    .map((link) => {
      const href = link.getAttribute('href') || '';
      const title = normalizeText(link.textContent || '');
      return { href, title };
    })
    .filter((item) => item.href.includes(hint) && item.title.length > 8)
    .slice(0, 8);
}

async function fetchViaProxy(url) {
  for (const proxyBuilder of proxies) {
    try {
      const response = await fetch(proxyBuilder(url));
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      // Try next proxy.
    }
  }
  throw new Error('All proxies failed.');
}

function renderQuickLinks() {
  quickLinksEl.innerHTML = '';
  for (const role of roles) {
    for (const source of sources) {
      const li = document.createElement('li');
      li.className = 'quick-link-item';
      const a = document.createElement('a');
      a.href = source.url(role);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = `${source.name}: ${role}`;
      li.appendChild(a);
      quickLinksEl.appendChild(li);
    }
  }
}

function renderJobs(jobs) {
  jobsList.innerHTML = '';
  if (!jobs.length) {
    emptyStateEl.textContent = 'No jobs could be loaded automatically. Use the direct site searches below or click Refresh jobs to retry.';
    emptyStateEl.style.display = 'block';
    return;
  }

  emptyStateEl.style.display = 'none';
  for (const job of jobs) {
    const li = document.createElement('li');
    li.className = 'job-item';
    const a = document.createElement('a');
    a.href = job.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = job.title;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${job.source} • ${job.role} • posted in last 24h filter`;

    li.appendChild(a);
    li.appendChild(meta);
    jobsList.appendChild(li);
  }
}

async function loadJobs() {
  setStatus('Loading...');
  refreshBtn.disabled = true;

  const allJobs = [];
  for (const role of roles) {
    for (const source of sources) {
      const url = source.url(role);
      try {
        const html = await fetchViaProxy(url);
        const parsed = parseJobs(html, source.name);
        parsed.forEach((job) => {
          const absoluteUrl = job.href.startsWith('http')
            ? job.href
            : new URL(job.href, url).toString();
          allJobs.push({
            title: job.title,
            url: absoluteUrl,
            source: source.name,
            role
          });
        });
      } catch (error) {
        setStatus(`Some sources blocked automated reads. Use direct links below.`);
      }
    }
  }

  const uniqueJobs = Array.from(new Map(allJobs.map((job) => [job.url, job])).values()).slice(0, 60);
  renderJobs(uniqueJobs);
  setStatus(`Loaded ${uniqueJobs.length} jobs.`);
  refreshBtn.disabled = false;
}

refreshBtn.addEventListener('click', loadJobs);
renderQuickLinks();
loadJobs();
