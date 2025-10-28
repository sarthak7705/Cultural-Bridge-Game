import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, CheckCircle, ChevronDown, Clock, Send } from "lucide-react"

export type MetadataType = {
  mode: string
  conflict_type: string
  role: string
  faction: string
  sentiment_score: number
  stage: number
  tension_level: number
}

export type ConflictResolutionData = {
  available_actions: string[]
  current_stage: number
  is_concluded: boolean
  kalki_score: null | number
  metadata: MetadataType
  response: string
  session_id: string
  tension_level: number
}

export type ConflictResolutionUIProps = {
  data: ConflictResolutionData
  onSubmitResponse?: (response: string) => Promise<void>
}

export default function ConflictResolutionUI({ data, onSubmitResponse }: ConflictResolutionUIProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [response, setResponse] = useState("")
  const [showActions, setShowActions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    available_actions = [],
    current_stage = 0,
    is_concluded = false,
    metadata = {} as MetadataType,
    response: scenarioText = "",
    tension_level = 50,
    session_id,
  } = data || {}

  useEffect(() => {
    setResponse("")
    setSelectedAction(null)
  }, [data?.current_stage])

  const getTensionColor = (level: number) => {
    if (level < 30) return "bg-green-600"
    if (level < 60) return "bg-yellow-600"
    return "bg-red-600"
  }

  const formatConflictType = (type: string | undefined) => {
    if (!type) return ""
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-")
  }

  const handleSubmit = async () => {
    if (!response.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const formattedResponse = selectedAction ? `${selectedAction}: ${response}` : response

      if (onSubmitResponse) {
        await onSubmitResponse(formattedResponse)
      } else {
        console.log({
          action: "respond",
          response: formattedResponse,
          session_id,
        })
      }

      setResponse("")
      setSelectedAction(null)
    } catch (error) {
      console.error("Failed to submit response:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-900 text-gray-200">
      <header className="bg-gray-800 text-gray-100 p-4 border-b border-gray-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <h1 className="text-xl font-bold">Conflict Resolution Simulator</h1>
          <div className="flex flex-wrap items-center gap-2">
            {metadata?.conflict_type && (
              <div className="text-sm border border-gray-600 rounded px-2 py-1 bg-gray-700">
                {formatConflictType(metadata.conflict_type)}
              </div>
            )}
            {metadata?.role && (
              <div className="text-sm border border-gray-600 rounded px-2 py-1 bg-gray-700">Role: {metadata.role}</div>
            )}
            {metadata?.faction && (
              <div className="text-sm border border-gray-600 rounded px-2 py-1 bg-gray-700">
                Faction: {metadata.faction}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto bg-gray-800 m-2 rounded border border-gray-700">
          <div className="mb-4">
            <h2 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4">Scenario</h2>
            <div className="prose prose-invert max-w-none">
              {scenarioText ? (
                <div dangerouslySetInnerHTML={{ __html: scenarioText.replace(/\n/g, "<br/>") }} />
              ) : (
                "Loading scenario..."
              )}
            </div>
          </div>

          {is_concluded && (
            <div className="bg-gray-700 border-l-4 border-gray-500 p-4 my-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={20} />
                <span className="font-semibold">Scenario Concluded</span>
              </div>
              <p className="mt-2">This conflict resolution scenario has ended.</p>
            </div>
          )}
        </div>

        <div className="w-full md:w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-medium text-gray-300 mb-3">Status</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Tension Level</span>
                  <span className="text-sm font-bold">{tension_level}/100</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getTensionColor(tension_level)}`}
                    style={{ width: `${tension_level}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-400">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <Clock size={16} className="mr-1" />
                    Stage
                  </span>
                  <span className="bg-gray-700 text-gray-200 text-xs font-medium px-2 py-0.5 rounded">
                    {(current_stage ?? 0) + 1}
                  </span>
                </div>
              </div>

              {metadata?.sentiment_score !== undefined && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Sentiment</span>
                    <span className="text-sm">
                      {metadata.sentiment_score > 0 ? (
                        <span className="flex items-center text-green-500">
                          <ArrowUp size={14} className="mr-1" />
                          Positive
                        </span>
                      ) : metadata.sentiment_score < 0 ? (
                        <span className="flex items-center text-red-500">
                          <ArrowDown size={14} className="mr-1" />
                          Negative
                        </span>
                      ) : (
                        <span>Neutral</span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!is_concluded && (
            <div className="flex-1 p-4 flex flex-col">
              <h3 className="font-medium text-gray-300 mb-3">Your Response</h3>

              {available_actions && available_actions.length > 0 && (
                <div className="mb-3">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="flex justify-between items-center w-full p-2 bg-gray-700 border border-gray-600 rounded text-left text-sm"
                  >
                    <span>{selectedAction || "Select an action"}</span>
                    <ChevronDown size={16} className={`transition-transform ${showActions ? "rotate-180" : ""}`} />
                  </button>

                  {showActions && (
                    <div className="mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg max-h-48 overflow-y-auto z-10 relative">
                      {available_actions.map((action, index) => (
                        <button
                          key={index}
                          className="w-full p-2 text-left text-sm hover:bg-gray-600 border-b border-gray-600 last:border-0"
                          onClick={() => {
                            setSelectedAction(action)
                            setShowActions(false)
                          }}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1 mb-3">
                <textarea
                  className="w-full h-32 p-2 border border-gray-600 rounded resize-none bg-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  placeholder="Type your response..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!response.trim() || isSubmitting}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded ${
                  response.trim() && !isSubmitting
                    ? "bg-gray-600 hover:bg-gray-500 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send size={16} />
                {isSubmitting ? "Submitting..." : "Submit Response"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
