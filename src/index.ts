// packages
import dotenv from 'dotenv';
import express, { Express, Response, Request } from 'express';
import 'module-alias/register';
import multer from 'multer';

// lib
import { openai } from '@lib/open-ai';

// env
dotenv.config();

const title = 'Doom Scheme API';

// server
const app: Express = express();
const port = process.env.PORT;

// form parsing
const upload = multer();

// middleware for parsing application/json
app.use(express.json());

// middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// middleware for parsing multipart/form-data
app.use(upload.array('input'));
app.use(express.static('public'));

// routes
app.post('/api/composition', async (req: Request, res: Response) => {
	try {
		// verify that the request is coming from the Doom Scheme app
		const authHeader = req.headers['access-token'];
		if (!authHeader || authHeader !== process.env.ACCESS_TOKEN)
			return res
				.status(401)
				.send(`You need to provide an access token to use the ${title}`);

		const { input } = req.body;

		// validate the input exists
		if (!input)
			return res
				.status(400)
				.send(`You need to provide a form input to use the ${title}`);

		console.log(input);

		// generate a response from GPT-3
		const openaiResponse = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: `Complete this rap by using consonance, assonance, internal rhymes, end rhymes, slant rhymes, onomatopoeia, alliteration, metaphors, similes, irony, and humor in the rhyme scheme:\n${input}`,
			temperature: 0.7,
			max_tokens: 256,
			top_p: 1,
			frequency_penalty: 0.5,
			presence_penalty: 0,
		});

		if (!openaiResponse.data.choices?.length) throw new Error();

		res.send(`${input} ${openaiResponse.data.choices[0].text}`);
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Something went wrong with the ${title}`);
	}
});

// listener
app.listen(port, () => {
	console.log(`[server]: ${title} is running @ port ${port}`);
});
