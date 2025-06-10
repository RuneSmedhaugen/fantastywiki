import React from "react";

const PrivacyPolicy = () => (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>Privacy Policy</h1>
        <p>
            <strong>Last updated:</strong> June 2025
        </p>
        <p>
            This Privacy Policy describes how we collect, use, and protect your information when you use our website.
        </p>

        <h2>Information We Collect</h2>
        <ul>
            <li>
                <strong>Personal Information:</strong> We may collect personal information such as your name, email address, and any other information you provide when you register or contact us.
            </li>
            <li>
                <strong>Usage Data:</strong> We may collect information about how you access and use the website, including your IP address, browser type, and pages visited.
            </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
            <li>To provide and maintain our service</li>
            <li>To communicate with you</li>
            <li>To improve our website and user experience</li>
            <li>To comply with legal obligations</li>
        </ul>

        <h2>Cookies</h2>
        <p>
            We may use cookies and similar tracking technologies to track activity on our website and store certain information.
        </p>

        <h2>Third-Party Services</h2>
        <p>
            We may use third-party services that collect, monitor, and analyze information to improve our service.
        </p>

        <h2>Data Security</h2>
        <p>
            We take reasonable measures to protect your information, but no method of transmission over the Internet is 100% secure.
        </p>

        <h2>Your Rights</h2>
        <p>
            You have the right to access, update, or delete your personal information. Please <a href="/contact" className="text-violet-400 underline hover:text-violet-300">contact us</a> if you wish to exercise these rights.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
        </p>

        <h2>Contact Us</h2>
        <p>
            If you have any questions about this Privacy Policy, please <a href="/contact" className="text-violet-400 underline hover:text-violet-300">contact us</a>.
        </p>
    </div>
);

export default PrivacyPolicy;