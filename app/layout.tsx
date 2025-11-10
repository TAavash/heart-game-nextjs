import Providers from "./game/components/Providers";
import "./globals.css";

export const metadata = {
  title: "Heart Game",
  description: "CIS007-3 Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
