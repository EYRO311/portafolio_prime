import type { Metadata } from "next";
import MusicDashboardWrapper from "./MusicDashboardWrapper";

export const metadata: Metadata = {
  title: "Music Dashboard | EYRO",
  description: "Spotify dashboard con top artists, top tracks, historial y playlists",
};

export default function MusicPage() {
  return <MusicDashboardWrapper />;
}
