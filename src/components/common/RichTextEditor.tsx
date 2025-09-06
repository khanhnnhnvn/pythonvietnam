
"use client";

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// ReactQuill should be loaded dynamically and only on the client side.
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const RichTextEditor = ({ value, onChange, ...props }: { value: string, onChange: (value: string) => void }) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'blockquote', 'code-block'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'blockquote', 'code-block'
    ];

    return (
        <div className="bg-background">
            <ReactQuill 
                theme="snow"
                modules={modules}
                formats={formats}
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    );
};

export default RichTextEditor;
