import { ServerABWrapper } from "../ab-testing/ServerABWrapper";

export function AiAbHeadline() {
    const variantA = (
        <div className="flex flex-col gap-5 text-center md:text-left max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Genera tu próximo presupuesto en <span className="text-blue-600">2 minutos.</span>
            </h1>
            <p className="text-xl text-gray-600 mt-2">
                Describe la reforma con tus propias palabras. Nuestra IA estructura las partidas, autocompleta rendimientos y genera un PDF listo para tu cliente. Pruébalo gratis.
            </p>
        </div>
    );

    const variantB = (
        <div className="flex flex-col gap-5 text-center md:text-left max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Presupuestos precisos. <span className="text-blue-600">Márgenes de beneficio asegurados.</span>
            </h1>
            <p className="text-xl text-gray-600 mt-2">
                Deja de cotizar a ojo. Usa el Generador AI-First para estructurar tu obra al milímetro antes de poner un ladrillo. Accede a la demo sin compromiso.
            </p>
        </div>
    );

    return <ServerABWrapper fallback="A" variantA={variantA} variantB={variantB} />;
}
