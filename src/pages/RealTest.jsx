import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { formatTime } from "../lib/utils";
import { Clock, AlertTriangle } from "lucide-react";

export const RealTest = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    const initTest = async () => {
      try {
        const projectId = sessionStorage.getItem("assess_projectId");
        const res = await api.get(`/attempts/${projectId}/test`);
        setQuestions(res.data.questions);
        setTimeLeft(res.data.timeLimit);
      } catch (err) {
        alert(err.response?.data?.message || "Error loading test");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    initTest();
  }, [navigate]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft === null || loading) return;
    
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft !== null, loading]); // Only start once

  // Security: Prevent right click and copy
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('cut', preventDefault);
    document.addEventListener('paste', preventDefault);
    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('cut', preventDefault);
      document.removeEventListener('paste', preventDefault);
    };
  }, []);

  const handleSelect = (taskId, option) => {
    setAnswers(prev => ({ ...prev, [taskId]: option }));
  };

  const handleAutoSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    
    try {
      const projectId = sessionStorage.getItem("assess_projectId");
      const formattedAnswers = questions.map(q => ({
        taskId: q.taskId,
        answer: answers[q.taskId] || ""
      }));
      
      const res = await api.post(`/attempts/${projectId}/submit-test`, { answers: formattedAnswers });
      
      // Save result in session storage to display on result page
      sessionStorage.setItem("test_result", JSON.stringify(res.data));
      navigate("/assessment/result");
    } catch (err) {
      console.error(err);
      alert("Failed to submit test. Please contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout><div className="text-center py-20">Loading secure test environment...</div></Layout>;
  if (questions.length === 0) return <Layout><div className="text-center py-20">No test questions found.</div></Layout>;

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const isLast = currentIdx === questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Secure Header */}
      <header className="bg-brand-black text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-brand-yellow" />
            <span className="font-semibold text-sm">Secure Assessment Environment</span>
          </div>
          <div className="flex items-center bg-white/10 px-4 py-1.5 rounded-full">
            <Clock className="w-4 h-4 text-brand-yellow mr-2" />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6">
        {/* Progress */}
        <div className="mb-6 flex items-center justify-between text-sm font-medium text-gray-500">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{answeredCount} Answered</span>
        </div>

        {/* Question */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-brand-border mb-6 select-none">
          <h2 className="text-xl font-semibold text-brand-black mb-6">{currentQ.question}</h2>
          
          {currentQ.content && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 whitespace-pre-line text-gray-800">
              {currentQ.content}
            </div>
          )}

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = answers[currentQ.taskId] === opt;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(currentQ.taskId, opt)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected 
                      ? "border-brand-black bg-brand-black/5" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
          >
            Previous
          </Button>

          {!isLast ? (
            <Button 
              variant="secondary"
              onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleAutoSubmit} 
              isLoading={submitting}
              className="bg-green-600 hover:bg-green-700 text-white border-none"
            >
              Submit Final Test
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};