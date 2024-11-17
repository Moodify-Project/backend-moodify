import { prisma } from "../../configs/prisma"

export class Transaction {
    getMoodEachJournal = (equalDate: string, email: string) => {
        return prisma.$transaction(async (tx) => {
            const journalId = await tx.journal.findFirst({
                where: {
                    createdAt: {
                        gte: new Date(`${equalDate} 00:00:00`),
                        lte: new Date(`${equalDate} 23:59:59`),
                    },
                    emailAuthor: email,
                },
                select: {
                    journalId: true,
                }
            })

            if (!journalId) {
                throw new Error(`Journal not found for email: ${email} on date: ${equalDate}`);
            }

            const moods = await tx.moodOnJournal.findMany({
                where: {
                    journalId: String(journalId),
                }
            })

            return moods;
        })
    }
}