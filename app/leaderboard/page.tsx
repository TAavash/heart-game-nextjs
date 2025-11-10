"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface UserScore {
  username: string;
  score: number;
}

export default function LeaderboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const loadLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        if (data.success) setUsers(data.users);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [status, router]);

  if (loading)
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        Loading leaderboard...
      </main>
    );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>

      <table className="min-w-[300px] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-700 text-left">
          <tr>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr
              key={i}
              className={`${
                i % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              } hover:bg-gray-600`}
            >
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2 font-bold">{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => router.push("/game")}
        className="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Back to Game
      </button>
    </main>
  );
}
