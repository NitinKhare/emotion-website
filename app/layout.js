import "./globals.css";

export const metadata = {
  title: "E-Motion Production - Creative Audio-Visual Solutions",
  description:
    "We create compelling audio-visual content that captivates audiences and drives results. From voice-overs to full production, we're your creative partners.",
  icons: {
    icon: "/Emotion.png",
    apple: "/Emotion.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
