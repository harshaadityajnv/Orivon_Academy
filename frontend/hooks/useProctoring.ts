// -------------------------------------------------------------
// FINAL useProctoring.ts — Full Anti-Cheat + Fullscreen Lock +
// Tab Switch Alerts + Auto Termination System
// -------------------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Alert, AlertType } from '../types';
import { analyzeFrame, initializeAiService } from '../services/geminiService';
import { sendProctorEvent } from '../utils/eventSender';

const FRAME_ANALYSIS_INTERVAL = 5000; // AI frame analysis interval
const MAX_VIOLATION_POINTS = 5;

export const useProctoring = () => {
  const [isProctoring, setIsProctoring] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [terminatedByMalpractice, setTerminatedByMalpractice] = useState(false);
  const [violationPoints, setViolationPoints] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const analysisIntervalRef = useRef<number | null>(null);
  const attemptIdRef = useRef<string | null>(null);
  const violationPointsRef = useRef<number>(0);

  const onMalpracticeExitRef = useRef<null | (() => void)>(null);

  // REGISTER CALLBACK THAT will be executed when malpractice > 5
  const registerExitCallback = (cb: () => void) => {
    onMalpracticeExitRef.current = cb;
  };

  // -------------------------------------------------------------
  // ADD ALERTS — ALWAYS show tab-switch warnings
  // -------------------------------------------------------------
  const addAlert = useCallback((type: AlertType, message: string) => {
    setAlerts((prevAlerts) => {
      const newAlert: Alert = {
        id: Date.now(),
        type,
        message,
        timestamp: new Date().toLocaleTimeString(),
      };

      // ❗ Allow duplicates ONLY for tab-switch
      if (type !== "tab-switch") {
        if (prevAlerts.length > 0 && prevAlerts[0].type === type) {
          return prevAlerts;
        }
      }

      toast.error(message, { icon: "⚠️" });
      return [newAlert, ...prevAlerts];
    });

    // All alerts increase violation points
    violationPointsRef.current += 1;
    setViolationPoints((v) => v + 1);

    if (violationPointsRef.current >= MAX_VIOLATION_POINTS) {
      setTerminatedByMalpractice(true);
      onMalpracticeExitRef.current?.();
    }

  }, []);

  // -------------------------------------------------------------
  // FULLSCREEN LOCK — Leaving fullscreen = violation
  // -------------------------------------------------------------
  const fullscreenCheck = useCallback(() => {
    if (!document.fullscreenElement && isProctoring) {
      addAlert(
        "screen-change",
        "Fullscreen mode exited. Please stay in fullscreen."
      );

      if (attemptIdRef.current) {
        sendProctorEvent(attemptIdRef.current, {
          event_type: "fullscreen_exit",
          metadata: { ts: Date.now() }
        });
      }
    }
  }, [isProctoring, addAlert]);

  useEffect(() => {
    document.addEventListener("fullscreenchange", fullscreenCheck);
    return () => document.removeEventListener("fullscreenchange", fullscreenCheck);
  }, [fullscreenCheck]);

  // -------------------------------------------------------------
  // TAB SWITCH / WINDOW CHANGE
  // -------------------------------------------------------------
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isProctoring) {
      addAlert("tab-switch", "Tab/window switch detected!");

      if (attemptIdRef.current) {
        sendProctorEvent(attemptIdRef.current, {
          event_type: "tab_switch",
          metadata: { ts: Date.now(), reason: "document_hidden" }
        });
      }
    }
  }, [isProctoring, addAlert]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleVisibilityChange]);

  // -------------------------------------------------------------
  // CAPTURE FRAME
  // -------------------------------------------------------------
  const captureFrameAsBase64 = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.videoWidth || !video.videoHeight) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
  }, []);

  // -------------------------------------------------------------
  // AI FRAME ANALYSIS LOOP
  // -------------------------------------------------------------
  const runFrameAnalysis = useCallback(async () => {
    if (!isProctoring) return;

    const base64 = captureFrameAsBase64();
    if (!base64) return;

    try {
      const violations = await analyzeFrame(base64);

      violations.forEach((violation) => {
        const msg = `AI detected: ${violation.replace(/-/g, " ")}.`;
        addAlert(violation as AlertType, msg);

        if (attemptIdRef.current) {
          sendProctorEvent(attemptIdRef.current, {
            event_type: violation,
            metadata: { ts: Date.now() }
          });
        }
      });
    } catch (err) {
      console.error("Frame analysis failed:", err);
    }
  }, [isProctoring, addAlert, captureFrameAsBase64]);

  // -------------------------------------------------------------
  // START PROCTORING
  // -------------------------------------------------------------
  const startProctoring = useCallback(async () => {
    setIsLoading(true);
    setAlerts([]);
    violationPointsRef.current = 0;

    try {
      initializeAiService();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = async () => {
          setIsCameraReady(true);
          setIsProctoring(true);
          setIsLoading(false);

          // reset violation points
          violationPointsRef.current = 0;
          setViolationPoints(0);

          toast.success("Proctoring started. You are now being monitored.");

          const certId = (window as any).__CERTIFICATION_ID || null;
          const examId = (window as any).__CERTIFICATION_EXAM_ID || null;
          const token = localStorage.getItem("access_token") || "";
          const API_BASE = (window as any).__API_BASE || "";

          // Start backend attempt logging
          if (certId) {
            try {
              const res = await fetch(`${API_BASE}/attempts/start`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  certification_id: certId,
                  certification_exam_id: examId,
                  consent: true,
                }),
              });

              if (res.ok) {
                const data = await res.json();
                attemptIdRef.current = data.attempt_id;

                sendProctorEvent(data.attempt_id, {
                  event_type: "session_started",
                  metadata: { ts: Date.now() },
                });
              }
            } catch (err) {
              console.error("Failed to log attempt:", err);
            }
          }

          // Enter fullscreen automatically
          document.documentElement.requestFullscreen?.();

          // Start AI analysis loop
          analysisIntervalRef.current = window.setInterval(
            runFrameAnalysis,
            FRAME_ANALYSIS_INTERVAL
          );
        };
      }
    } catch (err) {
      console.error("Proctoring start error:", err);
      toast.error("Unable to start proctoring.");
      setIsLoading(false);
    }
  }, [runFrameAnalysis]);

  // -------------------------------------------------------------
  // STOP PROCTORING
  // -------------------------------------------------------------
  const stopProctoring = useCallback(
    async (onSessionEnd: (finalAlerts: Alert[]) => void) => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      document.exitFullscreen?.();

      setIsProctoring(false);
      setIsCameraReady(false);

      if (attemptIdRef.current) {
        sendProctorEvent(attemptIdRef.current, {
          event_type: "session_ended",
          metadata: { ts: Date.now() },
        });
      }

      const finalAlert: Alert = {
        id: Date.now(),
        type: "system",
        message: "Proctoring ended.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setAlerts((curr) => [finalAlert, ...curr]);
      onSessionEnd([finalAlert, ...alerts]);
    },
    [alerts]
  );

  return {
    isProctoring,
    isLoading,
    alerts,
    videoRef,
    canvasRef,
    isCameraReady,
    startProctoring,
    stopProctoring,

    violationPoints,
    terminatedByMalpractice,
    registerExitCallback,
  };
};
