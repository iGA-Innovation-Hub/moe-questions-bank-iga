import jsPDF from "jspdf";

// Function to parse JSON and generate PDF
export const generateExamPDF = (jsonString: string): void => {
    try {
        // Parse the JSON string
        let response = jsonString.substring(jsonString.indexOf("{"), jsonString.lastIndexOf("}") + 1);
        console.log(response);
        const examData = JSON.parse(response);
        const doc = new jsPDF();
        const marginX = 15;
        const marginY = 20;
        const lineSpacing = 10;
        let currentY = marginY;

        // Set font to Times New Roman
        doc.setFont("times", "normal");

        /**
         * Helper function to handle adding text and line breaks.
         */
        const addText = (text: string, fontSize: number, x: number, y: number) => {
            doc.setFontSize(fontSize);
            const lines = doc.splitTextToSize(text, 180);
            lines.forEach((line: string) => {
                if (y > 280) {
                    doc.addPage();
                    y = marginY;
                }
                doc.text(line, x, y);
                y += lineSpacing;
            });
            return y;
        };

        // Add Title, Total Marks, and Time
        currentY = addText(`Exam Title: ${examData.title}`, 16, marginX, currentY);
        currentY = addText(`Total Marks: ${examData.total_marks}`, 12, marginX, currentY);
        currentY = addText(`Time Allowed: ${examData.time}`, 12, marginX, currentY);

        // Add Sections
        examData.sections.forEach((section: any) => {
            currentY = addText(`\nPart ${section.part}: ${section.title} (Total: ${section.total_marks} marks)`, 14, marginX, currentY);

            section.subsections?.forEach((subsection: any) => {
                currentY = addText(`\nSubsection ${subsection.subsection}: ${subsection.title} (${subsection.marks} marks)`, 12, marginX, currentY);

                // Add Content (Passages, Dialogues, or Questions)
                if (subsection.content) {
                    if (subsection.content.passage) {
                        currentY = addText(`\nPassage: ${subsection.content.passage}`, 11, marginX, currentY);
                    }

                    if (subsection.content.dialogue) {
                        currentY = addText(`\nDialogue:\n${subsection.content.dialogue}`, 11, marginX, currentY);
                    }

                    subsection.content.questions?.forEach((question: any, index: number) => {
                        const questionText = question.question || question.sentence;
                        currentY = addText(`${index + 1}. ${questionText}`, 11, marginX, currentY);

                        if (question.options) {
                            question.options.forEach((option: string, optionIndex: number) => {
                                currentY = addText(`   ${String.fromCharCode(97 + optionIndex)}. ${option}`, 10, marginX, currentY);
                            });
                        }
                    });
                }
            });

            // Add Writing Section Questions
            if (section.content?.questions) {
                section.content.questions.forEach((writingQuestion: any, index: number) => {
                    currentY = addText(`${index + 1}. ${writingQuestion.prompt}`, 11, marginX, currentY);
                    currentY = addText(`Word Limit: ${writingQuestion.word_limit}`, 10, marginX, currentY);
                });
            }
        });

        // Save the PDF
        doc.save(`${examData.title}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};
