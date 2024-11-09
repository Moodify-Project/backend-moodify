import axios from "axios";
import { Request, Response } from "express";

const getNews = (req: Request, res: Response): void => {
    const API_KEY = 'a67388915ccc4bb186579c7443fbc737';
    const date = new Date();
    date.setDate(date.getDate() - 7);

    const queryDate = date.toISOString().split("T")[0];

    const indexToNum = Number(req.query.index);

    const url = `https://newsapi.org/v2/everything?domains=forbes.com&q=mental&from=${queryDate}&apiKey=${API_KEY}`;

    axios.get(url)
        .then((response) => {
            const { status, totalResults, articles } = response.data;
            // const getDozens = totalResults.toString();
            // const dozensIndex = getDozens.slice(0, getDozens.length - 1);
            
            const firstSeq = indexToNum * 10;
            const temp = firstSeq + 9;
            const lastSeq = temp > totalResults ? totalResults : temp;
            const newArr = [];
            for (let i = firstSeq; i < lastSeq; i++) {
                newArr.push(articles[i]);
            }
            const newResponse = {
                status: 'success',
                index: indexToNum,
                totalArticle: newArr.length, 
                result: newArr
            }
            return res.status(200).json(newResponse);
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
            return res.status(500).json({
                status: 'failed',
                error: err
            });
        });
}

export default getNews;