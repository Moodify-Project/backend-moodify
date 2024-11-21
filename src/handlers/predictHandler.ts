import { Request, Response } from "express";
import { JournalRepository } from "../internal/repositories/JournalRepository";

export const predictHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const journalId = req.params.journalId;

  // put the model in here

  const journalRepository = new JournalRepository();

  const updateSuccessfully = await journalRepository.journalIsPredicted(
    journalId
  );

  if (!updateSuccessfully) {
    return res.status(500).json({ error: "internal server error" });
  }

  console.log(journalId);

  return res.status(200).json({ msg: "hello word" });
};
