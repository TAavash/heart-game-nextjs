"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("✅ Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMessage(`❌ ${data.message}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🧾 Register</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded text-black"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 py-2 rounded"
        >
          Register
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      <p className="mt-2 text-gray-400">
        Already have an account?{" "}
        <a href="/login" className="text-blue-400 underline">
          Login here
        </a>
      </p>
    </main>
  );
}
