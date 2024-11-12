export class Journal {
    emailAuthor: string;
    journalId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(emailAuthor: string, journalId: string, content: string) {
        this.emailAuthor = emailAuthor;
        this.journalId = journalId;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // updateContent(newContent: string) {
    //     this.content = newContent;
    //     this.updatedAt = new Date();
    // }
}
