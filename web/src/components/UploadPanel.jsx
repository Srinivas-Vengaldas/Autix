import { useRef, useState } from "react";

function PersonIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

export default function UploadPanel({ image, onImage, consent, onConsent, canAnalyze, onAnalyze, busy, faceCanvas }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const pick = (file) => {
    if (file && file.type.startsWith("image/")) onImage(file);
  };

  return (
    <div className="panel upload">
      <div
        className={`dropzone${dragging ? " dragging" : ""}${image ? " has-image" : ""}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files[0]);
        }}
        role="button"
        tabIndex={0}
        aria-label={image ? "Choose a different photo" : "Choose a face photo"}
      >
        {image ? (
          <img src={image.url} alt="Your selected photo" />
        ) : (
          <div className="dropzone-text">
            <PersonIcon />
            <strong>Drop a face photo here</strong>
            <span>or click to browse · JPG, PNG or WebP</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(e) => {
          pick(e.target.files[0]);
          e.target.value = "";
        }}
      />

      <div className="crop">
        {faceCanvas ? (
          <canvas
            ref={(el) => {
              if (el) {
                el.width = faceCanvas.width;
                el.height = faceCanvas.height;
                el.getContext("2d").drawImage(faceCanvas, 0, 0);
              }
            }}
          />
        ) : (
          <div className="crop-empty" aria-hidden="true" />
        )}
        <p>Model input: head framed like the training photos, 224 × 224 px</p>
      </div>

      <label className="consent">
        <input type="checkbox" checked={consent} onChange={(e) => onConsent(e.target.checked)} />
        <span>I understand this is an educational demo, not a diagnostic tool, and I have the right to use this photo.</span>
      </label>

      <button className="primary" disabled={!canAnalyze} onClick={onAnalyze}>
        {busy ? "Analyzing…" : "Analyze with both models"}
      </button>
    </div>
  );
}
