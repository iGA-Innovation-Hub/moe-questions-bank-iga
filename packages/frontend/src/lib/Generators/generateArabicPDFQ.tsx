import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { arabicFontBase64 } from "../../fonts/arabic-font";

export const generateExamPDFQ = (examContent: any) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // examContent = JSON.parse(examContent);

  // Load Arabic font
  doc.addFileToVFS("../../fonts/Arabic-Regular.ttf", arabicFontBase64);
  doc.addFont("../../fonts/Arabic-Regular.ttf", "Arabic", "normal");
  doc.setFont("Arabic");

  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;
  let y = 20;

  function addHeader() {
    const currentYear = new Date().getFullYear();
    const studyYear = `${currentYear}/${currentYear - 1}`;

    doc.setFontSize(16);
    doc.addFont("../../fonts/Arabic-Regular.ttf", "Arabic", "bold");
    doc.setTextColor(169, 169, 169); // RGB value for light grey
    doc.text(
      convertToArabicNumbers("عرب 101 المسار: توحيد المسارات"),
      155,
      margin
    );
    doc.setTextColor(0, 0, 0); // RGB value for black

    // Set font size and align to center
    doc.text("مملكة البحرين", 105, margin, { align: "center" });
    doc.text("وزارة التربية والتعليم", 105, margin + 8, {
      align: "center",
    });
    doc.text("قسم الامتحانات الداخلية", 105, margin + 16, {
      align: "center",
    });
    const xStart = (doc.internal.pageSize.width - 50) / 2; // Centered start
    doc.line(xStart, y + 8, xStart + 48, y + 8);

    doc.setFontSize(16);
    doc.addFont("../../fonts/Arabic-Regular.ttf", "Arabic", "bold");
    doc.text(
      convertToArabicNumbers(
        `${examContent.title}للعام الدراسي ${studyYear} م`.replace(
          "ARAB101",
          ""
        )
      ),
      105,
      margin + 32,
      { align: "center" }
    );
    doc.text("اسم المقرر: اللغة العربية", 160, margin + 40, {
      align: "right",
    });
    doc.line(xStart - 40, 43.5, xStart + 90, 43.5);
    doc.text(convertToArabicNumbers("رمز المقرر: عرب 101"), 160, margin + 48, {
      align: "right",
    });
    doc.text("المسار: توحيد المسارات", 40, margin + 40, {
      align: "left",
    });
    doc.text("الزمن: ساعتان", 51.5, margin + 48, { align: "left" });

    // Add a line below the header content
    doc.line(10, margin + 55, 200, margin + 55);
    doc.line(10, margin + 56, 200, margin + 56);

    y = margin + 70;
  }

  function addFooter(pageNumber: any, totalPages: any) {
    doc.setFontSize(10);
    doc.setFontSize(16);
    doc.addFont("../../fonts/Arabic-Regular.ttf", "Arabic", "bold");
    doc.text(
      `الصفحة ${convertToArabicNumbers(pageNumber)} من ${convertToArabicNumbers(
        totalPages
      )}`,
      105,
      pageHeight - 10,
      { align: "center" }
    );
  }

  function checkPageOverflow() {
    if (y > pageHeight - 61) {
      // Adjust the overflow condition
      doc.addPage(); // Add a new page
      doc.setTextColor(169, 169, 169); // RGB value for light grey
      doc.text(
        convertToArabicNumbers("عرب 101 المسار: توحيد المسارات"),
        155,
        margin
      );
      doc.setTextColor(0, 0, 0); // RGB value for light grey

      y = margin + 20; // Reset vertical position to margin at the top of the new page
    }
  }

  addHeader();

  // Content Sections
  if (Array.isArray(examContent.sections)) {
    examContent.sections.forEach((section: any) => {
      doc.setFontSize(18);
      doc.text(
        `القسم ${convertToArabicNumbers(section.part)}: ${
          section.title
        } ${convertToArabicNumbers(section.total_marks)} - درجة`,
        200,
        y,
        { align: "right" }
      );
      doc.setFontSize(16);

      y += 15;

      if (Array.isArray(section.subsections)) {
        section.subsections.forEach((subsection: any) => {
          let subsectionTitle = "";

          // Adjust subsection title based on its value
          if (subsection.subsection === "أ") {
            subsectionTitle = "أولاً:";
          } else if (subsection.subsection === "ب") {
            subsectionTitle = ":ثانياً";
          } else if (subsection.subsection === "ج") {
            subsectionTitle = ":ثالثاً"; // For "ج"
          } else {
            subsectionTitle = `(${subsection.subsection})`; // Default if it's neither "أ" nor "ب" nor "ج"
          }

          // Set font size
          doc.setFontSize(16);

          // Text to display
          const text = `${subsectionTitle} ${
            subsection.title
          } - ${convertToArabicNumbers(subsection.marks)} درجة`;

          // X and Y positions for the text
          const x = 200;
          const yPosition = y;

          // Draw the rounded rectangle around the text
          const textWidth = doc.getTextWidth(text) * 1.5; // Calculate the width of the box based on the text
          const textHeight = 10; // Height of the box (add some padding)

          doc.setFillColor(240, 240, 240);

          // Draw a rounded rectangle around the text (x, y, width, height, radius)
          doc.roundedRect(
            x - textWidth + 2,
            yPosition - 6,
            textWidth,
            textHeight,
            5,
            3,
            "F"
          ); // Radius 5 for rounded corners

          doc.setDrawColor(0, 0, 0); // Black color for the border
          doc.roundedRect(
            x - textWidth + 2, // X position (centered)
            yPosition - 6, // Y position
            textWidth, // Width of the box
            textHeight, // Height of the box
            5, // Radius of the corners for smoother rounded edges
            3, // Same radius for all corners
            "S" // Stroke the rectangle (draw the border)
          );

          // Draw the text inside the box
          doc.text(text, x, yPosition, { align: "right" });

          // Update the Y position for the next item
          y += textHeight + 6; // Adjust Y after the box

          if (subsection.content && subsection.content.passage) {
            if (subsection.title === "النص الخارجي") {
              // For "النص الخارجي", display as normal
              const lines = doc.splitTextToSize(
                subsection.content.passage,
                240
              );
              lines.forEach((line: any) => {
                doc.text(line, 200, y, { align: "right" });
                y += 6;
                checkPageOverflow();
              });
              y += 20;
            } else if (subsection.title === "النص الشعري") {
              y += 5;
              // For "النص الشعري", display every two lines together with a space between them
              const lines = doc.splitTextToSize(
                subsection.content.passage,
                240
              );
              let combinedLine = "";

              // Calculate the total height of the passage to know where to draw the box
              const initialY = y;
              const passageHeight = lines.length * 3 + 10; // Estimate the height of the content (each line has 6 height and adding some padding)

              // Draw a box around the whole passage
              // Set the background color to light gray (RGB value for light gray)
              doc.setFillColor(230, 230, 230); // Light gray color (can adjust this value)

              // Draw the rounded rectangle with the background color
              doc.roundedRect(20, initialY - 8, 160, passageHeight, 3, 1, "F"); // 'F' means fill the rectangle with the set color

              // Optional: Draw the outline of the rectangle (if you want the border to be visible)
              doc.setDrawColor(0, 0, 0); // Black color for the border
              doc.roundedRect(20, initialY - 8, 160, passageHeight, 3, 1); // 'S' means stroke (outline) the rectangl
              doc.stroke(); // Apply the stroke to draw the box

              lines.forEach((line: any, index: any) => {
                // Concatenate every two lines with a space between them
                if (index % 2 === 0) {
                  combinedLine = line; // First line of the pair
                } else {
                  combinedLine += "                    " + line; // Add the second line with a space between
                  doc.text(combinedLine, 165, y, { align: "right" });
                  y += 6;
                  combinedLine = ""; // Reset for next pair of lines
                  checkPageOverflow();
                }
              });

              // If there is an odd number of lines, display the last one
              if (combinedLine) {
                doc.text(combinedLine, 150, y, { align: "right" });
                y += 6;
                checkPageOverflow();
              }

              y += 20;
            }
          }

          if (
            subsection.content &&
            Array.isArray(subsection.content.questions)
          ) {
            subsection.content.questions.forEach(
              (question: any, index: any) => {
                if (question.question && index == 2 && question.marks) {
                  y;
                  doc.text(
                    convertToArabicNumbers(
                      `${index + 1} - ${question.question}`
                    ),
                    200,
                    y,
                    {
                      align: "right",
                    }
                  );
                  y += 10; // Adjust spacing after the question
                  checkPageOverflow();

                  // Generate 6 lines for answer placeholder
                  for (let i = 0; i < 6; i++) {
                    doc.text(
                      "_____________________________".repeat(3),
                      192,
                      y,
                      {
                        align: "right",
                      }
                    ); // Placeholder line
                    y += 7; // Spacing between lines
                    checkPageOverflow();
                  }
                  y += 15;
                }

                if (question.description) {
                  doc.text(
                    convertToArabicNumbers(
                      `${index + 1} - ${question.description}`
                    ),
                    200,
                    y,
                    {
                      align: "right",
                    }
                  );
                  y += 10;
                  checkPageOverflow();
                }

                // Handle specific question types (e.g., paragraph_matching, short_answer)
                if (question.paragraph_matching) {
                  question.paragraph_matching.forEach((pair: any) => {
                    doc.text(
                      `السؤال: ${pair.question}`.replace(".", ""),
                      200,
                      y,
                      {
                        align: "right",
                      }
                    );
                    y += 7.5;
                    doc.text(`_______________________`.repeat(3), 200, y, {
                      align: "right",
                    });
                    y += 10;
                    checkPageOverflow();
                  });
                }

                if (question.short_answer) {
                  question.short_answer.forEach((shortAns: any) => {
                    doc.text(
                      `السؤال: ${shortAns.question}`.replace(".", ""),
                      200,
                      y,
                      {
                        align: "right",
                      }
                    );
                    y += 7.5;
                    doc.text(`_______________________`.repeat(3), 200, y, {
                      align: "right",
                    });
                    y += 10;
                    checkPageOverflow();
                  });
                }

                if (question.syntax_analysis && index == 3) {
                  question.syntax_analysis.forEach((pair: any) => {
                    doc.text(` الكلمة: ${pair.question} •`, 200, y, {
                      align: "right",
                    });
                    y += 7.5;
                    doc.text(`_______________________`.repeat(3), 200, y, {
                      align: "right",
                    });
                    y += 10;
                    checkPageOverflow();
                  });
                }

                if (question.true_false) {
                  question.true_false.forEach((item: any) => {
                    doc.text(
                      convertToArabicNumbers(
                        `(   ) ${item.question} • `.replace(".", "")
                      ),
                      200,
                      y,
                      {
                        align: "right",
                      }
                    );
                    y += 6;
                    checkPageOverflow();
                  });
                  y += 15;
                }

                if (question.vocabulary_matching) {
                  question.vocabulary_matching.forEach((pair: any) => {
                    doc.text(`${pair.question} •`, 200, y, {
                      align: "right",
                    });
                    y += 6;
                    doc.text(`___________________`.repeat(3), 200, y, {
                      align: "right",
                    });
                    y += 10;
                    checkPageOverflow();
                  });
                }

                if (question.type === "multiple-choice") {
                  doc.text(
                    `${convertToArabicNumbers(index + 1)} - ${
                      question.question
                    }`,
                    200,
                    y,
                    {
                      align: "right",
                    }
                  );
                  y += 10;

                  const arabicLetters = ["أ", "ب", "ج", "د"]; // Arabic letters for the options

                  question.options.forEach((option: any, optIndex: any) => {
                    // Draw the option text
                    doc.text(
                      `${arabicLetters[optIndex]} ( ${option} )`, // Use the corresponding Arabic letter
                      200,
                      y,
                      { align: "right" }
                    );
                    y += 7; // Adjust spacing between options
                    checkPageOverflow();
                  });

                  y += 10; // Add space after options
                }
              }
            );
          }
        });
      }

      // Writing Questions
      if (Array.isArray(section.content?.questions)) {
        section.content.questions.forEach((question: any, index: any) => {
          doc.setFontSize(16);

          // Display the question index once on the first line
          const firstLine = `${convertToArabicNumbers(index + 1)} - ${
            question.prompt
          }`;
          const firstLineWrapped = doc.splitTextToSize(firstLine, 220); // Split the first line
          firstLineWrapped.forEach((line: any) => {
            doc.text(line, 200, y, { align: "right" });
            y += 6; // Adjust spacing between lines
            checkPageOverflow();
          });

          // If there are more lines to the prompt, continue to display them without the index
          const remainingPrompt = question.prompt.substring(firstLine.length); // Get the remaining part of the prompt after the index
          const remainingLines = doc.splitTextToSize(remainingPrompt, 220);
          remainingLines.forEach((line: any) => {
            doc.text(line, 200, y, { align: "right" });
            y += 6; // Adjust spacing between lines
            checkPageOverflow();
          });

          // Placeholder for essay writing (e.g., 28 lines for writing)
          const linesForEssay = 28;
          for (let i = 0; i < linesForEssay; i++) {
            doc.text("_____________________________".repeat(3), 192, y, {
              align: "right",
            });
            y += 7; // Spacing between lines
            checkPageOverflow();
          }

          y += 15; // Additional spacing after the question
        });
      }
    });
  }

  // Footer for last page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i); // Set the current page
    addFooter(i, totalPages); // Add footer for each page
  }

  // Get today's date
  const today = new Date();
  const formattedDate = today
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
    .replace(/\//g, "-"); // Format the date as YYYY-MM-DD (e.g., "2024-12-31")

  // Define your exam title
  const examTitle = examContent.title;

  // Combine the title and date for the filename
  const fileName = `${examTitle} - ${formattedDate}.pdf`;

  // Save PDF
  doc.save(fileName);
};

function convertToArabicNumbers(text: any) {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  if (typeof text === "string") {
    return text.replace(/\d/g, (digit: any) => arabicDigits[digit]);
  } else if (typeof text === "number") {
    return String(text).replace(/\d/g, (digit: any) => arabicDigits[digit]);
  } else {
    return text;
  }
}
