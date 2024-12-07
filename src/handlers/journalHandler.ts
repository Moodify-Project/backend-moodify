import { Request, Response } from "express";
import { Transaction } from "../internal/repositories/Transaction";
import { CreateNewJournal } from "../internal/services/CreateNewJournal";
import { FindDailyJournal } from "../internal/services/FindDailyJournal";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { UpdateJournal } from "../internal/services/UpdateJournal";
import { MoodOnJournalServices } from "../internal/services/MoodOnJournal";
import { WeeklyMoodJournal } from "../internal/services/WeeklyMoodJournal";

// TODO: create custom error and don't use any interface as value of the variable
// interface ErrorPrisma {
//     name?: string;
// }

export class JournalHandler {
    private createNewJournal: CreateNewJournal;
    private findDailyJournal: FindDailyJournal;
    private updateJournal: UpdateJournal;
    private moodOnJournalService: MoodOnJournalServices;
    private weeklyMoodJournal: WeeklyMoodJournal;

    constructor(createNewJournal: CreateNewJournal, findDailyJournal: FindDailyJournal, updateJournal: UpdateJournal, moodOnJournalService: MoodOnJournalServices, weeklyMoodJournal: WeeklyMoodJournal) {
        this.createNewJournal = createNewJournal;
        this.findDailyJournal = findDailyJournal;
        this.updateJournal = updateJournal;
        this.moodOnJournalService = moodOnJournalService;
        this.weeklyMoodJournal = weeklyMoodJournal;
    }

    createNewToday = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
        const { journalContent } = req.body;
        const { email } = req;

        if (!journalContent) {
          return res.status(404).json({
            status: false,
            message: "Please write the content of journal",
          });
        }

        if (!email) {
            return res.status(403).json({
              status: false,
              message: "Please login",
            });
        }

        console.log('kun')

