import { FooterBrand } from '../footer/FooterBrand';
import { FooterLinks } from '../footer/FooterLinks';
import { FooterBottom } from '../footer/FooterBottom';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FooterBrand />
          <FooterLinks />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}