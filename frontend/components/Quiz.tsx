import React, { useState } from 'react';
import { QuizQuestion } from '../types';

// const questions: QuizQuestion[] = [
//   {
//     id: 1,
//     question: 'What is the time complexity of a binary search algorithm?',
//     options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
//   },
//   {
//     id: 2,
//     question: 'Which of the following is NOT a principle of object-oriented programming?',
//     options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Decomposition'],
//   },
//   {
//     id: 3,
//     question: 'In React, what hook is used to perform side effects in function components?',
//     options: ['useState', 'useContext', 'useEffect', 'useReducer'],
//   },
//   {
//     id: 4,
//     question: 'What does API stand for?',
//     options: ['Application Programming Interface', 'Automated Program Interaction', 'Application Process Integration', 'Algorithmic Programming Interface'],
//   },
// ];

// const correctAnswers: Record<number, string> = {
//   1: 'O(log n)',
//   2: 'Decomposition',
//   3: 'useEffect',
//   4: 'Application Programming Interface',
// };


interface QuizProps {
  onSubmit: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ onSubmit }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleOptionChange = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSave = (questionId: number) => {
    if (!answers[questionId]) return;
    setSaved((prev) => ({ ...prev, [questionId]: true }));
  };

  const goTo = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const isAllAnswered = Object.keys(answers).length === questions.length;

  const handleSubmit = () => {
    let score = 0;
    for (const question of questions) {
      if (answers[question.id] === correctAnswers[question.id]) score++;
    }
    onSubmit(score);
  };

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const savedCount = Object.keys(saved).filter((k) => saved[Number(k)]).length;

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {/* Left: question + controls */}
        <div className="flex-1 bg-gradient-to-b from-white to-slate-50 rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Question {currentIndex + 1} <span className="text-sm font-medium text-slate-500">/ {total}</span></h3>
              <div className="text-xs text-slate-500 mt-1">Progress: {answeredCount}/{total} answered • {savedCount} saved</div>
            </div>

            <div className="flex items-center gap-3">
              {saved[currentQuestion.id] ? (
                <span className="text-sm font-medium text-green-800 bg-green-100 px-2 py-1 rounded-full">Saved</span>
              ) : (
                <span className="text-sm font-medium text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">{answers[currentQuestion.id] ? 'Answered' : 'Not answered'}</span>
              )}
            </div>
          </div>

          {/* progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </div>

          <p className="font-semibold text-lg text-slate-800 mb-4">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <label
                key={option}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-shadow ${
                  answers[currentQuestion.id] === option
                    ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                    : 'bg-white border-gray-200 hover:shadow-sm'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleOptionChange(currentQuestion.id, option)}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 mt-6">
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-white border border-gray-200 rounded hover:shadow-sm disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={() => handleSave(currentQuestion.id)}
                disabled={!answers[currentQuestion.id]}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                Save
              </button>

              <button
                onClick={() => {
                  handleSave(currentQuestion.id);
                  handleNext();
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Save & Next
              </button>
            </div>

            <div className="flex gap-2">
              {currentIndex < questions.length - 1 ? (
                <button onClick={handleNext} className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">
                  Next
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (answers[currentQuestion.id]) setSaved((s) => ({ ...s, [currentQuestion.id]: true }));
                    handleSubmit();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded shadow-md"
                >
                  Finish & Submit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: question list + quick preview */}
        <div className="w-96 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <h4 className="font-semibold text-slate-700 mb-3">Questions</h4>
            <div className="grid grid-cols-6 gap-3">
              {questions.map((q, idx) => {
                const answered = !!answers[q.id];
                const isSaved = !!saved[q.id];
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => goTo(idx)}
                    className={`flex flex-col items-center justify-center py-2 px-2 rounded-md text-sm font-medium border transition transform ${
                      isCurrent ? 'bg-indigo-50 border-indigo-300 scale-105' :
                      isSaved ? 'bg-green-50 border-green-200' :
                      answered ? 'bg-yellow-50 border-yellow-200' :
                      'bg-white border-gray-100 hover:shadow-sm'
                    }`}
                    title={`Question ${idx + 1} — ${isSaved ? 'Saved' : answered ? 'Answered' : 'Not answered'}`}
                  >
                    <div className="text-xs text-slate-600">Q{idx + 1}</div>
                    <div className={`mt-1 text-[11px] px-2 py-0.5 rounded-full ${
                      isSaved ? 'bg-green-100 text-green-800' :
                      answered ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {isSaved ? 'Saved' : answered ? 'Answered' : 'Empty'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <h4 className="font-semibold text-slate-700 mb-3">Quick Preview</h4>
            <div className="space-y-3 max-h-60 overflow-auto">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isSaved = !!saved[q.id];
                const isCurrent = idx === currentIndex;
                return (
                  <div
                    key={q.id}
                    onClick={() => goTo(idx)}
                    className={`p-2 rounded cursor-pointer border flex items-start gap-3 ${
                      isCurrent ? 'bg-indigo-50 border-indigo-200' : 'border-gray-100'
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
                      ${isSaved ? 'bg-green-100 text-green-800' : ans ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500' }">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-700">Q{idx + 1}</div>
                      <div className="text-xs text-slate-500">{ans ?? 'Not answered'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Submit area */}
      <div className="pt-6 border-t mt-4">
        <button
          onClick={handleSubmit}
          disabled={!isAllAnswered}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:scale-[1.01] disabled:opacity-50"
        >
          {isAllAnswered ? 'Submit Exam' : 'Answer all questions to submit'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
