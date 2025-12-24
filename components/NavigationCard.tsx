import Link from 'next/link';

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
}

export default function NavigationCard({ title, description, href }: NavigationCardProps) {
  return (
    <Link
      href={href}
      className="block p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer group"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
        {title}
      </h2>
      <p className="text-gray-600">
        {description}
      </p>
    </Link>
  );
}
