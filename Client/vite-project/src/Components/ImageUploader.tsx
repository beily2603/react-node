import React, { useState } from 'react';
import 'firebase/storage';

const ImageUploader: React.FC<any> = (props: any) => {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleMultipleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log(files);
    setSelectedFiles(files);
    props.handleMultipleFiles(files);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('in handleFileChange');
    const file = event.target.files && event.target.files[0];
    if (file) {
      console.log(file);
      setSelectedFile(file);
      props.handleFile(file);
    }
  };

  return (
    <div>
      <div>
        <p>בחר תמונה לתצוגה</p>
        <input type="file" accept='png, jpg, jepg' onChange={handleFileChange} />
        {selectedFile && (<p>נבחרה תמונה: {selectedFile.name}</p>)}
      </div>
      <div>
        <p>יש לך עוד תמונות להתרשמות?</p>
        <input
          type="file"
          multiple
          onChange={handleMultipleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;