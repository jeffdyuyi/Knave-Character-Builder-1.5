import fitz  # PyMuPDF
import sys

def parse_pdf(file_path, output_path):
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
        print("PDF extracted successfully!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    parse_pdf("knave2翻译文档.pdf", "knave2-text.txt")
