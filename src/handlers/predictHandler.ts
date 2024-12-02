import { Request, Response } from "express";
import { JournalRepository } from "../internal/repositories/JournalRepository";
import { removeStopwords, eng, fra } from 'stopword';
import * as tf from '@tensorflow/tfjs';

export const predictHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const journalId = req.params.journalId;

  let content: string = req.body.content;
  // preprocessing

  // remove character
  content = content.replace(/http\S+|https?:\/\/\S+|www\.\S+/g, "");
  content = content.replace(/@\w+|#\w+/g, "");
  content = content.replace(/&[a-z]+;/g, "");
  content = content.replace(/[^A-Za-z\s]/g, "");

  // lower
  const lowerCaseContent = content.toLowerCase();

  // tokenize
  const tokens = lowerCaseContent.split(' ');

  // remove stopword
  const removedStopwordToken = removeStopwords(tokens);

  console.log(removedStopwordToken);

  let emptyString = "";

  // lemmatize (convert to verb)


  // array to string
  removedStopwordToken.forEach((val) => {
    emptyString += `${val} `
  })

  const newString = emptyString.trim();

  console.log(newString)

  // text to sequence
  const tokenizerURL = String(process.env.TOKENIZER_URL);
  const response = await fetch(tokenizerURL);
  const tokenData = await response.json();

  // console.log(tokenData) don't

  // const texts = ["feel", "like"];

  // console.log(tokenData["like"])

  const seq = removedStopwordToken.map((text: string) => tokenData[text] || 0);
  console.log(seq)

  // pad sequence

  // load model and predict
  const modelURL = String(process.env.MODEL_URL);
  const model = await tf.loadLayersModel(modelURL);

  const probabilityArray = model.predict(seq);

  console.log(probabilityArray);


  // const journalRepository = new JournalRepository();

  // const updateSuccessfully = await journalRepository.journalIsPredicted(
  //   journalId
  // );

  // if (!updateSuccessfully) {
  //   return res.status(500).json({ error: "internal server error" });
  // }

  // console.log(journalId);

  return res.status(200).json({ msg: "hello word" });
};
