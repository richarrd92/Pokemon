var loaded = false;
export async function checkState() {
	if(document.readyState == "complete" || document.readyState == "interactive") {
		return await fetchExcelFile();
	}
	else {
		// Hopefully this never happens
		document.addEventListener("DOMContentLoaded", fetchExcelFile);
	}
}
async function fetchExcelFile() {
      // Fetch the file using getFile.php endpoint
	  try {
		  const response = await fetch('getFile.php');
	      if (!response.ok) {
			 throw new Error('Network response was not ok');
		  }
		  const data = await response.arrayBuffer();
		  const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          return await sendDataToServer(jsonData);
        }
        catch(error) {
          console.error('Error fetching the Excel file:', error);
        }
}
async function sendDataToServer(data) {
	return new Promise((resolve, reject) => {
		$.ajax({
		url: "upload.php",
		method: "POST",
		data: { data: JSON.stringify(data) },
		success: function (response) {
		  loaded = true;
		  resolve(response);
		},
		error: function (error) {
		  console.error("Error sending data to the server.");
		  console.error(error);
		},
	  });
  });
}