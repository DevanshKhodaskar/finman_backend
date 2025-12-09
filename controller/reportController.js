// controller/reportController.js
import PDFDocument from 'pdfkit';
import QUERY from '../models/query.js';

export const generateReport = async (req, res) => {
  try {
    const { phone, start, end } = req.body;
    if (!phone) return res.status(400).json({ error: 'phone required' });

    const q = { phone_number: phone };
    if (start || end) q.time = {};
    if (start) q.time.$gte = new Date(start);
    if (end) q.time.$lte = new Date(end);

    const rows = await QUERY.find(q).sort({ time: -1 }).lean();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=finman_report_${phone}.pdf`);

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    doc.fontSize(18).text('FinMan - Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Phone: ${phone}`);
    doc.text(`Range: ${start || 'start'} - ${end || 'now'}`);
    doc.moveDown();

    // header row
    doc.fontSize(10).text('Time', 50, doc.y);
    doc.text('Name', 170, doc.y);
    doc.text('Category', 320, doc.y);
    doc.text('Price', 430, doc.y);
    doc.text('Income?', 490, doc.y);
    doc.moveDown();

    rows.forEach(r => {
      doc.fontSize(9);
      doc.text(new Date(r.time).toLocaleString(), 50, doc.y);
      doc.text(r.name || '', 170, doc.y, { width: 140 });
      doc.text(r.category || '', 320, doc.y, { width: 100 });
      doc.text(String(r.price), 430, doc.y);
      doc.text(r.is_income ? 'Yes' : 'No', 490, doc.y);
      doc.moveDown();
      if (doc.y > doc.page.height - 60) doc.addPage();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};
