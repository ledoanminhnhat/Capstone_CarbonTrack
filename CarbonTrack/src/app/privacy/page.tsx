import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy – CarbonTrack" };

/** Trang chính sách quyền riêng tư (public) – Google OAuth yêu cầu khi publish app. */
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <article className="mx-auto max-w-2xl space-y-6 leading-relaxed">
        <header>
          <h1 className="text-3xl font-extrabold text-gradient-brand">Privacy Policy</h1>
          <p className="mt-1 text-sm opacity-70">Last updated: November 19, 2026</p>
        </header>

        <p>
          CarbonTrack is a student capstone project that helps users track and reduce their carbon
          footprint. This page explains what data we collect and how we use it.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Information we collect</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Account information: your name, email address and (optionally) a password.</li>
            <li>
              If you sign in with Google: your Google account ID, name, email address and profile
              picture. We do not access any other Google data.
            </li>
            <li>Activities you log, challenges you join, and posts, comments and images you share in the community.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">How we use it</h2>
          <p>
            Your data is used only to provide CarbonTrack&apos;s features: signing you in, calculating
            emissions, showing your progress and displaying community content. We do not sell your
            data or use it for advertising.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Storage and sharing</h2>
          <p>
            Data is stored in our database, and uploaded images are hosted on Cloudinary. Posts and
            your display name and avatar are visible to other CarbonTrack users. We do not share your
            data with any other third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Your choices</h2>
          <p>
            You can update your profile or remove your avatar in Settings at any time. To request
            deletion of your account and data, contact us at the email below.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Contact</h2>
          <p>
            Questions about this policy:{" "}
            <a href="mailto:carbontrack.noreply@gmail.com" className="text-brand-600 hover:underline">
              carbontrack.noreply@gmail.com
            </a>
          </p>
        </section>

        <Link href="/login" className="inline-block font-semibold underline">
          ← Back to CarbonTrack
        </Link>
      </article>
    </main>
  );
}
