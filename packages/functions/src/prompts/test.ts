export const ARAB101PROMPT = `
{
  "instruction": "Generate a second-semester final exam for ARAB 101 (Arabic) based on the provided structure and requirements. The type of your response should be JSON OBJECT ONLY. Return only the JSON object without additional descriptive text. Ensure that the keys are in English and the values are in Arabic. Follow the exact structure below.",
  "template": {
    "title": "امتحان الفصل الدراسي الثاني لمادة اللغة العربية ARAB101",
    "total_marks": "80",
    "time": "2 hours",
    "sections": [
      {
        "part": "1",
        "title": "القراءة",
        "total_marks": 28,
        "subsections": [
          {
            "subsection": "أ",
            "title": "النص الخارجي",
            "marks": 18,
            "content": {
              "passage": "<انشئ نص قراءة مكون من 400 كلمة>",
              "questions": {
                "paragraph-matching": [
                  { "paragraph": "<فقرة 1>", "title": "<عنوان 1>" },
                  { "paragraph": "<فقرة 2>", "title": "<عنوان 2>" },
                  { "paragraph": "<فقرة 3>", "title": "<عنوان 3>" },
                  { "paragraph": "<فقرة 4>", "title": "<عنوان 4>" },
                  { "paragraph": "<فقرة 5>", "title": "<عنوان 5>" }
                ],
                "short-answer": [
                  { "question": "<سؤال 1>", "answer": "<إجابة قصيرة>" },
                  { "question": "<سؤال 2>", "answer": "<إجابة قصيرة>" },
                  { "question": "<سؤال 3>", "answer": "<إجابة قصيرة>" },
                  { "question": "<سؤال 4>", "answer": "<إجابة قصيرة>" },
                  { "question": "<سؤال 5>", "answer": "<إجابة قصيرة>" }
                ],
                "summary": { "instructions": "تلخيص الفقرة في أقل من 80 كلمة", "marks": 5 },
                "syntax-analysis": [
                  { "verb": "<فعل 1>", "analysis": "<إعراب>" },
                  { "verb": "<فعل 2>", "analysis": "<إعراب>" },
                  { "verb": "<فعل 3>", "analysis": "<إعراب>" }
                ]
              }
            }
          },
          {
            "subsection": "ب",
            "title": "النص الشعري",
            "marks": 20,
            "content": {
              "poem": "<قصيدة شعرية عن حب الوطن مكونة من 100 كلمة>",
              "questions": {
                "true-false": [
                  { "statement": "<بيان 1>", "answer": "صح/خطأ" },
                  { "statement": "<بيان 2>", "answer": "صح/خطأ" },
                  { "statement": "<بيان 3>", "answer": "صح/خطأ" },
                  { "statement": "<بيان 4>", "answer": "صح/خطأ" },
                  { "statement": "<بيان 5>", "answer": "صح/خطأ" }
                ],
                "vocabulary-matching": [
                  { "word": "<كلمة 1>", "definition": "<معنى>" },
                  { "word": "<كلمة 2>", "definition": "<معنى>" },
                  { "word": "<كلمة 3>", "definition": "<معنى>" },
                  { "word": "<كلمة 4>", "definition": "<معنى>" },
                  { "word": "<كلمة 5>", "definition": "<معنى>" }
                ]
              }
            }
          }
        ]
      },
      {
        "part": "2",
        "title": "القواعد",
        "total_marks": 10,
        "content": {
          "questions": [
            { "type": "multiple-choice", "question": "<سؤال 1>", "options": ["<اختيار أ>", "<اختيار ب>", "<اختيار ج>", "<اختيار د>"], "answer": "<الإجابة الصحيحة>" },
            { "type": "multiple-choice", "question": "<سؤال 2>", "options": ["<اختيار أ>", "<اختيار ب>", "<اختيار ج>", "<اختيار د>"], "answer": "<الإجابة الصحيحة>" },
            { "type": "multiple-choice", "question": "<سؤال 3>", "options": ["<اختيار أ>", "<اختيار ب>", "<اختيار ج>", "<اختيار د>"], "answer": "<الإجابة الصحيحة>" },
            { "type": "multiple-choice", "question": "<سؤال 4>", "options": ["<اختيار أ>", "<اختيار ب>", "<اختيار ج>", "<اختيار د>"], "answer": "<الإجابة الصحيحة>" },
            { "type": "multiple-choice", "question": "<سؤال 5>", "options": ["<اختيار أ>", "<اختيار ب>", "<اختيار ج>", "<اختيار د>"], "answer": "<الإجابة الصحيحة>" }
          ]
        }
      },
      {
        "part": "3",
        "title": "الكتابة",
        "total_marks": 22,
        "content": {
          "questions": [
            { "type": "opinion-essay", "prompt": "اكتب موضوعًا تعبيريًا حول رأي شخصي في موضوع مستوحى من المقال (100-150 كلمة)", "marks": 12 },
            { "type": "formal-letter", "prompt": "اكتب رسالة رسمية أو تأملًا في موضوع ذي صلة (100-150 كلمة)", "marks": 10 }
          ]
        }
      }
    ]
  },
  "notes": "Ensure the JSON response adheres strictly to this format, with placeholders where content needs to be generated dynamically. Do not include any additional text outside the JSON object.
  The exam should test the students well, it should not be very direct.
  "
}

`;
