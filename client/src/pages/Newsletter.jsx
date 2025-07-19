import React, { useState, useEffect } from "react";

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [formData, setFormData] = useState({
    Title: "",
    Date: "",
    Link: "",
    Description: "",
  });

  useEffect(() => {
    setNewsletters([
      {
        _id: 1,
        Title: "June 2025 edition",
        Date: "6-6-2025",
        Link: "https://example.com/newsletter-june",
        Description: "Highlights of amlumni achievements  june 25",
      },
      {
        _id: 2,
        Title: "July 2025 edition",
        Date: "6-7-2025",
        Link: "https://example.com/newsletter-july",
        Description: "highlights of alumni achievements july 25",
      },
    ]);
  });
};
