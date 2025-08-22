// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-sm text-gray-600">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} YourApp. All rights reserved.</p>
          <nav className="flex gap-4">
            <a className="hover:underline" href="https://example.com">
              Docs
            </a>
            <a className="hover:underline" href="https://example.com">
              Privacy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
