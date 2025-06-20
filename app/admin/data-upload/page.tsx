"use client";
import { useState } from "react";

export default function DataUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("");
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file to upload.");
      return;
    }
    setUploading(true);
    setStatus("");
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/data-upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setStatus("Upload complete!");
      } else {
        setStatus(data.error || "Upload failed.");
      }
    } catch (err) {
      setStatus("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-12">
      <h2 className="text-2xl font-bold mb-4">Admin: Upload Property Listings</h2>
      <p className="mb-4 text-gray-600">
        Upload your property listings as a <b>JSON</b> or <b>CSV</b> file. The file should include fields like title, description, price, location, bedrooms, bathrooms, square feet, property type, and images.
      </p>
      <input
        type="file"
        accept=".json,.csv,application/json,text/csv"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {status && <div className="mt-4 text-blue-700">{status}</div>}
      {result && (
        <div className="mt-6">
          <div className="font-semibold">Validation Results:</div>
          <div>Valid records: {result.validCount}</div>
          <div>Invalid records: {result.invalidCount}</div>
          {result.invalidRecords && result.invalidRecords.length > 0 && (
            <div className="mt-2 text-red-600">
              <div>Invalid Records:</div>
              <ul className="list-disc ml-6">
                {result.invalidRecords.map((rec: any, idx: number) => (
                  <li key={idx}>Row {rec.index + 1}: Missing fields: {rec.missing.join(", ")}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 