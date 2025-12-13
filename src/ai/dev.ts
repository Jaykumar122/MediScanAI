import { config } from 'dotenv';
config();

import '@/ai/flows/ocr-and-summarize.ts';
import '@/ai/flows/summarize-medical-document.ts';
import '@/ai/flows/extract-data-from-image.ts';
import '@/ai/flows/chat-with-document.ts';
import '@/ai/flows/diagnose-image.ts';
import '@/ai/flows/medication-suggestion.ts';