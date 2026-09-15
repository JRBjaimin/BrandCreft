'use client';

import { useScrollScene } from '@brandcraft/motion/scroll-scene';
import type { Business } from '@brandcraft/storefront-data';
import { initials } from '../../lib/format';

/**
 * The one deliberately GSAP-driven "scene" in the storefront (see the
 * animation plan) — an entrance timeline plus a subtle scroll-linked
 * parallax on the logo. Everything else in this app uses Framer Motion;
 * this is the one spot where GSAP's timeline/ScrollTrigger tools earn their
 * keep over Framer's simpler variant system.
 */
export function BusinessHero({ business }: { business: Business }) {
  const ref = useScrollScene<HTMLElement>(
    ({ gsap, container }) => {
      const logo = container.querySelector('.hero-logo');
      const badge = container.querySelector('.badge');
      const title = container.querySelector('.hero-title');
      const tagline = container.querySelector('.hero-tagline');
      const metaItems = container.querySelectorAll('.hero-meta-item');

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(logo, { scale: 0.4, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' })
        .from(badge, { y: 16, opacity: 0, duration: 0.5 }, '-=0.4')
        .from(title, { y: 24, opacity: 0, duration: 0.6 }, '-=0.3')
        .from(tagline, { y: 16, opacity: 0, duration: 0.5 }, '-=0.35')
        .from(metaItems, { y: 12, opacity: 0, duration: 0.4, stagger: 0.08 }, '-=0.3');

      // Subtle parallax: the logo drifts up slightly faster than the rest while scrolling past the hero.
      gsap.to(logo, {
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: container, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    [business.id],
  );

  return (
    <section className="hero" ref={ref}>
      <div className="container hero-inner">
        <div className="hero-logo" aria-hidden>
          {business.branding.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary business-supplied URL, no fixed remote host to allow-list yet
            <img src={business.branding.logoUrl} alt="" />
          ) : (
            initials(business.name)
          )}
        </div>
        <div>
          <span className="badge">{business.category.label}</span>
          <h1 className="hero-title" style={{ marginTop: 8 }}>
            {business.name}
          </h1>
          <p className="hero-tagline">{business.description}</p>
          <div className="hero-meta">
            <span className="hero-meta-item">
              📍 {business.contact.address.city}, {business.contact.address.state}
            </span>
            <span className="hero-meta-item">📞 {business.contact.phone}</span>
            {business.contact.socials.instagram && (
              <a
                className="hero-meta-item"
                href={business.contact.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                📷 Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
