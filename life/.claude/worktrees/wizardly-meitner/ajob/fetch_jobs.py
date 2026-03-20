#!/usr/bin/env python3
"""
fetch_jobs.py — UK ML / AI / Data Science job fetcher
======================================================
Fetches jobs posted in the last 24 hours from:
  • Reed.co.uk API   (https://www.reed.co.uk/developers/jobseeker)
  • Adzuna API       (https://developer.adzuna.com/)

Saves deduplicated results to jobs.json for the GitHub Pages static site.

Required environment variables (set as GitHub Actions secrets):
  REED_API_KEY    — your Reed API key
  ADZUNA_APP_ID   — your Adzuna application ID
  ADZUNA_APP_KEY  — your Adzuna application key
"""

import os
import json
import hashlib
import sys
from datetime import datetime, timedelta, timezone

try:
    import requests
except ImportError:
    print("Installing requests…")
    os.system("pip install requests --quiet")
    import requests


# ── CONFIG ────────────────────────────────────────────────────────────────────

REED_API_KEY   = os.environ.get("REED_API_KEY", "")
ADZUNA_APP_ID  = os.environ.get("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.environ.get("ADZUNA_APP_KEY", "")

SEARCH_TERMS = [
    "machine learning engineer",
    "AI engineer",
    "data scientist",
    "MLOps engineer",
    "deep learning engineer",
    "NLP engineer",
    "computer vision engineer",
    "generative AI engineer",
    "LLM engineer",
    "applied scientist",
    "ML researcher",
    "data science manager",
]

# Only keep jobs from the last N hours
MAX_AGE_HOURS = 25   # slightly over 24h to avoid missing edge cases


# ── HELPERS ───────────────────────────────────────────────────────────────────

def job_fingerprint(job: dict) -> str:
    """Stable hash for deduplication. Prefer URL; fall back to title+company."""
    key = job.get("url") or f"{job.get('title','').lower().strip()}{job.get('company','').lower().strip()}"
    return hashlib.sha1(key.encode()).hexdigest()


def is_recent(date_str: str, hours: int = MAX_AGE_HOURS) -> bool:
    """Return True if date_str is within the last `hours` hours."""
    if not date_str:
        return True  # include if unknown
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return (datetime.now(timezone.utc) - dt).total_seconds() < hours * 3600
    except ValueError:
        return True


def clean_description(text: str) -> str:
    """Strip HTML tags and normalise whitespace."""
    import re
    text = re.sub(r"<[^>]+>", " ", text or "")
    text = re.sub(r"\s+", " ", text).strip()
    return text[:1000]  # cap length


# ── REED ──────────────────────────────────────────────────────────────────────

def fetch_reed_jobs() -> list[dict]:
    if not REED_API_KEY:
        print("⚠️  REED_API_KEY not set — skipping Reed")
        return []

    jobs: list[dict] = []
    seen: set[str] = set()
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    for term in SEARCH_TERMS:
        try:
            resp = requests.get(
                "https://www.reed.co.uk/api/1.0/search",
                auth=(REED_API_KEY, ""),
                params={
                    "keywords": term,
                    "locationName": "United Kingdom",
                    "resultsToTake": 100,
                    "minimumDate": yesterday,
                },
                timeout=20,
            )
            resp.raise_for_status()
            data = resp.json()

            for r in data.get("results", []):
                job = {
                    "title":       r.get("jobTitle", ""),
                    "company":     r.get("employerName", ""),
                    "location":    r.get("locationName", ""),
                    "salary_min":  r.get("minimumSalary"),
                    "salary_max":  r.get("maximumSalary"),
                    "description": clean_description(r.get("jobDescription", "")),
                    "url":         r.get("jobUrl", ""),
                    "date_posted": r.get("date", ""),
                    "source":      "reed",
                }
                fid = job_fingerprint(job)
                if fid not in seen and job["title"] and job["url"]:
                    seen.add(fid)
                    jobs.append(job)

        except requests.RequestException as e:
            print(f"  Reed error for '{term}': {e}")

    print(f"✅ Reed: {len(jobs)} unique jobs")
    return jobs


# ── ADZUNA ────────────────────────────────────────────────────────────────────

def fetch_adzuna_jobs() -> list[dict]:
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        print("⚠️  ADZUNA_APP_ID/KEY not set — skipping Adzuna")
        return []

    jobs: list[dict] = []
    seen: set[str] = set()

    for term in SEARCH_TERMS:
        page = 1
        while page <= 2:  # fetch up to 2 pages (50 results each)
            try:
                resp = requests.get(
                    f"https://api.adzuna.com/v1/api/jobs/gb/search/{page}",
                    params={
                        "app_id":          ADZUNA_APP_ID,
                        "app_key":         ADZUNA_APP_KEY,
                        "results_per_page": 50,
                        "what":            term,
                        "where":           "UK",
                        "max_days_old":    1,
                        "sort_by":         "date",
                    },
                    timeout=20,
                )
                resp.raise_for_status()
                data = resp.json()
                results = data.get("results", [])
                if not results:
                    break

                for r in results:
                    sal_min = r.get("salary_min")
                    sal_max = r.get("salary_max")
                    job = {
                        "title":       r.get("title", ""),
                        "company":     r.get("company", {}).get("display_name", ""),
                        "location":    r.get("location", {}).get("display_name", ""),
                        "salary_min":  int(sal_min) if sal_min and sal_min > 0 else None,
                        "salary_max":  int(sal_max) if sal_max and sal_max > 0 else None,
                        "description": clean_description(r.get("description", "")),
                        "url":         r.get("redirect_url", ""),
                        "date_posted": r.get("created", ""),
                        "source":      "adzuna",
                    }
                    fid = job_fingerprint(job)
                    if fid not in seen and job["title"] and job["url"]:
                        seen.add(fid)
                        jobs.append(job)

                page += 1

            except requests.RequestException as e:
                print(f"  Adzuna error for '{term}' page {page}: {e}")
                break

    print(f"✅ Adzuna: {len(jobs)} unique jobs")
    return jobs


# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    print("🔍 Fetching UK ML/AI/Data Science jobs…\n")

    reed_jobs   = fetch_reed_jobs()
    adzuna_jobs = fetch_adzuna_jobs()

    # Global dedup across both sources
    all_jobs: list[dict] = []
    seen_global: set[str] = set()

    for job in reed_jobs + adzuna_jobs:
        fid = job_fingerprint(job)
        if fid not in seen_global:
            seen_global.add(fid)
            all_jobs.append(job)

    # Filter to last 24 h (some APIs return slightly older results)
    all_jobs = [j for j in all_jobs if is_recent(j.get("date_posted", ""))]

    # Sort newest first
    all_jobs.sort(
        key=lambda j: j.get("date_posted") or "",
        reverse=True,
    )

    output = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "total":      len(all_jobs),
        "jobs":       all_jobs,
    }

    with open("jobs.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, default=str, ensure_ascii=False)

    print(f"\n🎉 Saved {len(all_jobs)} unique jobs to jobs.json")

    if len(all_jobs) == 0:
        print("⚠️  No jobs found. Check your API keys are set correctly in GitHub Secrets.")
        sys.exit(0)  # Don't fail CI — just an empty day


if __name__ == "__main__":
    main()
