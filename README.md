# safe-personas

> **Every child deserves an AI that speaks their language and keeps them safe.**

[![npm version](https://img.shields.io/npm/v/@gonzih/safe-personas.svg)](https://www.npmjs.com/package/@gonzih/safe-personas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

A library of production-ready, age-appropriate AI persona system prompts for children and teenagers aged 5–18. Use them directly as system prompts, or serve them through the included MCP server.

---

## The Problem

Default AI assistant configurations are built for adults. When a 7-year-old asks about their fish dying, a default AI might give a philosophical answer about grief. When a 15-year-old is struggling with suicidal thoughts, a default AI might not know to provide crisis resources and stay present. When a parent sets up a learning tool for their 10-year-old, they have no easy way to ensure the AI stays age-appropriate.

safe-personas solves this with carefully crafted, developmentally informed system prompts for five age tiers, plus an MCP server to make them programmatically accessible.

---

## Tier Overview

| Tier | Name | Ages | Persona | Style |
|------|------|------|---------|-------|
| `little-explorers` | Little Explorers | 5–7 | Sunny | Warm kindergarten teacher — 2-sentence max, positive-only, redirects all complexity to caregivers |
| `curious-kids` | Curious Kids | 8–10 | Cosmo | Enthusiastic older sibling — why/how thinking, tutoring not answering, good-vs-evil stories allowed |
| `young-learners` | Young Learners | 11–13 | Nova | Cool mentor — scaffolded homework help, identity support, mental health awareness, multiple perspectives |
| `teenagers` | Teenagers | 14–16 | Kai | Trusted older friend — honest on hard topics, no lecturing, full mental health engagement, prominent crisis protocol |
| `older-teens` | Older Teens | 17–18 | River | Peer with more experience — near-adult autonomy, harm reduction, philosophical depth, detailed crisis protocol |

Each tier includes:
- `persona.md` — the complete system prompt (400+ words of carefully crafted instructions)
- `config.json` — machine-readable metadata for programmatic use
- `examples.md` — 10 annotated example interactions covering edge cases
- `README.md` — design rationale and usage documentation

---

## Quick Start

### Option 1: Copy and Paste

The simplest approach — no installation needed.

1. Find the persona for your target age group in `personas/{tier}/persona.md`
2. Copy the entire file contents
3. Paste it as the **system prompt** in your AI assistant configuration

For Claude, ChatGPT, Gemini, or any other LLM: the system prompt is the instruction that comes before the conversation begins.

### Option 2: MCP Server with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "safe-personas": {
      "command": "npx",
      "args": ["-y", "@gonzih/safe-personas"]
    }
  }
}
```

Then restart Claude Desktop. You can now ask Claude to:
- "List all available safe personas"
- "Get the system prompt for the teenagers tier"
- "Recommend a persona for a 9-year-old"
- "Build a custom persona for my 12-year-old who loves Minecraft and science"

### Option 3: MCP Server with Claude Code

```bash
claude mcp add safe-personas npx @gonzih/safe-personas
```

### Option 4: Run Locally

```bash
# Clone the repo
git clone https://github.com/gonzih/safe-personas
cd safe-personas

# Install dependencies
npm install

# Build
npm run build

# Run the MCP server
npm start
```

---

## MCP Server Tools

The MCP server exposes five tools:

### `list_personas`
Returns all five tiers with descriptions, age ranges, and persona names.

```json
// Example output (truncated)
[
  {
    "tier": "little-explorers",
    "name": "Little Explorers",
    "ageRange": { "min": 5, "max": 7 },
    "personaName": "Sunny",
    "description": "Maximum-safety persona for ages 5–7..."
  }
]
```

### `get_persona(tier: string)`
Returns the full system prompt and configuration for a specific tier.

```json
// Input
{ "tier": "teenagers" }

// Output (truncated)
{
  "tier": "teenagers",
  "systemPrompt": "# Teenagers — System Prompt\n...",
  "config": { ... }
}
```

### `get_safety_layer`
Returns the full universal safety rules document — useful for reviewing or appending to custom configurations.

### `recommend_persona(age: number)`
Recommends the right tier for a given age.

```json
// Input
{ "age": 9 }

// Output
{
  "recommendedTier": "curious-kids",
  "personaName": "Cosmo",
  "reasoning": "Age 9 falls within the Curious Kids range (8–10)..."
}
```

### `build_custom_persona(age: number, interests: string[], restrictions: string[])`
Generates a complete, customized system prompt by combining the base tier persona with interest-specific guidance and parent-set restrictions. Always ends with the universal safety layer.

```json
// Input
{
  "age": 10,
  "interests": ["minecraft", "dogs", "space"],
  "restrictions": ["social media discussions", "horror stories"]
}

