import React from 'react';
import { Scale, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-xs">
          <Scale className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Last Updated: October 2026 · ClassPDF Maker
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using ClassPDF Maker ("the service", "we", "our"), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue use of the website immediately. This web application is publicly accessible without mandatory authentication or membership fees.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Acceptable Use Policy
          </h2>
          <p>
            ClassPDF Maker is designed to assist students, teachers, researchers, and general visitors in assembling homework assignments, handwritten notes, whiteboard photos, receipts, and personal documentation into unified PDF files. You agree to use the service only for lawful purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>You must not use the tool to convert, assemble, or distribute materials that you do not have the right or authorization to possess.</li>
            <li>You must not use the application to process unlawful, defamatory, harassing, or fraudulent materials.</li>
            <li>You must not attempt to circumvent client-side security boundaries, inject malicious scripts, or reverse engineer restricted hosting infrastructure.</li>
          </ul>
        </section>

        {/* Section 3 - Required: File limitations */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. File Limitations & Technical Constraints
            </h2>
          </div>
          <p>
            Because ClassPDF Maker operates client-side inside your browser rather than relying on server clusters, document processing capacity is governed by your local hardware capabilities:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white block mb-1">Supported File Formats</span>
              <p className="text-xs text-slate-500">Standard web image formats (JPG/JPEG, PNG, WEBP, HEIC) for Image-to-PDF; unlocked PDF files (up to 50MB per file) for PDF-to-Word and PDF Merging.</p>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white block mb-1">Recommended Batch Size</span>
              <p className="text-xs text-slate-500">We recommend batches of up to 50–100 photos or approximately 50MB–100MB per document for smooth compilation on most devices.</p>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white block mb-1">Browser Memory (RAM)</span>
              <p className="text-xs text-slate-500">Extremely high-resolution photo batches may consume significant device RAM. If a tab reloads, reduce image count or select Standard Quality.</p>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white block mb-1">Canvas Resolution Limits</span>
              <p className="text-xs text-slate-500">Mobile browser engines impose maximum HTML5 canvas dimensions (typically 4096×4096 px). Oversized photos are automatically scaled to fit.</p>
            </div>
          </div>
        </section>

        {/* Section 4 - Required: Service availability */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Service Availability & Maintenance
            </h2>
          </div>
          <p>
            ClassPDF Maker is provided as a free public utility on an "AS IS" and "AS AVAILABLE" basis without warranties of uninterrupted uptime or guaranteed Service Level Agreements (SLAs).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>No Cloud Document Storage:</strong> Because we do not store your documents remotely, we cannot restore or recover files if you close your tab or clear your browser cache prior to downloading your PDF.</li>
            <li><strong>Backup Advice:</strong> Users are strongly advised to retain their original source photos on their phone or computer before starting conversion.</li>
            <li><strong>Updates & Modifications:</strong> We reserve the right to modify, enhance, pause, or update features of the service at any time without notice.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. User Content & Intellectual Property
          </h2>
          <p>
            You retain 100% ownership, copyright, and intellectual property rights in all photographs, assignment answers, diagrams, and PDF files you process with ClassPDF Maker. We do not claim any copyright, license, or distribution rights over your content.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            6. Disclaimer of Warranties & Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, ClassPDF Maker and its maintainers disclaim all warranties, express or implied, including fitness for a particular purpose or non-infringement. Under no circumstances shall the developer, maintainer, or hosting provider be held liable for direct, indirect, incidental, or consequential damages resulting from missed assignment submission deadlines, academic discrepancies, or device memory errors.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            7. Contact Information
          </h2>
          <p>
            For questions or legal inquiries regarding these Terms of Service, please reach out via our Contact form or email:
          </p>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
            Direct Contact Email: <a href="mailto:danyalkhancs56@gmail.com" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">danyalkhancs56@gmail.com</a>
          </div>
        </section>
      </div>
    </div>
  );
};
