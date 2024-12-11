import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Exam, Section, SubSection, Content, Question, Exercise, ReadingQuestions } from "./InterfacesPDF";

export const generateExamPDF = (jsonString: string) => {
    const jsonContent = jsonString.substring(
        jsonString.indexOf("{"),
        jsonString.lastIndexOf("}") + 1
    );
    const parsedExam = JSON.parse(jsonContent);
    console.log(parsedExam);
    const exam: Exam = parsedExam;

    const doc = new jsPDF();
    let yPosition = 20;

    addExamInfo(doc, exam, yPosition);
    yPosition += 30;

    exam.sections.forEach((section) => {
        yPosition = addSection(doc, section, yPosition);
    });

    doc.save(`${exam.title.replace(/\s+/g, '_')}.pdf`);
};

function addExamInfo(doc: jsPDF, exam: Exam, yPosition: number): void {
    doc.setFont("Helvetica", "bold", 16);
    doc.text(exam.title, 105, yPosition, { align: "center" });

    yPosition += 10;
    doc.setFont("Helvetica", "normal", 12);
    doc.text(`Total Marks: ${exam.total_marks}`, 10, yPosition);
    doc.text(`Time: ${exam.time}`, 160, yPosition);
}

function addSection(doc: jsPDF, section: Section, yPosition: number): number {
    if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
    }

    doc.setFont("Helvetica", "bold", 14);
    doc.text(`Part ${section.part}: ${section.title} (${section.total_marks} marks)`, 10, yPosition);
    yPosition += 10;

    // Only add subsections if they exist
    if (section.subsections && section.subsections.length > 0) {
        section.subsections.forEach(subsection => {
            yPosition = addSubSection(doc, subsection, yPosition);
        });
    }

    // Only add content if it exists
    if (section.content) {
        yPosition = addContent(doc, section.content, yPosition);
    }

    return yPosition;
}


function addSubSection(doc: jsPDF, subsection: SubSection, yPosition: number): number {
    if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
    }

    doc.setFont("Helvetica", "italic", 12);
    doc.text(`Subsection ${subsection.subsection}: ${subsection.title} (${subsection.marks} marks)`, 10, yPosition);
    yPosition += 10;

    if (subsection.content) {
        yPosition = addContent(doc, subsection.content, yPosition);
    }

    return yPosition;
}

function addContent(doc: jsPDF, content: Content, yPosition: number): number {
    /**
     * Add the content of the section/subsection to the PDF
     * @param doc The jsPDF document
     * @param content The content to add
     * @param yPosition The current y position on the page
     * @returns The new y position after adding the content
     */
    if (content.passage) {
        // Add the passage if present
        yPosition = addTextBlock(doc, content.passage, yPosition, "Passage:") + 10;
    }

    if (content.dialogue) {
        // Add the dialogue if present
        yPosition = addTextBlock(doc, content.dialogue, yPosition, "Dialogue:") + 10;
    }

    if (Array.isArray(content.questions)) {
        // Add the questions if present
        yPosition = addGeneralQuestions(doc, content.questions, yPosition);
    } else if (content.questions) {
        const questions = content.questions as ReadingQuestions;

        if (questions["multiple-choice"]) {
            // Add multiple choice questions if present
            yPosition = addGeneralQuestions(doc, questions["multiple-choice"], yPosition, "Multiple Choice:");
        }
        if (questions["true-false"]) {
            // Add true/false questions if present
            yPosition = addTrueFalseQuestions(doc, questions["true-false"], yPosition);
        }
        if (questions["vocabulary-matching"]) {
            // Add vocabulary matching questions if present
            yPosition = addVocabularyMatching(doc, questions["vocabulary-matching"], yPosition);
        }
    }

    if (Array.isArray(content.questions) && content.questions.every(q => q.word_limit)) {
        yPosition = addWritingQuestions(doc, content.questions, yPosition);
    }

    if (content.exercises) {
        // Add the exercises if present
        yPosition = addExercises(doc, content.exercises, yPosition);
    }

    return yPosition;
}


function addTextBlock(doc: jsPDF, text: string, yPosition: number, heading: string): number {
    doc.setFont("Helvetica", "bold", 12);
    doc.text(heading, 10, yPosition);
    yPosition += 6;

    doc.setFont("Helvetica", "normal", 11);
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, yPosition);
    return yPosition + lines.length * 6;
}

function addGeneralQuestions(doc: jsPDF, questions: Question[], yPosition: number, heading?: string): number {
    if (heading) {
        doc.setFont("Helvetica", "bold", 12);
        doc.text(heading, 10, yPosition);
        yPosition += 6;
    }
    questions.forEach((q, index) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }

        if(!q.word_limit){
            doc.setFont("Helvetica", "normal", 11);
            doc.text(`${index + 1}. ${q.question || q.sentence}`, 10, yPosition);
            yPosition += 10;
    
            q.options?.forEach((option, i) => {
                doc.text(`   ${String.fromCharCode(65 + i)}. ${option}`, 10, yPosition);
                yPosition += 6;
            });
        }
       
    });
    return yPosition;
}

function addTrueFalseQuestions(doc: jsPDF, questions: Question[], yPosition: number): number {
    doc.setFont("Helvetica", "bold", 12);
    doc.text("True/False Questions:", 10, yPosition);
    yPosition += 10;

    questions.forEach((q, index) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFont("Helvetica", "normal", 11);
        doc.text(`${index + 1}. ${q.statement} (   )`, 10, yPosition);
        yPosition += 10;

        if (q.options) {
            q.options.forEach((option, i) => {
                doc.text(`   ${String.fromCharCode(65 + i)}. ${option}`, 10, yPosition);
                yPosition += 6;
            });
        }
    });

    return yPosition;
}

function addVocabularyMatching(doc: jsPDF, vocabList: Question[], yPosition: number): number {
    doc.setFont("Helvetica", "bold", 12);
    doc.text("Vocabulary Matching:", 10, yPosition);
    yPosition += 6;

    vocabList.forEach((vocab, index) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        doc.setFont("Helvetica", "normal", 11);
        doc.text(`${index + 1}. ${(vocab as any).word} - ${(vocab as any).definition}`, 10, yPosition);
        yPosition += 6;
    });

    return yPosition;
}

function addExercises(doc: jsPDF, exercises: Exercise[], yPosition: number): number {
    doc.setFont("Helvetica", "bold", 12);
    doc.text("Exercises:", 10, yPosition);
    yPosition += 6;

    exercises.forEach((exercise, index) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFont("Helvetica", "normal", 11);
        doc.text(`${index + 1}. ${exercise.question}`, 10, yPosition);
        yPosition += 10;
    });

    return yPosition;
}

function addWritingQuestions(doc: jsPDF, writingQuestions: Question[], yPosition: number): number {
    writingQuestions.forEach((q, index) => {
        doc.setFont("Helvetica", "bold", 12);
        doc.text(`Writing Question ${index + 1}:`, 10, yPosition);
        yPosition += 10;

        doc.setFont("Helvetica", "normal", 11);
        doc.text(q.prompt as string, 10, yPosition);
        yPosition += 10;

        doc.text(`Word Limit: ${q.word_limit}`, 10, yPosition);
        yPosition += 6;
    });

    return yPosition;
}
