import { MapPin, Star, Phone, ExternalLink } from 'lucide-react';
import type { PlaceResult } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface NearbyStoreCardProps {
  place: PlaceResult;
  className?: string;
}

export function NearbyStoreCard({ place, className }: NearbyStoreCardProps) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  return (
    <div className={`bg-white border border-scout-border rounded-2xl p-4 ${className || ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-scout-dark truncate">{place.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {place.rating && (
              <div className="flex items-center gap-1">
                <Star size={12} className="text-scout-accent fill-scout-accent" />
                <span className="text-xs font-medium text-scout-dark">{place.rating.toFixed(1)}</span>
                {place.userRatingsTotal && (
                  <span className="text-xs text-scout-muted">({place.userRatingsTotal.toLocaleString()})</span>
                )}
              </div>
            )}
            <span className="text-xs text-scout-muted">{(place.distanceKm * 0.621).toFixed(1)} mi</span>
          </div>
        </div>
        <Badge variant={place.openNow ? 'in-stock' : place.openNow === false ? 'out-of-stock' : 'default'}>
          {place.openNow === true ? 'Open' : place.openNow === false ? 'Closed' : 'Hours unknown'}
        </Badge>
      </div>

      {place.address && (
        <div className="flex items-start gap-1.5 text-xs text-scout-muted mb-2">
          <MapPin size={12} className="shrink-0 mt-0.5" />
          <span>{place.address}</span>
        </div>
      )}

      <div className="flex gap-2 mt-3">
        {place.phoneNumber && (
          <a
            href={`tel:${place.phoneNumber}`}
            className="flex items-center gap-1 text-xs text-scout-blue font-medium hover:underline"
          >
            <Phone size={12} />
            Call
          </a>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 bg-scout-dark text-white rounded-lg text-xs font-medium hover:bg-scout-dark/90 transition-colors"
        >
          <MapPin size={12} />
          Get Directions
        </a>
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-scout-muted hover:text-scout-dark transition-colors"
          >
            <ExternalLink size={12} />
            Website
          </a>
        )}
      </div>
    </div>
  );
}
