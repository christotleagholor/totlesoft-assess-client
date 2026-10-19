import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Check, X, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

export const Practice = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null); // { isCorrect, correctAnswer }
  const [answeredCount, setAnsweredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const projectId = sessionStorage.getItem("assess_projectId");
        const res = await api.get(`/attempts/${projectId}/practice`);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmitAnswer = async () => {
    if (!selected || result) return; // Prevent double submit
    setSubmitting(true);
    try {
      const projectId = sessionStorage.getItem("assess_projectId");
      const q = questions[currentIdx];
      const res = await api.post(`/attempts/${projectId}/practice-answer`, {
        taskId: q.taskId,
        answer: selected
      });
      setResult(res.data);
      setAnsweredCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setResult(null);
    }
  };

  const handleReady = async () => {
    setSubmitting(true);
    try {
      const projectId = sessionStorage.getItem("assess_projectId");
      await api.post(`/attempts/${projectId}/ready`);
      navigate("/assessment/test");
    } catch (err) {
      alert(err.response?.data?.message || "Error starting test");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout><div className="text-center py-20">Loading practice...</div></Layout>;
  if (questions.length === 0) return <Layout><div className="text-center py-20">No questions available.</div></Layout>;

  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const allPracticed = answeredCount === questions.length;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
            <span>Practice Mode</span>
            <span>{currentIdx + 1} of {questions.length}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-yellow transition-all duration-300" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-brand-border mb-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-brand-black mb-6">{currentQ.question}</h2>
          
          {currentQ.content && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 whitespace-pre-line text-gray-800">
              {currentQ.content}
            </div>
          )}

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selected === opt;
              const isCorrectAnswer = result?.correctAnswer === opt;
              const isWrongSelection = result && isSelected && !result.isCorrect;

              return (
                <button
                  key={i}
                  onClick={() => !result && setSelected(opt)}
                  disabled={!!result}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between",
                    !result && isSelected ? "border-brand-black bg-brand-black/5" : "border-gray-200 hover:border-gray-300",
                    !result && "cursor-pointer",
                    result && isCorrectAnswer && "border-green-500 bg-green-50",
                    result && isWrongSelection && "border-red-500 bg-red-50",
                    result && !isCorrectAnswer && !isWrongSelection && "opacity-50"
                  )}
                >
                  <span className="font-medium">{opt}</span>
                  {result && isCorrectAnswer && <Check className="w-5 h-5 text-green-600" />}
                  {result && isWrongSelection && <X className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Area */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-brand-border shadow-sm">
          {!result ? (
            <Button onClick={handleSubmitAnswer} disabled={!selected} isLoading={submitting} className="w-full sm:w-auto">
              Check Answer
            </Button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className={cn("font-medium", result.isCorrect ? "text-green-600" : "text-red-600")}>
                {result.isCorrect ? "✅ Correct! Well done." : `❌ Incorrect. The correct answer is: ${result.correctAnswer}`}
              </p>
              
              {!isLast ? (
                <Button onClick={handleNext} variant="secondary" className="w-full sm:w-auto">
                  Next Question <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleReady} disabled={!allPracticed} isLoading={submitting} className="w-full sm:w-auto">
                  Go to Real Test
                </Button>
              )}
            </div>
          )}
        </div>
        
        {isLast && !allPracticed && (
          <p className="text-center text-sm text-amber-600 mt-4">
            Please answer all practice questions to unlock the real test.
          </p>
        )}
      </div>
    </Layout>
  );
};