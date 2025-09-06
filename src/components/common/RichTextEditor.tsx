
"use client";

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useMemo } from 'react';

const RichTextEditor = ({ ...props }) => {
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
    
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link'
    ];

    return (
        <ReactQuill 
            theme="snow"
            modules={modules}
            formats={formats}
            {...props}
        />
    );
};

export default RichTextEditor;
