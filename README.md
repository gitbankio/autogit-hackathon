# autogit-hackathon

Open source prompt template library for AutoGit. Submit a template, get paid automatically when your PR merges.

## What is AutoGit?

[AutoGit](https://gitbank.io/autogit/) lets anyone describe an app and deploy it to GitHub Pages automatically using their own AI API key. This repo holds the community-built prompt templates that power different app types.

## Hackathon

We are running an open hackathon. Submit a prompt template for any app type and get 5 USDC automatically the moment your PR is merged.

Read [HACKATHON.md](HACKATHON.md) for full details and rules.

**Participant list:** https://gitbankio.github.io/autogit-hackathon/

## How templates work

Each template is a markdown file in `templates/` with:

```
---
title: Your Template Title
app_type: your-app-type
wallet: 0xYourBaseWalletAddress
---

Your system prompt here...
```

AutoGit sends the prompt to your chosen AI provider (OpenAI, Anthropic, Gemini, Groq, DeepSeek) and uses the response to generate a full React + Vite + Tailwind app.

## Existing templates

| App Type | File |
|---|---|
| Product Landing Page | [templates/example-landing-page.md](templates/example-landing-page.md) |
| Developer Portfolio | [templates/example-portfolio.md](templates/example-portfolio.md) |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CONTEST.md](CONTEST.md).

## License

MIT. See [LICENSE](LICENSE).
