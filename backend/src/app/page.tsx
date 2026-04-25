"use client";

import { type ChangeEvent, type ClipboardEvent, useMemo, useState } from "react";

type AnalysisResult = {
  isPlant: boolean;
  confidence: number;
  plantTypeGuess: string;
  currentGrowthPhase: string;
  phaseReasoning: string;
  healthScore: number;
  healthStatus: string;
  visibleSymptoms: string[];
  possibleCauses: string[];
  careRecommendations: string[];
  nextTask: {
    title: string;
    priority: string;
    dueIn: string;
  };
  uploadQuality: {
    rating: string;
    feedback: string;
  };
  pointEligibility: {
    shouldAwardPoints: boolean;
    reason: string;
  };
  safetyNote: string;
};

type ScanResponse =
  | {
      ok: true;
      analysis: AnalysisResult;
    }
  | {
      ok: false;
      error: string;
    };

type ImageState = {
  fileName: string;
  mimeType: string;
  previewUrl: string;
  base64: string;
};

function getStatusColor(status: string): string {
  if (status === "healthy") return "#15803d";
  if (status === "watch") return "#a16207";
  if (status === "needs_attention") return "#c2410c";
  if (status === "critical") return "#b91c1c";
  return "#475569";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [image, setImage] = useState<ImageState | null>(null);
  const [plantName, setPlantName] = useState("");
  const [plantType, setPlantType] = useState("");
  const [expectedGrowthStage, setExpectedGrowthStage] = useState("");
  const [daysSincePlanting, setDaysSincePlanting] = useState("");
  const [userNotes, setUserNotes] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const canAnalyze = useMemo(() => Boolean(image && !isLoading), [image, isLoading]);

  async function setImageFromFile(file: File): Promise<void> {
    if (!file.type.startsWith("image/")) {
      setError("Please use a plant image file.");
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    const base64 = dataUrl.split(",")[1] ?? "";

    setImage({
      fileName: file.name,
      mimeType: file.type,
      previewUrl: dataUrl,
      base64,
    });
    setAnalysis(null);
    setError("");
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) await setImageFromFile(file);
  }

  async function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const file = Array.from(event.clipboardData.files).find((item) =>
      item.type.startsWith("image/"),
    );

    if (file) {
      event.preventDefault();
      await setImageFromFile(file);
    }
  }

  async function analyzePlant() {
    if (!image) return;

    setIsLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/plants/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: image.base64,
          mimeType: image.mimeType,
          plantName: plantName.trim() || undefined,
          plantType: plantType.trim() || undefined,
          expectedGrowthStage: expectedGrowthStage.trim() || undefined,
          daysSincePlanting: daysSincePlanting ? Number(daysSincePlanting) : undefined,
          userNotes: userNotes.trim() || undefined,
        }),
      });

      const data = (await response.json()) as ScanResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.ok ? "Plant scan failed." : data.error);
      }

      setAnalysis(data.analysis);
    } catch (scanError) {
      setError(
        scanError instanceof Error
          ? scanError.message
          : "Something went wrong while analyzing the plant.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      className="shell"
      onPaste={handlePaste}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={async (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) await setImageFromFile(file);
      }}
    >
      <section className="intro">
        <div className="intro-card">
          <p className="eyebrow">GROOTED backend lab</p>
          <h1>Plant AI scanner</h1>
          <p>
            Test the plant analysis pipeline with a real image. Add a little context
            if you have it, then get a beginner-friendly health report and next care
            task.
          </p>
          <div className="quick-steps" aria-label="How to use this scanner">
            <span>1. Add image</span>
            <span>2. Add plant context</span>
            <span>3. Analyze health</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="panel">
          <div className="panel-title">
            <div>
              <h2>Upload plant image</h2>
              <p>Use a clear photo of the full plant or affected leaves.</p>
            </div>
          </div>

          <div className={`dropzone ${isDragging ? "dragging" : ""}`}>
            {image ? (
              <img src={image.previewUrl} alt="Uploaded plant preview" />
            ) : (
              <div className="dropzone-copy">
                <strong>Drop image here</strong>
                <span>or paste with Ctrl+V / choose a file</span>
              </div>
            )}
          </div>

          <div className="upload-row">
            <label className="file-button">
              Choose image
              <input accept="image/png,image/jpeg,image/webp" type="file" onChange={handleFileChange} />
            </label>
            <span className="file-name">{image?.fileName ?? "No image selected"}</span>
          </div>

          <div className="form-grid">
            <label>
              Plant name
              <input
                placeholder="My balcony tomato"
                value={plantName}
                onChange={(event) => setPlantName(event.target.value)}
              />
            </label>
            <label>
              Plant type
              <input
                placeholder="Tomato, chilli, basil..."
                value={plantType}
                onChange={(event) => setPlantType(event.target.value)}
              />
            </label>
            <label>
              Expected stage
              <select
                value={expectedGrowthStage}
                onChange={(event) => setExpectedGrowthStage(event.target.value)}
              >
                <option value="">Not sure</option>
                <option value="germination">Germination</option>
                <option value="seedling">Seedling</option>
                <option value="vegetative">Vegetative</option>
                <option value="flowering">Flowering</option>
                <option value="fruiting">Fruiting</option>
                <option value="harvest_ready">Harvest ready</option>
              </select>
            </label>
            <label>
              Days since planting
              <input
                min="0"
                placeholder="14"
                type="number"
                value={daysSincePlanting}
                onChange={(event) => setDaysSincePlanting(event.target.value)}
              />
            </label>
          </div>

          <label className="notes">
            Notes
            <textarea
              placeholder="Leaves look yellow, watered yesterday..."
              value={userNotes}
              onChange={(event) => setUserNotes(event.target.value)}
            />
          </label>

          <button className="analyze" disabled={!canAnalyze} type="button" onClick={analyzePlant}>
            {isLoading ? "Analyzing plant..." : "Analyze plant"}
          </button>

          {error ? <p className="error">{error}</p> : null}
        </div>

        <div className="panel results">
          {!analysis && !isLoading ? (
            <div className="empty">
              <div className="empty-icon">+</div>
              <h2>AI findings will appear here</h2>
              <p>
                For best results, upload a clear photo of the full plant and a few
                leaves in natural light.
              </p>
            </div>
          ) : null}

          {isLoading ? (
            <div className="loading">
              <span />
              <h2>Studying the plant</h2>
              <p>Checking growth phase, leaf color, visible stress, and care signals.</p>
            </div>
          ) : null}

          {analysis ? (
            <div className="analysis">
              <div className="score-row">
                <div>
                  <p className="label">Health score</p>
                  <strong>{analysis.healthScore}/100</strong>
                </div>
                <div
                  className="status-pill"
                  style={{ backgroundColor: getStatusColor(analysis.healthStatus) }}
                >
                  {analysis.healthStatus.replaceAll("_", " ")}
                </div>
              </div>

              <div className="summary-grid">
                <SummaryItem label="Plant detected" value={analysis.isPlant ? "Yes" : "No"} />
                <SummaryItem label="Confidence" value={`${Math.round(analysis.confidence * 100)}%`} />
                <SummaryItem label="Likely plant" value={analysis.plantTypeGuess} />
                <SummaryItem
                  label="Growth phase"
                  value={analysis.currentGrowthPhase.replaceAll("_", " ")}
                />
              </div>

              <section>
                <h2>Phase reasoning</h2>
                <p>{analysis.phaseReasoning}</p>
              </section>

              <FindingList title="Visible symptoms" items={analysis.visibleSymptoms} />
              <FindingList title="Possible causes" items={analysis.possibleCauses} />
              <FindingList title="Care recommendations" items={analysis.careRecommendations} />

              <section className="next-task">
                <p className="label">Next task</p>
                <h2>{analysis.nextTask.title}</h2>
                <p>
                  Priority: {analysis.nextTask.priority} · Due: {analysis.nextTask.dueIn}
                </p>
              </section>

              <section>
                <h2>Upload quality</h2>
                <p>
                  {analysis.uploadQuality.rating}: {analysis.uploadQuality.feedback}
                </p>
              </section>

              <section>
                <h2>Points</h2>
                <p>
                  {analysis.pointEligibility.shouldAwardPoints ? "Award points" : "Do not award points"}:
                  {" "}
                  {analysis.pointEligibility.reason}
                </p>
              </section>

              <p className="safety">{analysis.safetyNote}</p>
            </div>
          ) : null}
        </div>
      </section>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #eef5ed;
          color: #172516;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
        }

        .shell {
          min-height: 100vh;
          padding: 40px;
        }

        .intro {
          max-width: 920px;
          margin: 0 auto 28px;
        }

        .eyebrow,
        .label {
          margin: 0 0 8px;
          color: #51724a;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          font-size: 42px;
          line-height: 1.05;
        }

        h2 {
          margin: 0 0 10px;
          font-size: 18px;
        }

        p {
          line-height: 1.6;
        }

        .intro p:last-child {
          max-width: 720px;
          color: #496048;
          font-size: 16px;
        }

        .workspace {
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(360px, 1.1fr);
          gap: 20px;
          max-width: 1180px;
          margin: 0 auto;
        }

        .panel {
          border: 1px solid #ccdcc8;
          border-radius: 8px;
          background: #fbfdf9;
          box-shadow: 0 14px 40px rgba(36, 60, 33, 0.08);
          padding: 18px;
        }

        .dropzone {
          display: grid;
          min-height: 300px;
          place-items: center;
          overflow: hidden;
          border: 2px dashed #9dbb96;
          border-radius: 8px;
          background: #f3faef;
          color: #51724a;
          text-align: center;
        }

        .dropzone.dragging {
          border-color: #2f7d32;
          background: #e4f5dd;
        }

        .dropzone img {
          width: 100%;
          height: 300px;
          object-fit: contain;
          background: #e8f1e5;
        }

        .dropzone strong,
        .dropzone span {
          display: block;
        }

        .dropzone strong {
          color: #274a25;
          font-size: 20px;
        }

        .upload-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0;
        }

        .file-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          border-radius: 8px;
          background: #1f6b2a;
          color: white;
          cursor: pointer;
          font-weight: 800;
          padding: 0 16px;
        }

        .file-button input {
          display: none;
        }

        .file-name {
          min-width: 0;
          overflow: hidden;
          color: #60725d;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        label {
          display: grid;
          gap: 6px;
          color: #375235;
          font-size: 13px;
          font-weight: 800;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid #c8d8c4;
          border-radius: 8px;
          background: white;
          color: #172516;
          font: inherit;
          font-weight: 500;
          outline: none;
          padding: 12px;
        }

        textarea {
          min-height: 96px;
          resize: vertical;
        }

        .notes {
          margin-top: 12px;
        }

        .analyze {
          width: 100%;
          min-height: 50px;
          margin-top: 16px;
          border: 0;
          border-radius: 8px;
          background: #172516;
          color: white;
          cursor: pointer;
          font-size: 16px;
          font-weight: 900;
        }

        .analyze:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .error {
          border-radius: 8px;
          background: #fee2e2;
          color: #991b1b;
          font-weight: 700;
          padding: 12px;
        }

        .results {
          min-height: 620px;
        }

        .empty,
        .loading {
          display: grid;
          min-height: 560px;
          place-content: center;
          color: #60725d;
          text-align: center;
        }

        .loading span {
          width: 42px;
          height: 42px;
          margin: 0 auto 18px;
          border: 4px solid #d5e6d0;
          border-top-color: #1f6b2a;
          border-radius: 999px;
          animation: spin 0.9s linear infinite;
        }

        .analysis {
          display: grid;
          gap: 18px;
        }

        .score-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid #dbe7d8;
          padding-bottom: 16px;
        }

        .score-row strong {
          font-size: 42px;
          line-height: 1;
        }

        .status-pill {
          border-radius: 999px;
          color: white;
          font-weight: 900;
          padding: 10px 14px;
          text-transform: capitalize;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .summary-item,
        .next-task {
          border: 1px solid #dbe7d8;
          border-radius: 8px;
          background: #f6fbf3;
          padding: 12px;
        }

        .summary-item strong {
          display: block;
          overflow-wrap: anywhere;
        }

        ul {
          margin: 0;
          padding-left: 18px;
        }

        li {
          margin: 6px 0;
        }

        .safety {
          border-top: 1px solid #dbe7d8;
          color: #5d6f5a;
          font-size: 13px;
          margin: 0;
          padding-top: 14px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 860px) {
          .shell {
            padding: 22px;
          }

          .workspace,
          .form-grid,
          .summary-grid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 34px;
          }
        }
      `}</style>
    </main>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary-item">
      <p className="label">{label}</p>
      <strong>{value || "Unknown"}</strong>
    </div>
  );
}

function FindingList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2>{title}</h2>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No clear findings from this image.</p>
      )}
    </section>
  );
}
