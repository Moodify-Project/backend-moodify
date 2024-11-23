import axios from "axios";
import { Request, Response } from "express";
import myCache from "../internal/configs/myCache";

interface Country {
  name: {
    common: string;
  };
}
const nation = async (req: Request, res: Response): Promise<any> => {

  const index = String(req.query.index) || 0;

  if (myCache.get(`allNations-${index}`)) {
    const allNations: string[] = myCache.get(`allNations-${index}`) || [];

    const newResponse = {
      success: true,
      // index: indexToNum,
      totalNation: allNations.length,
      result: allNations,
    };
    return res.status(200).json(newResponse);
  }

  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");

    const countries: string[] = [];

    response.data?.map((val: Country) => {
      countries.push(val.name.common);
    });

    myCache.set("allNations", countries, 10000);

    const newResponse = {
      success: true,
      // index: indexToNum,
      totalNation: countries.length,
      result: countries,
    };

    res.status(200).json(newResponse);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

export default nation;
