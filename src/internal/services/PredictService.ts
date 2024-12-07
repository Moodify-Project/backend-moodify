import axios from "axios";
import { Journal } from "../../domain/entities/Journal";
import { JournalRepository } from "../repositories/JournalRepository";
import { MoodRepository } from "../repositories/MoodRepository";
import { MoodOnJournalRepository } from "../repositories/MoodOnJournalRepository";

export class PredictService {
    private journalRepository: JournalRepository;
    private moodRepository: MoodRepository;
    private moodOnJournalRepository: MoodOnJournalRepository;

    constructor(journalRepository: JournalRepository, moodRepository: MoodRepository, moodOnJournalRepository: MoodOnJournalRepository) {
        this.journalRepository = journalRepository;
        this.moodRepository = moodRepository;
        this.moodOnJournalRepository = moodOnJournalRepository;
    }

    updateIsPredicted = async (id: string) => {
        await this.journalRepository.updateJournalIsPredicted(id);

        console.log("predicted");
    }

    predictedJournal = async (id: string, content: string) => {
        const predictURL = String(process.env.PREDICT_URL);
        
        try {
           const response = await axios.post(predictURL, { sentence: content });
        //    console.log(response.data);

           const { predictions } = response.data;
            //const { anger, enthusiasm, happiness, sadness, worry } = predictions;
           const moodData = [];
           let predTotal = 0;
           const moodArray = new Map<string, number>();

           const moodKey = await this.moodRepository.getAllMoodKey();
           moodKey.forEach((val) => {
            moodArray.set(val.moodName, val.id);
           })

           console.log(moodArray);

           for (const [key, value] of Object.entries(predictions)) {
                const parsedValue = Number(parseFloat(String(value)).toFixed(2));
                predTotal += parsedValue;
                let newData = {
                    moodId: Number(moodArray.get(key)),
                    journalId: id,
                    percentage: (predTotal >= 0.97 && predTotal < 1) ? Math.round(Number((parsedValue + 1 - predTotal).toFixed(2)) * 100) : Math.round(parsedValue * 100)
                }
                moodData.push(newData);
           }

           console.log(moodData);

           await this.moodOnJournalRepository.postNewMoodOnPredictedJournal(moodData);

        } catch (error: any) {
            console.log(error.message);
            throw new Error('something wrong with url or request body');
        }
        
    }
}