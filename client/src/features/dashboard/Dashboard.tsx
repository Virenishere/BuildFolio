import React, { useEffect, useState } from "react";
import { instance } from "@/lib/axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Resume from "../resume/Resume";

const Dashboard = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await instance.get("/api/resume");
        if (response.data.success) {
          setResume(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!resume) return <div className="p-4 text-red-500">No resume found.</div>;

  return (
    <div className="p-4 w-full border border-green-400">
      <h2 className="text-xl font-bold text-green-700 mb-4">Resume Details</h2>

      <p>
        <strong>Full Name:</strong> {resume.fullName}
      </p>
      <p>
        <strong>Email:</strong> {resume.email}
      </p>
      <p>
        <strong>Phone:</strong> {resume.phone}
      </p>
      <p>
        <strong>Address:</strong> {resume.address}
      </p>
      <p>
        <strong>Summary:</strong> {resume.summary}
      </p>

      <div className="mt-4">
        <h3 className="font-semibold">Education</h3>
        <ul className="list-disc ml-6">
          {resume.education.map((edu) => (
            <li key={edu._id}>
              <p>
                {edu.degree} at {edu.institution}
              </p>
              <p className="text-sm text-gray-500">
                {edu.startDate} - {edu.endDate}
              </p>
              <p>{edu.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Experience</h3>
        <ul className="list-disc ml-6">
          {resume.experience.map((exp) => (
            <li key={exp._id}>
              <p>
                {exp.title} at {exp.company}
              </p>
              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.endDate}
              </p>
              <p>{exp.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Languages</h3>
        <p>{resume.languages.join(", ")}</p>
      </div>

      <PDFDownloadLink
        document={<Resume data={resume} />} 
        fileName="Virender_Resume.pdf"
      >
        {({ loading }) => (loading ? "Loading PDF..." : "Download PDF")}
      </PDFDownloadLink>
    </div>
  );
};

export default Dashboard;
