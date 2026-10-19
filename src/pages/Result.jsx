import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { CheckCircle2, XCircle, Send } from "lucide-react";

export const Result = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("test_result");
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  if (!result) return null;

  const { passed, score, correctCount, totalQuestions, passingScore } = result;

  return (
    <Layout>
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-brand-border overflow-hidden text-center animate-slide-up">
        <div className={`p-8 ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
          {passed ? (
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          )}
          
          <h1 className="text-3xl font-bold text-brand-black mb-2">
            {passed ? "Congratulations!" : "Assessment Failed"}
          </h1>
          <p className="text-gray-600">
            {passed 
              ? "You have successfully passed the qualification test." 
              : "You did not meet the passing score for this project."}
          </p>
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="text-center">
              <div className="text-5xl font-black text-brand-black">{score}%</div>
              <div className="text-sm font-medium text-gray-500 mt-1">Your Score</div>
            </div>
          </div>

          <div className="flex justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8 text-sm">
            <div>
              <span className="text-gray-500 block">Correct</span>
              <span className="font-bold text-brand-black">{correctCount} / {totalQuestions}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block">Required</span>
              <span className="font-bold text-brand-black">{passingScore}%</span>
            </div>
          </div>

          {passed ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Your details are ready to be sent to the shop owner for manual review. 
                They will contact you within 24-72 hours.
              </p>
              <Button 
                onClick={() => alert("Backend webhook not connected yet")} 
                className="w-full py-4 text-lg"
              >
                <Send className="w-5 h-5 mr-2" />
                Forward Details to Shop
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                You can review the guidelines and try again after 7 days.
              </p>
              <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};