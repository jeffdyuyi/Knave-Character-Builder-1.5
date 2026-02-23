import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

let dataBuffer = fs.readFileSync('knave2翻译文档.pdf');

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('knave2-text.txt', data.text);
    console.log("PDF text extracted successfully.");
}).catch(function (err) {
    console.error("Error extracting text: ", err);
});
