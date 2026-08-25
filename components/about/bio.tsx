'use client';

/*
    CENTER - CODE EDITOR
    Painel direito "Code snippet showcase" removido: o editor agora ocupa toda a
    largura disponível, por isso a borda direita (`border-r`) também saiu.
*/
export default function Bio() {
    return (
        <main className="flex-1 flex flex-col min-h-[500px] transition-colors duration-300">
            <div
                className="flex-1 p-6 overflow-y-auto transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-primary)' }}
            >
                <div className="flex font-mono text-sm leading-relaxed">
                    <div
                        className="flex flex-col text-right pr-6 select-none transition-colors duration-300 flex-shrink-0"
                        style={{ color: 'var(--syntax-comment)' }}
                    >
                        {Array.from({ length: 16 }, (_, i) => (
                            <span key={i + 1}>{i + 1}</span>
                        ))}
                    </div>
                    <div className="flex flex-col" style={{ color: 'var(--syntax-comment)' }}>
                        <span>/**</span>
                        <span><span className="mr-8">*</span>About me</span>
                        <span><span className="mr-8">*</span>I have 5 years of experience in web</span>
                        <span><span className="mr-8">*</span>development lorem ipsum dolor sit amet,</span>
                        <span><span className="mr-8">*</span>consectetur adipiscing elit, sed do eiusmod</span>
                        <span><span className="mr-8">*</span>tempor incididunt ut labore et dolore</span>
                        <span><span className="mr-8">*</span>magna aliqua. Ut enim ad minim veniam,</span>
                        <span><span className="mr-8">*</span>quis nostrud exercitation ullamco laboris</span>
                        <span><span className="mr-8">*</span>nisi ut aliquip ex ea commodo consequat.</span>
                        <span><span className="mr-8">*</span>Duis aute irure dolor in reprehenderit in</span>
                        <span><span className="mr-8">*</span></span>
                        <span><span className="mr-8">*</span>Duis aute irure dolor in reprehenderit in</span>
                        <span><span className="mr-8">*</span>voluptate velit esse cillum dolore eu fugiat</span>
                        <span><span className="mr-8">*</span>nulla pariatur. Excepteur sint occaecat</span>
                        <span><span className="mr-8">*</span>officia deserunt mollit anim id est laborum.</span>
                        <span>*/</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
