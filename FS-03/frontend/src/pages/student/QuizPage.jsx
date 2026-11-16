import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/quizzes/course/${courseId}`);
        setQuiz(res.data.quiz);
        setQuestions(res.data.questions);
        setTimeRemaining((res.data.quiz.timeLimitMinutes || 15) * 60);
      } catch (err) {
        setError(err.message || 'Failed to load quiz for this course.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId]);

  // Timer Countdown
  useEffect(() => {
    if (!quiz || result) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz, result]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (result) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const answersPayload = questions.map((q) => ({
        questionId: q._id,
        selectedOptionIndex: selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : -1
      }));

      const res = await api.post(`/api/quizzes/${quiz._id}/submit`, {
        courseId,
        answers: answersPayload,
        timeSpentSeconds: (quiz.timeLimitMinutes * 60) - timeRemaining
      });

      setResult(res.data);

      if (res.data.passed) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
      }
    } catch (err) {
      alert('Error submitting quiz: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="card-saas p-10 max-w-lg mx-auto text-center space-y-4 my-12 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Quiz Unavailable</h2>
        <p className="text-xs text-slate-500">{error || 'No active quiz assigned to this course yet.'}</p>
        <button onClick={() => navigate(-1)} className="btn-secondary text-xs">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Course
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" />
          Exit Quiz
        </button>

        {!result && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white font-mono text-xs font-bold shadow-md">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Time Left: {formatTimer(timeRemaining)}
          </div>
        )}
      </div>

      {/* Quiz Header Card */}
      <div className="card-saas p-6 bg-white border border-slate-200 rounded-3xl space-y-2">
        <span className="badge-pill bg-blue-50 text-blue-600 border border-blue-100">
          Assessment & Verification
        </span>
        <h1 className="text-xl font-extrabold text-slate-900">{quiz.title}</h1>
        <p className="text-xs text-slate-500 leading-relaxed">{quiz.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100 font-medium">
          <span>{questions.length} Multiple Choice Questions</span>
          <span>Passing Score: {quiz.passingScorePercentage || 70}%</span>
        </div>
      </div>

      {/* Quiz Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIdx) => (
          <div key={q._id} className="card-saas p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-bold text-sm text-slate-900">
                <span className="text-blue-600 mr-2">{qIdx + 1}.</span>
                {q.questionText}
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                {q.points || 10} pts
              </span>
            </div>

            {/* Options */}
            <div className="space-y-2 pt-2">
              {q.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[q._id] === oIdx;

                return (
                  <label
                    key={oIdx}
                    onClick={() => handleSelectOption(q._id, oIdx)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question_${q._id}`}
                      checked={isSelected}
                      onChange={() => handleSelectOption(q._id, oIdx)}
                      className="accent-blue-600 w-4 h-4"
                      disabled={Boolean(result)}
                    />
                    <span>{opt.text}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Result Card or Submit Button */}
      {result ? (
        <div className={`card-saas p-8 rounded-3xl border text-center space-y-4 ${result.passed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'}`}>
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-white shadow-md">
            {result.passed ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            ) : (
              <XCircle className="w-10 h-10 text-rose-500" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {result.passed ? 'Assessment Passed! 🎉' : 'Assessment Incomplete'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              You scored <strong className="text-slate-900 text-sm font-bold">{result.score} / {result.totalPossibleScore} points ({result.percentage}%)</strong>.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link to={`/learn/${courseId}`} className="btn-secondary text-xs">
              Return to Course
            </Link>
            {result.passed && (
              <Link to="/certificates" className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700">
                View Certificate
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary text-sm py-3 px-8 rounded-xl shadow-lg shadow-blue-500/20"
          >
            {submitting ? 'Submitting & Evaluating...' : 'Submit Assessment'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
