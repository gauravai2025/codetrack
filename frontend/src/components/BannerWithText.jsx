const generateBannerWithText = (contestName, startDate) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      context.drawImage(img, 0, 0);
      context.font = "bold 35px 'Playwrite CU', sans-serif";
      context.fillStyle = "white";
      context.textAlign = "left";

      // Format date to readable format
      const formattedStartDate = new Date(startDate).toLocaleString();

      // Contest Name
      const paddingBottom = 80;
      const paddingLeft = 100;
      context.fillText(
        formattedStartDate,
        paddingLeft,
        canvas.height - paddingBottom
      );

      // Start Date
      const startPaddingLeft = 10;
      context.fillText(
        contestName,
        startPaddingLeft,
        canvas.height - paddingBottom - 60
      );

      const dataUrl = canvas.toDataURL("image/png");
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "default-banner.png", {
            type: "image/png",
          });
          resolve(file);
        })
        .catch(reject);
    };

    img.onerror = reject;
    img.src = "assets/banner.png"; // Adjust this path to your default image
  });
};

export default generateBannerWithText;
