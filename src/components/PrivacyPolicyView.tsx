import React from 'react';
import { ShieldCheck, Lock, EyeOff, Cookie, ServerOff, Mail, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-200/80 dark:border-[#232B45]">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-400 border border-indigo-200/50 dark:border-indigo-800/40 flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A7B0C5] max-w-xl mx-auto">
          Effective Date: October 2026 · ClassPDF Maker
        </p>
      </div>

      {/* Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171D32] border border-slate-200/80 dark:border-[#232B45] space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold text-xs">
            <ServerOff className="w-4 h-4 shrink-0" />
            <span>100% Local In-Browser Processing</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
            Images and photos are converted to PDF locally in your web browser. No photos or document contents are uploaded to remote servers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#171D32] border border-slate-200/80 dark:border-[#232B45] space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold text-xs">
            <EyeOff className="w-4 h-4 shrink-0" />
            <span>No Account Required</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
            Freely accessible to all visitors without user registration, login credentials, passwords, or personal identity tracking.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#171D32] border border-slate-200/80 dark:border-[#232B45] space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold text-xs">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Volatile Memory Isolation</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
            Image files exist strictly in your browser's active memory buffer and are automatically purged when you refresh or close the tab.
          </p>
        </div>
      </div>

      {/* Main Policy Content */}
      <div className="bg-white dark:bg-[#171D32] rounded-3xl border border-slate-200/80 dark:border-[#232B45] p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-[#A7B0C5] leading-relaxed shadow-xs">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
            1. Overview &amp; Commitment to Privacy
          </h2>
          <p>
            ClassPDF Maker ("we", "our", or "the application") is committed to protecting the privacy of students, educators, and the public. Unlike conventional cloud converters that upload your documents to third-party file servers, ClassPDF Maker executes image processing and PDF compilation <strong>entirely on the client side</strong> within your web browser using HTML5 Canvas, the JavaScript File API, and client-side PDF libraries (jsPDF).
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. How Document Processing Works (Image to PDF, PDF to Word, Word to PDF, Merge &amp; Compress PDF)
          </h2>
          <p>
            When you select or drop images, Word documents, or PDF files (such as notebook pictures, assignment pages, lecture slides, study sheets, Word files, or documents to merge and compress) into ClassPDF Maker:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>Local Ingestion:</strong> Files are read into your device's browser memory via the standard HTML5 File API and client-side web technologies.</li>
            <li><strong>Local Transformations, Merging &amp; Compression:</strong> Page rotations, crops, brightness adjustments, PDF page merging, image downsampling, stream compaction, and DOCX conversion are executed directly using your computer or mobile device's CPU and memory.</li>
            <li><strong>Client-Side Blob Compilation:</strong> The finished PDF or Word document is compiled directly in browser memory as a binary Blob and handed to your browser's native download manager.</li>
            <li><strong>No Remote File Transmission:</strong> At no point during conversion, merging, or compression are your files, document filenames, or assignment texts transmitted over the internet to remote servers or third-party cloud storage buckets.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Information We Collect
          </h2>
          <p>
            Because we do not mandate accounts or sign-in, we do not collect usernames, passwords, physical addresses, or student ID records on our servers. We interact solely with data stored locally on your device:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>Browser Local Storage:</strong> Used strictly to save non-sensitive UI settings on your device (e.g., light or dark theme preference, default page size selection, an optional show/hide toggle for ad placeholders, and a local history list of recent file titles). You can clear this saved history at any time using the "Clear History" button in the My Files view or through your browser settings.</li>
            <li><strong>Contact Form Inquiries:</strong> If you voluntarily submit a message through our Contact Us form, the information you provide (name, email address, topic, and message text) is retained solely to review and respond to your inquiry.</li>
            <li><strong>Standard Web Infrastructure Logs:</strong> Like virtually all websites hosted on cloud infrastructure, hosting providers may record anonymous technical connection metadata (e.g., IP address, browser user-agent, request timestamp, and HTTP status code) strictly for network security, diagnostics, and DDoS prevention. These logs are never correlated with your personal documents.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Cookie className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Cookies, Analytics & Advertising Disclosures
            </h2>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Current Cookie & Analytics Status:</strong> ClassPDF Maker currently does <em>NOT</em> deploy any first-party tracking cookies or web analytics trackers (such as Google Analytics or marketing pixels). We do not track your activity across other websites.
            </p>
            <p>
              <strong>Future Advertising Disclosures (Google AdSense):</strong> To support free public access without paywalls, ClassPDF Maker includes clearly designated, responsive placeholder containers reserved for future approved advertising networks, including Google AdSense. No ads are currently active or approved, and no ad scripts are currently collecting your data.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <p className="font-semibold text-slate-900 dark:text-white">
              When Google AdSense is activated in the future, the following third-party advertising policies will apply:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites on the Internet.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to this site and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising at any time by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline">Google Ads Settings</a>.</li>
              <li>Users may also opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline">www.aboutads.info</a>.</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Data Retention & Deletion
          </h2>
          <p>
            Because your files are never transmitted to our backend database, there is no remote document storage or retention period. Temporary image buffers are automatically released from device RAM when you reset the workspace or close the browser tab. You have complete autonomy over your local browser cache.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            6. Contacting the Site Maintainer
          </h2>
          <p>
            If you have questions, feedback, or concerns regarding this Privacy Policy or document processing, please contact the site maintainer:
          </p>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
            Direct Contact Email: <a href="mailto:danyalkhancs56@gmail.com" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">danyalkhancs56@gmail.com</a>
          </div>
        </section>
      </div>
    </div>
  );
};
