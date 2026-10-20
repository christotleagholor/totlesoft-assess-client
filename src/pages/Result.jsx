import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api"; // ✅ Import api
import { CheckCircle2, XCircle, Send } from "lucide-react";

export const Result = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [forwarding, setForwarding] = useState(false);
  const [forwarded, setForwarded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("test_result");
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleForward = async () => {
    setForwarding(true);
    setError("");
    try {
      const projectId = sessionStorage.getItem("assess_projectId");
      await api.post(`/attempts/${projectId}/forward`);
      setForwarded(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to forward. Please try again.");
    } finally {
      setForwarding(false);
    }
  };

  if (!result) return null;

  const { passed, score, correctCount, totalQuestions, passingScore } = result;

  // If just forwarded, show confirmation screen
  if (forwarded) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-brand-border overflow-hidden text-center animate-slide-up">
          <div className="p-8 bg-green-50">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-brand-black mb-2">Details Sent Successfully!</h1>
            <p className="text-gray-600">Your application has been forwarded to the shop owner.</p>
          </div>
          <div className="p-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-700">
                <strong>What happens next?</strong>
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                <li>The shop owner will receive your profile and test score.</li>
                <li>Manual review typically takes <strong>24 to 72 hours</strong>.</li>
                <li>You will be notified by email once added to the project.</li>
              </ul>
            </div>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {passed ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Your details are ready to be sent to the shop owner for manual review. 
                They will contact you within 24-72 hours.
              </p>
              <Button 
                onClick={handleForward} 
                isLoading={forwarding}
                className="w-full py-4 text-lg"
              >
                <Send className="w-5 h-5 mr-2" />
                {forwarding ? "Forwarding..." : "Forward Details to Shop"}
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