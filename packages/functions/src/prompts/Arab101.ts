export const ARAB101PROMPT = `
{
  "instruction": "Generate a second-semester final exam for ARAB 101 (Arabic) based on the provided structure and requirements. The type of your response should be JSON OBJECT ONLY. Return only the JSON object without additional descriptive text. Ensure that the keys are in English and the values are in Arabic. Follow the exact structure below.",
  "template": {
  "language": "arb",
    "title": "امتحان الفصل الدراسي الثاني لمادة اللغة العربية ARAB101",
    "total_marks": "60",
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
            "content":{
                "passage": "<انشئ نص قراءة مكون من 200 كلمة>",
                "questions": [
                  {
                    "description": "اختر العنوان المناسب لكل الفقرات",
                    "instruction": "Mix and match the paragraphs with the titles",
                    "paragraph_matching": [
                      { "question": "<فقرة 2>", "answer": "<عنوان 1>" },
                      { "question": "<فقرة 3>", "answer": "<عنوان 2>" },
                      { "question": "<فقرة 1>", "answer": "<عنوان 3>" },
                      { "question": "<فقرة 4>", "answer": "<عنوان 4>" }
                     
                    ]
                  },
                  {
                    "description": "أجب عن الأسئلة التالية بإجابات قصيرة",
                    "short_answer": [
                      { "question": "<سؤال 1>", "answer": "<إجابة قصيرة>" },
                      { "question": "<سؤال 2>", "answer": "<إجابة قصيرة>" },
                      { "question": "<سؤال 3>", "answer": "<إجابة قصيرة>" },
                      { "question": "<سؤال 4>", "answer": "<إجابة قصيرة>" } 
                    ]
                  },
                  {
                    "question": "اكتب تلخيصًا للفقرة التالية في أقل من 80 كلمة",
                    "marks": 5
                  },
                  {
                    "description": "أعرب الافعال التالية",
                    "syntax_analysis": [
                      { "question": "<فعل 1>", "answer": "<إعراب>" },
                      { "question": "<فعل 2>", "answer": "<إعراب>" },
                      { "question": "<فعل 3>", "answer": "<إعراب>" }
                    ]
                  }
                ]
            }
          },
          {
            "subsection": "ب",
            "title": "النص الشعري",
            "marks": 10,
            "content": {
              "passage": "<قصيدة شعرية عن حب الوطن مكونة من 80 كلمة>",
              "questions": [
                {
                  "description": "أجب عن الأسئلة التالية بصح او خطأ",
                  "true_false": [
                    { "question": "<بيان 1>", "answer": "صح/خطأ" },
                    { "question": "<بيان 2>", "answer": "صح/خطأ" },
                    { "question": "<بيان 3>", "answer": "صح/خطأ" },
                    { "question": "<بيان 4>", "answer": "صح/خطأ" },
                    { "question": "<بيان 5>", "answer": "صح/خطأ" }
                  ]
                },
                {
                  "description": "اختر معاني الكلمات التالية",
                  "vocabulary_matching": [
                    { "question": "<كلمة 1>", "answer": "<معنى>" },
                    { "question": "<كلمة 2>", "answer": "<معنى>" },
                     { "question": "<كلمة 3>", "answer": "<معنى>" }
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "part": "2",
        "title": "القواعد",
        "total_marks": 10,
        "subsections": [
          {
            "subsection": "أ",
            "title": "القواعد النحوية",
            "marks": 10,
            "description": "اختر الإجابة الصحيحة",
            "content": {

                "questions": [
                  {
                    "type": "multiple-choice",
                    "question": "<سؤال 1>",
                    "options": [
                      "<اختيار أ>",
                      "<اختيار ب>",
                      "<اختيار ج>",
                      "<اختيار د>"
                    ],
                    "answer": "<الإجابة الصحيحة>"
                  },
                  {
                    "type": "multiple-choice",
                    "question": "<سؤال 2>",
                    "options": [
                      "<اختيار أ>",
                      "<اختيار ب>",
                      "<اختيار ج>",
                      "<اختيار د>"
                    ],
                    "answer": "<الإجابة الصحيحة>"
                  },
                  {
                    "type": "multiple-choice",
                    "question": "<سؤال 3>",
                    "options": [
                      "<اختيار أ>",
                      "<اختيار ب>",
                      "<اختيار ج>",
                      "<اختيار د>"
                    ],
                    "answer": "<الإجابة الصحيحة>"
                  },
                  {
                    "type": "multiple-choice",
                    "question": "<سؤال 4>",
                    "options": [
                      "<اختيار أ>",
                      "<اختيار ب>",
                      "<اختيار ج>",
                      "<اختيار د>"
                    ],
                    "answer": "<الإجابة الصحيحة>"
                  },
                  {
                    "type": "multiple-choice",
                    "question": "<سؤال 5>",
                    "options": [
                      "<اختيار أ>",
                      "<اختيار ب>",
                      "<اختيار ج>",
                      "<اختيار د>"
                    ],
                    "answer": "<الإجابة الصحيحة>"
                  }
                ]
            }
          }
        ]
      },
      {
        "part": "3",
        "title": "التعبير",
        "total_marks": 22,
            "content": {
              "questions": [
                {
                  "type": "opinion-essay",
                  "prompt": "اكتب موضوعًا تعبيريًا حول رأي شخصي في موضوع مستوحى من المقال (100-150 كلمة)",
                  "marks": 12
                },
                {
                  "type": "formal-letter",
                  "prompt": "اكتب رسالة رسمية أو تأملًا في موضوع ذي صلة (100-150 كلمة)",
                  "marks": 10
                }
              ]
            }
      }
    ]
  },

  "notes": {
    "general": "Ensure the JSON response adheres strictly to this format, with placeholders where content needs to be generated dynamically. Do not include any additional text outside the JSON object. The exam should test the students well, it should not be very direct.",
    "القراءة": "The reading passage should test the students well.",
    "القواعد": "The questions should be challenging and test the students well. انشئ اس~لة عن الافعال اللازمة و المتعدية و المضاف و المضاف اليه و المبتدأ و الخبر",
    "النعبير": "The topics should be challenging and test the students well."
  }
}

`;
