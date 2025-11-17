import images from '../images/exporting';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CheckPath } from './index.js';

const Footer = ({children}) => {

    const ScrollToTop = () => {
        if (window.location.pathname !== '/') {
            return
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const num = '584129692100'
    let message = "Holaa 😃 Deseo solicitar lista de precios por favor"
    let encodedMessage = encodeURIComponent(message);

    return(
        <>
            <div className='footer-top-publicity alternative-product-title-position' style={{backgroundImage:`url(${images.bg1})`}}>
                {children}
            </div>
            <section className='footer'>
                <div className='flex-col' style={{gap:'30px'}}>
                    <div className='flex-footer'>
                        <picture className='footer-logo'>
                            <img className='logo-header' src={images.logoNegro} alt='logo'></img>
                        </picture>
                        <div className='flex-col z-fold-max-width footer-menu-box padding-menu'>
                            <h1 className='footer-link-title'>Menú</h1>
                            <Link className='footer-menu-link' to='/' onClick={ScrollToTop}>Inicio</Link>
                            <Link className='footer-menu-link' to='/products/all'>Productos</Link>
                            <CheckPath css='footer-menu-link' path='/' optional='/products/all' id='categorias'>Categorias</CheckPath>
                            <Link className='footer-menu-link' to='/cart'>Carrito</Link>
                        </div>
                        <div className='flex-col z-fold-max-width footer-menu-box'>
                            <h1 className='footer-link-title'>Contacto</h1>
                            <a className='footer-menu-link' href={`https://api.whatsapp.com/send?phone=${num}&text=${encodedMessage}`}><FaWhatsapp/>+58-412-9692100</a>
                            <a className='footer-menu-link' href='https://instagram.com/casa_condimentos28'><FaInstagram/>@casa_condimentos28</a>
                            <label className='footer-menu-link' id='mail'>
                                <img className='logo-footer' src={images.email} alt='logo'></img>
                                lacasacye@gmail.com
                            </label>
                        </div>
                        <div className='direction-max-width flex-col footer-menu-box'>
                            <h1 className='footer-link-title'>Dirección</h1>
                            <label className='footer-menu-link line-height'>
                                <img className='logo-footer' src={images.pin} alt='logo'></img>
                                Calle 28 entre carrera 22 y 23, Barquisimeto, Estado Lara, Venezuela
                            </label>
                        </div>

                    </div>
                    <h1 className='bottom-info-site'>© 2023. La Casa de los Condimentos - Mejores Sabores los Tenemos en Casa. Todos los derechos reservados</h1>
                </div>
            </section>
        </>
    )
}

export default Footer
