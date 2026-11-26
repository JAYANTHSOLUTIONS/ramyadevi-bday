"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Clock, CheckCircle, XCircle, Award } from "lucide-react"

interface Question {
  id: string
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  correctAnswer: string
  domain: string
}

export default function QuizPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Sample questions pool
  const questionPool: Question[] = [
    {
      id: "1",
      question: "What does HTML stand for?",
      options: {
        A: "Hyper Text Markup Language",
        B: "High Tech Modern Language",
        C: "Home Tool Markup Language",
        D: "Hyperlink and Text Markup Language",
      },
      correctAnswer: "A",
      domain: "Frontend",
    },
    {
      id: "2",
      question: "Which CSS property is used to change the text color?",
      options: {
        A: "font-color",
        B: "text-color",
        C: "color",
        D: "foreground-color",
      },
      correctAnswer: "C",
      domain: "Frontend",
    },
    {
      id: "3",
      question: "What is a variable in programming?",
      options: {
        A: "A fixed value",
        B: "A storage location with a name",
        C: "A type of function",
        D: "A programming language",
      },
      correctAnswer: "B",
      domain: "General",
    },
    {
      id: "4",
      question: "What does API stand for?",
      options: {
        A: "Application Programming Interface",
        B: "Advanced Programming Interface",
        C: "Application Process Interface",
        D: "Automated Programming Interface",
      },
      correctAnswer: "A",
      domain: "Backend",
    },
    {
      id: "5",
      question: "What does UX stand for?",
      options: {
        A: "User Experience",
        B: "User Extension",
        C: "Universal Experience",
        D: "Unified Extension",
      },
      correctAnswer: "A",
      domain: "UI/UX",
    },
    {
      id: "6",
      question: "What is a blockchain?",
      options: {
        A: "A type of database",
        B: "A distributed ledger technology",
        C: "A programming language",
        D: "A web framework",
      },
      correctAnswer: "B",
      domain: "Blockchain",
    },
    {
      id: "7",
      question: "What does AI stand for?",
      options: {
        A: "Automated Intelligence",
        B: "Artificial Intelligence",
        C: "Advanced Intelligence",
        D: "Applied Intelligence",
      },
      correctAnswer: "B",
      domain: "AI/ML",
    },
    {
      id: "8",
      question: "Which data structure follows LIFO principle?",
      options: {
        A: "Queue",
        B: "Stack",
        C: "Array",
        D: "Linked List",
      },
      correctAnswer: "B",
      domain: "General",
    },
    {
      id: "9",
      question: "What is machine learning?",
      options: {
        A: "A type of computer hardware",
        B: "A subset of AI that learns from data",
        C: "A programming language",
        D: "A database system",
      },
      correctAnswer: "B",
      domain: "AI/ML",
    },
    {
      id: "10",
      question: "What does CPU stand for?",
      options: {
        A: "Computer Processing Unit",
        B: "Central Processing Unit",
        C: "Core Processing Unit",
        D: "Central Program Unit",
      },
      correctAnswer: "B",
      domain: "General",
    },
    {
      id: "11",
      question: "What is responsive design?",
      options: {
        A: "Design that responds to user clicks",
        B: "Design that adapts to different screen sizes",
        C: "Design with animations",
        D: "Design with sound effects",
      },
      correctAnswer: "B",
      domain: "UI/UX",
    },
    {
      id: "12",
      question: "What is a smart contract?",
      options: {
        A: "A legal document",
        B: "Self-executing contract with terms written into code",
        C: "A type of cryptocurrency",
        D: "A blockchain wallet",
      },
      correctAnswer: "B",
      domain: "Blockchain",
    },
  ]

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(currentUser)
    setUser(parsedUser)

    // Check if user has already completed quiz
    if (parsedUser.hasCompletedQuiz) {
      toast({
        title: "Quiz Already Completed",
        description: "You have already completed the qualification quiz.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    // Select 10 random questions
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random())
    const selectedQuestions = shuffled.slice(0, 10)
    setQuestions(selectedQuestions)
    setIsLoading(false)
  }, [router, toast])

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [quizStarted, timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const calculateScore = () => {
    let correctAnswers = 0
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })
    return correctAnswers
  }

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true)

    try {
      const score = calculateScore()
      const isQualified = score >= 3 // Need at least 3 correct answers

      // Simulate API call to save quiz results
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user data in registered users
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const updatedUsers = registeredUsers.map((u: any) => {
        if (u.id === user.id) {
          return {
            ...u,
            hasCompletedQuiz: true,
            quizScore: score,
            isQualified,
            isFirstLogin: false,
          }
        }
        return u
      })
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

      // Update current user session
      const updatedUser = {
        ...user,
        hasCompletedQuiz: true,
        quizScore: score,
        isQualified,
        isFirstLogin: false,
      }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      if (isQualified) {
        toast({
          title: "Congratulations! 🎉",
          description: `You scored ${score}/10 and qualified for the internship!`,
        })
      } else {
        toast({
          title: "Quiz Completed",
          description: `You scored ${score}/10. Unfortunately, you need at least 3 correct answers to qualify.`,
          variant: "destructive",
        })
      }

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation user={user} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading quiz questions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation user={user} />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="animate-fade-in-up">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold gradient-text">Qualification Quiz</CardTitle>
              <CardDescription className="text-lg">
                Complete this quiz to qualify for the Smart Summer Internship 2025
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg">Quiz Instructions:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>10 multiple choice questions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>30 minutes time limit</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Minimum 3 correct answers required to qualify</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Questions cover various CS/IT domains</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <span>Quiz can only be taken once</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleStartQuiz}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation user={user} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Qualification Quiz</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-red-600">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{currentQuestion.domain}</span>
            </div>
          </CardHeader>

          <CardContent>
            <RadioGroup
              value={selectedAnswers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
              className="space-y-4"
            >
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={key} id={`${currentQuestion.id}-${key}`} />
                  <Label htmlFor={`${currentQuestion.id}-${key}`} className="flex-1 cursor-pointer">
                    <span className="font-medium mr-2">{key}.</span>
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-blue-600 text-white"
                    : selectedAnswers[questions[index].id]
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Quiz"
              )}
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
              Next
            </Button>
          )}
        </div>

        {/* Answer Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Answer Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                    selectedAnswers[question.id] ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Answered: {Object.keys(selectedAnswers).length} / {questions.length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
