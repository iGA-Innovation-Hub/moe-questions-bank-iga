export interface Exam {
    title: string;
    total_marks: number;
    time: string;
    sections: Section[];
}

export interface Section {
    part: number;
    title: string;
    total_marks: number;
    subsections?: SubSection[];
    content?: Content;
}

export interface SubSection {
    subsection: string;
    title: string;
    marks: number;
    content: Content;
}

export interface Content {
    passage?: string;
    dialogue?: string;
    questions?: Question[] | ReadingQuestions;
    exercises?: Exercise[];
}

export interface Question {
    type: string;
    question?: string;
    sentence?: string;
    options?: string[];
    prompt?: string;
    word_limit?: number;
    answer?: string;
    statement?: string;
}

export interface ReadingQuestions {
    "multiple-choice": Question[];
    "true-false": Question[];
    "vocabulary-matching": Question[];
}

export interface Exercise {
    type: string;
    question: string;
    answer: string;
}

export interface VocabularyQuestion extends Question {
    word: string;
    definition: string;
}