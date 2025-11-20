// 压缩图片质量
export const compressImage = (file: File, callback: (file: File) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          if (width > height) {
              if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
              }
          } else {
              if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
              }
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // const newFile = new File([canvas.toDataURL('image/jpeg', 0.8).split(',')[1]], file.name, { type: 'image/jpeg' });
          // callback(newFile);
          canvas.toBlob((blob) => {
              if (blob) {
                  const newFile = new File([blob], file.name, { type: 'image/jpeg' });
                  callback(newFile);
              }
          }, 'image/jpeg', 0.9); // 0.8 为压缩质量
      };
  };
};
