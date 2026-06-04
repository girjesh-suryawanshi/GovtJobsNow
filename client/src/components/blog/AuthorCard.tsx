import { User, PenLine } from "lucide-react";

interface AuthorCardProps {
  name: string;
  bio?: string | null;
  image?: string | null;
  publishedAt?: Date | null;
}

export function AuthorCard({ name, bio, image, publishedAt }: AuthorCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:to-blue-950/30 border border-slate-200 dark:border-slate-700"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-200 dark:ring-blue-700"
              itemProp="image"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-blue-200 dark:ring-blue-700">
              <User className="w-7 h-7 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <PenLine className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">
              Written by
            </span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base" itemProp="name">
            {name}
          </h3>
          {formattedDate && (
            <p className="text-xs text-slate-500 mt-0.5">Published on {formattedDate}</p>
          )}
          {bio && (
            <p
              className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
              itemProp="description"
            >
              {bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