        try {
            const journalFound = await this.createNewJournal.execute(email, journalContent);

            if (journalFound) {
              return res.status(409).json({
                status: false,
                message: 'Journal already created today',
              });

            }

            return res.status(201).json({
                status: true,
                message: 'Successfully created journal',
              });

        } catch(error: any) {
            const { message }: any = error;

            console.log(error.message);
            
            if (message === 'JournalAlreadyExistToday') {
                return res.status(409).json({
                    status: false,
                    message: "Journal already created today",
                  });

            } else if (message === 'UnexpectedErrorCantCreateJournal') {
                return res.status(500).json({
                    status: false,
                    message: "Unexpected error occurs",
                  });
            } else {
              const errorMsg = JSON.parse(error.message)

              return res.status(422).json({
                status: true,
                message: "validation error when create new journal",
                errors: errorMsg.content,
              });
            }


        }
    }

    getJournalEachDay = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
        const date = String(req.query.date) || null;
        const { email } = req;

        if (!email) {
            return res.status(403).json({
                status: false,
                message: "Please login",
            });
        }

        if (!date) {
            return res.status(400).json({
                status: false,
                message: "Please choose the date",
            });
        }

        try {
          const journal = await this.findDailyJournal.execute(email, date);

          return res.status(200).json({
            status: true,
            message: "Journal fetch successfully from database",
            journal,
          });

        } catch(error) {
          return res.status(404).json({
            status: false,
            message: "Journal created that day is not found",
          });
        }
        
    }

    editJournal = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
        const { email } = req;

        if (!email) return res.status(401).json({ status: false, message: 'need login to access edit journal endpoint' });

        const journalId: string | null = req.params.id || null;

        const { journal } = req.body || null;
      
        if (!journal || !journalId) {
          return res.status(400).json({
            status: false,
            message: "Journal request body and id are not contain",
          });
        }

        const validationErrors = this.updateJournal.validateJournalRequest(email, journal, journalId);

        if (validationErrors) {
          const parseValidation = JSON.parse(validationErrors);

          return res.status(422).json({
            status: false,
            message: 'Validation error when edit existing journal',
            errors: parseValidation,
        });
        }

        try {
          await this.updateJournal.execute(journalId, journal);

          return res.status(200).json({
            status: true,
            message: `Sucessfully update journal content with id: ${journalId}`,
          });

        } catch(error: any) {

          console.log(error);
          if (error.message === 'UnexpectedErrorOccur') {
            res.status(500).json({
              status: false,
              error: 'unexpected error occur, internal server error',
            });
          } else {
            res.status(403).json({
              status: false,
              error: error.message,
            })
          }

        }
    }

    updateJournalToday = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
      const { email } = req;
      // const { today } = req.query;
      const date: string = String(req.query?.date);

      // if (!today) return res.status(403).json({ status: false, message: "only can edit journal today" });

      if (!email) return res.status(403).json({ status: false, message: "can't access this endpoint, need login" });

      const { journal } = req.body || null;
      
      if (!journal) {
        return res.status(400).json({
          status: false,
          message: "Journal request body is not exist",
        });
      }

      const validationErrors = this.updateJournal.validateJournalRequest(email, journal);

      if (validationErrors) {
        const parseValidation = JSON.parse(validationErrors);

        return res.status(422).json({
          status: false,
          message: 'Validation error when edit existing journal',
          errors: parseValidation,
      });
      }

      try {
        await this.updateJournal.executeWithDate(email, journal, date);

        return res.status(200).json({
          status: true,
          message: `Sucessfully update journal on ${date}`,
        });

      } catch(error: any) {

        console.log(error);
        if (error.message === 'UnexpectedErrorOccur') {
          res.status(500).json({
            status: false,
            error: 'unexpected error occur, internal server error',
          });
        } else {
          res.status(403).json({
            status: false,
            error: error.message,
          })
        }

      }

    }

    showMoodOnJournalEachDay = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
      const { email } = req;
      if (!email) {
        return res.status(403).json({
          success: false,
          message: "please login",
        });
      }

      await this.moodOnJournalService.findAll(email)
    }

    calculateMoodEveryWeek = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
      const { email } = req;

      if (!email) {
        res.status(401).json({
          error: true,
          message: 'User not authenticated'
        })
      }

      // this.weeklyMoodService.calculate();
    }

    fetchWeeklyMood = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
      const dateQuery: string = String(req.query?.date);

      const { email } = req;

      if (!email) return res.status(403).json({ error: true, message: "Forbiden role, can't access to endpoint" });

      const result = await this.weeklyMoodJournal.execute(email, dateQuery);

      return res.status(200).json({
        error: false,
        // journals: Object.fromEntries(result)
        moods: result,
      })
    }

    updateJournalTodayWithoutQueryParams = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
      const { email } = req;

      if (!email) return res.status(403).json({ error: true, message: "Forbiden role, can't access to endpoint" });

      const { journal } = req.body || null;
      
      if (!journal) {
        return res.status(400).json({
          status: false,
          message: "Journal request body is not exist",
        });
      }

      const validationErrors = this.updateJournal.validateJournalRequest(email, journal);

      if (validationErrors) {
        const parseValidation = JSON.parse(validationErrors);

        return res.status(422).json({
          status: false,
          message: 'Validation error when edit existing journal',
          errors: parseValidation,
      });
      }

      try {
        await this.updateJournal.executeToday(email, journal);

        return res.status(200).json({
          status: true,
          message: `Sucessfully update journal today`,
        });

      } catch(error: any) {

        console.log(error);
        if (error.message === 'UnexpectedErrorOccur') {
          res.status(500).json({
            status: false,
            error: 'unexpected error occur, internal server error',
          });
        } else {
          res.status(403).json({
            status: false,
            error: error.message,
          })
        }

      }
    }
}

export const moodOnJournalEachDay = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  const today = new Date();
  const day = String(today.getDate() - 1).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const yesterdayString = `${year}-${month}-${day}`;

  if (!req.email) {
    return res.status(403).json({
      success: false,
      message: "please login",
    });
  }

  const transaction = new Transaction();
  try {
    const moodRecapEachDay = await transaction.getMoodEachJournal(
      yesterdayString,
      req.email
    );

    return res.status(200).json({
      journalId: moodRecapEachDay.journalId,
      moods: moodRecapEachDay.moods,
    });

  } catch (error) {

    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    
  }

  return res.status(500).json({
    success: false,
    message: "internal server error",
  });
};