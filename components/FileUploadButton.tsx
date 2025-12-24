'use client';

import { useState } from 'react';

interface FileUploadButtonProps {
  onUpload: (file: File) => Promise<void>;
  fileName: string;
  accept: string;
}

export default function FileUploadButton({ onUpload, fileName, accept }: FileUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      await onUpload(file);
      setMessage({ type: 'success', text: `${fileName} 上传成功！` });
    } catch (error) {
      setMessage({ type: 'error', text: `上传失败: ${error instanceof Error ? error.message : '未知错误'}` });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="cursor-pointer">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <span className={`px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-dashed border-gray-300 hover:border-blue-400 inline-block text-center ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
          {uploading ? '上传中...' : `选择 ${fileName} 文件`}
        </span>
      </label>
      {message && (
        <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
