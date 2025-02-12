import React, { useState } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  accept?: string; // File types allowed (e.g., "image/*" or ".pdf")
}

{/* A reusable input field component */}
export default function InputField({ label, name, type = "text", required, accept }: InputFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (type === "file" && accept?.includes("image")) {
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl); // Show image preview
      } else {
        setPreview(file.name); // Show file name for non-image uploads
      }
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        required={required}
        accept={accept}
        className="w-full p-2 border rounded"
        onChange={type === "file" ? handleFileChange : undefined}
      />

      {/* Preview for images */}
      {preview && accept?.includes("image") && (
        <div className="mt-2">
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover border rounded-lg" />
        </div>
      )}

      {/* Show file name for non-image files */}
      {preview && !accept?.includes("image") && (
        <p className="text-gray-600 mt-1">Selected file: {preview}</p>
      )}
    </div>
  );
}
