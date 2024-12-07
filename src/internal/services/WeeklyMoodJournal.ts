import { getTodayDateString } from "../../utils/todayString";
import { JournalRepository } from "../repositories/JournalRepository";
import { MoodOnJournalRepository } from "../repositories/MoodOnJournalRepository";
import { MoodRepository } from "../repositories/MoodRepository";

export class WeeklyMoodJournal {
    private journalRepository: JournalRepository;
    private moodOnJournalRepository: MoodOnJournalRepository;
    private moodRepository: MoodRepository;


    constructor(journalRepository: JournalRepository, moodOnJournalRepository: MoodOnJournalRepository, moodRepository: MoodRepository) {
        this.journalRepository = journalRepository;
        this.moodOnJournalRepository = moodOnJournalRepository;
        this.moodRepository = moodRepository;
    }

    execute = async(email: string, dateQuery: string) => {
        
      const daysInTheWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]

      const [year, month, day] = dateQuery.split('-').map(Number);

      const date = new Date();

      date.setFullYear(Number(year), Number(month) - 1, Number(day));

      const todayDayIndex = date.getDay();

      console.log('today: ', todayDayIndex);

      const startDate = todayDayIndex !== 0 
      ? date.getDate() + 1 - todayDayIndex 
      : date.getDate() - 6;
  
      const endDate = todayDayIndex !== 0 
      ? date.getDate() + 7 - todayDayIndex 
      : date.getDate();
          
      const yearParam = date.getFullYear();
      const monthParam = date.getMonth();

      const startDateOfWeek = getTodayDateString(yearParam, monthParam, startDate);
      const endDateOfWeek = getTodayDateString(yearParam, monthParam, endDate);

      console.log(startDateOfWeek);
      console.log(endDateOfWeek);


        const journals = await this.journalRepository.filterJournalIdByWeekly(email, startDateOfWeek, endDateOfWeek);


        console.log(journals);

        const arrayOfJournal = journals.map((journal: any) => journal.journalId)
        const moodsJournals = await this.moodOnJournalRepository.getJournalEveryWeekly(arrayOfJournal);

        console.log(moodsJournals);

        const data: Map<string, object[]> = new Map();
        const moodCalculate: number[][] = Array(5).fill(null).map(() => [0, 0]);
        const rateOfPercentageEach: number[] = [];
        let max = 0;

        moodsJournals?.map((moodJournal) => {
            if (!data.has(moodJournal.journalId)) {
                data.set(moodJournal.journalId, [])
            }
            
            moodCalculate[moodJournal.moodId - 1][0] += moodJournal.percentage;
            moodCalculate[moodJournal.moodId - 1][1] += 1;

            const journalArray = data.get(moodJournal.journalId) || [];
            journalArray.push(moodJournal);
            data.set(moodJournal.journalId, journalArray);

            console.log(journalArray)
        
            if (journalArray.length > max) {
                max = journalArray.length;
            }
        })

        for (let i = 0; i < moodCalculate.length; i++) {
          moodCalculate[i][1] = max;
        }

        moodCalculate.map((val, idx) => {
            // const percents = Number(val[0] / val[1]) || 0;
            const percents = Number(val[0] / journals.length) || 0;

            rateOfPercentageEach.push(Math.floor(percents));
        })

        console.log("moods-percentage ", rateOfPercentageEach);

        const moods: string[] = [];

        const moodKey = await this.moodRepository.getAllMoodKey();
        moodKey.forEach((val) => {
          moods.push(val.moodName)
        })

        const result = rateOfPercentageEach.reduce((acc: { [key: string] : number }, val, idx) => {
          acc[moods[idx]] = val;
          return acc;
        }, {});

        return result;
    }
}