import React, { useState } from "react";
import BannerWithText from "./BannerWithText";

const CreateContestForm = () => {
  const [contestName, setContestName] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the contest details along with the bannerImage
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Contest Name:</label>
        <input
          type="text"
          value={contestName}
          onChange={(e) => setContestName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Contest Banner:</label>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setBannerImage(reader.result);
              reader.readAsDataURL(file);
            } else {
              setBannerImage(""); // Reset if no file is selected
            }
          }}
        />
      </div>
      {!bannerImage && contestName && (
        <BannerWithText
          contestName={contestName}
          setBannerImage={setBannerImage}
        />
      )}
      <button type="submit">Create Contest</button>
    </form>
  );
};

export default CreateContestForm;
