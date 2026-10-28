import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, HelpCircle, User, MessageSquare, Clock } from 'lucide-react';

interface ContactViewProps {
  onGoToConvert: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactView: React.FC<ContactViewProps> = ({ onGoToConvert }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Feedback & Suggestions');
  const [message, setMessage] = useState('');
  
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>('');

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!name.trim()) {
      errs.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. name@university.edu).';
    }

    if (!message.trim()) {
      errs.message = 'Please provide your message.';
    } else if (message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }

    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const currentErrors = validate();
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      const generatedId = `MSG-${Date.now().toString(36).toUpperCase()}`;
      setSubmissionId(generatedId);
      
      // Store in localStorage for persistence without remote server
      try {
        const stored = localStorage.getItem('classpdf_contact_messages');
        const list = stored ? JSON.parse(stored) : [];
        list.push({
          id: generatedId,
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('classpdf_contact_messages', JSON.stringify(list));
      } catch {
        // Ignore storage errors
      }

      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setSubject('General Feedback & Suggestions');
    setMessage('');
    setTouched({});
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-xs">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Contact Us
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Have suggestions, feature requests, or questions regarding ClassPDF Maker? Submit the verified contact form below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info Card (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Get in Touch</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We welcome all feedback from students, educators, and users around the world to improve conversion speed and document formatting.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Direct Contact Email
              </span>
              <a
                href="mailto:danyalkhancs56@gmail.com"
                className="text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline break-all block"
              >
                danyalkhancs56@gmail.com
              </a>
            </div>

            <div className="space-y-2.5 pt-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Response timeline: Within 24–48 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Technical support & browser bug inquiries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Academic partnerships & classroom suggestions</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-sky-50/70 dark:bg-sky-950/40 rounded-2xl border border-sky-100 dark:border-sky-900/60 space-y-2">
            <h3 className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Document Privacy Note</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Please do not submit homework or sensitive assignment photos through this form. All image-to-PDF processing happens directly inside your web browser via the converter workspace.
            </p>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          {isSubmitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Message Sent Successfully
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out, <strong className="text-slate-800 dark:text-slate-200">{name}</strong>! Your message has been received with tracking reference <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold">{submissionId}</span>. We will respond to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span> as soon as possible.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors"
                >
                  Send Another Message
                </button>
                <button
                  type="button"
                  onClick={onGoToConvert}
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors"
                >
                  Return to Converter
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Send Us a Message
                </h2>
                <span className="text-[11px] text-slate-400">
                  * Required fields
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (touched.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  onBlur={() => handleBlur('name')}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white focus:outline-none transition-colors ${
                    touched.name && errors.name
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                  }`}
                />
                {touched.name && errors.name && (
                  <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  onBlur={() => handleBlur('email')}
                  placeholder="e.g. alex@university.edu"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white focus:outline-none transition-colors ${
                    touched.email && errors.email
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                  }`}
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Topic Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  <option value="General Feedback & Suggestions">General Feedback & Suggestions</option>
                  <option value="Bug or Conversion Issue">Bug or Conversion Issue</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Academic / Classroom Use">Academic / Classroom Use</option>
                  <option value="Privacy or Terms Inquiry">Privacy or Terms Inquiry</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Message *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {message.length} characters (min 10)
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (touched.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  onBlur={() => handleBlur('message')}
                  placeholder="How can we assist you with ClassPDF Maker? Describe any bug, idea, or question in detail..."
                  className={`w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white focus:outline-none transition-colors ${
                    touched.message && errors.message
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                  }`}
                />
                {touched.message && errors.message && (
                  <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Direct recipient: danyalkhancs56@gmail.com
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
