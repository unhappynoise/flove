import type { ReactNode } from "react";

export default function InfoPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-brown mb-3 text-center">{title}</h1>
      {intro && (
        <p className="font-body text-brown-light text-center mb-10">{intro}</p>
      )}
      <div className="font-body text-brown-light leading-relaxed space-y-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-brown [&_h2]:pt-6 [&_a]:text-gold [&_a:hover]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}
