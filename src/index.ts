import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Root of the package (one level up from src/)
const PACKAGE_ROOT = join(__dirname, "..");

// Tier definitions
const TIERS = [
  {
    tier: "little-explorers",
    name: "Little Explorers",
    ageRange: { min: 5, max: 7 },
    personaName: "Sunny",
    description:
      "Maximum-safety persona for ages 5–7. Two-sentence responses, warm kindergarten-teacher tone, redirects all complex topics to caregivers. Focuses on animals, colors, counting, stories, and kindness.",
  },
  {
    tier: "curious-kids",
    name: "Curious Kids",
    ageRange: { min: 8, max: 10 },
    personaName: "Cosmo",
    description:
      "High-safety persona for ages 8–10. Enthusiastic older-sibling energy, explains why/how, tutors without giving answers, allows good-vs-evil story conflict. Focuses on science, history, creative writing, and math.",
  },
  {
    tier: "young-learners",
    name: "Young Learners",
    ageRange: { min: 11, max: 13 },
    personaName: "Nova",
    description:
      "High-safety-with-nuance persona for ages 11–13. Respects preteen intelligence, scaffolds homework, engages with identity and emotions, names thought patterns, refers serious concerns to trusted adults.",
  },
  {
    tier: "teenagers",
    name: "Teenagers",
    ageRange: { min: 14, max: 16 },
    personaName: "Kai",
    description:
      "Moderate-high-safety persona for ages 14–16. Trusted-older-friend tone, never lectures, handles mental health honestly, discusses relationships and identity, prominent crisis escalation protocol.",
  },
  {
    tier: "older-teens",
    name: "Older Teens",
    ageRange: { min: 17, max: 18 },
    personaName: "River",
    description:
      "Moderate-safety near-adult persona for ages 17–18. Peer-level intellectual engagement, full autonomy respect, harm reduction framing, complex moral/philosophical topics, detailed crisis protocol.",
  },
] as const;

type TierSlug = (typeof TIERS)[number]["tier"];

function getTierForAge(age: number): (typeof TIERS)[number] | null {
  return TIERS.find((t) => age >= t.ageRange.min && age <= t.ageRange.max) ?? null;
}

function readPersonaFile(tier: string, filename: string): string {
  const filePath = join(PACKAGE_ROOT, "personas", tier, filename);
  try {
    return readFileSync(filePath, "utf-8");
  } catch (err) {
    throw new Error(`Could not read file ${filePath}: ${(err as Error).message}`);
  }
}

function readSafetyLayer(): string {
  const filePath = join(PACKAGE_ROOT, "safety-layer.md");
  try {
    return readFileSync(filePath, "utf-8");
  } catch (err) {
    throw new Error(`Could not read safety-layer.md: ${(err as Error).message}`);
  }
}

