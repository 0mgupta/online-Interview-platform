import React from "react";

const BentoCard = ({ icon, title, desc, children, classname = "", featured = false }) => {
  return (
    <div
      className={`relative flex flex-col p-9 h-full transition-colors duration-200 hover:bg-fog ${classname}`}
      style={{
        background: "#efefef",
        borderRadius: featured ? "6px 0px 6px 6px" : "8px",
      }}
    >
      <span
        className="w-10 h-10 flex items-center justify-center mb-5 shrink-0"
        style={{
          background: "#ffffff",
          border: "1px solid #e8e8e8",
          borderRadius: "8px",
        }}
      >
        {icon}
      </span>
      <h3
        className="text-lg mb-2"
        style={{
          fontFamily: "var(--font-polysans)",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: "#202020",
        }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "#4d4d4d" }}>
        {desc}
      </p>
      {children}
    </div>
  );
};

export default BentoCard;