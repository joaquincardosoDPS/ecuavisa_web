import plusRaw from "@/assets/img/icons/plus.svg?raw";


function EmptyList() {
    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <div
                className="h-35 w-35 mt-20 2xl:mt-30 2xl:h-50 2xl:w-50 rounded-full border-4 border-(--clr-text-primary-button) flex items-center justify-center text-(--clr-text-primary-button)"
                dangerouslySetInnerHTML={{
                    __html: plusRaw
                        .replace(/width="[^"]*"/, 'width="80"')
                        .replace(/height="[^"]*"/, 'height="80"')
                        .replace(/stroke="[^"]*"/, 'stroke="currentColor"'),
                }}
            />
            <h1 className="text-2xl 2xl:text-4xl">Tu lista está vacía</h1>
            <p className="text-lg 2xl:text-2xl">El contenido que agregues a tu lista aparecerá aquí</p>
        </div>
    );
}

export default EmptyList;
