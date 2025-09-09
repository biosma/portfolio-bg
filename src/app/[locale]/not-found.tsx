import FuzzyText from '@/components/fuzzy-text';
import { Link } from '@/i18n/navigation';


// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <FuzzyText baseIntensity={0.4} hoverIntensity={0} enableHover={false}>
        404
      </FuzzyText>{' '}
      <h2 className="text-2xl mb-2">Página no encontrada</h2>
      <p className="mb-6">Ups, no pudimos encontrar lo que buscabas.</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
