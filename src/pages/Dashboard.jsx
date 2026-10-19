import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { formatTime } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Clock, Target, ChevronRight, AlertCircle } from "lucide-react";

export const Dashboard = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectId = sessionStorage.getItem("assess_projectId");
        const response = await api.get(`/projects/${projectId}`);
        setProject(response.data.project);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading project...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const testConfig = project.testConfig || {
    passingScore: 90,
    testSize: 20,
    timeLimit: 600,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Assessment</h1>
          <p className="text-gray-500">You are about to be assessed for the following project.</p>
        </div>

        {/* Project Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h2>
            <p className="text-gray-600 mb-6 whitespace-pre-line leading-relaxed">
                 {project.btdescription}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center text-gray-500 mb-1">
                  <Target className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Pass Mark</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{testConfig.passingScore}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center text-gray-500 mb-1">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Time Limit</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{Math.floor(testConfig.timeLimit / 60)} mins</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center text-gray-500 mb-1">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Questions</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{testConfig.testSize} items</p>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => navigate("/assessment/guidelines")}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg py-4 rounded-xl shadow-md transition-all flex items-center justify-center group"
            >
              Start Assessment
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p>
            After passing the test, you will be able to forward your details to the shop owner. 
            Manual review typically takes <strong>24 to 72 hours</strong>.
          </p>
        </div>

      </div>
    </div>
  );
};