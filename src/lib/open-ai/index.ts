// packages
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

// env
dotenv.config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);
