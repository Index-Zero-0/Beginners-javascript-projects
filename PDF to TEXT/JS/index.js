window.jsPDF = window.jspdf.jsPDF
//Convert pdf to text button
const pdf_txt = document.querySelector('#pdf_txt');
//Convert text to pdf button
const txt_pdf = document.querySelector('#txt_pdf');
const arrow = document.querySelector('.arrow');
const dropArea = document.querySelector('.drop_area');
const browseBtn = document.getElementById('browseBtn');
const inputFile = dropArea.querySelector('input');
// Change this to false if we want to convert text to pdf file otherwise it should be true
let pdfToText = true;
// Create a 'a' tag to be able to download the output txt file
let a = document.createElement('a');
let outputFileName = "";
// Later in the code this variable will be assingn to 'new jsPDF()'
let doc = null;



inputFile.addEventListener('change', async () => {
	// Get the first file that user selected
	const file = inputFile.files[0];
	await openFile(file);
});

browseBtn.addEventListener('click', () => {
	inputFile.click();
});

// Change the arrows direction to currect direction ( pdf to txt )
pdf_txt.addEventListener('click', () => {
	arrow.classList.remove('opposite');
	pdfToText = true;
});

// Change the arrows direction to currect direction ( txt to pdf)
txt_pdf.addEventListener('click', () => {
	arrow.classList.add('opposite');
	pdfToText = false;
});


dropArea.addEventListener("dragover", event => {
	event.preventDefault();
	dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
	dropArea.classList.remove("dragover");
});


document.addEventListener("drop", async event => {
	event.preventDefault();
	const file = event.dataTransfer.files[0];
	await openFile(file);
});

// Add event listeners to the download button
// Depending on user converted pdf => txt or txt => pdf the metheod for downloading will be different
document.getElementById('donwloadButton').addEventListener('click', event => {
	if (pdfToText) {
		a.download = outputFileName;
		a.click();
	}
	else {
		doc.save(outputFileName);
	}
});


// Open the input file
async function openFile(file) {
	dropArea.classList.remove("dragover");
	// determine whether user wants to convert pdf => txt or txt => pdf
	if (pdfToText) {
		saveToTextFile(file, file.type);
	}
	else {
		saveToPdfFile(file, file.type);
	}
}

// Convert txt to pdf
function saveToPdfFile(inputFile, contentType) {
	if (contentType != 'text/plain') {
		alert('Expected a txt file');
		return;
	}
	// We create a new instance of jsPDF each time user chose a new input file
	// Otherwise the text of new file and the previous file will mix together 
	doc = new jsPDF()
	const fileName = inputFile.name.split('.')[0] + '.pdf';
	const reader = new FileReader();

	outputFileName = fileName;
	document.getElementById('fileName').innerHTML = fileName;
	reader.readAsText(inputFile);
	reader.onload = () => {
		let result = doc.splitTextToSize(reader.result, 180);
		let pageHeight = doc.internal.pageSize.height;
		console.log(doc)
		let y = 15;
		result.forEach(item => {
			if (y + 10 > pageHeight) {
				y = 15;
				doc.addPage();
			}
			doc.text(item, 10, y);
			y += 7;
		})
	}
	document.querySelector('.Download').style.display = 'block';
}

// Convert pdf to txt
function saveToTextFile(inputFile, contentType) {
	if (contentType != 'application/pdf') {
		alert('Expected a pdf file');
		return;
	}
	const fileName = inputFile.name.split('.')[0] + '.txt';
	outputFileName = fileName;
	document.getElementById('fileName').innerHTML = fileName;
	const reader = new FileReader();
	reader.readAsDataURL(inputFile);
	reader.onload = async () => {
		const content = await pdfjsLib.getDocument(reader.result).promise;
		const textContent = await get_pdfsText(content);
		const file = new Blob([textContent], { type: 'text/plain' });
		a.href = URL.createObjectURL(file);
	}
	document.querySelector('.Download').style.display = 'block';

}

// Extract pdf's text
async function get_pdfsText(pdfContent) {
	let resultText = "";
	let page = null;
	let temp = "";
	const totalPageNum = pdfContent._pdfInfo.numPages;
	for (let i = 1; i <= totalPageNum; i++) {
		page = await pdfContent.getPage(i);
		temp = await page.getTextContent();
		temp.items.map((item) => {
			resultText += item.str;
		})
	}
	return resultText;
}

