import { Link } from "react-router-dom"

function NotFound() {
    return (
        <section className="flex items-center h-full p-16 dark:bg-gray-50 dark:text-gray-800">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-400">
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">Lo sentimos, la pagina que buscas no existe </p>
                    <p className="mt-4 mb-8 dark:text-gray-600">Pero no te preocues, puedes regresar a la pagina de inicio.</p>
                    <Link rel="noopener noreferrer" to="/" className="px-8 py-3 font-semibold cursor-pointer bg-blue-500 text-white hover:bg-blue-600 rounded-md">Regresar a la pagina de inicio</Link>
                </div>
            </div>
        </section>
    )
}

export default NotFound