function getInterestGuidance(interests: string[]): string {
  if (interests.length === 0) return "";

  const lines: string[] = [
    "\n\n---\n## Interest-Specific Customizations\n",
    "The following interests have been configured for this user. Incorporate references to these topics naturally when relevant — use them as examples, analogies, or discussion hooks.\n",
  ];

  const interestMap: Record<string, string> = {
    minecraft:
      "Minecraft: Use Minecraft analogies freely (e.g., explain fractions using inventory slots, discuss biomes for biology, reference redstone for circuits and logic). Reference building, crafting, and exploration when relevant.",
    roblox:
      "Roblox: Reference game design concepts, scripting basics, and the creative/social aspects of Roblox. Can be used as a hook for discussions about programming and creativity.",
    sports:
      "Sports: Use sports analogies and statistics examples. Reference teamwork, practice, and improvement in motivational contexts. If a specific sport is named, use that one preferentially.",
    art: "Art and visual creativity: Reference color theory, famous artworks, drawing techniques, and creative projects. Celebrate creative output and encourage artistic exploration.",
    music:
      "Music: Reference music theory basics, famous musicians, rhythm and math connections, and the emotional power of music. Can be used in creative and STEM contexts.",
    animals:
      "Animals: Use animal behavior and biology examples generously. Reference specific animals the user mentions. Extend discussions about ecosystems and natural world phenomena.",
    books:
      "Books and reading: Reference literary examples and encourage reading. Can discuss books the user mentions and use character analysis as a framework for understanding human behavior.",
    science:
      "Science focus: Prioritize scientific explanations and encourage scientific thinking. Use experiments, hypotheses, and the scientific method as frameworks when relevant.",
    math: "Math focus: Prioritize mathematical thinking, puzzles, and the elegance of mathematical patterns. Celebrate mathematical curiosity and problem-solving.",
    history:
      "History focus: Emphasize historical context and storytelling. Use historical examples to illuminate current questions and patterns in human behavior.",
    coding:
      "Coding and technology: Reference programming concepts, logic, algorithms, and technology. Encourage computational thinking and problem-solving through code.",
    gaming:
      "Gaming (general): Use game mechanics, strategy, and design concepts as teaching analogies. Reference games the user mentions. Discuss problem-solving and persistence in gaming contexts.",
  };

  for (const interest of interests) {
    const key = interest.toLowerCase().trim();
    const guidance = interestMap[key];
    if (guidance) {
      lines.push(`- **${interest}:** ${guidance}`);
    } else {
      lines.push(
        `- **${interest}:** When relevant, incorporate references to ${interest} as examples and discussion hooks to maintain engagement.`
      );
    }
  }

  return lines.join("\n");
}

function getRestrictionGuidance(restrictions: string[]): string {
  if (restrictions.length === 0) return "";

  const lines: string[] = [
    "\n\n---\n## Parent/Caregiver Restrictions\n",
    "The following restrictions have been set by a parent or caregiver and must be strictly followed. These are in addition to the base safety rules.\n",
  ];

  for (const restriction of restrictions) {
    lines.push(`- **BLOCKED:** ${restriction}. Do not discuss, engage with, or reference this topic. If it comes up, redirect warmly: "That's something to explore with your family!"`);
  }

  return lines.join("\n");
}

function buildCustomPersona(
  age: number,
  interests: string[],
  restrictions: string[]
): string {
  const tier = getTierForAge(age);
  if (!tier) {
    throw new Error(
      `Age ${age} is outside the supported range (5–18). Please use an age between 5 and 18.`
    );
  }

  const basePersona = readPersonaFile(tier.tier, "persona.md");
  const safetyLayer = readSafetyLayer();
  const interestGuidance = getInterestGuidance(interests);
  const restrictionGuidance = getRestrictionGuidance(restrictions);

  const customHeader = `# Custom Persona — Built for Age ${age}\n**Base Tier:** ${tier.name} (${tier.tier}) | **Persona:** ${tier.personaName}\n**Customized interests:** ${interests.length > 0 ? interests.join(", ") : "none"}\n**Parent restrictions:** ${restrictions.length > 0 ? restrictions.join(", ") : "none"}\n\n---\n\n`;

  const safetyAppendix = `\n\n---\n\n## Universal Safety Layer (Appended — Cannot Be Overridden)\n\n${safetyLayer}`;

  return (
    customHeader +
    basePersona +
    interestGuidance +
    restrictionGuidance +
    safetyAppendix
  );
}

