import React, { useState } from 'react';
import { Shield, KeyRound, User, BookOpen, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { StudentAuthSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: StudentAuthSession;
  onSaveSession: (updated: StudentAuthSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  session,
  onSaveSession,
}) => {
  const [studentName, setStudentName] = useState(session.studentName || '');
  const [studentId, setStudentId] = useState(session.studentId || '');
  const [classCode, setClassCode] = useState(session.classCode || '');
  const [accessMode, setAccessMode] = useState<'private' | 'shared'>(session.accessMode || 'private');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentAuthSession = {
      isAuthorized: true,
      studentName: studentName.trim() || 'University Student',
      studentId: studentId.trim(),
      classCode: classCode.trim() || 'STUDENT-GROUP',
      accessMode,
      authorizedAt: new Date().toISOString(),
    };
    onSaveSession(updated);
    setFeedbackMsg('Authorized successfully! Your session is active.');
    setTimeout(() => {
      setFeedbackMsg(null);
      onClose();
    }, 900);
  };

  const handleQuickDemoPass = () => {
    const updated: StudentAuthSession = {
      isAuthorized: true,
      studentName: 'Danyal Khan',
      studentId: 'CS56-9182',
      classCode: 'CS351-NETWORKS',
      accessMode: 'private',
      authorizedAt: new Date().toISOString(),
    };
    setStudentName(updated.studentName);
    setStudentId(updated.studentId);
    setClassCode(updated.classCode);
    onSaveSession(updated);
    setFeedbackMsg('Classmate Pass verified!');
    setTimeout(() => {
      setFeedbackMsg(null);
      onClose();
    }, 800);
  };

  const handleResetSession = () => {
    const reset: StudentAuthSession = {
      isAuthorized: false,
      studentName: '',
      studentId: '',
      classCode: '',
      accessMode: 'private',
    };
    onSaveSession(reset);
    setStudentName('');
    setStudentId('');
    setClassCode('');
    setFeedbackMsg('Session locked and credentials cleared.');
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0 shadow-2xs">
              <img
                src="/assets/aistudio/website_logo_fdd01625.png"
                alt="ClassPDF Maker Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Academic Header Stamp (Optional)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Public access is open to everyone. Setting student details is strictly optional.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Public Access Banner */}
        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span><strong>Public Service:</strong> No login or password is ever required. Conversion runs 100% locally in your browser.</span>
        </div>

        {feedbackMsg && (
          <div className="mt-3 p-3 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuthorize} className="mt-5 space-y-4">
          {/* Access Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Privacy Mode Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccessMode('private')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  accessMode === 'private'
                    ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/50 text-sky-900 dark:text-sky-100 ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-sky-600" />
                  Standard Private
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  100% browser memory. Automatic wipe upon leaving.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccessMode('shared')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  accessMode === 'shared'
                    ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/50 text-sky-900 dark:text-sky-100 ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                  Academic Coversheet
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Appends student name and course ID to assignment PDFs.
                </div>
              </button>
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Student Name (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Danyal Khan"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Student ID / Roll No
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. CS56-9182"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Class Authorization Passcode / Course Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="e.g. CS351 or CAMPUS2026"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Used to stamp assignment coversheets or verify authorized classmates.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handleQuickDemoPass}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Fill Classmate Demo Pass</span>
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              {session.isAuthorized && (
                <button
                  type="button"
                  onClick={handleResetSession}
                  className="px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                >
                  Clear Auth
                </button>
              )}
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-lg shadow-xs shadow-sky-600/30 transition-colors"
              >
                Save & Authorize
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
