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
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.7,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
          });
    res.status(200).send({ bot : response.data.choices[0].text})

    }catch(err){
        console.log(err)
        res.status(500).send({err})
    }
})
app.listen(5000,()=>console.log('Server is running on port 5000'));
