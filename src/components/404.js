import { useEffect } from 'react';
import images from '../images/exporting';
import {
  Header,
  Footer,
  Presentation,
  TopText,
  Featured,
} from './index.js';

const NotFound = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const NotText = ({first, second}) => {
        return(
            <>
                <div className='for0for-container'>
                    <h2>{first}</h2>
                    <h4>{second}/</h4>
                </div>
            </>
        )
    }

    return(
        <>
            <Header dynamic={true}/>
            <Presentation image={images.bg4} image2={images.bg3} container='father-container'>
                <NotText first='404' second='No encontrado :' />
            </Presentation>
            <Featured css='flex-col align-center section-margin'/>
            <Footer>
                <TopText first='Síguenos en ' second='Instagram'/>
            </Footer>
        </>
    )
}

export default NotFound
