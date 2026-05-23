import { ImageUpload } from '@/components/search/ImageUpload';

export const metadata = {
  title: 'Visual Search — Scout',
};

const EXAMPLES = [
  { label: 'Laptop', query: 'laptop' },
  { label: 'Headphones', query: 'headphones' },
  { label: 'Coffee maker', query: 'espresso machine' },
  { label: 'Bike', query: 'hybrid bike' },
];

export default function ImageSearchPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <p className="section-label mb-3">Visual Search</p>
      <h1 className="text-3xl font-bold text-scout-dark mb-3">Search by image</h1>
      <p className="text-scout-muted mb-10">Upload a photo of any product and Scout will find where to buy it for the best price.</p>

      <ImageUpload />

      <div className="mt-10">
        <p className="text-sm text-scout-muted mb-4">Or try these examples</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLES.map(({ label, query }) => (
            <a
              key={query}
              href={`/search?q=${encodeURIComponent(query)}`}
              className="px-4 py-2 bg-white border border-scout-border rounded-xl text-sm text-scout-dark hover:border-scout-dark transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
