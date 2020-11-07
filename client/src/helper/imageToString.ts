export default function imageToString(
  e: React.ChangeEvent<HTMLInputElement>,
  callback: (value: string) => void
) {
  if (e && e.currentTarget && e.currentTarget.files) {
    const [fileData] = e.currentTarget.files;
    if (e.currentTarget.validity && e.currentTarget.validity.valid) {
      const reader = new FileReader();
      reader.onload = (r) => {
        if (r.target && r.target.result && typeof r.target.result === "string")
          callback(r.target.result);
      };
      reader.readAsDataURL(fileData);
    }
  }
}
