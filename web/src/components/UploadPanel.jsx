import { useRef, useState } from "react";

export default function UploadPanel({ image, onImage, consent, onConsent, canAnalyze, onAnalyze, busy, faceCanvas }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const pick = (file) => {
    if (file && file.type.startsWith("image/")) onImage(file);
  };

  return (
    <section className="panel upload" aria-label="Choose a photo">
      <h2>1. Choose a face photo</h2>
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
      >
        {image ? (
          <img src={image.url} alt="Your selected photo" />
        ) : (
          <div className="dropzone-text">
            <strong>Drop an image here</strong>
            <span>or click to browse (JPG or PNG)</span>
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

      <label className="consent">
        <input type="checkbox" checked={consent} onChange={(e) => onConsent(e.target.checked)} />
        <span>
          I understand this is an educational machine-learning demo, not a medical or diagnostic tool, and I have
          the right to use this photo.
        </span>
      </label>

      <button className="primary" disabled={!canAnalyze} onClick={onAnalyze}>
        {busy ? "Analyzing…" : "2. Analyze with both models"}
      </button>

      {faceCanvas && (
        <figure className="crop">
          <canvas
            ref={(el) => {
              if (el) {
                el.width = faceCanvas.width;
                el.height = faceCanvas.height;
                el.getContext("2d").drawImage(faceCanvas, 0, 0);
              }
            }}
          />
          <figcaption>What the models saw: the head framed like the training photos, scaled to 224 × 224.</figcaption>
        </figure>
      )}
    </section>
  );
}
