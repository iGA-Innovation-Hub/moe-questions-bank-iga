import jsPDF from "jspdf";
import { formatExamContent } from "./formatExamContent";

export const generatePDF = async (content: string): Promise<Blob> => {
    const doc = new jsPDF();

    // Format the content
    const formattedContent = formatExamContent(content);

    // Add content to the PDF
    doc.text(formattedContent, 10, 10);

    // Return the PDF as a Blob
    return new Promise((resolve, reject) => {
        try {
            const blob = doc.output("blob");
            resolve(blob);
        } catch (error) {
            reject(error);
        }
    });
};
