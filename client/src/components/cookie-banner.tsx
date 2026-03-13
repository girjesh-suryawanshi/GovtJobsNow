import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the user has already accepted or rejected cookies
        const cookieConsent = localStorage.getItem("cookie_consent");
        if (!cookieConsent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie_consent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="flex-1 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        <strong>We value your privacy.</strong> We use cookies to enhance your browsing experience,
                        serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you
                        consent to our use of cookies as outlined in our {" "}
                        <Link href="/privacy-policy" className="text-blue-600 hover:underline font-medium">
                            Privacy Policy
                        </Link>.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        onClick={handleDecline}
                        className="flex-1 sm:flex-none"
                    >
                        Decline
                    </Button>
                    <Button
                        onClick={handleAccept}
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Accept All
                    </Button>
                </div>

            </div>
        </div>
    );
}
