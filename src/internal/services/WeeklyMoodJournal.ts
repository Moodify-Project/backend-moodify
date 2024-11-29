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

      const startDate = date.getDate() - 7;
      const endDate = date.getDate() - 1;
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

        moodsJournals.map((moodJournal) => {
            if (!data.has(moodJournal.journalId)) {
                data.set(moodJournal.journalId, [])
            }
            
            moodCalculate[moodJournal.moodId][0] += moodJournal.percentage;
            moodCalculate[moodJournal.moodId][1] += 1;

            data.get(moodJournal.journalId)?.push(moodJournal);
        })

        console.log(moodCalculate);

        moodCalculate.map((val, idx) => {
            const percents = Number(val[0] / val[1]) || 0;

            rateOfPercentageEach.push(percents);
        })

        console.log(rateOfPercentageEach);

        return data;
    }
}