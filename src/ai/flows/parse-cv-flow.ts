'use server';
/**
 * @fileOverview A flow for parsing resumes/CVs.
 *
 * - parseCV - A function that handles parsing a CV file.
 * - ParseCVInput - The input type for the parseCV function.
 * - ParseCVOutput - The return type for the parseCV function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseCVInputSchema = z.object({
  cvDataUri: z
    .string()
    .describe(
      "A curriculum vitae (CV) or resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseCVInput = z.infer<typeof ParseCVInputSchema>;

const ParseCVOutputSchema = z.object({
  name: z.string().describe("The full name of the applicant. Return empty string if not found."),
  email: z.string().describe("The email address of the applicant. Return empty string if not found."),
  phone: z.string().describe("The phone number of the applicant. Return empty string if not found."),
});
export type ParseCVOutput = z.infer<typeof ParseCVOutputSchema>;

export async function parseCV(input: ParseCVInput): Promise<ParseCVOutput> {
  return parseCvFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseCVPrompt',
  input: {schema: ParseCVInputSchema},
  output: {schema: ParseCVOutputSchema},
  prompt: `You are an expert recruiter and hiring manager. Your task is to parse the given resume/CV and extract the applicant's contact information.

Extract the full name, email address, and phone number from the following document.
If a piece of information is not found, return an empty string for that field.

Resume/CV:
{{media url=cvDataUri}}
`,
});

const parseCvFlow = ai.defineFlow(
  {
    name: 'parseCvFlow',
    inputSchema: ParseCVInputSchema,
    outputSchema: ParseCVOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
