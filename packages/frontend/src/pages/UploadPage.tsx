import React from "react";
import { ChangeEvent } from "react";
import invokeApig from "../lib/callAPI.ts";
const UploadPage: React.FC = () => {
  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

      const key = await uploadToS3(e);
      console.log("File uploaded to S3:", key);
  }

  return (
    <>
      <p>Please select file to upload</p>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf, .doc, .docx, .ppt, .pptx, .txt"
          name="file"
        />
        <button type="submit">Upload</button>
      </form>
    </>
  );
};


async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
  const formData = new FormData(e.target);

  const file = formData.get("file");

  if (!file) {
    return null;
  }
    
    const fileExtension = file.name.split(".").pop();
    console.log("File extension:", fileExtension);

  // @ts-ignore
    const fileType = file.type;
     console.log("fle type: ", file.type);

  //@ts-ignore
  const data = await invokeApig({
    path: "/upload",
    method: "GET",
    queryParams: {
      fileType: fileType,
      extension: fileExtension,
    },
  });
    
    console.log(data)

    const uploadUrl = data.uploadUrl;
    const key = data.key;

//   const { uploadUrl, key } = data;

  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }

  return key;
}

export default UploadPage;
