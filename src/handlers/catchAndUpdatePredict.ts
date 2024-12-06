import { Response } from "express";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { PredictService } from "../internal/services/PredictService";
import { FindDailyJournal } from "../internal/services/FindDailyJournal";

export class PredictHandler {
    private predictService: PredictService;
    private findDailyJournal: FindDailyJournal;

    constructor(predictService: PredictService, findDailyJournal: FindDailyJournal) {
        this.predictService = predictService;
        this.findDailyJournal = findDailyJournal;
    }

    catchAndUpdatePredict = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
        const { email, params } = req;
        const { id } = params;
        // const { content } = req.body;

        const journal = await this.findDailyJournal.getJournalById(id);
        console.log(id);

        if (!journal) return res.status(404).json({ error: true, message: "journal not found please provide the correct journal id" })
        // if (String(journal?.content) !== String(content)) return res.status(400).json({ error: true, message: "content not same" });
        // return res.status(200).json({id});

        const content = String(journal?.content);

        console.log(content)

        try {
            await this.predictService.predictedJournal(id, content)

            await this.predictService.updateIsPredicted(id);
        } catch(error: any) {
            return res.status(200).json({
                error: true,
                message: error.message
            })
        }
    
        return res.status(200).json({id})
    
    }
}

