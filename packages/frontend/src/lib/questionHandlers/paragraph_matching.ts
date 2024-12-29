// Shuffle function
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}


export function paragraphMatchingHandler(question: any) {
  const shuffledQuestions = shuffleArray(
    question.map((item: any) => item.question)
  );
  const shuffledAnswers = shuffleArray(
    question.map((item: any) => item.answer)
  );

  let result = "";

  shuffledQuestions.forEach((q, index) => {
    result += `${index + 1}. ${q} - ${shuffledAnswers[index]}\n`;
  });

  return result;
}
