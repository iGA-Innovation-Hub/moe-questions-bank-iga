import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Exam, Section, SubSection, Content, Question, Exercise, ReadingQuestions } from "./InterfacesPDF";

const marginLeft = 20;
const marginRight = 190; // Adjust according to the document size

export const generateExamPDF = (jsonString: string) => {
    const jsonContent = jsonString.substring(
        jsonString.indexOf("{"),
        jsonString.lastIndexOf("}") + 1
    );
    const parsedExam = JSON.parse(jsonContent);
    console.log(parsedExam);
    const exam: Exam = parsedExam;

    const doc = new jsPDF();
    let yPosition = 30;

    addExamInfo(doc, exam, yPosition);
    yPosition += 30;

    exam.sections.forEach((section) => {
        yPosition = addSection(doc, section, yPosition);
    });

    addFooter(doc, exam.title);

    doc.save(`${exam.title.replace(/\s+/g, '_')}.pdf`);
};

function addFooter(doc: jsPDF, title: string): void {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("Times", "italic", 10);
        doc.text(`${title}`, marginLeft, 290);
        doc.text(`Page ${i} of ${pageCount}`, 195, 290, { align: "right" });
    }
}

function addExamInfo(doc: jsPDF, exam: Exam, yPosition: number): void {
    // Ministry header
    doc.setFont("Times", "bold", 12);
    doc.text("KINGDOM OF BAHRAIN", 105, yPosition, { align: "center" });
    yPosition += 8;
    doc.text("MINISTRY OF EDUCATION", 105, yPosition, { align: "center" });
    yPosition += 8;
    doc.text("Internal Exams Section", 105, yPosition, { align: "center" });
    yPosition += 8;
    doc.text("SECOND SEMESTER FINAL EXAM 2024-2025", 105, yPosition, { align: "center" });

    // Add course info
    yPosition += 12;
    doc.setFont("Times", "normal", 12);
    doc.text(`COURSE NAME: English Language`, marginLeft, yPosition);
    yPosition += 8;
    doc.text(`COURSE CODE: ENG102`, marginLeft, yPosition);
    doc.text(`Total Marks: ${exam.total_marks}`, 160, yPosition); 
    yPosition += 8;
    doc.text(`Track: Unified Tracks`, marginLeft, yPosition);
    doc.text(`Time: 2 Hours`, 160, yPosition);

    // Divider line
    yPosition += 8;
    const line = "=".repeat(60);
    doc.setFont("Times", "normal", 10);
    doc.text(line, marginLeft, yPosition);
}



function addSection(doc: jsPDF, section: Section, yPosition: number): number {
    if (yPosition > 195 || section.title.includes('Reading') || section.title.includes('Writing')) {
        doc.addPage();
        yPosition = 30;
    }

    if(section.title.includes('Listening')) {
        yPosition += 50; 
    }

    doc.setFont("Times", "bold", 14);
    doc.text(`Part ${section.part}: ${section.title} (${section.total_marks} marks)`, marginLeft, yPosition);
    yPosition += 12;

    if (section.subsections && section.subsections.length > 0) {
        section.subsections.forEach((subsection) => {
            yPosition = addSubSection(doc, subsection, yPosition);
        });
    }

    if (section.content) {
        yPosition = addContent(doc, section, yPosition);
    }

    yPosition += 20; // Add extra spacing between sections

    return yPosition;
}

function addSubSection(doc: jsPDF, subsection: SubSection, yPosition: number): number {
    if (yPosition > 195) {
        doc.addPage();
        yPosition = 30;
    }

    doc.setFont("Times", "italic", 12);
    doc.text(`Subsection ${subsection.subsection}: ${subsection.title} (${subsection.marks} marks)`, marginLeft, yPosition);
    yPosition += 12;

    if (subsection.content) {
        yPosition = addContent(doc, subsection, yPosition);
    }

    yPosition += 10; // Add extra spacing between subsections

    return yPosition;
}

function addContent(doc: jsPDF, section: SubSection | Section, yPosition: number): number {
    const content = section.content as Content;

    if (content.passage && !section.title.includes("Listening")) {
        yPosition = addTextBlock(doc, content.passage, yPosition + 10, "Please read the following passage and answer the following questions:") + 20;
    }

    if (Array.isArray(content.questions) && !content.questions.every((q: any) => q.word_limit)) {
        yPosition = addGeneralQuestions(doc, content.questions, yPosition);
    } else if (content.questions) {
        const questions = content.questions as ReadingQuestions;

        if (questions["multiple-choice"]) {
            yPosition = addGeneralQuestions(doc, questions["multiple-choice"], yPosition + 20, "A. Multiple Choice:") + 20;
        }
        if (questions["true-false"]) {
            yPosition = addTrueFalseQuestions(doc, questions["true-false"], yPosition) + 10;
        }
        if (questions["vocabulary-matching"]) {
            yPosition = addVocabularyMatching(doc, questions["vocabulary-matching"], yPosition) + 20;
        }
    }

    if (content.exercises) {
        yPosition = addExercises(doc, content.exercises, yPosition);
    }

    if (Array.isArray(content.questions) && content.questions.every(q => q.word_limit)) {
        yPosition = addWritingQuestions(doc, content.questions, yPosition);
    }

    return yPosition;
}

