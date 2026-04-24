import type { Program } from "@/interfaces/catalog.interface"


function DetailsProgram({ programDetail }: { programDetail: Program }) {


    const yearProduction = programDetail.anio_production
    const genders = programDetail.genders?.map(gender => gender.name).join(', ')
    const casting = programDetail.actors || ''

    return (
        <>
            <h3 className="text-white text-xl font-bold uppercase tracking-wider mb-3">Sinopsis</h3>
            <div className="animate-in fade-in duration-500 flex flex-row gap-20">
                <div className="w-1/2">
                    <p className="text-white/60 text-xl leading-relaxed font-medium">
                        {programDetail.description || programDetail.description_short}
                    </p>
                </div>
                <div>
                    <div className="text-white/60 text-xl tracking-wider font-medium mb-3">
                        <h3 className="">Año:{' '}</h3>
                        <p className="">{yearProduction}</p>
                    </div>
                    <div className="text-white/60 text-xl tracking-wider font-medium">
                        <h3 className="">Géneros:</h3>
                        <p className="">{genders}</p>
                    </div>
                </div>
                <div className="text-white/60 text-xl tracking-wider font-medium">
                    <h3 className="">Elenco:</h3>
                    <p className="">{casting}</p>
                </div>
            </div>
        </>
    )
}

export default DetailsProgram