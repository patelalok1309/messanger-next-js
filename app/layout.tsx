import type { Metadata } from "next";
import "./globals.css";
import ToasterProvider from "./context/ToasterContext";
import AuthContext from "./context/AuthContext";
import ActiveStatus from "./components/ActiveStatus";

export const metadata: Metadata = {
    title: "Messanger",
    description: "Messanger App",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AuthContext>
                    <ToasterProvider />
                    <ActiveStatus />
                    {children}
                </AuthContext>
            </body>
        </html>
    );
}