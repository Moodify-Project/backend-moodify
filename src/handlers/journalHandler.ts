import { Request, Response } from "express";
import { Journal } from "../domain/entities/Journal";
import { v4 as uuidv4 } from "uuid";
import { JournalRepository } from "../internal/repositories/JournalRepository";
import { journalSchema } from "../schemas/journalSchemas";
import validateData from "../utils/validateData";
import { Transaction } from "../internal/repositories/Transaction";
import { CreateNewJournal } from "../internal/services/CreateNewJournal";
import { FindDailyJournal } from "../internal/services/FindDailyJournal";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { UpdateJournal } from "../internal/services/UpdateJournal";
import { MoodOnJournalServices } from "../internal/services/MoodOnJournal";

// TODO: create directory to store all custom interface
interface AuthMiddlewareRequest extends Request {
  // email or username
  email?: string;
}

// TODO: create custom error and don't use any interface as value of the variable
// interface ErrorPrisma {
//     name?: string;
// }

export class JournalHandler {
    private createNewJournal: CreateNewJournal;
    private findDailyJournal: FindDailyJournal;
    private updateJournal: UpdateJournal;
    private moodOnJournalService: MoodOnJournalServices;
    // private weeklyMoodServices: WeeklyMoodServices;

    constructor(createNewJournal: CreateNewJournal, findDailyJournal: FindDailyJournal, updateJournal: UpdateJournal, moodOnJournalService: MoodOnJournalServices) {
        this.createNewJournal = createNewJournal;
        this.findDailyJournal = findDailyJournal;
        this.updateJournal = updateJournal;
        this.moodOnJournalService = moodOnJournalService;
        // this.weeklyMoodService = weeklyMoodService;
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

            return res.status(200).json({
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

              return res.status(400).json({
                status: true,
                message: errorMsg.content,
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
        const journalId: string | null = req.params.id || null;

        const { journal } = req.body || null;
      
        if (!journal || !journalId) {
          return res.status(400).json({
            status: false,
            message: "Journal request body and id are not contain",
          });
        }

        try {
          await this.updateJournal.execute(journalId, journal);

          return res.status(400).json({
            status: false,
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


}

export const moodOnJournalEachDay = async (
  req: AuthMiddlewareRequest,
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

// export const createNewJournal = async (
//     req: AuthMiddlewareRequest,
//     res: Response
//   ): Promise<any> => {
//     const { journalContent } = req.body;
  
//     if (!journalContent) {
//       return res.status(404).json({
//         status: false,
//         message: "Please write the content of journal",
//       });
//     }
  
//     if (!req.email) {
//       return res.status(403).json({
//         status: false,
//         message: "Please login",
//       });
//     }
  
//     const journalRepository = new JournalRepository();
  
//     // TODO: change equal date variable with today date
//     const equalDate: string = "2024-11-04";
  
//     try {
//       const existingJournal = await journalRepository.findOneJournal(
//         req.email,
//         equalDate
//       );
//       console.log(existingJournal);
  
//       return res.status(409).json({
//         status: false,
//         message: "Journal already created in the current day",
//       });
//     } catch (error: any) {
//       if (error.name === "NotFoundError") {
//         //
//       } else if (error.name === "PrismaClientValidationError") {
//         return res.status(500).json({
//           status: false,
//           error: error,
//           message: "Validation error in find repository",
//         });
//       } else {
//         return res.status(500).json({
//           status: false,
//           error: error,
//           message: "An unexpected error occurred",
//         });
//       }
//     }
  
//     const randomUUID = uuidv4();
  
//     const journal = new Journal(req.email, randomUUID, journalContent, false);
  
//     const journalData = validateData(journalSchema, journal);
  
//     if (journalData instanceof Map) {
//       const errReponseObj = Object.fromEntries(journalData);
//       return res.status(404).json(errReponseObj);
//     }
  
//     const journalCreated = await journalRepository.createNew(journal);
  
//     if (!journalCreated) {
//       return res.status(500).json({
//         status: false,
//         message: "There is something with server",
//       });
//     }
  
//     return res.status(200).json({
//       status: true,
//       message: journalCreated,
//     });
//   };
  
//   export const getJounalEachDay = async (
//     req: AuthMiddlewareRequest,
//     res: Response
//   ) => {
//     const date = String(req.query.date) || null;
  
//     const journalRepository = new JournalRepository();
  
//     if (!req.email) {
//       return res.status(403).json({
//         status: false,
//         message: "Please login",
//       });
//     }
  
//     if (!date) {
//       return res.status(400).json({
//         status: false,
//         message: "Please choose the date",
//       });
//     }
  
//     const journal = await journalRepository.findOneJournal(req.email, date);
  
//     const { journalId, content, createdAt, updatedAt, isPredicted } = journal;
//     return res.status(200).json({
//       status: true,
//       message: "Journal fetch successfully from database",
//       data: {
//         journalId,
//         content,
//         createdAt,
//         updatedAt,
//         isPredicted,
//       },
//     });
//   };


//   export const editJournal = async (
//     req: AuthMiddlewareRequest,
//     res: Response
//   ): Promise<any> => {
//     const journalId: string | null = req.params.journalId || null;
  
//     const { journal } = req.body || null;
  
//     if (journal === null || journalId === null) {
//       return res.status(400).json({
//         status: false,
//         message: "Journal request body and id are not contain",
//       });
//     }
  
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, "0");
//     const month = String(today.getMonth() + 1).padStart(2, "0");
//     const year = today.getFullYear();
  
//     const todayDateString = `${year}-${month}-${day}`;
  
//     const journalRepository = new JournalRepository();
  
//     const dateOfJournal = await journalRepository
//       .findJournalById(journalId)
//       .then((val: Journal | null) => {
//         if (!journal) return res.status(200).json();
//         const journalDateFromDB: string = val?.createdAt.toISOString();
//         const dateString = journalDateFromDB.split("T")[0];
//         if (dateString === todayDateString) {
//           return res.status(400).json({
//             success: false,
//             message:
//               "The journal can't be edited after 24 hours have passed since its creation",
//           });
//         }
  
//         return dateString;
//       })
//       .catch((error: any) => {
//         return res.status(500).json({
//           success: false,
//           message: "An error occurred while retrieving the journal entry",
//           error: error.message || error,
//         });
//       });
  
//     const successUpdatedJournal = await journalRepository.updateJournalById(
//       journalId,
//       journal
//     );
  
//     if (successUpdatedJournal) {
//       return res.status(200).json({
//         status: true,
//         message: "Journal updated successfully",
//       });
//     }
  
//     return res.status(500).json({
//       status: true,
//       message: "Jounal didnt updated, internal server error",
//     });
//   };