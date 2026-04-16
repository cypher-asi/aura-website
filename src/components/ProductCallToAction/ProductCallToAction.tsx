import { AppLink } from '@/components/AppLink/AppLink';
import './ProductCallToAction.css';

type ProductCallToActionProps = {
  readonly href: string;
  readonly label: string;
};

export function ProductCallToAction({
  href,
  label,
}: ProductCallToActionProps): React.ReactNode {
  return (
    <section className="productCtaSection" aria-label="Product call to action">
      <div className="productCtaPanel">
        <AppLink href={href} className="productCtaButton">
          {label}
        </AppLink>
      </div>
    </section>
  );
}