// Output
{
  "tier": "curious-kids",
  "systemPrompt": "# Custom Persona — Built for Age 10\n..."
}
```

---

## Using Personas Directly (Copy-Paste)

All persona files are plain Markdown, designed to be readable and pasteable. To use any persona with any LLM:

1. Open `personas/{tier}/persona.md`
2. Select all text
3. Paste as the system prompt

The persona files include the safety layer rules inline, so you do not need to append `safety-layer.md` separately for standard use.

For maximum safety, you can also append `safety-layer.md` at the end of any system prompt to reinforce the universal rules.

---

## Understanding the Safety Design

### Universal Safety Layer

All five tiers share a common set of non-negotiable safety rules defined in `safety-layer.md`. These rules cannot be overridden by any user instruction, roleplay framing, or operator customization. They include:

- **Absolute content blocks:** No sexual content involving minors (ever), no self-harm method details, no violence instructions, no grooming behaviors
- **Crisis escalation protocol:** Step-by-step guidance for handling suicidal ideation, self-harm, abuse, and immediate danger — including specific crisis resources
- **AI identity disclosure:** Clear, age-appropriate honesty about being an AI
- **Privacy protection:** No solicitation of personally identifiable information from minors

### Developmental Design Principles

The tier structure is grounded in established child development research:

**Piaget's Cognitive Development Stages** describe how children's thinking matures through distinct phases. Children aged 5–7 are in the preoperational stage — they think concretely and symbolically but cannot yet handle abstract reasoning. This is why the Little Explorers persona uses maximum simplicity and avoids complex explanations. Children 8–11 are in the concrete operational stage — they can apply logic to concrete situations, which is why Curious Kids engages with science, history, and cause-and-effect. Adolescents enter formal operational thinking — capable of abstract reasoning, hypothetical thinking, and moral philosophy — which is why the Teenagers and Older Teens tiers engage with genuine complexity.

**Erikson's Psychosocial Development Stages** map the key social and emotional tasks at each developmental phase. The "Industry vs. Inferiority" stage (ages 6–11) centers on building competence — which is why Curious Kids and Young Learners emphasize tutoring and capability building over answer-giving. The "Identity vs. Role Confusion" stage (ages 12–18) is the central work of adolescence, which is why Young Learners, Teenagers, and Older Teens all engage thoughtfully with identity questions without pushing a direction.

---

## Combining with Parental Control MCPs

safe-personas is designed to work alongside other parental control tools. A recommended configuration:

```json
{
  "mcpServers": {
    "safe-personas": {
      "command": "npx",
      "args": ["-y", "@gonzih/safe-personas"]
    }
  }
}
```

When using `build_custom_persona`, you can pass additional restrictions discovered by parental control tools:

```javascript
// Example: parent control tool discovers child is 11 and
// parent has blocked "gaming discussions" and "social media"
const result = await mcpClient.callTool("build_custom_persona", {
  age: 11,
  interests: ["reading", "animals"],
  restrictions: ["gaming discussions", "social media"]
});
// Returns a complete system prompt with those restrictions embedded
```

---

## How to Contribute

Contributions are welcome. Priority areas:

1. **Additional age tiers** — a dedicated tier for ages 3–4 or 19–25 would be valuable
2. **Non-English personas** — the safety patterns here should be adapted for other languages, not simply translated
3. **Specialized tiers** — tiers for specific contexts (school use, therapy-adjacent, STEM focus)
4. **Example improvements** — additional edge case examples for any tier
5. **Testing infrastructure** — automated tests that run example inputs and verify output patterns

To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes
4. Submit a pull request with a clear description of what you changed and why

When submitting a new persona or modifying an existing one, please include:
- The rationale for design choices
- At least 5 new example interactions covering edge cases
- A review of the safety layer compatibility

---

## Crisis Resources

The following resources are referenced in the crisis escalation protocols across all tiers:

| Resource | Contact |
|----------|---------|
| 988 Suicide & Crisis Lifeline | Call or text **988** (US) |
| Crisis Text Line | Text **HOME** to **741741** |
| The Trevor Project (LGBTQ+ youth) | Call **1-866-488-7386** or text **START** to **678-678** |
| Emergency Services | Call **911** (US) |
| Childhelp National Child Abuse Hotline | **1-800-422-4453** |

If you are building an application for international users, consider adapting these resources for your region.

---

## License

MIT — Copyright 2026 Maksim Soltan

See `LICENSE` for full terms.

---

## Acknowledgments

The developmental frameworks referenced in the design of these personas draw on:
- Jean Piaget's theory of cognitive development
- Erik Erikson's theory of psychosocial development
- Public health literature on adolescent harm reduction
- Research on youth crisis intervention best practices
