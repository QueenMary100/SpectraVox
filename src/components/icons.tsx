import type { SVGProps } from 'react';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

export function SpectraVoXLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.5 4.5 9 19.5l-2.5-1" />
      <path d="m14 11-5-5" />
      <path d="M17.5 4.5 15 9" />
      <path d="M7 11h10" />
    </svg>
  );
}

export { Facebook, Twitter, Linkedin, Youtube };
