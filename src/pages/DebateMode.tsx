"use client"

import { Award, MessageCircle, RefreshCw, Send, BookOpen, Users, Brain, Globe, Lightbulb } from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import Spinner from "../components/ui/Spinner"
import { useTheme } from "../contexts/ThemeContext"
import { debateApi } from "../services/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface DebateState {
  dilemma: string
  messages: Message[]
  currentMessage: string
  evaluation: {
    evaluation: string
    timestamp: string
  } | null
  isLoading: boolean
  isSending: boolean
  isEvaluating: boolean
  error: string | null
  debateEnded: boolean
}

interface DebateTopic {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

const DebateMode: React.FC = () => {
  const { theme } = useTheme()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [debateState, setDebateState] = useState<DebateState>({
    dilemma: "",
    messages: [],
    currentMessage: "",
    evaluation: null,
    isLoading: false,
    isSending: false,
    isEvaluating: false,
    error: null,
    debateEnded: false,
  })

  const [isActive, setIsActive] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const debateTopics: DebateTopic[] = [
    {
      id: "ethics",
      title: "Ethics & Morality",
      description: "Explore complex ethical dilemmas and moral questions",
      icon: <Brain className={`h-8 w-8 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`} />,
    },
    {
      id: "technology",
      title: "Technology & Society",
      description: "Debate the impact of technology on our lives and future",
      icon: <Globe className={`h-8 w-8 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />,
    },
    {
      id: "philosophy",
      title: "Philosophical Questions",
      description: "Tackle deep philosophical questions about existence and reality",
      icon: <BookOpen className={`h-8 w-8 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />,
    },
    {
      id: "social",
      title: "Social Issues",
      description: "Discuss contemporary social challenges and potential solutions",
      icon: <Users className={`h-8 w-8 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`} />,
    },
    {
      id: "random",
      title: "Random Topic",
      description: "Get a surprise debate topic from any category",
      icon: <Lightbulb className={`h-8 w-8 ${theme === "dark" ? "text-rose-400" : "text-rose-600"}`} />,
    },
  ]

  useEffect(() => {
    scrollToBottom()
  }, [debateState.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchDilemma = async (topicId?: string) => {
    setDebateState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      evaluation: null,
      messages: [],
      currentMessage: "",
      debateEnded: false,
    }))

    try {
      // In a real implementation, you would pass the topicId to the API
      const response = await debateApi.getPrompt()

      const initialMessage: Message = {
        role: "assistant",
        content: response.prompt,
        timestamp: new Date(),
      }

      setDebateState((prev) => ({
        ...prev,
        dilemma: response.prompt,
        messages: [initialMessage],
        isLoading: false,
      }))

      setIsActive(true)
    } catch (error) {
      setDebateState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to fetch a debate prompt. Please try again.",
      }))
    }
  }

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId)
    fetchDilemma(topicId)
  }

  const sendMessage = async () => {
    if (!debateState.currentMessage.trim() || debateState.isSending || debateState.debateEnded) return

    const userMessage: Message = {
      role: "user",
      content: debateState.currentMessage,
      timestamp: new Date(),
    }

    setDebateState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      currentMessage: "",
      isSending: true,
      error: null,
    }))

    try {
      const history = debateState.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await debateApi.sendMessage(debateState.dilemma, debateState.currentMessage, history)

      const assistantMessage: Message = {
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
      }

      setDebateState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isSending: false,
      }))
    } catch (error) {
      setDebateState((prev) => ({
        ...prev,
        isSending: false,
        error: "Failed to send your message. Please try again.",
      }))
    }
  }

  const endDebateAndEvaluate = async () => {
    if (debateState.messages.length <= 1 || debateState.isEvaluating) return

    setDebateState((prev) => ({
      ...prev,
      isEvaluating: true,
      error: null,
    }))

    try {
      const fullDebate = debateState.messages
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n\n")

      const evaluationResponse = await debateApi.evaluateDebate(debateState.dilemma, fullDebate)

      setDebateState((prev) => ({
        ...prev,
        evaluation: {
          evaluation: evaluationResponse.evaluation,
          timestamp: evaluationResponse.timestamp,
        },
        isEvaluating: false,
        debateEnded: true,
      }))
    } catch (error) {
      setDebateState((prev) => ({
        ...prev,
        isEvaluating: false,
        error: "Failed to evaluate the debate. Please try again.",
      }))
    }
  }

  const resetDebate = () => {
    setIsActive(false)
    setSelectedTopic(null)
    setDebateState({
      dilemma: "",
      messages: [],
      currentMessage: "",
      evaluation: null,
      isLoading: false,
      isSending: false,
      isEvaluating: false,
      error: null,
      debateEnded: false,
    })
  }

  const renderMessages = () => {
    return debateState.messages.map((message, index) => (
      <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
        <div
          className={`
            inline-block max-w-3xl rounded-lg px-4 py-3
            ${
              message.role === "user"
                ? theme === "dark"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-500 text-white"
                : theme === "dark"
                  ? "bg-slate-700 text-white"
                  : "bg-gray-200 text-gray-800"
            }
          `}
        >
          <div className={`prose max-w-none ${theme === "dark" ? "prose-invert" : ""}`}>
            {message.content.split("\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          <div
            className={`text-xs mt-1 ${message.role === "user" ? "text-gray-200" : theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    ))
  }

  const renderTopicSelection = () => {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Choose a Debate Topic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {debateTopics.map((topic) => (
            <Card
              key={topic.id}
              className={`
                cursor-pointer transition-all duration-200 hover:shadow-lg
                ${
                  selectedTopic === topic.id
                    ? theme === "dark"
                      ? "ring-2 ring-rose-500 shadow-lg"
                      : "ring-2 ring-rose-500 shadow-lg"
                    : ""
                }
                ${theme === "dark" ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-gray-50"}
              `}
              onClick={() => handleTopicSelect(topic.id)}
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  {topic.icon}
                  <h3 className="text-xl font-semibold">{topic.title}</h3>
                </div>
                <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{topic.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <MessageCircle className={`h-8 w-8 ${theme === "dark" ? "text-rose-400" : "text-rose-600"}`} />
          <h1 className="text-3xl font-bold">Debate Mode</h1>
        </div>
        <p className="text-lg max-w-3xl">
          Engage in a debate on ethical dilemmas. When you're done, get an evaluation of your arguments.
        </p>
      </header>

      {!isActive ? (
        renderTopicSelection()
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div
              className={`rounded-xl shadow-lg overflow-hidden ${theme === "dark" ? "bg-slate-800" : "bg-white"} mb-6`}
            >
              <div
                className={`p-4 border-b ${theme === "dark" ? "border-slate-700" : "border-gray-200"} flex justify-between items-center`}
              >
                <h2 className="text-xl font-semibold">Debate</h2>
                <div className="flex space-x-2">
                  {!debateState.debateEnded && (
                    <button
                      onClick={endDebateAndEvaluate}
                      disabled={debateState.isLoading || debateState.isEvaluating || debateState.messages.length <= 1}
                      className={`
                        flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium
                        ${
                          debateState.isLoading || debateState.isEvaluating || debateState.messages.length <= 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-amber-500 text-white hover:bg-amber-600"
                        }
                        transition-colors
                      `}
                    >
                      {debateState.isEvaluating ? (
                        <>
                          <Spinner size="sm" />
                          <span>Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <Award size={16} />
                          <span>End & Evaluate</span>
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={resetDebate}
                    className={`
                      p-2 rounded-md 
                      ${theme === "dark" ? "hover:bg-slate-700" : "hover:bg-gray-100"}
                      transition-colors
                    `}
                    title="Choose New Topic"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>

              {debateState.error && (
                <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                  <p>{debateState.error}</p>
                </div>
              )}

              <div className="p-4 h-96 overflow-y-auto">
                {debateState.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <>
                    {renderMessages()}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className={`p-4 border-t ${theme === "dark" ? "border-slate-700" : "border-gray-200"}`}>
                <div className="flex">
                  <input
                    type="text"
                    value={debateState.currentMessage}
                    onChange={(e) => setDebateState((prev) => ({ ...prev, currentMessage: e.target.value }))}
                    placeholder="Enter your argument..."
                    className={`
                      flex-grow p-2 rounded-l-lg
                      ${
                        theme === "dark"
                          ? "bg-slate-700 border-slate-600 text-white"
                          : "bg-white border-gray-300 text-gray-800"
                      }
                      border border-r-0 focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50
                      focus:border-rose-500 transition-colors
                    `}
                    disabled={debateState.isLoading || debateState.isSending || debateState.debateEnded}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={
                      debateState.isLoading ||
                      debateState.isSending ||
                      !debateState.currentMessage.trim() ||
                      debateState.debateEnded
                    }
                    className={`
                      flex items-center justify-center p-2 rounded-r-lg
                      ${
                        debateState.isLoading ||
                        debateState.isSending ||
                        !debateState.currentMessage.trim() ||
                        debateState.debateEnded
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-rose-500 text-white hover:bg-rose-600"
                      }
                      transition-colors w-12
                    `}
                  >
                    {debateState.isSending ? <Spinner size="sm" /> : <Send size={18} />}
                  </button>
                </div>
                {debateState.debateEnded && (
                  <div className="mt-2 text-center text-sm text-amber-500">
                    Debate has ended. See evaluation on the right.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {debateState.evaluation ? (
              <div
                className={`rounded-xl shadow-lg overflow-hidden ${theme === "dark" ? "bg-slate-800" : "bg-white"} sticky top-4`}
              >
                <div className={`p-4 border-b ${theme === "dark" ? "border-slate-700" : "border-gray-200"}`}>
                  <h2 className="text-xl font-semibold">Debate Evaluation</h2>
                </div>

                <div className="p-4">
                  <div className={`p-4 mb-4 rounded-lg ${theme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}>
                    <div className={`prose max-w-none ${theme === "dark" ? "prose-invert" : ""}`}>
                      {debateState.evaluation.evaluation.split("\n").map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mt-2">
                    Evaluated on: {new Date(debateState.evaluation.timestamp).toLocaleString()}
                  </div>

                  <div className="mt-4 text-center">
                    <Button
                      onClick={resetDebate}
                      className="bg-gradient-to-r from-rose-500 to-red-600 hover:opacity-90"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Start New Debate
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-xl shadow-lg overflow-hidden ${theme === "dark" ? "bg-slate-800" : "bg-white"} p-4`}
              >
                <h3 className="text-lg font-semibold mb-3">Current Topic</h3>
                {selectedTopic && (
                  <div className="flex items-center gap-3 mb-4">
                    {debateTopics.find((t) => t.id === selectedTopic)?.icon}
                    <span className="font-medium">{debateTopics.find((t) => t.id === selectedTopic)?.title}</span>
                  </div>
                )}
                <div className={`p-3 rounded-lg text-sm ${theme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}>
                  <p>
                    Engage in the debate by responding to the prompt. When you're ready, click "End & Evaluate" to get
                    feedback on your arguments.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DebateMode
