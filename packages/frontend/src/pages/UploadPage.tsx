// import React from "react";
// import { ChangeEvent } from "react";
// import invokeApig from "../lib/callAPI.ts";
// const UploadPage: React.FC = () => {
//   async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
//     e.preventDefault();
//       const key = await uploadToS3(e);
//       console.log("File uploaded to S3:", key);
//   }

//   return (
//     <div>
//       <h1>Upload Material</h1>
//       <p>Please select file to upload</p>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="file"
//           accept=".pdf, .doc, .docx, .ppt, .pptx, .txt"
//           name="file"
//         />
//         <button type="submit">Upload</button>
//       </form>
//     </div>
//   );
// };


// async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
//   const formData = new FormData(e.target);

//   const file = formData.get("file");

//   if (!file) {
//     return null;
//   }
    
//     const fileExtension = file.name.split(".").pop();
//     console.log("File extension:", fileExtension);

//   // @ts-ignore
//     const fileType = file.type;
//      console.log("fle type: ", file.type);

//   //@ts-ignore
//   const data = await invokeApig({
//     path: "/upload",
//     method: "GET",
//     queryParams: {
//       fileType: fileType,
//       extension: fileExtension,
//     },
//   });
    
//     console.log(data)

//     const uploadUrl = data.uploadUrl;
//     const key = data.key;

// //   const { uploadUrl, key } = data;

//   try {
//     const response = await fetch(uploadUrl, {
//       method: "PUT",
//       body: file,
//     });

//     if (!response.ok) {
//       throw new Error("Failed to upload file");
//     }
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return null;
//   }

//   return key;
// }

// export default UploadPage;

import React, { useState, ChangeEvent } from "react";
import invokeApig from "../lib/callAPI.ts";
import "../styles/UploadPage.css";

const UploadPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSingleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMessage(null);

    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleFolderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMessage(null);

    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeFile = (fileIndex: number) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex)
    );
  };

  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (selectedFiles.length === 0) {
      setError("Please select files or a folder to upload.");
      return;
    }

    try {
      setIsLoading(true);

      // Upload each file
      for (const file of selectedFiles) {
        await uploadToS3(file);
        console.log("File uploaded to S3:", file.name);
      }

      setSuccessMessage("All files have been uploaded successfully!");
      setSelectedFiles([]); // Clear files after upload
    } catch (uploadError) {
      setError("Something went wrong during upload. Please try again.");
      console.error(uploadError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="upload-container">
      <h1 className="title">Upload Course Material</h1>
      <p className="subtitle">Select files or folder to upload</p>
      <form onSubmit={handleSubmit} className="upload-form">
        <label htmlFor="singleFileInput" className="file-label">
          <input
            type="file"
            id="singleFileInput"
            name="singleFile"
            accept=".pdf, .doc, .docx, .ppt, .pptx, .txt"
            className="file-input"
            multiple
            onChange={handleSingleFileChange}
          />
          Choose a file
        </label>
        <label htmlFor="folderInput" className="file-label">
          <input
            type="file"
            id="folderInput"
            name="folder"
            className="file-input"
            onChange={handleFolderChange}
            multiple
            webkitdirectory="true"
          />
          Choose a folder
        </label>
        {selectedFiles.length > 0 && (
          <div className="file-list-container">
            <div className="file-list">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <button
                    type="button"
                    className="remove-file-button"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          type="submit"
          className={`upload-button ${isLoading ? "loading" : ""}`}
          disabled={selectedFiles.length === 0 || isLoading}
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {isLoading && <div className="loading-spinner"></div>}
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

async function uploadToS3(file: File) {
  const fileExtension = file.name.split(".").pop();
  const fileType = file.type;

  const data = await invokeApig({
    path: "/uploadFiles",
    method: "GET",
    queryParams: {
      fileType: fileType,
      extension: fileExtension,
    },
  });

  const uploadUrl = data.uploadUrl;
  const key = data.key;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${file.name}`);
  }

  return key;
}

export default UploadPage;




