const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generatePDF(results) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    const logoPath = path.join(__dirname, '..', 'src', 'images', 'logo.png');
    const logo = fs.readFileSync(logoPath);
    const imageWidth = 50;
    const centerX = (doc.page.width - imageWidth) / 2;

    doc.image(logo, { x: centerX, y: 20, width: imageWidth, height: imageWidth });

    doc.fontSize(12).text('Relatorio de Clientes', { align: 'center' });

    const verticalSpacing = 10;
    const borderSpacing = 30;
    const cellWidth = 150;
    const cellHeight = 35;

    let yPosition = doc.y;

    results.forEach(result => {
      const xPosition = (doc.page.width - cellWidth * 4) / 2;

      for (let i = 0; i < 4; i++) {
        const xPos = xPosition + i * cellWidth;

        if (i > 0) {
          doc.moveTo(xPos, yPosition).lineTo(xPos, yPosition + cellHeight).stroke();
        }

        let cellText;
        if (i === 0) {
          // Diminuir a célula de ID
          cellText = result.id.toString().substring(0, 8);
        } else if (i === 3) {
          // Aumentar a célula de email
          cellText = result.email + ' '.repeat(100);
        } else {
          cellText = i === 1 ? result.nome : result.cpf;
        }

        doc.rect(xPos, yPosition, cellWidth, cellHeight).stroke();
        doc.text(cellText, xPos + 5, yPosition + 10, { width: cellWidth - 10, align: 'left' });
      }

      yPosition += cellHeight + verticalSpacing;
    });

    const pdfBuffer = [];

    doc.on('data', chunk => {
      pdfBuffer.push(chunk);
    });

    doc.on('end', () => {
      const finalPDF = Buffer.concat(pdfBuffer);

      const outputPath = __dirname + '/output.pdf';
      fs.writeFileSync(outputPath, finalPDF);
      console.log('PDF gerado com sucesso:', outputPath);

      resolve(outputPath);
    });

    doc.end();
  });
}

module.exports = { generatePDF };