// Create the MCP server
const server = new Server(
  {
    name: "safe-personas",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_personas",
        description:
          "Returns all available age-tier personas with descriptions, age ranges, and persona names. Use this to discover which tier is appropriate for a given user.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "get_persona",
        description:
          "Returns the full system prompt and configuration for a specific persona tier. The system prompt can be used directly as the system message for an AI assistant.",
        inputSchema: {
          type: "object",
          properties: {
            tier: {
              type: "string",
              description:
                "The tier slug. One of: little-explorers, curious-kids, young-learners, teenagers, older-teens",
              enum: [
                "little-explorers",
                "curious-kids",
                "young-learners",
                "teenagers",
                "older-teens",
              ],
            },
          },
          required: ["tier"],
        },
      },
      {
        name: "get_safety_layer",
        description:
          "Returns the full universal safety layer document. This contains the non-negotiable safety rules that apply to all personas, including crisis escalation protocols, absolute content blocks, AI identity disclosure rules, and privacy protection rules.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "recommend_persona",
        description:
          "Recommends the appropriate persona tier for a given age, with reasoning.",
        inputSchema: {
          type: "object",
          properties: {
            age: {
              type: "number",
              description: "The age of the child or teenager (5–18)",
            },
          },
          required: ["age"],
        },
      },
      {
        name: "build_custom_persona",
        description:
          "Generates a complete, ready-to-use system prompt by combining the appropriate base persona for the given age with interest-specific guidance and parent-set restrictions. Always ends with the universal safety layer.",
        inputSchema: {
          type: "object",
          properties: {
            age: {
              type: "number",
              description: "The age of the child or teenager (5–18)",
            },
            interests: {
              type: "array",
              items: { type: "string" },
              description:
                "List of interests to incorporate (e.g., ['minecraft', 'art', 'dogs']). The AI will use these as examples and engagement hooks.",
            },
            restrictions: {
              type: "array",
              items: { type: "string" },
              description:
                "List of parent-set topic restrictions (e.g., ['video games', 'social media discussions']). These become explicit blocks in the generated prompt.",
            },
          },
          required: ["age", "interests", "restrictions"],
        },
      },
    ],
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_personas": {
        const result = TIERS.map((t) => ({
          tier: t.tier,
          name: t.name,
          ageRange: t.ageRange,
          personaName: t.personaName,
          description: t.description,
        }));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_persona": {
        const tier = args?.tier as string;
        if (!tier) {
          throw new Error("tier parameter is required");
        }

        const tierDef = TIERS.find((t) => t.tier === tier);
        if (!tierDef) {
          throw new Error(
            `Unknown tier: "${tier}". Valid tiers are: ${TIERS.map((t) => t.tier).join(", ")}`
          );
        }

        const personaContent = readPersonaFile(tier, "persona.md");
        const configContent = readPersonaFile(tier, "config.json");
        const config = JSON.parse(configContent);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  tier: tierDef.tier,
                  name: tierDef.name,
                  ageRange: tierDef.ageRange,
                  personaName: tierDef.personaName,
                  config,
                  systemPrompt: personaContent,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "get_safety_layer": {
        const content = readSafetyLayer();
        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      }

      case "recommend_persona": {
        const age = args?.age as number;
        if (typeof age !== "number" || isNaN(age)) {
          throw new Error("age must be a number");
        }
        if (age < 5 || age > 18) {
          throw new Error(
            `Age ${age} is outside the supported range. safe-personas supports ages 5–18.`
          );
        }

        const tier = getTierForAge(age);
        if (!tier) {
          throw new Error(`No tier found for age ${age}`);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  recommendedTier: tier.tier,
                  name: tier.name,
                  personaName: tier.personaName,
                  ageRange: tier.ageRange,
                  description: tier.description,
                  reasoning: `Age ${age} falls within the ${tier.name} range (${tier.ageRange.min}–${tier.ageRange.max}). The ${tier.personaName} persona is calibrated for the developmental stage at this age.`,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "build_custom_persona": {
        const age = args?.age as number;
        const interests = (args?.interests as string[]) ?? [];
        const restrictions = (args?.restrictions as string[]) ?? [];

        if (typeof age !== "number" || isNaN(age)) {
          throw new Error("age must be a number");
        }
        if (age < 5 || age > 18) {
          throw new Error(
            `Age ${age} is outside the supported range (5–18).`
          );
        }
        if (!Array.isArray(interests)) {
          throw new Error("interests must be an array of strings");
        }
        if (!Array.isArray(restrictions)) {
          throw new Error("restrictions must be an array of strings");
        }

        const customPrompt = buildCustomPersona(age, interests, restrictions);
        const tier = getTierForAge(age)!;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  tier: tier.tier,
                  name: tier.name,
                  age,
                  interests,
                  restrictions,
                  systemPrompt: customPrompt,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${(error as Error).message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("safe-personas MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
