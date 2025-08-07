'use client'

import { useState } from 'react'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of two-factor authentication (2FA)?",
    options: [
      "To make passwords longer",
      "To add an extra layer of security beyond just a password",
      "To encrypt data transmission",
      "To scan for malware"
    ],
    correctAnswer: 1,
    explanation: "Two-factor authentication adds an additional security layer by requiring a second form of verification beyond just your password."
  },
  {
    id: 2,
    question: "Which of the following is considered a strong password practice?",
    options: [
      "Using the same password for all accounts",
      "Using a combination of uppercase, lowercase, numbers, and special characters",
      "Using personal information like birthdate",
      "Sharing passwords with trusted colleagues"
    ],
    correctAnswer: 1,
    explanation: "Strong passwords should include a mix of character types and be unique for each account to maximize security."
  },
  {
    id: 3,
    question: "What is phishing?",
    options: [
      "A type of computer virus",
      "A method of encrypting data",
      "A social engineering attack that tricks users into revealing sensitive information",
      "A firewall protection mechanism"
    ],
    correctAnswer: 2,
    explanation: "Phishing is a social engineering attack where attackers impersonate legitimate entities to steal sensitive information like passwords or credit card details."
  },
  {
    id: 4,
    question: "Which of the following best describes ransomware?",
    options: [
      "Software that protects against viruses",
      "Malicious software that encrypts files and demands payment for decryption",
      "A tool for backing up important data",
      "A type of firewall protection"
    ],
    correctAnswer: 1,
    explanation: "Ransomware is malicious software that encrypts a victim's files and demands payment (usually in cryptocurrency) in exchange for the decryption key."
  },
  {
    id: 5,
    question: "What should you do if you receive a suspicious email asking for personal information?",
    options: [
      "Reply immediately with the requested information",
      "Forward it to all your contacts to warn them",
      "Delete the email and report it to your IT security team",
      "Click on any links to verify if it's legitimate"
    ],
    correctAnswer: 2,
    explanation: "Never provide personal information via email. Delete suspicious emails and report them to your IT security team. Legitimate organizations will never ask for sensitive information via email."
  }
]

interface QuizComponentProps {
  onComplete: (score: number) => void
}

export default function QuizComponent({ onComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      // Calculate score
      const score = selectedAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correctAnswer ? 1 : 0)
      }, 0)
      setQuizFinished(true)
      onComplete(score)
    }
  }

  const currentQ = questions[currentQuestion]
  const isCorrect = selectedAnswers[currentQuestion] === currentQ.correctAnswer

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="w-full max-w-md mx-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {currentQ.question}
        </h2>

        <div className="space-y-4">
          {currentQ.options.map((option, index) => {
            let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 "
            
            if (showExplanation) {
              if (index === currentQ.correctAnswer) {
                buttonClass += "border-green-500 bg-green-50 text-green-800"
              } else if (index === selectedAnswers[currentQuestion] && index !== currentQ.correctAnswer) {
                buttonClass += "border-red-500 bg-red-50 text-red-800"
              } else {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-500"
              }
            } else {
              if (selectedAnswers[currentQuestion] === index) {
                buttonClass += "border-blue-500 bg-blue-50 text-blue-800"
              } else {
                buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={buttonClass}
                disabled={showExplanation}
              >
                <span className="font-medium">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {showExplanation && (
        <div className={`p-6 rounded-lg mb-6 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center mb-2">
            <span className={`text-lg font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </span>
          </div>
          <p className="text-gray-700">{currentQ.explanation}</p>
        </div>
      )}

      {showExplanation && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
          </button>
        </div>
      )}
    </div>
  )
}
