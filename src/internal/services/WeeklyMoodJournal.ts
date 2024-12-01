import { getTodayDateString } from "../../utils/todayString";
import { JournalRepository } from "../repositories/JournalRepository";
import { MoodOnJournalRepository } from "../repositories/MoodOnJournalRepository";

export class WeeklyMoodJournal {
    private journalRepository: JournalRepository;
    private moodOnJournalRepository: MoodOnJournalRepository;


    constructor(journalRepository: JournalRepository, moodOnJournalRepository: MoodOnJournalRepository) {
        this.journalRepository = journalRepository;
        this.moodOnJournalRepository = moodOnJournalRepository;
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

      if (todayDayIndex !== 0) {
        // logic not sunday
        //return
      }

      console.log('today: ', todayDayIndex);

      // const indexDay = date.getDay();

      // const startDate = date.getDate() - 7;
      // const endDate = date.getDate() - 1;
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

        moodsJournals.map((moodJournal) => {
            if (!data.has(moodJournal.journalId)) {
                data.set(moodJournal.journalId, [])
            }
            
            moodCalculate[moodJournal.moodId][0] += moodJournal.percentage;
            moodCalculate[moodJournal.moodId][1] += 1;

            const journalArray = data.get(moodJournal.journalId) || [];
            journalArray.push(moodJournal);
            data.set(moodJournal.journalId, journalArray);

            console.log(journalArray)
        
            if (journalArray.length > max) {
                max = journalArray.length;
            }
        })

        // console.log(moodCalculate);
        // console.log(moodCalculate.length);

        for (let i = 0; i < moodCalculate.length; i++) {
          moodCalculate[i][1] = max;
        }

        moodCalculate.map((val, idx) => {
            const percents = Number(val[0] / val[1]) || 0;

            rateOfPercentageEach.push(percents);
        })

        console.log("moods-percentage ", rateOfPercentageEach);

        const moods = ["neutral", "empty", "angry", "enthusiashm", "sad"]

        // const result = rateOfPercentageEach.map((val, idx) => ({
        //   [moods[idx]]: val,
        // }))

        const result = rateOfPercentageEach.reduce((acc: { [key: string] : number }, val, idx) => {
          acc[moods[idx]] = val;
          return acc;
        }, {});

        // return data;
        return result;
    }
}