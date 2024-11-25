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
              // console.log(date.getDay());
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

    //   JournalRepository.


      // const dayConverted: string = daysInTheWeek[todayDateDay];

      // console.log(dayConverted);

        const journals = await this.journalRepository.filterJournalIdByWeekly(email, startDateOfWeek, endDateOfWeek);


        console.log(journals);

        const arrayOfJournal = journals.map((journal: any) => journal.journalId)
        const moodsJournals = await this.moodOnJournalRepository.getJournalEveryWeekly(arrayOfJournal);

        console.log(moodsJournals);

        const data: Map<string, object[]> = new Map();

        moodsJournals.map((moodJournal) => {
            if (!data.has(moodJournal.journalId)) {
                data.set(moodJournal.journalId, [])
            }

            data.get(moodJournal.journalId)?.push(moodJournal);
        })

        console.log(data);

        return data;
    }
}