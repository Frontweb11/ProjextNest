import React from "react";

const ResumePreview = ({ data, template = "classic" }) => {
  const {
    personalInfo,
    summary,
    education,
    experience,
    skills,
    projects,
    certifications,
  } = data;

  const themeColors = {
    classic: {
      primary: "#1E3A5F",
      text: "#111827",
      muted: "#6B7280",
    },
    modern: {
      primary: "#2563EB",
      text: "#0F172A",
      muted: "#64748B",
    },
    minimal: {
      primary: "#111827",
      text: "#111827",
      muted: "#9CA3AF",
    },
  };

  const theme = themeColors[template] || themeColors.classic;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden font-sans">
      {/* HEADER */}
      <div
        className="px-6 py-5 text-white"
        style={{ backgroundColor: theme.primary }}
      >
        <h1 className="text-2xl font-bold tracking-wide">
          {personalInfo?.fullName || "Your Name"}
        </h1>

        <div className="text-sm mt-1 opacity-90 flex flex-wrap gap-x-2 gap-y-1">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo?.location && <span>• {personalInfo.location}</span>}
        </div>

        <div className="text-xs mt-2 opacity-80 flex flex-wrap gap-x-3">
          {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo?.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-6 text-sm text-gray-900">
        {/* SUMMARY */}
        {summary && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: theme.primary }}
            >
              Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience?.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: theme.primary }}
            >
              Experience
            </h2>

            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-gray-900">
                    {exp.role} — {exp.company}
                  </div>

                  <div className="text-xs text-gray-500 mb-1">
                    {exp.duration}
                  </div>

                  {exp.responsibilities?.length > 0 && (
                    <ul className="list-disc ml-5 text-gray-700 space-y-1">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education?.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: theme.primary }}
            >
              Education
            </h2>

            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div className="font-semibold">{edu.school}</div>
                  <div className="text-gray-600 text-xs">
                    {edu.degree} {edu.field && `• ${edu.field}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {edu.startYear} - {edu.endYear}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {skills?.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: theme.primary }}
            >
              Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects?.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: theme.primary }}
            >
              Projects
            </h2>

            <div className="space-y-3">
              {projects.map((p, idx) => (
                <div key={idx}>
                  <div className="font-semibold">{p.name}</div>
                  <p className="text-gray-700 text-xs">{p.description}</p>
                  {p.techStack && (
                    <div className="text-xs text-gray-500 mt-1">
                      Tech: {p.techStack}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications?.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: theme.primary }}
            >
              Certifications
            </h2>

            <ul className="list-disc ml-5 text-gray-700 text-xs space-y-1">
              {certifications.map((c, idx) => (
                <li key={idx}>
                  {c.name} {c.issuer && `- ${c.issuer}`}{" "}
                  {c.year && `(${c.year})`}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* FOOTER */}
      <div className="text-xs text-center text-gray-400 border-t py-2">
        Live Preview • ATS-Friendly Resume Layout
      </div>
    </div>
  );
};

export default ResumePreview;
