import { Journal } from "../../domain/entities/Journal";
import { JournalRepositoryInterface } from "../../domain/interfaces/JournalRepositoryInterface";
import { BaseRepository } from "./BaseRepository";

export class JournalRepository
  extends BaseRepository
  implements JournalRepositoryInterface
{
  async findOneJournal(email: string, equalDate: string, tx?: any): Promise<Journal> {
    console.log(equalDate);
    return await (tx || JournalRepository._prisma).journal.findFirstOrThrow({
      where: {
        createdAt: {
          gte: new Date(`${equalDate} 00:00:00`),
          lte: new Date(`${equalDate} 23:59:59`),
        },
        emailAuthor: email,
      },
    });
  }

  async createNew(journal: Journal): Promise<Journal> {
    return await JournalRepository._prisma.journal.create({
      data: {
        emailAuthor: journal.emailAuthor,
        journalId: journal.journalId,
        content: journal.content,
        createdAt: journal.createdAt,
        updatedAt: journal.updatedAt,
        isPredicted: journal.isPredicted,
      },
    });
  }

  async findJournalById(journalId: string): Promise<Journal | null> {
    return await JournalRepository._prisma.journal.findUnique({
      where: {
        journalId: journalId,
      },
    });
  }

  updateJournalById = async (
    journalId: string,
    journal: Journal
  ): Promise<Journal> => {
    return await JournalRepository._prisma.journal.update({
      where: {
        journalId: journalId,
      },
      data: {
        content: journal?.content,
        updatedAt: journal?.updatedAt,
      },
    });
  };

  async journalIsPredicted(journalId: string): Promise<Journal> {
    return await JournalRepository._prisma.journal.update({
      where: {
        journalId: journalId,
      },
      data: {
        isPredicted: true,
      },
    });
  }

  unwrittenJournalToday = async(todayDateString: string): Promise<any> => {
    const startOfDay = `${todayDateString} 00:00:00`;
    const endOfDay = `${todayDateString} 23:00:00`;

    return await JournalRepository._prisma.$queryRaw`SELECT DISTINCT user.email, 
      COUNT(journal.journalId) AS journal_count FROM user LEFT JOIN journal ON user.email = journal.emailAuthor 
      AND (journal.createdAt IS NULL OR journal.createdAt BETWEEN ${startOfDay} AND ${endOfDay}) 
      GROUP BY user.email;`
    }

    filterJournalIdByWeekly = async(email: string, startDate: string, endDate: string): Promise<any> => {
      return await JournalRepository._prisma.journal.findMany({
        where: {
          emailAuthor: email,
          createdAt: {
            gte: new Date(`${startDate} 00:00:00`),
            lte: new Date(`${endDate} 23:59:59`)
          }
        },
        select: {
          journalId: true
        }
      })
    }

    updateJournalByDate = async(email: string, journal: Journal, todayDateString: string) => {
      return await JournalRepository._prisma.journal.updateMany({
        where: {
          emailAuthor: email,
          createdAt: {
            gte: new Date(`${todayDateString} 00:00:00`),
            lte: new Date(`${todayDateString} 23:59:59`)
          }
        },
        data: {
          content: journal.content,
          updatedAt: journal.updatedAt
        }
      })
    }

    updateJournalIsPredicted = async(id: string) => {
      return await JournalRepository._prisma.journal.update({
        where: {
          journalId: id
        },
        data: {
          isPredicted: true,
          // isPredicted: false,
        }
      })
    }
}
