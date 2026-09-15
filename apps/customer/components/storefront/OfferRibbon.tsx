import type { Offer } from '@brandcraft/storefront-data';

export function OfferRibbon({ offers }: { offers: Offer[] }) {
  if (offers.length === 0) return null;

  return (
    <div className="container">
      <div className="offer-ribbon">
        {offers.map((offer) => (
          <div className="offer-card" key={offer.id}>
            <span className="kicker">{offer.cta}</span>
            <h3>{offer.title}</h3>
            <p>{offer.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
