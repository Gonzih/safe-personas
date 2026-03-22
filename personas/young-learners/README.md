# Young Learners Tier

**Age Range: 11–13 | Safety Level: High with Nuance | Persona: Nova**

---

## What This Tier Covers

Young Learners is designed for preteens aged 11 to 13 — the middle school years. This is one of the most developmentally significant periods in a person's life, marked by rapid cognitive development, the beginning of formal operational thinking, and the start of identity formation. The AI experience for this age group needs to honor their growing sophistication while maintaining strong protective guardrails.

This tier engages substantively with:
- All core middle school academic subjects (language arts, math, science, history, reading)
- Social dynamics, peer relationships, and the complexity of middle school life
- Age-appropriate identity exploration (who am I, what do I value, where do I belong)
- Emotional awareness: naming feelings, coping strategies, thought patterns
- Puberty and body changes (factual, clinical, age-appropriate)
- Mature themes in school-assigned reading
- Critical thinking, multiple perspectives, and genuine intellectual engagement

This tier maintains strict guardrails around:
- Sexual content (absolute block)
- Self-harm or suicide method details
- Graphic violence
- Writing academic assignments wholesale for the student

---

## Who It Is For

Young Learners is appropriate for:
- Middle school educational platforms
- Homework help tools for grades 6–8
- School counselor support tools (with professional oversight)
- General-purpose AI assistants configured for a 11–13 year old's household device
- Library and after-school program applications

---

## Why These Design Choices Were Made

### Respecting intelligence without removing guardrails
Eleven-to-thirteen-year-olds are often treated as either older children (still needing heavy protection) or younger teenagers (ready for near-adult content). Neither is quite right. They are in transition — cognitively capable of handling nuance and complexity, but emotionally and developmentally still in need of meaningful protection. Nova is calibrated to honor the cognitive reality while maintaining the emotional and safety reality.

### The scaffolding approach to homework
Research on learning (see Vygotsky's Zone of Proximal Development) is clear that learning happens when we are challenged just beyond our current ability with appropriate support — not when someone does the work for us. The homework scaffolding approach (hints, frameworks, Socratic questions) is grounded in this research. It also protects against academic integrity violations that could have real consequences for the student.

### Mental health engagement
Children 11–13 are old enough to benefit meaningfully from conversations about mental health concepts: naming emotions, recognizing thought patterns, understanding coping strategies. Research shows that early mental health literacy has lasting positive effects. At the same time, Nova is not a therapist and does not try to be one. The approach is: normalize, engage, offer simple tools, refer to professionals for anything serious.

### Identity exploration without direction
Erikson's "Identity vs. Role Confusion" stage, which begins around age 12, describes the central developmental task of adolescence: forming a coherent sense of who you are. An AI that pushes a direction — about values, gender, sexuality, beliefs — during this process would be doing harm. Nova is designed to be a mirror that helps a young person think, not a guide that tells them who to be.

---

## How to Use This Tier

### Copy-paste the system prompt
The full system prompt is in `persona.md`.

### Use with the MCP server
```bash
npx @gonzih/safe-personas
```
Call `get_persona` with `tier: "young-learners"`.

### Testing
Run through `examples.md` — particularly Example 1 (ambiguous self-harm statement) and Example 4 (puberty question) as these represent the highest-complexity interactions for this tier.

---

## Key Safety Guarantees

- No sexual content
- Crisis escalation with 988 and Crisis Text Line for any safety signals
- Mental health support without overstepping into therapy
- Homework help is scaffolding, not completion
- Honest, direct AI identity disclosure
- Privacy protection with gentle education
- Bullying taken seriously and escalated to adults
