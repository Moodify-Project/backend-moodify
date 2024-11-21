import { prisma } from "../configs/prisma";

export class Transaction {
  getMoodEachJournal = (equalDate: string, email: string) => {
    return prisma.$transaction(async (tx) => {
      const journal = await tx.journal.findFirst({
        where: {
          createdAt: {
            gte: new Date(`${equalDate} 00:00:00`),
            lte: new Date(`${equalDate} 23:59:59`),
          },
          emailAuthor: email,
        },
        select: {
          journalId: true,
        },
      });

      const journalId = journal?.journalId;

      if (!journalId) {
        throw new Error(
          `Journal not found for email: ${email} on date: ${equalDate}`
        );
      }

      console.log(journalId)

      const moods = await tx.moodOnJournal.findMany({
        where: {
          journalId: String(journalId),
        },
        select: {
          moodId: true,
          percentage: true,
        }
      });

      // console.log(moods)

      const moodRecapEachDay = {
        journalId,
        moods
      }

      return moodRecapEachDay;
    });
  };

  findOneThrowErrOrCreateBookmark = (email: string, articleId: string) => {
    return prisma.$transaction(async (tx) => {
      const bookmarkFound = await tx.userBookmarkArticle.findFirst({
        where: {
          emailUser: email,
          articleId: articleId,
        },
      });

      console.log("yes:", bookmarkFound);

      if (bookmarkFound) {
        throw new Error("User already bookmark the article");
      }

      await tx.userBookmarkArticle.create({
        data: {
          emailUser: email,
          articleId: articleId,
        },
      });
    });
  };
}
