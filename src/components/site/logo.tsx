import Image from "next/image";

/**
 * The logo itself is dark red, which disappears against the site's dark
 * backgrounds — so it always renders on a light chip for contrast, rather
 * than swapping the logo's own color.
 */
export function Logo({
  imgClassName = "h-12 w-auto",
  priority = false,
}: {
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <span className="inline-flex items-center rounded-2xl border border-kitchen-gold/25 bg-[#F7F0E1] px-3 py-1.5 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.4)]">
      <Image
        src="/logo.png"
        alt="The Kitchen Veendam"
        width={1630}
        height={965}
        priority={priority}
        className={imgClassName}
      />
    </span>
  );
}
