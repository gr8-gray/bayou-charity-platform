import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 font-['Caveat'] text-lg text-amber dark:text-amber">
        404
      </p>
      <h1 className="mb-4 font-['Playfair_Display'] text-4xl font-bold text-text-dark dark:text-white md:text-5xl">
        This page doesn&apos;t exist — yet.
      </h1>
      <p className="mb-10 max-w-md font-['Lora'] text-lg text-text-mid dark:text-white/70">
        The water&apos;s still out there, but this particular dock seems to have
        drifted off.
      </p>

      <Link
        href="/"
        className="mb-8 rounded-full bg-amber px-8 py-3 font-['Lora'] font-semibold text-white shadow-md transition hover:opacity-90"
      >
        Head back home
      </Link>

      <div className="flex gap-6 font-['Lora'] text-sm">
        <Link
          href="/volunteer"
          className="text-amber underline-offset-4 hover:underline dark:text-amber"
        >
          Volunteer
        </Link>
        <Link
          href="/donate"
          className="text-amber underline-offset-4 hover:underline dark:text-amber"
        >
          Donate
        </Link>
        <Link
          href="/gallery"
          className="text-amber underline-offset-4 hover:underline dark:text-amber"
        >
          Gallery
        </Link>
      </div>
    </div>
  )
}
