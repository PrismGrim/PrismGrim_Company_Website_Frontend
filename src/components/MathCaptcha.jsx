import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { RefreshCw } from "lucide-react";

/**
 * MathCaptcha renders a math challenge from the backend, validates the user's
 * answer, and yields a short-lived JWT form-token on success. The parent
 * form must include the returned form_token in its submission.
 */
export default function MathCaptcha({ onToken, testIdPrefix = "captcha" }) {
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("idle"); // idle | verifying | ok | error
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setStatus("idle");
    setAnswer("");
    setError("");
    onToken?.("");
    try {
      const { data } = await api.get("/captcha");
      setChallenge(data);
    } catch (e) {
      setError("Could not load challenge");
    }
  }, [onToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const verify = useCallback(async () => {
    if (!challenge) return;
    setStatus("verifying");
    setError("");
    try {
      const { data } = await api.post("/form-token", {
        challenge_id: challenge.challenge_id,
        captcha_token: challenge.token,
        answer: parseInt(answer, 10),
      });
      setStatus("ok");
      onToken?.(data.form_token);
    } catch (e) {
      setStatus("error");
      setError(e?.response?.data?.detail || "Incorrect answer. Try again.");
      onToken?.("");
    }
  }, [challenge, answer, onToken]);

  return (
    <div
      className="border border-[var(--pg-border)] bg-[var(--pg-surface-2)] p-4"
      data-testid={`${testIdPrefix}-wrapper`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--pg-muted)] font-mono">
          Human check
        </span>
        <button
          type="button"
          onClick={refresh}
          className="text-[var(--pg-text-2)] hover:text-[var(--pg-primary)] transition-colors"
          data-testid={`${testIdPrefix}-refresh`}
          aria-label="Refresh challenge"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="font-mono text-lg text-[var(--pg-text)]"
          data-testid={`${testIdPrefix}-question`}
        >
          {challenge?.question || "Loading…"}
        </span>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="pg-input max-w-[120px]"
          placeholder="?"
          disabled={status === "ok"}
          data-testid={`${testIdPrefix}-answer`}
        />
        {status !== "ok" ? (
          <button
            type="button"
            onClick={verify}
            disabled={!answer || status === "verifying"}
            className="pg-btn"
            data-testid={`${testIdPrefix}-verify`}
          >
            {status === "verifying" ? "Verifying…" : "Verify"}
          </button>
        ) : (
          <span
            className="font-mono text-[12px] text-[var(--pg-accent)] uppercase tracking-widest"
            data-testid={`${testIdPrefix}-ok`}
          >
            ✓ Verified
          </span>
        )}
      </div>
      {error && (
        <div
          className="mt-2 text-[12px] text-[var(--pg-secondary)] font-mono"
          data-testid={`${testIdPrefix}-error`}
        >
          {error}
        </div>
      )}
    </div>
  );
}