function addTextBlock(doc: jsPDF, text: string, yPosition: number, heading: string): number {

    doc.setFont("Times", "bold", 12);
    doc.text(heading, marginLeft, yPosition);
    yPosition += 12;

    doc.setFont("Times", "normal", 11);
    const lines = doc.splitTextToSize(text, marginRight - marginLeft);
    doc.text(lines, marginLeft, yPosition);
    return yPosition + lines.length * 6 + 30;
}

function addGeneralQuestions(doc: jsPDF, questions: Question[], yPosition: number, heading?: string): number {
    if (heading) {
        if (yPosition > 195) {
            doc.addPage();
            yPosition = 30;
            doc.setFont("Times", "bold", 12);
            doc.text(heading, marginLeft, yPosition);
            yPosition += 12;
        }
    }

    questions.forEach((q, index) => {
        if (yPosition > 195) {
            doc.addPage();
            yPosition = 30;
        }

        doc.setFont("Times", "normal", 11);
        const questionText = `${index + 1}. ${q.question || q.sentence}`;
        const lines = doc.splitTextToSize(questionText, marginRight - marginLeft);
        doc.text(lines, marginLeft, yPosition);
        yPosition += lines.length * 6 + 5;

        q.options?.forEach((option, i) => {
            const optionText = `   ${String.fromCharCode(65 + i)}. ${option}`;
            const optionLines = doc.splitTextToSize(optionText, marginRight - marginLeft);
            doc.text(optionLines, marginLeft, yPosition);
            yPosition += optionLines.length * 6 + 5;
        });
    });

    return yPosition;
}

function addTrueFalseQuestions(doc: jsPDF, questions: Question[], yPosition: number): number {
    doc.setFont("Times", "bold", 12);
    doc.text("B. True/False Questions:", marginLeft, yPosition);
    yPosition += 12;

    questions.forEach((q, index) => {
        if (yPosition > 210) {
            doc.addPage();
            yPosition = 30;
        }

        doc.setFont("Times", "normal", 11);
        doc.text(`${index + 1}. ${q.statement} (   )`, marginLeft, yPosition);
        yPosition += 13;
    });

    return yPosition;
}

function shuffleArray(A: Question[]): void {
    for (let i = A.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [A[i], A[j]] = [A[j], A[i]]; // Swap elements
    }
}

function addVocabularyMatching(doc: jsPDF, vocabList: Question[], yPosition: number): number {
    doc.setFont("Times", "bold", 12);
    doc.text("C. Vocabulary Matching:", marginLeft, yPosition);
    yPosition += 12;

    shuffleArray(vocabList);

    const vocabWords = vocabList.map((vocab, index) => `${index + 1}. ${(vocab as any).word}`).join("    ");
    const vocabLines = doc.splitTextToSize(vocabWords, marginRight - marginLeft);
    doc.setFont("Times", "bold", 11);
    doc.text(vocabLines, marginLeft, yPosition);
    yPosition += vocabLines.length * 6 + 10;

    vocabList.forEach((vocab, index) => {
        if (yPosition > 210) {
            doc.addPage();
            yPosition = 30;
        }
        doc.setFont("Times", "normal", 11);
        const definitionText = `${index + 1}. __________________ ${(vocab as any).definition }.`;
        const definitionLines = doc.splitTextToSize(definitionText, marginRight - marginLeft);
        doc.text(definitionLines, marginLeft, yPosition);
        yPosition += definitionLines.length * 6 + 10;
    });

    return yPosition;
}

function addExercises(doc: jsPDF, exercises: Exercise[], yPosition: number): number {
    doc.setFont("Times", "bold", 12);
    doc.text("D. Exercises:", marginLeft, yPosition);
    yPosition += 12;

    exercises.forEach((exercise, index) => {
        if (yPosition > 195) {
            doc.addPage();
            yPosition = 30;
        }

        doc.setFont("Times", "normal", 11);
        const questionText = `${index + 1}. ${exercise.question}`;
        const questionLines = doc.splitTextToSize(questionText, marginRight - marginLeft);
        doc.text(questionLines, marginLeft, yPosition);
        yPosition += 15;
    });

    return yPosition;
}

function addWritingQuestions(doc: jsPDF, writingQuestions: Question[], yPosition: number): number {
    writingQuestions.forEach((q, index) => {
        if (yPosition > 195) {
            doc.addPage();
            yPosition = 30;
        }
        doc.setFont("Times", "bold", 12);
        doc.text(`Writing Question ${index + 1}:`, marginLeft, yPosition);
        yPosition += 12;
        
        doc.setFont("Times", "normal", 11);
        const questionText = `${q.prompt as string} \n\nWord Limit: (${q.word_limit})`;
        const questionLines = doc.splitTextToSize(questionText, marginRight - marginLeft);
        doc.text(questionLines, marginLeft, yPosition);
        yPosition += questionLines.length * 6 + 10;

        // Add space for the answer
        const answerLines = Array(27).fill("").map(() => "_".repeat(60)).join("\n");
        const answerYPosition = doc.splitTextToSize(answerLines, marginRight - marginLeft);
        doc.text(answerYPosition, marginLeft, yPosition);
        yPosition += answerYPosition.length * 6 + 20;
    });

    return yPosition;
}
