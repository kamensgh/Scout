export const metadata = { title: 'Merchant Dashboard — Scout' };

const STATS = [
  { label: 'Products listed', value: '142', change: '+12 this week' },
  { label: 'Price competitiveness', value: '78%', change: 'Above market avg' },
  { label: 'Page views', value: '3,421', change: '+18% vs last month' },
  { label: 'Click-throughs', value: '289', change: '8.4% CTR' },
];

export default function MerchantPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="section-label mb-1">Merchant Portal</p>
        <h1 className="text-2xl font-bold text-scout-dark">Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map(({ label, value, change }) => (
          <div key={label} className="bg-white border border-scout-border rounded-2xl p-5">
            <p className="text-xs text-scout-muted uppercase tracking-widest mb-2">{label}</p>
            <p className="text-2xl font-bold text-scout-dark mb-1">{value}</p>
            <p className="text-xs text-scout-green">{change}</p>
          </div>
        ))}
      </div>

      {/* Mock inventory table */}
      <div className="bg-white border border-scout-border rounded-2xl overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-scout-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-scout-dark">Inventory</h2>
          <span className="text-xs text-scout-muted">142 products</span>
        </div>
        <div className="divide-y divide-scout-border">
          {[
            { name: 'Sony WH-1000XM5', sku: 'SONY-WH1K-BLK', price: '£289.00', stock: 'In stock', views: 847 },
            { name: 'Apple AirPods Pro 2', sku: 'APP-AIP2-WHT', price: '£229.00', stock: 'In stock', views: 1203 },
            { name: 'Dyson V15 Detect', sku: 'DYS-V15-SIL', price: '£589.00', stock: 'Low stock', views: 621 },
          ].map(row => (
            <div key={row.sku} className="flex items-center gap-4 px-5 py-3.5 text-sm">
              <div className="flex-1">
                <p className="font-medium text-scout-dark">{row.name}</p>
                <p className="text-xs text-scout-muted">{row.sku}</p>
              </div>
              <span className="w-24 text-scout-dark">{row.price}</span>
              <span className={`w-20 text-xs font-medium ${row.stock === 'In stock' ? 'text-scout-green' : 'text-scout-accent'}`}>{row.stock}</span>
              <span className="w-20 text-xs text-scout-muted text-right">{row.views.toLocaleString()} views</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-scout-bg border border-scout-border rounded-2xl p-6 text-center">
        <p className="text-sm text-scout-muted">Full merchant features — API integration, bulk upload, analytics — coming soon.</p>
      </div>
    </div>
  );
}
