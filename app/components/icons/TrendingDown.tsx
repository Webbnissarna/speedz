import * as React from "react";
import { SVGProps } from "react";
const SvgTrendingDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-trending-down"
    {...props}
  >
    <path d="m23 18-9.5-9.5-5 5L1 6" />
    <path d="M17 18h6v-6" />
  </svg>
);
export default SvgTrendingDown;
