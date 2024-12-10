/**
 * Formats the exam content by dividing it into sections and labeling them with appropriate headers.
 * @param content - The raw exam content as a string.
 * @returns A formatted string with labeled sections and properly formatted content.
 */
export const formatExamContent = (content: string): string => {
    // Split content into main sections based on known patterns like "Listening", "Reading", "Writing"
    const sections = content.split("\n\n");

    // Function to format questions for matching or True/False questions
    const formatQuestion = (question: string): string => {
        if (question.includes("Match")) {
            // Handle matching question formatting
            return question.replace(/(\d+\.)/g, '\n$1');
        } else if (question.includes("True") || question.includes("False")) {
            // Handle True/False question formatting
            return question.replace(/(\d+\.)/g, '\n$1');
        } else {
            // For regular multiple-choice or short answer questions
            return question.replace(/(\d+\.)/g, '\n$1');
        }
    };

    // Format Listening Section
    const formatListeningSection = (section: string) => {
        let formattedSection = "Listening Section (Total: 10 marks)\n";
        formattedSection += section.replace("Question 1:", "1. Question 1:")
                                    .replace("Question 2:", "2. Question 2:")
                                    .split("\n").map(formatQuestion).join("\n");
        return formattedSection;
    };

    // Format Reading Section
    const formatReadingSection = (section: string) => {
        let formattedSection = "Reading Section (Total: 20 marks)\n";
        formattedSection += section.split("\n").map(formatQuestion).join("\n");
        return formattedSection;
    };

    // Format Writing Section
    const formatWritingSection = (section: string) => {
        let formattedSection = "Writing Section (Total: 20 marks)\n";
        formattedSection += section.split("\n").map(formatQuestion).join("\n");
        return formattedSection;
    };

    // Now apply specific formats to each section
    let formattedExam = "";

    sections.forEach(section => {
        if (section.includes("Listening Section")) {
            formattedExam += formatListeningSection(section) + "\n\n";
        } else if (section.includes("Reading Section")) {
            formattedExam += formatReadingSection(section) + "\n\n";
        } else if (section.includes("Writing Section")) {
            formattedExam += formatWritingSection(section) + "\n\n";
        } else {
            formattedExam += section + "\n\n"; // For any remaining sections
        }
    });

    return formattedExam.trim(); // Clean up any trailing newlines
};
