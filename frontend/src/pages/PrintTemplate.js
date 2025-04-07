import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import styles from "../css/PrintTemplate.module.css";

const PrintTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { template } = location.state || {};

  useEffect(() => {
    const handlePopState = () => {
      navigate("/admindashboard", { replace: true });
    };

    window.history.pushState(null, null, location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, location.pathname]);

  const generatePDF = () => {
    if (!template) {
      alert("No template data available.");
      return;
    }

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(20);
    doc.text(`${template.templateName} Form`, 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.line(10, 18, 200, 18);

    y += 10;

    doc.setFontSize(14);
    doc.text(`Template Name: ${template.templateName}`, 15, y);
    y += 8;
    doc.text(`Type: ${template.type}`, 15, y);
    y += 8;
    doc.text(
      `Duplicate Submission Allowed: ${template.duplicateSubmissionAllowed ? "Yes" : "No"}`,
      15,
      y
    );
    y += 12;

    template.questions?.forEach((q) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.text(q.question, 15, y);
      y += 5;
      doc.setFontSize(12);

      if (q.note?.trim().length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(100); 
        doc.text(`Note: ${q.note}`, 15, y);
        doc.setTextColor(0); 
        y += 5;
      }

      if (q.answerType === "checkbox") {
        doc.text("(Multiple choice)", 15, y);
        y += 5;
        q.options?.forEach((opt) => {
          doc.rect(15, y, 5, 5);
          doc.text(opt, 25, y + 4);
          y += 7;
        });
      } else if (q.answerType === "radio") {
        doc.text("(Single choice)", 15, y);
        y += 5;
        q.options?.forEach((opt) => {
          doc.circle(18, y + 2, 2);
          doc.text(opt, 25, y + 4);
          y += 7;
        });
      } else {
        let ruleLines = 1;
        if (q.answerType === "text") ruleLines = 1;
        if (q.answerType === "textarea") ruleLines = 5;
        if (q.answerType === "text-editor") ruleLines = 10;

        for (let i = 0; i < ruleLines; i++) {
          doc.line(15, y, 195, y);
          y += 8;
        }
        y += 5;
      }
    });

    y += 15;

    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.text("Authorized Signatures", 15, y);
    y += 10;
    doc.line(20, y, 80, y);
    doc.text("Signature 1", 30, y + 5);
    doc.line(120, y, 180, y);
    doc.text("Signature 2", 130, y + 5);
    y += 15;

    doc.setFontSize(10);
    doc.line(10, 285, 200, 285);
    doc.text(
      "Note: You can officially use this auto-generated PDF version when system failure.",
      15,
      290
    );

    doc.save(`${template.templateName}.pdf`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Print Template</h2>
      <div className={styles.templateDetails}>
        <p>
          <strong>Template Name:</strong> {template?.templateName || "N/A"}
        </p>
        <p>
          <strong>Type:</strong> {template?.type || "N/A"}
        </p>
        <p>
          <strong>Duplicate Submission Allowed:</strong>{" "}
          {template?.duplicateSubmissionAllowed ? "Yes" : "No"}
        </p>

        <h3>Questions:</h3>
        {template?.questions?.map((q, index) => (
          <div key={index} className={styles.questionBox}>
            <p>
              <strong>Q:</strong> {q.question}
            </p>
            <p>
              <strong>Type:</strong> {q.answerType}
            </p>
            {q.note && <p><strong>Note:</strong> {q.note}</p>}
            {q.options?.length > 0 ? (
              <p>
                <strong>Options:</strong> {q.options.join(", ")}
              </p>
            ) : (
              <p>
                <strong>Rules:</strong>{" "}
                {q.answerType === "text"
                  ? "1 rule"
                  : q.answerType === "textarea"
                  ? "5 rules"
                  : q.answerType === "text-editor"
                  ? "10 rules"
                  : q.answerType === "checkbox"
                  ? "Multiple inputs allowed"
                  : q.answerType === "radio"
                  ? "Only one input allowed"
                  : "N/A"}
              </p>
            )}
          </div>
        ))}
      </div>

      <button onClick={generatePDF} className={styles.downloadBtn}>
        Download PDF
      </button>
      <button onClick={() => navigate("/")} className={styles.homeBtn}>
        Go Home
      </button>
      <button
        onClick={() => navigate("/create-letter-template")}
        className={styles.newTemplateBtn}
      >
        Create Another Template
      </button>
    </div>
  );
};

export default PrintTemplate;