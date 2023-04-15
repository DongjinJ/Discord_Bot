// import { Configuration, OpenAIApi } from 'openai';
require("dotenv").config()

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey:process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const str = "How can you learn English?"
const runPrompt = async(str) => {
    var answer = "No Data"
    const response = await openai.createCompletion({
        model:"text-davinci-003",
        prompt:str,
        max_tokens:300,
        temperature:0.2,
    }).then(function(result){
        answer = result.data.choices[0].text;
        console.log(result.data.choices[0].text);
        return answer;
    })
}