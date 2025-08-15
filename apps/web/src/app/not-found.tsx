import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex  flex-col items-center justify-center py-16">
      <div className="text-center">
        <h1 className="text-primary mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Don&apos;t worry, even the best data sometimes gets lost in the
          internet.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            replace
            className="flex items-center justify-center rounded-md px-4 py-2 transition-colors hover:underline"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to the dashboard
          </Link>
        </div>
      </div>
      <footer className="text-muted-foreground mt-12 text-center text-sm">
        If you believe this is an error, please contact our support team.
      </footer>
    </div>
  );
};

export default NotFoundPage;
