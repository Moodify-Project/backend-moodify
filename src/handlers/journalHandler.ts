import { Request, Response } from "express";
import { Journal } from "../entity/journalEntity";
import { v4 as uuidv4 } from "uuid";
import { JournalRepository } from "../internal/repository/JournalRepository";

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

    const equalDate: string = '2024-11-11'
    
    try {
        await journalRepository.findOneJournal(req.email, equalDate);
    } catch (error: any) {
        // fix bug
        if (error.name === "NotFoundError") {
            return res.status(404).json({
                status: false,
                error: error,
                message: 'Journal already created in current day',
            })
        }
        
        if (error.name === "PrismaClientValidationError") {
            return res.status(500).json({
                status: false,
                error: error,
                message: 'Validation error in find repository',
            })
        }

    }

    const randomUUID = uuidv4();

    const journal = new Journal(req.email, randomUUID, journalContent);

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

export default createNewJournal;