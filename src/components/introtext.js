const IntroText = () => {
    return(
        <>
            <h1 id="presentation-heading" className="sr-only">Los Mejores Sabores los Tenemos Aquí En Casa</h1>
            <div className="simple-flex fit-content" aria-hidden="true">
                <h2 className="los">Los</h2><h2 className="intro-title">Mejores Sabores</h2>
            </div>
            <div className="simple-flex fit-content" aria-hidden="true">
                <h2 className="los">los</h2><h2 className="intro-title">Tenemos</h2>
            </div>
            <h2 className="intro-title" aria-hidden="true">Aqui En <strong>Casa</strong></h2>
        </>
    )
}

export default IntroText
