# Project Boundary

Vexa Autopilot is a public hackathon demo project.

It is not the production Tabi browser.
It is not the private Nami core.
It is not a fork of the current agent-browser runtime.

## Allowed Relationship To Tabi/Nami

The demo may describe the same high-level pattern:

- user request
- model planning
- tool/action proposal
- human approval
- evidence report

The demo must reimplement this pattern with clean demo code and mock tools. Do not import private modules from `/Users/sammili/Documents/Claude/agent-browser`.

## Folder Rule

Keep the hackathon code under:

`/Users/sammili/Documents/Claude/Projects/byPINKLAND/vela-autopilot`

The local folder name is retained for continuity; the public product name is Vexa Autopilot.

Do not place hackathon code under:

- `agent-browser/nami-runtime`
- `agent-browser/nami-local-runtime`
- `agent-browser/nami-runtime/nami`
- any Tabi release/package folder

## Open Source Rule

Assume every file in this repo may become public.

Before committing or publishing, check that:

- no `.env` file is committed
- no API key/token/secret appears in source or docs
- no private customer/company data appears in sample data
- no Tabi/Nami private implementation is copied in
- any external assets are licensed for public use
