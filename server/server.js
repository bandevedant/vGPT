import express from 'express'
import * as dotenv  from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi }  from 'openai';

dotenv.config();

const configuration = new Configuration({
    organization: "org-SFeA4kySt1bTs1ldXbUT32sM",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// console.log(process.env.OPENAI_API_KEY)
const app = express()
app.use(cors());
app.use(express.json());

app.get('/',async (req,res)=>{
    res.status(200).send('Hello from VedX...')

});
app.post('/',async (req,res)=>{
    try{
        const prompt=req.body.prompt;
        const response = await await openai.chat.completions.create({
                messages: [{"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "Who won the world series in 2020?"},
                    {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
                    {"role": "user", "content": "Where was it played?"}],
                model: "gpt-3.5-turbo",
              });
        // const response = await openai.createCompletion({
        //     model: "text-davinci-003",
        //     prompt: `${prompt}`,
        //     temperature: 0.7,
        //     max_tokens: 2000,
        //     top_p: 1,
        //     frequency_penalty: 0.5,
        //     presence_penalty: 0,
        //   });
    res.status(200).send({ bot : response.choices[0].message.content})

    }catch(err){
        console.log(err)
        res.status(500).send({err})
    }
})
app.listen(5000,()=>console.log('Server is running on port 5000'));
