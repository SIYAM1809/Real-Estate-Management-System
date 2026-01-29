import { Link } from "react-router-dom";
import { FaBuilding, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="container-shell">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* BRAND */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 text-white">
                            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                                <FaBuilding className="text-sm" />
                            </div>
                            <div className="text-xl font-bold tracking-tight">
                                Syntax<span className="text-primary-400">Estate</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Elevating your real estate experience with premium listings, seamless transactions, and trusted agents. Find your dream home today.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialLink icon={<FaFacebook />} />
                            <SocialLink icon={<FaTwitter />} />
                            <SocialLink icon={<FaInstagram />} />
                            <SocialLink icon={<FaLinkedin />} />
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <FooterLink to="/" label="Home" />
                            <FooterLink to="/properties" label="Properties" />
                            <FooterLink to="/login" label="Login" />
                            <FooterLink to="/register" label="Register" />
                        </ul>
                    </div>

                    {/* PROPERTIES */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Properties</h3>
                        <ul className="space-y-3 text-sm">
                            <FooterLink to="/properties?type=house" label="Houses for Sale" />
                            <FooterLink to="/properties?type=apartment" label="Apartments for Rent" />
                            <FooterLink to="/properties?sort=newest" label="New Listings" />
                            <FooterLink to="/properties" label="Featured Properties" />
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="text-primary-400 font-semibold">Address:</span>
                                <span>123 Premium Blvd, Suite 100, Beverly Hills, CA 90210</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-400 font-semibold">Phone:</span>
                                <span>(555) 123-4567</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-400 font-semibold">Email:</span>
                                <span>hello@syntaxestate.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} SyntaxEstate. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <FaHeart className="text-red-500" />
                        <span>by Syntax Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon }) {
    return (
        <a
            href="#"
            className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 transition-colors hover:bg-primary-600 hover:text-white"
        >
            {icon}
        </a>
    );
}

function FooterLink({ to, label }) {
    return (
        <li>
            <Link to={to} className="hover:text-primary-400 transition-colors">
                {label}
            </Link>
        </li>
    );
}

export default Footer;
