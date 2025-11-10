"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [questionImg, setQuestionImg] = useState<string | null>(null);
  const [solution, setSolution] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch new question
  const fetchQuestion = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/question", { cache: "no-store" });
      const data = await res.json();

      if (data.success && data.data?.question && data.data?.solution) {
        setQuestionImg(data.data.question);
        setSolution(Number(data.data.solution));
        setUserAnswer("");
        setTimeLeft(10);
        setMessage(null);
      } else {
        setError("Failed to load question.");
      }
    } catch (err) {
      console.error("Error fetching question:", err);
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Load initial data
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      Promise.resolve().then(async () => {
        await fetchQuestion();
        try {
          const res = await fetch("/api/score");
          const data = await res.json();
          if (data.success) setHighScore(data.score);
        } catch (err) {
          console.error("Error loading score:", err);
        }
      });
    }
  }, [status, fetchQuestion, router]);

  // ✅ Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setMessage("⏰ Time’s up!");
      setTimeout(() => router.push("/"), 1500);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, router]);

  // ✅ Handle answer
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solution) return;

    if (parseInt(userAnswer) === solution) {
      const newScore = score + 1;
      setScore(newScore);
      setMessage("✅ Correct! +1 point");

      try {
        await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: newScore }),
        });
      } catch (err) {
        console.error("Error updating score:", err);
      }

      await fetchQuestion();
    } else {
      setMessage("❌ Wrong! Game Over!");
      await new Promise((res) => setTimeout(res, 1500));
      router.push("/");
    }
  };

  if (status === "loading" || loading)
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        Loading...
      </main>
    );

  // ✅ UI
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-2">❤️ Heart Game</h1>
      {session?.user?.email && (
        <p className="mb-4 text-gray-400">Logged in as {session.user.email}</p>
      )}

      <p className="mb-1 text-yellow-400 text-lg">
        🏅 Highest Score: {highScore}
      </p>
      <p className="mb-4 text-lg">⭐ Current Score: {score}</p>

      {questionImg && (
        <img
          src={questionImg}
          alt="Heart Question"
          className="rounded-lg shadow-lg mb-4 w-80 h-80 object-contain"
        />
      )}

      <p className="mb-2 text-lg">⏱️ Time Left: {timeLeft}s</p>

      <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-4">
        <input
          type="number"
          placeholder="How many hearts?"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="text-black bg-orange-400 p-2 rounded w-48 text-center"
          disabled={timeLeft <= 0}
        />
        <button
          type="submit"
          disabled={timeLeft <= 0}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Submit Answer
        </button>
      </form>

      {message && <p className="mb-4">{message}</p>}
    </main>
  );
}
