const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('knave2翻译文档.pdf');

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('knave2-text.txt', data.text);
    console.log("PDF text extracted successfully: " + data.text.substring(0, 100));
}).catch(function (err) {
    console.error("Error extracting text: ", err);
});
