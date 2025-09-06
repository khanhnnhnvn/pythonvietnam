
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  [key: string]: any; // Allow other props
}

const RichTextEditor = ({ value, onChange, placeholder, ...props }: RichTextEditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
  ];

  return (
    <div className="bg-background">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Nhập mô tả chi tiết...'}
        {...props}
      />
    </div>
  );
};

export default RichTextEditor;
