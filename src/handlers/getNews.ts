import axios from "axios";
import { Request, Response } from "express";
import myCache from "../internal/configs/myCache";

interface News {
  source: {
    id: undefined;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

const getNews = (req: Request, res: Response): any => {
  const API_KEY_NEWS =
    process.env.API_KEY_NEWS || "a67388915ccc4bb186579c7443fbc737";
  const date = new Date();
  date.setDate(date.getDate() - 7);

  const queryDate = date.toISOString().split("T")[0];

  const indexToNum = Number(req.query.index) || 0;

  if (myCache.get(`news-${indexToNum}`)) {
    const allNewsData: News[] = myCache.get(`news-${indexToNum}`) || [];

    const newResponse = {
      status: "success",
      index: indexToNum,
      totalArticle: allNewsData.length,
      result: allNewsData,
    };
    return res.status(200).json(newResponse);
  }

  const url = `https://newsapi.org/v2/everything?domains=forbes.com&q=mental&from=${queryDate}&apiKey=${API_KEY_NEWS}`;

  axios
    .get(url)
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

      myCache.set(`news-${indexToNum}`, newArr, 10000);

      const newResponse = {
        status: "success",
        index: indexToNum,
        totalArticle: newArr.length,
        result: newArr,
      };
      return res.status(200).json(newResponse);
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
      return res.status(500).json({
        status: "failed",
        error: err,
      });
    });
};

export default getNews;
