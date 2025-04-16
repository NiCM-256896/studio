// Use server directive is needed to ensure that the code is only run on the server.
'use server';

/**
 * @fileOverview This file defines a Genkit flow to parse a list of technologies,
 * remove duplicates, determine relevance, and rank them.
 *
 * - parseAndRankTechnologies - A function that handles the parsing and ranking process.
 * - ParseAndRankTechnologiesInput - The input type for the parseAndRankTechnologies function.
 * - ParseAndRankTechnologiesOutput - The return type for the parseAndRankTechnologies function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ParseAndRankTechnologiesInputSchema = z.object({
  technologies: z
    .string()
    .describe('A comma-separated list of technologies to parse and rank.'),
});

export type ParseAndRankTechnologiesInput = z.infer<
  typeof ParseAndRankTechnologiesInputSchema
>;

const ParseAndRankTechnologiesOutputSchema = z.object({
  rankedTechnologies: z.array(
    z.object({
      technology: z.string().describe('The name of the technology.'),
      relevance: z
        .number()
        .describe('The relevance score of the technology (0-1).'),
    })
  ).describe('A list of technologies ranked by relevance.'),
});

export type ParseAndRankTechnologiesOutput = z.infer<
  typeof ParseAndRankTechnologiesOutputSchema
>;

export async function parseAndRankTechnologies(
  input: ParseAndRankTechnologiesInput
): Promise<ParseAndRankTechnologiesOutput> {
  return parseAndRankTechnologiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseAndRankTechnologiesPrompt',
  input: {
    schema: z.object({
      technologies: z
        .string()
        .describe('A comma-separated list of technologies to parse and rank.'),
    }),
  },
  output: {
    schema: z.object({
      rankedTechnologies: z.array(
        z.object({
          technology: z.string().describe('The name of the technology.'),
          relevance: z
            .number()
            .describe('The relevance score of the technology (0-1).'),
        })
      ).describe('A list of technologies ranked by relevance.'),
    }),
  },
  prompt: `You are an AI expert in software development technologies.

You will receive a list of technologies as input. Your task is to parse this list,
remove any duplicate entries, determine the relevance of each technology, and then
rank them based on their relevance. The relevance should be a score between 0 and 1.

Technologies list: {{{technologies}}}

Return the technologies ranked by relevance in JSON format.
`,
});

const parseAndRankTechnologiesFlow = ai.defineFlow<
  typeof ParseAndRankTechnologiesInputSchema,
  typeof ParseAndRankTechnologiesOutputSchema
>(
  {
    name: 'parseAndRankTechnologiesFlow',
    inputSchema: ParseAndRankTechnologiesInputSchema,
    outputSchema: ParseAndRankTechnologiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
