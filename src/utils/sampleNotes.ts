import { UploadedImage } from '../types';

export function createSampleNotes(): Promise<UploadedImage[]> {
  return new Promise((resolve) => {
    const samples: UploadedImage[] = [];

    // Helper to generate a realistic notebook page on canvas
    const generateNotebookPage = (
      title: string,
      course: string,
      date: string,
      contentRenderer: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
    ): { dataUrl: string; width: number; height: number; size: number } => {
      const w = 1200;
      const h = 1600;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      // Off-white/subtle paper background
      ctx.fillStyle = '#FFFDF9';
      ctx.fillRect(0, 0, w, h);

      // Margin line (red/rose)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(140, 0);
      ctx.lineTo(140, h);
      ctx.stroke();

      // Ruled lines (soft blue)
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.6)';
      ctx.lineWidth = 1;
      const lineSpacing = 42;
      for (let y = 160; y < h - 80; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Notebook Header
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(title, 160, 110);

      ctx.fillStyle = '#64748B';
      ctx.font = '20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${course}  ·  ${date}`, 160, 145);

      // Custom page content
      contentRenderer(ctx, w, h);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      // Rough approximation of byte length from base64
      const approxBytes = Math.round((dataUrl.length * 3) / 4);

      return { dataUrl, width: w, height: h, size: approxBytes };
    };

    // Note 1: Computer Networks
    const note1 = generateNotebookPage(
      'Lecture 07: TCP Handshake & Flow Control',
      'CS 351: Computer Networks',
      'Oct 20, 2026',
      (ctx) => {
        ctx.fillStyle = '#1E293B';
        ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';

        ctx.fillText('1. The Three-Way Handshake Protocol:', 160, 230);

        // Sequence diagram box
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 2;
        ctx.strokeRect(200, 270, 780, 320);

        ctx.fillStyle = '#0284C7';
        ctx.font = 'bold 22px monospace';
        ctx.fillText('CLIENT', 240, 310);
        ctx.fillText('SERVER', 860, 310);

        // Client & Server timelines
        ctx.strokeStyle = '#94A3B8';
        ctx.beginPath();
        ctx.moveTo(280, 330);
        ctx.lineTo(280, 560);
        ctx.moveTo(900, 330);
        ctx.lineTo(900, 560);
        ctx.stroke();

        // SYN arrow
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(280, 380);
        ctx.lineTo(900, 420);
        ctx.stroke();
        ctx.fillStyle = '#1D4ED8';
        ctx.font = '600 18px monospace';
        ctx.fillText('1. SYN (seq = x)', 480, 390);

        // SYN-ACK arrow
        ctx.strokeStyle = '#059669';
        ctx.beginPath();
        ctx.moveTo(900, 460);
        ctx.lineTo(280, 500);
        ctx.stroke();
        ctx.fillStyle = '#059669';
        ctx.fillText('2. SYN-ACK (seq = y, ack = x + 1)', 420, 470);

        // ACK arrow
        ctx.strokeStyle = '#D97706';
        ctx.beginPath();
        ctx.moveTo(280, 540);
        ctx.lineTo(900, 570);
        ctx.stroke();
        ctx.fillStyle = '#B45309';
        ctx.fillText('3. ACK (ack = y + 1)', 490, 545);

        // Notes underneath
        ctx.fillStyle = '#334155';
        ctx.font = '22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('• Connection is established in full duplex mode.', 160, 680);
        ctx.fillText('• ISN (Initial Sequence Number) is dynamically pseudo-random.', 160, 725);
        ctx.fillText('• Protects against stale duplicate packets in slow networks.', 160, 770);
        ctx.fillText('• Congestion window (CWND) initialized to 10 MSS (RFC 6928).', 160, 815);
        ctx.fillText('• Fast Retransmit triggers on receiving 3 duplicate ACKs.', 160, 860);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('2. Sliding Window Buffer Management:', 160, 940);

        ctx.fillStyle = '#475569';
        ctx.font = '22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Effective Window = AdvertisedWindow - (LastByteSent - LastByteAcked)', 160, 990);
        ctx.fillText('Flow control ensures receiver buffer does not overflow.', 160, 1035);
        ctx.fillText('End of Section 4.2 · Assignment 3 Due Thursday 11:59 PM', 160, 1120);
      }
    );

    // Note 2: Calculus II
    const note2 = generateNotebookPage(
      'Problem Set 4: Integration by Parts & Series',
      'MATH 241: Calculus II',
      'Oct 21, 2026',
      (ctx) => {
        ctx.fillStyle = '#1E293B';
        ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';

        ctx.fillText('Problem 1: Evaluate ∫ x² · e^(3x) dx', 160, 230);

        ctx.fillStyle = '#475569';
        ctx.font = '22px monospace';
        ctx.fillText('Formula: ∫ u dv = u·v - ∫ v du', 200, 280);

        ctx.fillText('Step 1: Choose u = x²    =>  du = 2x dx', 200, 340);
        ctx.fillText('        dv = e^(3x) dx   =>   v = (1/3) e^(3x)', 200, 385);

        ctx.fillText('First pass:', 200, 445);
        ctx.fillText('= (1/3) x² e^(3x) - ∫ (2/3) x e^(3x) dx', 240, 490);

        ctx.fillText('Step 2: Apply parts again on remaining integral:', 200, 560);
        ctx.fillText('        u₁ = x           =>  du₁ = dx', 200, 605);
        ctx.fillText('        dv₁ = e^(3x) dx  =>   v₁ = (1/3) e^(3x)', 200, 650);

        ctx.fillText('Final Expansion:', 200, 720);
        ctx.fillStyle = '#0369A1';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('= (1/3) x² e^(3x) - (2/9) x e^(3x) + (2/27) e^(3x) + C', 240, 770);

        // Box around solution
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(220, 735, 780, 55);

        ctx.fillStyle = '#1E293B';
        ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Problem 2: Taylor Series Convergence Test:', 160, 870);
        ctx.fillStyle = '#475569';
        ctx.font = '22px monospace';
        ctx.fillText('Ratio Test: L = lim | a_{n+1} / a_n | as n -> ∞', 200, 920);
        ctx.fillText('If L < 1: Absolutely Convergent', 200, 965);
        ctx.fillText('If L > 1: Divergent', 200, 1010);
        ctx.fillText('Radius of Convergence R = 1 / L = 3.5 units.', 200, 1055);
      }
    );

    // Note 3: Chemistry Lab Report
    const note3 = generateNotebookPage(
      'Experiment 6: Acid-Base Titration Curve',
      'CHEM 120: General Chemistry Lab',
      'Oct 22, 2026',
      (ctx) => {
        ctx.fillStyle = '#1E293B';
        ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';

        ctx.fillText('Objective: Determine molarity of unknown HCl solution with 0.100 M NaOH', 160, 230);

        // Data table
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1;
        ctx.strokeRect(180, 270, 820, 200);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Trial', 220, 310);
        ctx.fillText('Initial NaOH (mL)', 340, 310);
        ctx.fillText('Final NaOH (mL)', 550, 310);
        ctx.fillText('Net Volume (mL)', 780, 310);

        // Row dividers
        ctx.beginPath();
        ctx.moveTo(180, 330);
        ctx.lineTo(1000, 330);
        ctx.moveTo(180, 380);
        ctx.lineTo(1000, 380);
        ctx.moveTo(180, 430);
        ctx.lineTo(1000, 430);
        ctx.stroke();

        ctx.font = '20px monospace';
        ctx.fillStyle = '#334155';
        ctx.fillText('1', 230, 360);
        ctx.fillText('0.00', 380, 360);
        ctx.fillText('24.35', 590, 360);
        ctx.fillText('24.35', 820, 360);

        ctx.fillText('2', 230, 410);
        ctx.fillText('24.35', 380, 410);
        ctx.fillText('48.60', 590, 410);
        ctx.fillText('24.25', 820, 410);

        ctx.fillText('3', 230, 460);
        ctx.fillText('0.50', 380, 460);
        ctx.fillText('24.80', 590, 460);
        ctx.fillText('24.30', 820, 460);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Calculations & Equivalence Point:', 160, 520);

        ctx.fillStyle = '#475569';
        ctx.font = '22px monospace';
        ctx.fillText('Average NaOH = (24.35 + 24.25 + 24.30) / 3 = 24.30 mL', 200, 570);
        ctx.fillText('Moles NaOH = 0.02430 L × 0.100 M = 2.430 × 10⁻³ mol', 200, 620);
        ctx.fillText('Molarity HCl = (2.430 × 10⁻³ mol) / 0.02500 L = 0.0972 M', 200, 670);

        ctx.fillStyle = '#059669';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Percent Error = |0.1000 - 0.0972| / 0.1000 × 100% = 2.80% (Acceptable)', 200, 730);

        ctx.fillStyle = '#64748B';
        ctx.font = 'italic 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Note: Indicator turned faint permanent pink at pH 8.4', 200, 780);
      }
    );

    samples.push({
      id: 'sample-note-1',
      name: 'CS351_TCP_Handshake_Notes.jpg',
      size: note1.size,
      type: 'image/jpeg',
      dataUrl: note1.dataUrl,
      width: note1.width,
      height: note1.height,
      rotation: 0,
    });

    samples.push({
      id: 'sample-note-2',
      name: 'MATH241_Calculus_ProblemSet4.jpg',
      size: note2.size,
      type: 'image/jpeg',
      dataUrl: note2.dataUrl,
      width: note2.width,
      height: note2.height,
      rotation: 0,
    });

    samples.push({
      id: 'sample-note-3',
      name: 'CHEM120_Titration_LabReport.jpg',
      size: note3.size,
      type: 'image/jpeg',
      dataUrl: note3.dataUrl,
      width: note3.width,
      height: note3.height,
      rotation: 0,
    });

    resolve(samples);
  });
}
