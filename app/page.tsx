"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [highScore, setHighScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user’s high score from /api/score
  useEffect(() => {
    const fetchScore = async () => {
      if (status === "authenticated") {
        setLoading(true);
        try {
          const res = await fetch("/api/score");
          const data = await res.json();
          if (data.success) setHighScore(data.score);
        } catch (err) {
          console.error("Error fetching score:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchScore();
  }, [status]);

  // Loading state
  if (status === "loading" || loading)
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        Loading...
      </main>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">❤️ Heart Game</h1>

      {status === "authenticated" && session?.user ? (
        <>
          <p className="text-2xl mb-2 text-white">
            Welcome <span className="font-bold text-orange-400">{session.user.name}</span> let's start your game
          </p>
          <p className="text-lg mb-2 text-yellow-400">
            Logged in as <span className="font-semibold">{session.user.email}</span>
          </p>
          <p className="text-xl font-semibold mb-6">
            🏆 Highest Score: <span className="text-green-400">{highScore}</span>
          </p>

          <div className="flex flex-col gap-4 w-60">
            <button
              onClick={() => router.push("/game")}
              className="bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold"
            >
              ▶️ Start Game
            </button>

            <button
              onClick={() => router.push("/leaderboard")}
              className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
            >
              🏁 View Leaderboard
            </button>

            <button
              onClick={() => signOut()}
              className="bg-gray-700 hover:bg-gray-800 py-2 rounded-lg font-semibold"
            >
              🚪 Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-400 mb-4">Please log in to start playing.</p>
          <div className="flex gap-4">
            <button
              onClick={() => signIn()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
            >
              Register
            </button>
          </div>
        </>
      )}
    </main>
  );
}
