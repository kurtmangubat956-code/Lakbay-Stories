import FlashMessage from '@/Components/FlashMessage';
import Navbar from '@/Components/Navbar';

export default function SiteLayout({ overlayNav = false, flush = false, children }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar overlay={overlayNav} />
            <main id="main" className={`flex-1 ${flush ? '' : 'pb-24'}`}>
                {children}
            </main>
            <FlashMessage />
        </div>
    );
}
