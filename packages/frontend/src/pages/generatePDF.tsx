import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ExamData {
    title: string;
    total_marks: number;
    time: string;
    sections: Section[];
}

interface Section {
    part: number;
    title: string;
    total_marks: number;
    subsections?: SubSection[];
    content?: {
        passage?: string;
        dialogue?: string;
        questions?: Question[];
    };
}

interface SubSection {
    subsection: number;
    title: string;
    marks: number;
    content: {
        passage?: string;
        dialogue?: string;
        questions?: Question[];
    };
}

interface Question {
    type: string;
    question?: string;
    sentence?: string;
    options?: string[];
    prompt?: string;
    word_limit?: number;
}

export const generateExamPDF = (jsonString: string) => {
    // Extract JSON portion from the string
    const jsonContent = jsonString.substring(
        jsonString.indexOf("{"),
        jsonString.lastIndexOf("}") + 1
    );

    // Parse the extracted JSON
    const examData: ExamData = JSON.parse(jsonContent);

    const doc = new jsPDF();

    // Initial Y position
    let yPosition = 20;

    // Add Title and Exam Info
    doc.setFont("Helvetica", "bold", 16);
    doc.text(examData.title, 105, yPosition, { align: "center" });
    yPosition += 10;

    doc.setFont("Helvetica", "normal", 12);
    doc.text(`Total Marks: ${examData.total_marks}`, 10, yPosition);
    yPosition += 5;
    doc.text(`Time: ${examData.time}`, 10, yPosition);
    yPosition += 10;

    // Loop through sections
    examData.sections?.forEach((section: Section) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFont("Helvetica", "bold", 14);
        doc.text(`Part ${section.part}: ${section.title} (${section.total_marks} marks)`, 10, yPosition);
        yPosition += 10;

        section.subsections?.forEach((subsection: SubSection) => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }

            doc.setFont("Helvetica", "bold", 12);
            doc.text(
                `  Subsection ${subsection.subsection}: ${subsection.title} (${subsection.marks} marks)`,
                10,
                yPosition
            );
            yPosition += 10;

            if (subsection.content) {
                if (subsection.content.passage) {
                    const passage = doc.splitTextToSize(subsection.content.passage, 180);
                    doc.text(passage, 10, yPosition);
                    yPosition += passage.length * 5;
                }

                if (subsection.content.dialogue) {
                    const dialogue = doc.splitTextToSize(subsection.content.dialogue, 180);
                    doc.text(dialogue, 10, yPosition);
                    yPosition += dialogue.length * 5;
                }

                if (subsection.content.questions && Array.isArray(subsection.content.questions)) {
                    subsection.content.questions.forEach((q: Question, index: number) => {
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 20;
                        }

                        doc.setFont("Helvetica", "normal", 12);
                        if (q.type === "multiple-choice") {
                            doc.text(`${index + 1}. ${q.question}`, 10, yPosition);
                            yPosition += 5;
                            q.options?.forEach((option: string, i: number) => {
                                doc.text(`  ${String.fromCharCode(65 + i)}. ${option}`, 10, yPosition);
                                yPosition += 5;
                            });
                        } else if (q.type === "fill-in-the-blank" && q.sentence) {
                            doc.text(`${index + 1}. ${q.sentence}`, 10, yPosition);
                            yPosition += 5;
                        } else if (q.type === "essay" && q.prompt) {
                            doc.text(`${index + 1}. ${q.prompt} (${q.word_limit} words)`, 10, yPosition);
                            yPosition += 10;
                        }
                    });
                }
            }
        });

        if (section.content?.questions && Array.isArray(section.content.questions)) {
            section.content.questions.forEach((q: Question, index: number) => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }

                doc.setFont("Helvetica", "normal", 12);
                if (q.type === "essay" && q.prompt) {
                    doc.text(`${index + 1}. ${q.prompt} (${q.word_limit} words)`, 10, yPosition);
                    yPosition += 10;
                }
            });
        }
    });

    // Save the PDF
    doc.save("exam.pdf");
};