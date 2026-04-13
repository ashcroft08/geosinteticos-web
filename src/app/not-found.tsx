import Link from 'next/link'
import { HardHat, Compass, Home, Briefcase, Folders } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center animate-fade-in-up">
      <div className="relative mb-10">
        <div className="bg-accent-light p-8 rounded-full animate-float">
          <Compass size={80} className="text-accent" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-full border-4 border-white">
          <HardHat size={24} className="text-white" />
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
        404 - Página no encontrada
      </h1>

      <p className="text-lg text-text-muted max-w-lg mb-10 leading-relaxed">
        Parece que el recurso que buscas se ha movido o ya no está disponible. No te preocupes, estamos aquí para guiarte de vuelta a terreno seguro.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl">
        <Link
          href="/"
          className="w-full sm:w-auto bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Home size={18} />
          Volver al Inicio
        </Link>
        <Link
          href="/servicios"
          className="w-full sm:w-auto bg-surface hover:bg-gray-100 text-primary font-semibold py-3 px-8 rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-2"
        >
          <Briefcase size={18} />
          Servicios
        </Link>
        <Link
          href="/proyectos"
          className="w-full sm:w-auto bg-surface hover:bg-gray-100 text-primary font-semibold py-3 px-8 rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-2"
        >
          <Folders size={18} />
          Proyectos
        </Link>
      </div>
    </div>
  )
}
