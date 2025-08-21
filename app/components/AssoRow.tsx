// import Image from "next/image";
// import Link from "next/link";
//
// export type Association = {
//   name: string;
//   href: string;
//   logoSrc: string;
// };
//
// export type AssociationRowsProps = {
//   /** Items to render */
//   items: Association[];
// };
//
// export default function AssociationRows({ items }: AssociationRowsProps) {
//   const size: number = 100; // Default size for logos
//
//   return (
//     <div className="flex flex-wrap justify-center my-4 gap-2">
//       {items.map((a, n) => (
//         <Link
//           key={a.href + a.name + n}
//           href={a.href}
//           className="group block"
//           aria-label={a.name}
//         >
//           <div
//             className="rounded-full bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
//             style={{ width: size, height: size }}
//           >
//             <Image
//               src={a.logoSrc}
//               alt={`${a.name} logo`}
//               width={500}
//               height={500}
//               className="object-contain w-full h-full p-2"
//               sizes={`${size}px`}
//             />
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }

import Image from "next/image";
import Link from "next/link";

export type Association = {
  name: string;
  href: string;
  logoSrc: string;
};

export type AssociationRowsProps = {
  items: Association[];
  size?: number;
};

export default function AssociationRows({
  items,
  size = 100,
}: AssociationRowsProps) {
  return (
    // Hidden by default; becomes flex at >= 800px wide
    <div className="hidden min-[800px]:flex flex-wrap justify-center my-4 gap-2">
      {items.map((a, n) => (
        <Link
          key={`${a.name}-${n}`}
          href={a.href}
          className="group block"
          aria-label={a.name}
        >
          <div
            className="rounded-full bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ width: size, height: size }}
          >
            <Image
              src={a.logoSrc}
              alt={`${a.name} logo`}
              width={size}
              height={size}
              className="object-contain w-full h-full p-2"
              sizes={`(max-width: 799px) 0px, ${size}px`}
              loading="lazy"
              decoding="async"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
