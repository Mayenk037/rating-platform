// src/components/PageShell.jsx
function PageShell({ title, subtitle, children }) {
  return (
    <div className="space-y-4">
      <header>
        {title && (
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </header>
      <section className="space-y-4">{children}</section>
    </div>
  );
}

export default PageShell;
