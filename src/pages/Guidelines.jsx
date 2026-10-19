import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { FileText, Download, Link as LinkIcon } from "lucide-react";

export const Guidelines = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [checks, setChecks] = useState({
    reviewed: false,
    understood: false,
    prepared: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const projectId = sessionStorage.getItem("assess_projectId");
      try {
        const res = await api.get(`/auth/verify?projectId=${projectId}`);
        setProject(res.data.project);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProject();
  }, []);

    const handleStart = async () => {
    setLoading(true);
    try {
      const projectId = sessionStorage.getItem("assess_projectId");
      await api.post('/attempts/start', { projectId });
      navigate("/assessment/practice");
    } catch (err) {
      console.error(err);
      // Show the error message from the backend (e.g., "You must wait 168 hours...")
      alert(err.response?.data?.message || "Failed to start assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logic copied from your main site to handle Google Drive links properly
  const handleDownloadGuideline = (url) => {
    if (!url) return;
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/([^\/]+)/);
      if (fileIdMatch) {
        window.open(`https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`, '_blank');
      } else {
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  };

  const allChecked = checks.reviewed && checks.understood && checks.prepared;
  const hasGuidelines = project?.resourceLink1 || project?.resourceLink2 || project?.resourceLink3;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden">
        <div className="bg-brand-black p-6 text-white">
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-brand-yellow" />
            Assessment Guidelines
          </h1>
          <p className="text-gray-300 text-sm">
            Please review carefully before starting the practice and real test.
          </p>
        </div>

        <div className="p-6">
          {/* Project Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-brand-black mb-2">Project Details</h3>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">
              {project?.btdescription || "Loading..."}
            </p>
          </div>

          {/* Downloadable Guidelines Section */}
          {hasGuidelines && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Download Project Guidelines
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                You must download and review the guidelines before starting the test.
              </p>
              <div className="flex flex-wrap gap-3">
                {project?.resourceLink1 && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadGuideline(project.resourceLink1)}
                    className="bg-white border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Guideline 1
                  </Button>
                )}
                {project?.resourceLink2 && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadGuideline(project.resourceLink2)}
                    className="bg-white border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Guideline 2
                  </Button>
                )}
                {project?.resourceLink3 && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadGuideline(project.resourceLink3)}
                    className="bg-white border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Guideline 3
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Rules & Checklist */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-brand-black mb-4">Rules & Confirmation</h3>
            
            <div className="space-y-3">
              {[
                { key: 'reviewed', label: "I have downloaded and reviewed the project guidelines." },
                { key: 'understood', label: "I understand the requirements and evaluation criteria." },
                { key: 'prepared', label: "I am ready to take the test independently." }
              ].map((item) => (
                <label key={item.key} className="flex items-start p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checks[item.key]}
                    onChange={(e) => setChecks({ ...checks, [item.key]: e.target.checked })}
                    className="w-5 h-5 mt-0.5 text-brand-black rounded border-gray-300 focus:ring-brand-black"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleStart} 
            disabled={!allChecked} 
            isLoading={loading}
            className="w-full text-lg py-4"
          >
            Continue to Practice Mode
          </Button>
        </div>
      </div>
    </Layout>
  );
};