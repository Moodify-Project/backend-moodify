import { Request, Response } from "express";
import { Journal } from "../entity/journalEntity";
import { v4 as uuidv4, validate } from "uuid";
import { JournalRepository } from "../internal/repository/JournalRepository";
import { journalSchema } from "../schemas/journalSchemas";
import validateData from "../utils/validateData";

interface AuthMiddlewareRequest extends Request {
    // email or username
    email?: string;
}

// interface ErrorPrisma {
//     name?: string;
// }

const createNewJournal = async (req: AuthMiddlewareRequest, res: Response): Promise<any> => {
    const {
        journalContent,
    } = req.body;

    if (!journalContent) {
        return res.status(404).json({
            status: false,
            message: 'Please write the content of journal',
        }); 
    }

    if (!req.email) {
        return res.status(403).json({
            status: false,
            message: 'Please login',
        }); 
    }

    const journalRepository = new JournalRepository();

    //
    const equalDate: string = '2024-11-04';
    
    try {
        const existingJournal = await journalRepository.findOneJournal(req.email, equalDate);
        console.log(existingJournal);

        return res.status(409).json({
            status: false,
            message: 'Journal already created in the current day',
        });
    } catch (error: any) {
        if (error.name === "NotFoundError") {
            //
        } else if (error.name === "PrismaClientValidationError") {
            return res.status(500).json({
                status: false,
                error: error,
                message: 'Validation error in find repository',
            });
        } else {
            return res.status(500).json({
                status: false,
                error: error,
                message: 'An unexpected error occurred',
            });
        }
    }

    const randomUUID = uuidv4();

    const journal = new Journal(req.email, randomUUID, journalContent);

    const journalData = validateData(journalSchema, journal);

    if (journalData instanceof Map) {
        const errReponseObj = Object.fromEntries(journalData);
        return res.status(404).json(errReponseObj);
    }

    const journalCreated = await journalRepository.createNew(journal);

    if (!journalCreated) {
        return res.status(500).json({
            status: false,
            message: 'There is something with server',
        });
    }

    return res.status(200).json({
        status: true,
        message: journalCreated
    });
}

export const getJounalEachDay = async (req: AuthMiddlewareRequest, res: Response) => {
    const date = String(req.query.date) || null;

    const journalRepository =  new JournalRepository();

    if (!req.email) {
        return res.status(403).json({
            status: false,
            message: 'Please login',
        }); 
    }

    if (!date) {
        return res.status(404).json({
            status: false,
            message: 'Please choose the date',
        }); 
    }

    const journal = await journalRepository.findOneJournal(req.email, date)

    const { journalId, content, createdAt, updatedAt } = journal;
    return res.status(200).json({
        status: true,
        message: 'Journal fetch successfully from database',
        data: {
            journalId,
            content,
            createdAt,
            updatedAt,
        }
    })
}

export const editJournal = async (req: AuthMiddlewareRequest, res: Response): Promise<any> => {
    const journalId: string | null = req.params.journalId || null;

    const { journal } = req.body || null;

    if (journal === null || journalId === null) {
        return res.status(400).json({
            status: false,
            message: 'Journal request body and id are not contain',
        });
    }

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const todayDateString = `${year}-${month}-${day}`;

    
 
    const journalRepository = new JournalRepository();

    const dateOfJournal = await journalRepository.findJournalById(journalId).then(
        (val: Journal) => {
            const journalDateFromDB: string = val.createdAt.toISOString();
            const dateString = journalDateFromDB.split("T")[0];
            if (dateString === todayDateString) {
                return res.status(400).json({
                    success: true,
                    message: "The journal can't be edited after 24 hours have passed since its creation",
                })
            } 

            return dateString;
        }
    ).catch((error: any) => {
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the journal entry",
            error: error.message || error,
        });
    });


    const successUpdatedJournal = await journalRepository.updateJournalById(journalId, journal);

    if (successUpdatedJournal) {
        return res.status(200).json({
            status: true,
            message: 'Journal updated successfully',
        })
    }

    return res.status(500).json({
        status: true,
        message: 'Jounal didnt updated, internal server error',
    })
}

export default createNewJournal;